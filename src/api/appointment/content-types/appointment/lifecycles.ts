const processedIds = new Set();

export default {
  // Trigger on initial creation (Admin or API)
  async afterCreate(event: any) {
    handleEmailTrigger(event);
  },

  // Trigger on publication (In case the API publishes immediately)
  async afterPublish(event: any) {
    handleEmailTrigger(event);
  }
};

async function handleEmailTrigger(event: any) {
  const { result, action } = event;
  const documentId = result.documentId || result.id;
  const uniqueKey = `${documentId}-${action}`;

  // Prevent double execution for the same ID/Action in a short window
  if (processedIds.has(uniqueKey)) return;

  processedIds.add(uniqueKey);
  setTimeout(() => processedIds.delete(uniqueKey), 10000);

  console.log(`[Lifecycle] ${action} triggered for:`, documentId);

  // TRIGGER EMAIL (Non-blocking)
  strapi
    .service("api::appointment.email" as any)
    .sendAppointmentNotification(result)
    .catch((err: any) => {
      console.error("[Production Email Error]:", err);
    });
}
