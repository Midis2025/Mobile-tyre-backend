/**
 * book-appointment controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::book-appointment.book-appointment', ({ strapi }) => ({
  async create(ctx) {
    const response: any = await super.create(ctx);
    // Return minimal response omitting sensitive customer PII
    return {
      data: {
        id: response?.data?.id,
        documentId: response?.data?.documentId,
      },
      meta: {
        message: 'Booking request received successfully.',
      },
    };
  },
}));

