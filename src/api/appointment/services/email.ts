import { sendEmail, getAdminEmail, getSenderEmail, isValidEmail } from '../../../services/resend';
import {
  buildAppointmentAdminEmail,
  buildAppointmentCustomerEmail,
} from '../../../services/email-templates';

export default ({ strapi }: { strapi: any }) => {
  return {
    async sendAppointmentNotification(appointment: any) {
      try {
        const adminEmail = getAdminEmail();
        const html = buildAppointmentAdminEmail(appointment);
        const customerEmail = appointment.email?.trim();
        const replyTo = isValidEmail(customerEmail) ? customerEmail : undefined;
        const recordId = appointment.documentId || appointment.id;

        return await sendEmail({
          to: adminEmail,
          subject: `🚀 New Appointment: ${appointment.fullName || 'Booking'}`,
          html,
          replyTo,
          workflow: 'appointment',
          category: 'admin',
          recordId,
        });
      } catch (error) {
        console.error('[Resend Error] Failed to send appointment notification:', error);
        return { success: false, error: String(error) };
      }
    },

    async sendUserConfirmationEmail(userEmail: string, userName: string, appointment: any) {
      try {
        if (!isValidEmail(userEmail)) {
          console.warn('[Resend Warning] No valid user email provided, skipping confirmation email');
          return { success: false, skipped: true, error: 'Invalid or missing customer email' };
        }

        const html = buildAppointmentCustomerEmail(userName, appointment);
        const recordId = appointment.documentId || appointment.id;

        return await sendEmail({
          to: userEmail.trim(),
          subject: 'Thank You for Contacting Us',
          html,
          replyTo: getSenderEmail(),
          workflow: 'appointment',
          category: 'customer',
          recordId,
        });
      } catch (error) {
        console.error('[Resend Error] Failed to send user confirmation email:', error);
        return { success: false, error: String(error) };
      }
    },
  };
};
