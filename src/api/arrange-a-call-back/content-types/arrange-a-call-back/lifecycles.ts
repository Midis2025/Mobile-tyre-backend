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

    console.log(`[Lifecycle] afterCreate triggered for arrange-a-call-back:`, documentId);

    // Asynchronous non-blocking dispatch
    (async () => {
      // ── 1. Resend Email Dispatch ─────────────────────────────────────
      try {
        // Send admin notification
        await strapi
          .service("api::arrange-a-call-back.email" as any)
          .sendCallbackNotification(result);

        // Send user confirmation if valid customer email is present
        if (result.email && typeof result.email === 'string' && result.email.trim().length > 0) {
          await strapi
            .service("api::arrange-a-call-back.email" as any)
            .sendUserConfirmationEmail(result.email, result.mobileNumber || "Customer", result);
        }
      } catch (emailErr: any) {
        console.error("[Callback Email Error]:", emailErr?.message || emailErr);
      }

      // ── 2. Meta Conversions API (Completely Independent) ─────────────
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
      } catch (metaErr: any) {
        strapi.log.error('Failed to trigger Meta Conversions API for arrange-a-call-back:', metaErr);
      }
    })();
  },
};
