// ─── In-memory rate limiter ──────────────────────────────────────────────────
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;     // 30 requests/minute per IP

// Cache duration: 24 hours
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
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

// Periodically clean up expired rate limit entries (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

export default {
  /**
   * GET /api/google-reviews
   *
   * Returns Google Business Profile reviews for Mobile Tyre Champions.
   * Results are cached for 24 hours in the Strapi DB store.
   */
  async getReviews(ctx) {
    // ── Rate Limiting ──────────────────────────────────────────────────
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
      // ── Check cache ────────────────────────────────────────────────
      const store = strapi.store({ type: 'api', name: 'google-reviews' });
      const cacheKey = 'places_reviews_cache';
      const cachedData: any = await store.get({ key: cacheKey });

      if (cachedData?.timestamp && cachedData?.data) {
        if (Date.now() - cachedData.timestamp < CACHE_TTL_MS) {
          strapi.log.info('[GoogleReviews] Serving cached response.');
          ctx.body = { success: true, data: cachedData.data };
          return;
        }
        strapi.log.info('[GoogleReviews] Cache expired — fetching fresh data.');
      }

      // ── Fetch fresh data ───────────────────────────────────────────
      const reviewsService = strapi.service('api::google-reviews.google-reviews');
      const freshData = await reviewsService.fetchReviews();

      // ── Update cache ───────────────────────────────────────────────
      await store.set({
        key: cacheKey,
        value: { timestamp: Date.now(), data: freshData },
      });

      // ── Sync reviews to Strapi Review collection ───────────────────
      if (freshData?.reviews && Array.isArray(freshData.reviews)) {
        for (const review of freshData.reviews) {
          try {
            const existing = await strapi.documents('api::review.review').findMany({
              filters: {
                reviewerName: review.authorName,
                reviewText: review.text,
              },
            });

            if (!existing || existing.length === 0) {
              await strapi.documents('api::review.review').create({
                data: {
                  reviewerName: review.authorName,
                  reviewText: review.text,
                  rating: Math.min(5, Math.max(1, Math.round(review.rating))),
                  timeElapsed: review.relativePublishTimeDescription || 'Recently',
                  publishedAt: new Date(),
                },
              });
              strapi.log.info(`[GoogleReviews] Synced new review from "${review.authorName}".`);
            }
          } catch (syncErr: any) {
            // Don't fail the request if a single review sync fails
            strapi.log.warn(`[GoogleReviews] Failed to sync review from "${review.authorName}": ${syncErr.message}`);
          }
        }
      }

      ctx.body = { success: true, data: freshData };
    } catch (error: any) {
      strapi.log.error(`[GoogleReviews] Controller error: ${error.message}`);

      // If we have stale cache, serve it rather than returning an error
      try {
        const store = strapi.store({ type: 'api', name: 'google-reviews' });
        const staleCache: any = await store.get({ key: 'places_reviews_cache' });
        if (staleCache?.data) {
          strapi.log.warn('[GoogleReviews] Serving stale cache due to API error.');
          ctx.body = { success: true, data: staleCache.data, stale: true };
          return;
        }
      } catch (_) {
        // Ignore cache read errors
      }

      ctx.status = 500;
      ctx.body = {
        success: false,
        message: 'Unable to fetch Google reviews. Please try again later.',
      };
    }
  },
};
