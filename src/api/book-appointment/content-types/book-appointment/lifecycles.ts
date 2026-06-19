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
        };

        const customData = {
          serviceType: 'Booking',
          vehicleType: result.carModel,
          location: result.location,
          timingSlot: result.timingSlot,
        };

        await metaService.sendScheduleEvent(eventId, userData, customData);
      } catch (error) {
        strapi.log.error('Failed to trigger Meta Conversions API for book-appointment:', error);
      }
    })();
  },
};
