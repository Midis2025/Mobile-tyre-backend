import type { Core } from '@strapi/strapi';

// The correct business name fragment — used to detect stale cache from wrong businesses
const CORRECT_BUSINESS_NAME = 'Mobile Tyre Champions';

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
   * Validates the configured Google Place ID on startup and clears
   * any stale review caches that belong to the wrong business.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
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
      // ── Validate the Place ID ───────────────────────────────────────
      const placeService = strapi.service('api::google-reviews.google-place') as any;
      const isValid = await placeService.validatePlaceId(placeId);

      if (isValid) {
        strapi.log.info(`[Bootstrap] ✅ Google Place ID verified: ${placeId}`);
        await placeService.cachePlaceId(placeId);
      } else {
        strapi.log.warn(
          `[Bootstrap] ⚠️ Google Place ID "${placeId}" could not be verified as Mobile Tyre Champions. ` +
          'Please verify your GOOGLE_PLACE_ID.'
        );
      }

      // ── Clear stale reviews cache if it belongs to wrong business ──
      const store = strapi.store({ type: 'api', name: 'google-reviews' });
      const cachedReviews = (await store.get({ key: 'places_reviews_cache' })) as any;

      if (cachedReviews?.data?.businessName) {
        const cachedName = cachedReviews.data.businessName.toLowerCase();
        if (!cachedName.includes(CORRECT_BUSINESS_NAME.toLowerCase())) {
          await store.delete({ key: 'places_reviews_cache' });
          strapi.log.warn(
            `[Bootstrap] 🗑️ Cleared stale reviews cache — was from "${cachedReviews.data.businessName}" ` +
            `(not ${CORRECT_BUSINESS_NAME}). Fresh data will be fetched on next request.`
          );
        } else {
          strapi.log.info('[Bootstrap] ✅ Cached reviews belong to the correct business.');
        }
      }
    } catch (err: any) {
      strapi.log.warn(`[Bootstrap] Could not validate Google Place ID: ${err.message}`);
    }
  },
};
