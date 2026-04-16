const processedIds = new Set();

export default {
  async afterCreate(event: any) {
    const { result } = event;
    const documentId = result.documentId || result.id;

    // Prevent double execution for the same ID in a short window
    if (processedIds.has(documentId)) return;

    processedIds.add(documentId);
    setTimeout(() => processedIds.delete(documentId), 10000);

    console.log(`[Lifecycle] afterCreate triggered for:`, documentId);

    // TRIGGER EMAIL (Non-blocking)
    strapi
      .service("api::appointment.email" as any)
      .sendAppointmentNotification(result)
      .catch((err: any) => {
        console.error("[Production Email Error]:", err);
      });
  },
};
