// Simple in-memory rate limiter
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + RATE_LIMIT_WINDOW_MS;
    return false;
  }

  record.count += 1;
  return record.count > MAX_REQUESTS_PER_WINDOW;
}

export default {
  async getReviews(ctx) {
    // Check Rate Limiting
    const ip = ctx.ip || ctx.request.ip || 'unknown';
    if (isRateLimited(ip)) {
      ctx.status = 429;
      ctx.body = {
        success: false,
        message: 'Too many requests. Please try again later.',
      };
      return;
    }

    try {
      // Access caching provider using Strapi store
      const store = strapi.store({ type: 'api', name: 'google-reviews' });
      const cacheKey = 'places_reviews_cache';
      const cachedData: any = await store.get({ key: cacheKey });

      if (cachedData) {
        const { timestamp, data } = cachedData;
        // 24 hour cache expiration: 24 * 60 * 60 * 1000 = 86,400,000 ms
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          ctx.body = {
            success: true,
            data,
          };
          return;
        }
      }

      // Fetch fresh data from service
      const reviewsService = strapi.service('api::google-reviews.google-reviews');
      const freshData = await reviewsService.fetchReviews();

      // Save to cache store with current timestamp
      await store.set({
        key: cacheKey,
        value: {
          timestamp: Date.now(),
          data: freshData,
        },
      });

      // Synchronize/persist reviews to Strapi Review Collection Type
      if (freshData && Array.isArray(freshData.reviews)) {
        for (const review of freshData.reviews) {
          // Check if this review already exists in the database
          // Strapi v5 Entity Service API: strapi.documents('api::review.review')
          const existing = await strapi.documents('api::review.review').findMany({
            filters: {
              reviewerName: review.authorName,
              reviewText: review.text,
            },
          });

          if (!existing || existing.length === 0) {
            // Create a new entry in Review Collection
            await strapi.documents('api::review.review').create({
              data: {
                reviewerName: review.authorName,
                reviewText: review.text,
                rating: Math.min(5, Math.max(1, Math.round(review.rating))),
                timeElapsed: review.relativePublishTimeDescription || 'Recently',
                publishedAt: new Date(), // Auto publish
              },
            });
          }
        }
      }

      ctx.body = {
        success: true,
        data: freshData,
      };
    } catch (error: any) {
      strapi.log.error(`Controller Error fetching Google reviews: ${error.message}`);
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: 'Unable to fetch Google reviews.',
      };
    }
  },
};
