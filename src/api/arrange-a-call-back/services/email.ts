import { sendEmail, getAdminEmail, getSenderEmail, isValidEmail } from '../../../services/resend';
import {
  buildCallbackAdminEmail,
  buildCallbackCustomerEmail,
} from '../../../services/email-templates';

export default ({ strapi }: { strapi: any }) => {
  return {
    async sendCallbackNotification(callbackRequest: any) {
      try {
        const adminEmail = getAdminEmail();
        const html = buildCallbackAdminEmail(callbackRequest);
        const customerEmail = callbackRequest.email?.trim();
        const replyTo = isValidEmail(customerEmail) ? customerEmail : undefined;
        const recordId = callbackRequest.documentId || callbackRequest.id;

        return await sendEmail({
          to: adminEmail,
          subject: `🚀 New Callback Request: ${callbackRequest.regNumber || callbackRequest.title || 'Inquiry'}`,
          html,
          replyTo,
          workflow: 'arrange-a-call-back',
          category: 'admin',
          recordId,
        });
      } catch (error) {
        console.error('[Resend Error] Failed to send callback notification:', error);
        return { success: false, error: String(error) };
      }
    },

    async sendUserConfirmationEmail(userEmail: string, userName: string, callbackRequest: any) {
      try {
        if (!isValidEmail(userEmail)) {
          console.warn('[Resend Warning] No valid user email provided, skipping callback confirmation email');
          return { success: false, skipped: true, error: 'Invalid or missing customer email' };
        }

        const html = buildCallbackCustomerEmail(userName);
        const recordId = callbackRequest?.documentId || callbackRequest?.id;

        return await sendEmail({
          to: userEmail.trim(),
          subject: 'Thank You for Your Callback Request',
          html,
          replyTo: getSenderEmail(),
          workflow: 'arrange-a-call-back',
          category: 'customer',
          recordId,
        });
      } catch (error) {
        console.error('[Resend Error] Failed to send callback confirmation email:', error);
        return { success: false, error: String(error) };
      }
    },
  };
};
