import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * Validates the configured Google Place ID on startup
   * to ensure reviews will be fetched from the correct business.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Validate Google Place ID on startup (non-blocking)
    const placeId = process.env.GOOGLE_PLACE_ID?.trim();
    const apiKey = process.env.GOOGLE_MAPS_API_KEY?.trim();

    if (!placeId) {
      strapi.log.warn(
        '[Bootstrap] GOOGLE_PLACE_ID is not set. Google Reviews API will not work. ' +
        'Set it in your .env file.'
      );
      return;
    }

    if (!apiKey) {
      strapi.log.warn('[Bootstrap] GOOGLE_MAPS_API_KEY is not set. Skipping Place ID validation.');
      return;
    }

    try {
      const placeService = strapi.service('api::google-reviews.google-place') as any;
      const isValid = await placeService.validatePlaceId(placeId);

      if (isValid) {
        strapi.log.info(`[Bootstrap] ✅ Google Place ID verified: ${placeId}`);
        // Cache it in DB for resilience
        await placeService.cachePlaceId(placeId);
      } else {
        strapi.log.warn(
          `[Bootstrap] ⚠️ Google Place ID "${placeId}" could not be verified as Mobile Tyre Champions. ` +
          'Reviews may be from the wrong business. Please verify your GOOGLE_PLACE_ID.'
        );
      }
    } catch (err: any) {
      strapi.log.warn(`[Bootstrap] Could not validate Google Place ID: ${err.message}`);
    }
  },
};
