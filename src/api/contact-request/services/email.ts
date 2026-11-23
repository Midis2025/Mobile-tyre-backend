import { sendEmail, getAdminEmail, getSenderEmail, isValidEmail } from '../../../services/resend';
import {
  buildContactAdminEmail,
  buildContactCustomerEmail,
} from '../../../services/email-templates';

export default ({ strapi }: { strapi: any }) => {
  return {
    async sendContactNotification(contactRequest: any) {
      try {
        const adminEmail = getAdminEmail();
        const html = buildContactAdminEmail(contactRequest);
        const customerEmail = contactRequest.email?.trim();
        const replyTo = isValidEmail(customerEmail) ? customerEmail : undefined;
        const recordId = contactRequest.documentId || contactRequest.id;

        return await sendEmail({
          to: adminEmail,
          subject: `🚀 New Contact Request: ${contactRequest.fullName || 'Inquiry'}`,
          html,
          replyTo,
          workflow: 'contact-request',
          category: 'admin',
          recordId,
        });
      } catch (error) {
        console.error('[Resend Error] Failed to send contact notification:', error);
        return { success: false, error: String(error) };
      }
    },

    async sendUserConfirmationEmail(userEmail: string, userName: string, contactRequest: any) {
      try {
        if (!isValidEmail(userEmail)) {
          console.warn('[Resend Warning] No valid user email provided, skipping contact confirmation email');
          return { success: false, skipped: true, error: 'Invalid or missing customer email' };
        }

        const html = buildContactCustomerEmail(userName);
        const recordId = contactRequest?.documentId || contactRequest?.id;

        return await sendEmail({
          to: userEmail.trim(),
          subject: 'Thank You for Contacting Us',
          html,
          replyTo: getSenderEmail(),
          workflow: 'contact-request',
          category: 'customer',
          recordId,
        });
      } catch (error) {
        console.error('[Resend Error] Failed to send contact confirmation email:', error);
        return { success: false, error: String(error) };
      }
    },
  };
};
