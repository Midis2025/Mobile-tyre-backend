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

export default ({ strapi }: { strapi: any }) => ({
  async fetchReviews(): Promise<GoogleReviewsData> {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      strapi.log.error('Google Reviews Service: Missing GOOGLE_MAPS_API_KEY in environment variables.');
      throw new Error('Google Places API key configuration is missing.');
    }

    // Try finding placeId dynamically using the place discovery service
    let placeId = '';
    try {
      const placeService = strapi.service('api::google-reviews.google-place');
      placeId = await placeService.getPlaceId();
    } catch (e: any) {
      strapi.log.warn(`Google Reviews Service Place Discovery fallback failed: ${e.message}`);
      // Fallback to process.env
      placeId = process.env.GOOGLE_PLACE_ID || '';
    }

    if (!placeId) {
      strapi.log.error('Google Reviews Service: Unable to determine GOOGLE_PLACE_ID.');
      throw new Error('Google Places API Place ID is missing.');
    }

    try {
      const url = `https://places.googleapis.com/v1/places/${placeId}`;
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'displayName,rating,userRatingCount,reviews,googleMapsUri',
        },
      });

      const data = response.data;
      if (!data) {
        throw new Error('Empty response received from Google Places API.');
      }

      // Map reviews safely
      const reviews: GoogleReview[] = (data.reviews || []).map((rev: any) => ({
        authorName: rev.authorAttribution?.displayName || 'Anonymous',
        authorPhoto: rev.authorAttribution?.photoUri || '',
        rating: rev.rating || 0,
        text: rev.originalText?.text || rev.text?.text || '',
        publishTime: rev.publishTime || '',
        relativePublishTimeDescription: rev.relativePublishTimeDescription || '',
      }));

      const normalized: GoogleReviewsData = {
        businessName: data.displayName?.text || '',
        rating: data.rating || 0,
        totalReviews: data.userRatingCount || 0,
        googleMapsUrl: data.googleMapsUri || '',
        reviews,
      };

      return normalized;
    } catch (error: any) {
      if (error.response) {
        strapi.log.error(
          `Google Places API call failed with status ${error.response.status}: ${JSON.stringify(error.response.data)}`
        );
      } else {
        strapi.log.error(`Google Places API call failed: ${error.message}`);
      }
      throw error;
    }
  },
});
