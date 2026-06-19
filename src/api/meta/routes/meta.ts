export default {
  routes: [
    {
      method: 'POST',
      path: '/meta/test-event',
      handler: 'meta.testEvent',
      config: {
        auth: false, // adjust based on security needs (false for testing/public endpoint)
      },
    },
    {
      method: 'GET',
      path: '/meta/stats',
      handler: 'meta.stats',
      config: {
        auth: false, // adjust based on security needs
      },
    },
  ],
};
