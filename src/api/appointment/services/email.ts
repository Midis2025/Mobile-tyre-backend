import nodemailer from "nodemailer";

export default ({ strapi }: { strapi: any }) => {
  // Create transporter once to be reused across calls (Production Best Practice)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.hostinger.com",
    port: Number(process.env.EMAIL_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER || "info@mobiletyrechampions.com",
      pass: process.env.EMAIL_PASS,
    },
  });

  return {
    async sendAppointmentNotification(appointment: any) {
      try {
        const htmlContent = `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h2 style="color: #00468b; text-align: center; border-bottom: 2px solid #00468b; padding-bottom: 10px;">🚀 New Appointment Booking</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9; width: 40%;">Full Name</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${appointment.fullName || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9;">Phone Number</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${appointment.phoneNumber || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9;">Service Type</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${appointment.serviceType || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9;">Tyre Size</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${appointment.tyreSize || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9;">Timing Slot</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${appointment.timingSlot || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9;">Booking Status</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${appointment.bookingStatus || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9;">Location</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${appointment.location || 'N/A'}</td>
              </tr>
            </table>
            <p style="margin-top: 20px; text-align: center; color: #777; font-size: 12px;">This is an automated notification from Mobile Tyre Champions Backend.</p>
          </div>
        `;

        await transporter.sendMail({
          from: `"Mobile Tyre Champions" <${process.env.EMAIL_USER}>`,
          to: "mtyrechampions@gmail.com",
          subject: "🚀 New Appointment Booking",
          html: htmlContent,
        });

        console.log(`[Email Success] Notification sent for appointment: ${appointment.fullName}`);
      } catch (error) {
        console.error("[Email Error] Failed to send notification:", error);
      }
    },
  };
};
