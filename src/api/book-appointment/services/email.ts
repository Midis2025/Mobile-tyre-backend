import { sendEmail, getAdminEmail, getSenderEmail, isValidEmail } from '../../../services/resend';
import {
  buildAppointmentAdminEmail,
  buildAppointmentCustomerEmail,
} from '../../../services/email-templates';

export default ({ strapi }: { strapi: any }) => {
  return {
    async sendBookingNotification(booking: any) {
      try {
        const adminEmail = getAdminEmail();
        const html = buildAppointmentAdminEmail(booking);
        const customerEmail = booking.email?.trim();
        const replyTo = isValidEmail(customerEmail) ? customerEmail : undefined;
        const recordId = booking.documentId || booking.id;

        return await sendEmail({
          to: adminEmail,
          subject: `🚀 New Booking: ${booking.fullName || 'Booking'}`,
          html,
          replyTo,
          workflow: 'book-appointment',
          category: 'admin',
          recordId,
        });
      } catch (error) {
        console.error('[Resend Error] Failed to send legacy booking notification:', error);
        return { success: false, error: String(error) };
      }
    },

    async sendUserConfirmationEmail(userEmail: string, userName: string, booking: any) {
      try {
        if (!isValidEmail(userEmail)) {
          return { success: false, skipped: true, error: 'Invalid or missing customer email' };
        }

        const html = buildAppointmentCustomerEmail(userName, booking);
        const recordId = booking?.documentId || booking?.id;

        return await sendEmail({
          to: userEmail.trim(),
          subject: 'Thank You for Contacting Us',
          html,
          replyTo: getSenderEmail(),
          workflow: 'book-appointment',
          category: 'customer',
          recordId,
        });
      } catch (error) {
        console.error('[Resend Error] Failed to send legacy booking confirmation email:', error);
        return { success: false, error: String(error) };
      }
    },
  };
};
