export default {
  routes: [
    {
      method: 'GET',
      path: '/google-reviews',
      handler: 'google-reviews.getReviews',
      config: {
        auth: false,
      },
    },
  ],
};
