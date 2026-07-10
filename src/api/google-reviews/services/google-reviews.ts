import axios from 'axios';

export interface GoogleReview {
  authorName: string;
  authorPhoto: string;
  rating: number;
  text: string;
  publishTime: string;
  relativePublishTimeDescription: string;
}

export interface GoogleReviewsData {
  businessName: string;
  rating: number;
  totalReviews: number;
  googleMapsUrl: string;
  reviews: GoogleReview[];
}

// Field mask for the Places API (New) — includes reviews
const REVIEWS_FIELD_MASK =
  'displayName,rating,userRatingCount,reviews,googleMapsUri';

export default ({ strapi }: { strapi: any }) => ({
  /**
   * Fetches reviews from the Google Places API (New) for Mobile Tyre Champions.
   *
   * Uses the Places API v1 endpoint which supports Service Area Businesses
   * (the old Places API returns NOT_FOUND for these).
   */
  async fetchReviews(): Promise<GoogleReviewsData> {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      strapi.log.error('[GoogleReviews] Missing GOOGLE_MAPS_API_KEY in environment.');
      throw new Error('Google Places API key configuration is missing.');
    }

    // Resolve Place ID via the place service
    let placeId = '';
    try {
      const placeService = strapi.service('api::google-reviews.google-place');
      placeId = await placeService.getPlaceId();
    } catch (e: any) {
      strapi.log.error(`[GoogleReviews] Failed to resolve Place ID: ${e.message}`);
      throw new Error('Unable to determine Google Place ID. Please set GOOGLE_PLACE_ID in your .env file.');
    }

    try {
      strapi.log.info(`[GoogleReviews] Fetching reviews for Place ID: ${placeId}`);

      const url = `https://places.googleapis.com/v1/places/${placeId}`;
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': REVIEWS_FIELD_MASK,
        },
        timeout: 15_000,
      });

      const data = response.data;
      if (!data) {
        throw new Error('Empty response received from Google Places API.');
      }

      // Map reviews from the Places API (New) format
      const reviews: GoogleReview[] = (data.reviews || []).map((rev: any) => ({
        authorName: rev.authorAttribution?.displayName || 'Anonymous',
        authorPhoto: rev.authorAttribution?.photoUri || '',
        rating: rev.rating || 0,
        text: rev.originalText?.text || rev.text?.text || '',
        publishTime: rev.publishTime || '',
        relativePublishTimeDescription: rev.relativePublishTimeDescription || '',
      }));

      const result: GoogleReviewsData = {
        businessName: data.displayName?.text || '',
        rating: data.rating || 0,
        totalReviews: data.userRatingCount || 0,
        googleMapsUrl: data.googleMapsUri || '',
        reviews,
      };

      strapi.log.info(
        `[GoogleReviews] Successfully fetched ${reviews.length} reviews. ` +
        `Business: "${result.businessName}" | Rating: ${result.rating} | Total: ${result.totalReviews}`
      );

      return result;
    } catch (error: any) {
      if (error.response) {
        strapi.log.error(
          `[GoogleReviews] API call failed (${error.response.status}): ${JSON.stringify(error.response.data)}`
        );
      } else {
        strapi.log.error(`[GoogleReviews] API call failed: ${error.message}`);
      }
      throw error;
    }
  },
});
