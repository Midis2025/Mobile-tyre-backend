/**
 * quote-request controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::quote-request.quote-request', ({ strapi }) => ({
  async create(ctx) {
    const response: any = await super.create(ctx);
    // Return minimal response omitting sensitive customer PII
    return {
      data: {
        id: response?.data?.id,
        documentId: response?.data?.documentId,
      },
      meta: {
        message: 'Quote request received successfully.',
      },
    };
  },
}));
