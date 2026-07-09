import axios from 'axios';
import fs from 'fs';
import path from 'path';

export interface GooglePlaceService {
  getPlaceId(): Promise<string>;
  searchPlaceId(): Promise<string>;
  cachePlaceId(placeId: string): Promise<void>;
}

export default ({ strapi }: { strapi: any }) => {
  // Configured target paths & fallback search info
  const envPath = path.resolve(process.cwd(), '.env');
  const textQuery = 'Mobile Tyre Champions 78A Grosvenor Rd Aldershot GU11 3HY United Kingdom';

  return {
    /**
     * Retrieves the place ID using local store, .env fallback, or live Search API.
     */
    async getPlaceId(): Promise<string> {
      // 1. Check if GOOGLE_PLACE_ID is present in process.env
      if (process.env.GOOGLE_PLACE_ID && process.env.GOOGLE_PLACE_ID.trim() !== '') {
        strapi.log.info('Using configured GOOGLE_PLACE_ID from environment.');
        return process.env.GOOGLE_PLACE_ID;
      }

      // 2. Check if cached in Strapi database store
      const store = strapi.store({ type: 'api', name: 'google-reviews' });
      const cached = await store.get({ key: 'google_place_id_cache' }) as any;
      if (cached && cached.placeId) {
        const twelveMonthsInMs = 365 * 24 * 60 * 60 * 1000;
        if (Date.now() - cached.timestamp < twelveMonthsInMs) {
          strapi.log.info('Using cached Google Place ID from database store.');
          return cached.placeId;
        }
        strapi.log.info('Cached Google Place ID is older than 12 months, refreshing...');
      }

      // 3. Not found or expired: search programmatically
      const placeId = await this.searchPlaceId();
      await this.cachePlaceId(placeId);
      return placeId;
    },

    /**
     * Programmatically performs a Text Search request to find the Place ID.
     */
    async searchPlaceId(): Promise<string> {
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        throw new Error('Google Maps API Key is missing (GOOGLE_MAPS_API_KEY).');
      }

      strapi.log.info('Searching Google Place ID programmatically...');
      try {
        const response = await axios.post(
          'https://places.googleapis.com/v1/places:searchText',
          { textQuery },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-Api-Key': apiKey,
              'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress',
            },
          }
        );

        const places = response.data?.places || [];
        if (places.length === 0) {
          throw new Error('Google Places API returned no results for the search query.');
        }

        // Filtering matching result
        let selectedPlace = places[0];
        if (places.length > 1) {
          const match = places.find((p: any) => {
            const name = (p.displayName?.text || '').toLowerCase();
            const address = (p.formattedAddress || '').toLowerCase();
            return (
              name.includes('mobile tyre champions') &&
              address.includes('aldershot') &&
              address.includes('gu11 3hy')
            );
          });
          if (match) {
            selectedPlace = match;
          }
        }

        const placeId = selectedPlace.id;
        if (!placeId) {
          throw new Error('Discovered place payload contains no valid ID.');
        }

        strapi.log.info(`Google Place ID discovered successfully: ${placeId}`);
        return placeId;
      } catch (error: any) {
        strapi.log.error(`Failed programmatically searching Google Place ID: ${error.message}`);
        throw error;
      }
    },

    /**
     * Caches the discovered Place ID in the database and tries updating the local .env.
     */
    async cachePlaceId(placeId: string): Promise<void> {
      try {
        // Cache to Database store
        const store = strapi.store({ type: 'api', name: 'google-reviews' });
        await store.set({
          key: 'google_place_id_cache',
          value: {
            placeId,
            timestamp: Date.now(),
          },
        });

        // Set on running env context
        process.env.GOOGLE_PLACE_ID = placeId;

        // Try writing back to .env file if writable
        if (fs.existsSync(envPath)) {
          let envContent = fs.readFileSync(envPath, 'utf8');
          const regex = /^GOOGLE_PLACE_ID=.*$/m;
          if (regex.test(envContent)) {
            envContent = envContent.replace(regex, `GOOGLE_PLACE_ID=${placeId}`);
          } else {
            envContent += `\nGOOGLE_PLACE_ID=${placeId}\n`;
          }
          fs.writeFileSync(envPath, envContent, 'utf8');
          strapi.log.info('Updated local .env file with discovered GOOGLE_PLACE_ID.');
        }
      } catch (err: any) {
        strapi.log.warn(`Could not persist discovered Place ID to .env file: ${err.message}`);
      }
    },
  };
};
