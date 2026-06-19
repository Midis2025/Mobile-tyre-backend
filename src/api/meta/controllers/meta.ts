import metaService from '../../../services/meta-conversions';

export default {
  async testEvent(ctx) {
    try {
      const { email, phone } = ctx.request.body;

      if (!email || !phone) {
        return ctx.badRequest('Email and phone are required for the test event.');
      }

      const testEventCode = process.env.META_TEST_EVENT_CODE;

      if (!testEventCode) {
        return ctx.internalServerError('META_TEST_EVENT_CODE is not configured.');
      }

      const userData = {
        email,
        phone,
      };

      const result = await metaService.sendTestEvent(userData, testEventCode);

      if (result?.success) {
        return ctx.send({
          success: true,
          response: result.response,
        });
      } else {
        return ctx.send({
          success: false,
          error: result?.error,
          details: result?.details,
        }, 500);
      }
    } catch (error: any) {
      return ctx.internalServerError(error.message);
    }
  },

  async stats(ctx) {
    try {
      const contactRequests = await strapi.documents('api::contact-request.contact-request').count({});
      const quoteRequests = await strapi.documents('api::quote-request.quote-request').count({});
      const callbackRequests = await strapi.documents('api::arrange-a-call-back.arrange-a-call-back').count({});
      const emergencyRequests = await (strapi.documents as any)('api::emergency-request.emergency-request').count({});
      const bookings = await strapi.documents('api::book-appointment.book-appointment').count({});

      const totalLeads = contactRequests + quoteRequests + callbackRequests + emergencyRequests;

      // To calculate today and this month, we need to add filters. 
      // For simplicity in this demo endpoint, we only return total aggregates, 
      // but in production, we would add { filters: { createdAt: { $gte: startOfDay } } }
      // Let's implement a basic today / thisMonth logic

      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const getCountWithFilter = async (uid: any, dateString: string) => {
        return strapi.documents(uid).count({
          filters: { createdAt: { $gte: dateString } }
        });
      };

      const uids = [
        'api::contact-request.contact-request',
        'api::quote-request.quote-request',
        'api::arrange-a-call-back.arrange-a-call-back',
        'api::emergency-request.emergency-request'
      ];

      let todayLeads = 0;
      let thisMonthLeads = 0;

      for (const uid of uids) {
        todayLeads += await getCountWithFilter(uid, startOfDay);
        thisMonthLeads += await getCountWithFilter(uid, startOfMonth);
      }

      return ctx.send({
        totalLeads,
        todayLeads,
        thisMonthLeads,
        bookings,
        quoteRequests,
        emergencyRequests,
      });
    } catch (error: any) {
      return ctx.internalServerError('Failed to fetch stats: ' + error.message);
    }
  }
};
