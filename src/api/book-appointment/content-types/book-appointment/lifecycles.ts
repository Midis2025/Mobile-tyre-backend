import metaService from '../../../../services/meta-conversions';
import crypto from 'crypto';

const processedIds = new Set();

export default {
  async afterCreate(event: any) {
    const { result } = event;
    const documentId = result.documentId || result.id;

    if (processedIds.has(documentId)) return;
    processedIds.add(documentId);
    setTimeout(() => processedIds.delete(documentId), 30000);

    console.log(`[Lifecycle] afterCreate triggered for book-appointment:`, documentId);

    // Asynchronous non-blocking dispatch
    (async () => {
      // ── 1. Resend Email Dispatch (Legacy) ────────────────────────────
      try {
        await strapi
          .service("api::book-appointment.email" as any)
          .sendBookingNotification(result);

        if (result.email && typeof result.email === 'string' && result.email.trim().length > 0) {
          await strapi
            .service("api::book-appointment.email" as any)
            .sendUserConfirmationEmail(result.email, result.fullName, result);
        }
      } catch (emailErr: any) {
        console.error("[Legacy Booking Email Error]:", emailErr?.message || emailErr);
      }

      // ── 2. Meta Conversions API (Completely Independent) ─────────────
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
      } catch (metaErr: any) {
        strapi.log.error('Failed to trigger Meta Conversions API for book-appointment:', metaErr);
      }
    })();
  },
};
