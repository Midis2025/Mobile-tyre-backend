import metaService from '../../../../services/meta-conversions';
import crypto from 'crypto';

export default {
  async afterCreate(event) {
    const { result } = event;

    // We do not await this so it doesn't block the request/response cycle
    (async () => {
      try {
        const eventId = crypto.randomUUID();
        
        const userData = {
          email: result.email,
          phone: result.mobileNumber,
          postcode: result.postcode,
        };

        const customData = {
          serviceType: 'Call Back',
          vehicleType: result.brand,
          message: result.title,
        };

        await metaService.sendLeadEvent(eventId, userData, customData);
      } catch (error) {
        strapi.log.error('Failed to trigger Meta Conversions API for arrange-a-call-back:', error);
      }
    })();
  },
};
