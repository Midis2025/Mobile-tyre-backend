const processedIds = new Set();

export default {
  async afterCreate(event: any) {
    const { result } = event;
    const documentId = result.documentId || result.id;

    // Prevent double execution for the same ID in a short window
    if (processedIds.has(documentId)) return;

    processedIds.add(documentId);
    setTimeout(() => processedIds.delete(documentId), 30000);

    console.log(`[Lifecycle] afterCreate triggered for appointment:`, documentId);

    // Asynchronous non-blocking dispatch
    (async () => {
      try {
        // 1. Send admin notification email via Resend
        await strapi
          .service("api::appointment.email" as any)
          .sendAppointmentNotification(result);

        // 2. Send user confirmation email via Resend (if customer email is provided)
        if (result.email && typeof result.email === 'string' && result.email.trim().length > 0) {
          await strapi
            .service("api::appointment.email" as any)
            .sendUserConfirmationEmail(result.email, result.fullName, result);
        }
      } catch (err: any) {
        console.error("[Appointment Email Error]:", err?.message || err);
      }
    })();
  },
};
