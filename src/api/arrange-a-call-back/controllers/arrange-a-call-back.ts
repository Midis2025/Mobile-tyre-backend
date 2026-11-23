/**
 * arrange-a-call-back controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::arrange-a-call-back.arrange-a-call-back', ({ strapi }) => ({
  async create(ctx) {
    const response: any = await super.create(ctx);
    // Return minimal response omitting sensitive customer PII
    return {
      data: {
        id: response?.data?.id,
        documentId: response?.data?.documentId,
      },
      meta: {
        message: 'Callback request received successfully.',
      },
    };
  },
}));

