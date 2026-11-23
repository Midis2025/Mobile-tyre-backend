export default {
  routes: [
    {
      method: 'POST',
      path: '/meta/test-event',
      handler: 'meta.testEvent',
      config: {
        // Requires authentication; cannot be called publicly
      },
    },
    {
      method: 'GET',
      path: '/meta/stats',
      handler: 'meta.stats',
      config: {
        // Requires authentication; cannot be called publicly
      },
    },
  ],
};
