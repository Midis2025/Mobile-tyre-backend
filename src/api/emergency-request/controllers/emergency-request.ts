/**
 * emergency-request controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::emergency-request.emergency-request' as any, ({ strapi }) => ({
  async create(ctx) {
    const response: any = await super.create(ctx);
    // Return minimal response omitting sensitive customer PII
    return {
      data: {
        id: response?.data?.id,
        documentId: response?.data?.documentId,
      },
      meta: {
        message: 'Emergency request received successfully.',
      },
    };
  },
}));
