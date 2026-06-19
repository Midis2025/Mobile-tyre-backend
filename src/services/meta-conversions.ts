import crypto from 'crypto';
import axios from 'axios';

// Interfaces for incoming data
interface UserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  postcode?: string;
  suburb?: string;
}

interface CustomData {
  serviceType?: string;
  vehicleType?: string;
  message?: string;
  [key: string]: any;
}

interface MetaEventParams {
  eventName: 'Lead' | 'Schedule';
  eventId: string;
  userData: UserData;
  customData?: CustomData;
  eventSourceUrl?: string;
  testEventCode?: string;
}

/**
 * Utility: Normalize and hash data using SHA256 as required by Meta.
 */
const hashData = (data: string | undefined): string | undefined => {
  if (!data) return undefined;
  // Normalize: lowercase and trim whitespace
  const normalized = data.trim().toLowerCase();
  if (!normalized) return undefined;
  return crypto.createHash('sha256').update(normalized).digest('hex');
};

/**
 * Normalizes phone numbers (e.g. remove spaces, keeping only digits and leading +).
 */
const hashPhone = (phone: string | undefined): string | undefined => {
  if (!phone) return undefined;
  // Basic normalization for phone: keep only numbers and a leading '+'
  const normalized = phone.replace(/[^\d+]/g, '');
  if (!normalized) return undefined;
  return crypto.createHash('sha256').update(normalized).digest('hex');
};

/**
 * Send event to Meta Conversions API
 */
const sendMetaEvent = async (params: MetaEventParams) => {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;
  const testEventCode = params.testEventCode || process.env.META_TEST_EVENT_CODE;

  if (!pixelId || !accessToken) {
    strapi.log.warn('Meta Conversions API: Missing META_PIXEL_ID or META_ACCESS_TOKEN');
    return null;
  }

  const { eventName, eventId, userData, customData, eventSourceUrl } = params;

  // Prepare hashed user data
  const metaUserData: any = {};
  
  const hashedEmail = hashData(userData.email);
  if (hashedEmail) metaUserData.em = [hashedEmail];

  const hashedPhone = hashPhone(userData.phone);
  if (hashedPhone) metaUserData.ph = [hashedPhone];

  const hashedFirstName = hashData(userData.firstName);
  if (hashedFirstName) metaUserData.fn = [hashedFirstName];

  const hashedLastName = hashData(userData.lastName);
  if (hashedLastName) metaUserData.ln = [hashedLastName];

  if (userData.postcode) metaUserData.zp = [hashData(userData.postcode)];
  if (userData.suburb) metaUserData.ct = [hashData(userData.suburb)];

  const payload: any = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: 'website',
        event_source_url: eventSourceUrl || 'https://mobiletyrechampions.com',
        user_data: metaUserData,
        custom_data: customData || {},
      },
    ],
  };

  if (testEventCode) {
    payload.test_event_code = testEventCode;
  }

  const url = `https://graph.facebook.com/v23.0/${pixelId}/events?access_token=${accessToken}`;

  // Retry logic: Retry once on failure
  let attempts = 0;
  const maxAttempts = 2; // 1 initial + 1 retry

  while (attempts < maxAttempts) {
    try {
      attempts++;
      const response = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      strapi.log.info(`Meta API (${eventName}) success: EventID ${eventId}`);
      return { success: true, response: response.data };
    } catch (error: any) {
      if (attempts >= maxAttempts) {
        strapi.log.error(`Meta API (${eventName}) failed after ${attempts} attempts: ${error.message}`);
        if (error.response) {
          strapi.log.error(`Meta API Error Details: ${JSON.stringify(error.response.data)}`);
        }
        return { success: false, error: error.message, details: error.response?.data };
      }
      strapi.log.warn(`Meta API (${eventName}) attempt ${attempts} failed, retrying...`);
    }
  }
};

export default {
  /**
   * Send a Lead event
   */
  async sendLeadEvent(eventId: string, userData: UserData, customData?: CustomData, eventSourceUrl?: string) {
    return sendMetaEvent({
      eventName: 'Lead',
      eventId,
      userData,
      customData,
      eventSourceUrl,
    });
  },

  /**
   * Send a Schedule event
   */
  async sendScheduleEvent(eventId: string, userData: UserData, customData?: CustomData, eventSourceUrl?: string) {
    return sendMetaEvent({
      eventName: 'Schedule',
      eventId,
      userData,
      customData,
      eventSourceUrl,
    });
  },

  /**
   * Send a Test event explicitly
   */
  async sendTestEvent(userData: UserData, testEventCode: string) {
    const eventId = crypto.randomUUID();
    return sendMetaEvent({
      eventName: 'Lead', // default to Lead for testing
      eventId,
      userData,
      testEventCode,
    });
  },

  /**
   * Generate an event ID for frontend-backend deduplication
   */
  generateEventId() {
    return crypto.randomUUID();
  }
};
