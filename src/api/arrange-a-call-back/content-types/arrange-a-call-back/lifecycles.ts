const processedIds = new Set();

export default {
  async afterCreate(event: any) {
    const { result } = event;
    const documentId = result.documentId || result.id;

    // Prevent double execution for the same ID in a short window
    if (processedIds.has(documentId)) return;

    processedIds.add(documentId);
    setTimeout(() => processedIds.delete(documentId), 10000);

    console.log(`[Lifecycle] afterCreate triggered for arrange-a-call-back:`, documentId);

    try {
      // Send admin notification email
      await strapi
        .service("api::arrange-a-call-back.email" as any)
        .sendCallbackNotification(result);

      // Send user confirmation email (non-blocking, errors won't stop the process)
      if (result.email) {
        await strapi
          .service("api::arrange-a-call-back.email" as any)
          .sendUserConfirmationEmail(result.email, result.mobileNumber || "Customer", result);
      }
    } catch (err: any) {
      console.error("[Production Email Error]:", err);
    }
  },
};
