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
          phone: result.phoneNumber,
          firstName: result.fullName?.split(' ')[0],
          lastName: result.fullName?.split(' ').slice(1).join(' '),
          postcode: result.postcode,
        };

        const customData = {
          serviceType: 'Emergency Tyre Assistance',
          location: result.location,
          message: result.issue,
        };

        await metaService.sendLeadEvent(eventId, userData, customData);
      } catch (error) {
        strapi.log.error('Failed to trigger Meta Conversions API for emergency-request:', error);
      }
    })();
  },
};
