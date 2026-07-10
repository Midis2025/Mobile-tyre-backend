import axios from 'axios';

// ─── Target Business Constants (for validation) ─────────────────────────────
const TARGET_NAME_FRAGMENT = 'Mobile Tyre Champions';
const TARGET_WEBSITE       = 'mobiletyrechampions.com';

// ─── Field mask for validation ───────────────────────────────────────────────
const VALIDATE_FIELD_MASK =
  'displayName,websiteUri,nationalPhoneNumber,rating,userRatingCount,googleMapsUri';

export interface GooglePlaceService {
  getPlaceId(): Promise<string>;
  validatePlaceId(placeId: string): Promise<boolean>;
  cachePlaceId(placeId: string): Promise<void>;
}

export default ({ strapi }: { strapi: any }) => {
  return {
    /**
     * Returns the Google Place ID for Mobile Tyre Champions.
     *
     * Priority:
     *  1. GOOGLE_PLACE_ID from .env (primary — always preferred)
     *  2. DB cache (Strapi store, 12-month TTL)
     *
     * Throws if neither source provides a Place ID.
     */
    async getPlaceId(): Promise<string> {
      // 1. Use the env variable (this is the confirmed, production Place ID)
      const envPlaceId = process.env.GOOGLE_PLACE_ID?.trim();
      if (envPlaceId) {
        strapi.log.info('[GooglePlace] Using GOOGLE_PLACE_ID from environment.');
        return envPlaceId;
      }

      // 2. Fall back to DB cache
      try {
        const store = strapi.store({ type: 'api', name: 'google-reviews' });
        const cached = (await store.get({ key: 'google_place_id_cache' })) as any;
        if (cached?.placeId) {
          const twelveMonths = 365 * 24 * 60 * 60 * 1000;
          if (Date.now() - cached.timestamp < twelveMonths) {
            strapi.log.info('[GooglePlace] Using cached Google Place ID from DB store.');
            return cached.placeId as string;
          }
          strapi.log.warn('[GooglePlace] Cached Place ID is older than 12 months — expired.');
        }
      } catch (err: any) {
        strapi.log.warn(`[GooglePlace] Failed to read DB cache: ${err.message}`);
      }

      throw new Error(
        '[GooglePlace] GOOGLE_PLACE_ID is not set in environment variables and no valid DB cache exists. ' +
        'Please set GOOGLE_PLACE_ID in your .env file.'
      );
    },

    /**
     * Validates a Place ID by calling the Google Places API (New) and checking
     * that the returned business matches Mobile Tyre Champions.
     */
    async validatePlaceId(placeId: string): Promise<boolean> {
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      if (!apiKey || !placeId) return false;

      try {
        const response = await axios.get(
          `https://places.googleapis.com/v1/places/${placeId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-Api-Key': apiKey,
              'X-Goog-FieldMask': VALIDATE_FIELD_MASK,
            },
            timeout: 10_000,
          }
        );

        const data    = response.data;
        const name    = (data.displayName?.text || '').toLowerCase();
        const website = (data.websiteUri || '').toLowerCase();

        const nameOk    = name.includes(TARGET_NAME_FRAGMENT.toLowerCase());
        const websiteOk = website.includes(TARGET_WEBSITE);

        strapi.log.info(
          `[GooglePlace] Validation — name:${nameOk} website:${websiteOk} ` +
          `| displayName="${data.displayName?.text}" website="${data.websiteUri}" ` +
          `phone="${data.nationalPhoneNumber}" rating=${data.rating} reviews=${data.userRatingCount}`
        );

        return nameOk && websiteOk;
      } catch (err: any) {
        strapi.log.warn(`[GooglePlace] Validation failed for "${placeId}": ${err.message}`);
        return false;
      }
    },

    /**
     * Persists a validated Place ID to the Strapi DB store.
     */
    async cachePlaceId(placeId: string): Promise<void> {
      try {
        const store = strapi.store({ type: 'api', name: 'google-reviews' });
        await store.set({
          key: 'google_place_id_cache',
          value: { placeId, timestamp: Date.now() },
        });
        strapi.log.info(`[GooglePlace] Cached Place ID "${placeId}" in DB store.`);
      } catch (err: any) {
        strapi.log.warn(`[GooglePlace] Could not persist Place ID: ${err.message}`);
      }
    },
  };
};
