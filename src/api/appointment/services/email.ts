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
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; border: none; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #00468b 0%, #002d5a 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">New Appointment Booking</h1>
              <p style="color: #a5c7eb; margin: 10px 0 0 0; font-size: 14px;">Mobile Tyre Champions Notification</p>
            </div>
            
            <div style="padding: 30px; background-color: #ffffff;">
              <div style="margin-bottom: 25px; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">
                <h3 style="color: #00468b; margin: 0; font-size: 18px;">Customer Information</h3>
              </div>
              
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 12px 0; color: #777; font-size: 14px; width: 35%;">Full Name</td>
                  <td style="padding: 12px 0; color: #333; font-size: 15px; font-weight: 500;">${appointment.fullName || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; color: #777; font-size: 14px;">Phone Number</td>
                  <td style="padding: 12px 0; color: #333; font-size: 15px; font-weight: 500;">${appointment.phoneNumber || 'N/A'}</td>
                </tr>
              </table>

              <div style="margin-bottom: 25px; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">
                <h3 style="color: #00468b; margin: 0; font-size: 18px;">Service Details</h3>
              </div>

              <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 12px 0; color: #777; font-size: 14px; width: 35%;">Service Type</td>
                  <td style="padding: 12px 0; color: #333; font-size: 15px; font-weight: 500;">${appointment.serviceType || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; color: #777; font-size: 14px;">Tyre Size</td>
                  <td style="padding: 12px 0; color: #333; font-size: 15px; font-weight: 500;">${appointment.tyreSize || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; color: #777; font-size: 14px;">Timing Slot</td>
                  <td style="padding: 12px 0; color: #333; font-size: 15px; font-weight: 500;">${appointment.timingSlot || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; color: #777; font-size: 14px;">Status</td>
                  <td style="padding: 12px 0;">
                    <span style="background-color: #e8f4fd; color: #00468b; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase;">
                      ${appointment.bookingStatus || 'Pending'}
                    </span>
                  </td>
                </tr>
              </table>

              <div style="margin-bottom: 25px; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">
                <h3 style="color: #00468b; margin: 0; font-size: 18px;">Location & Notes</h3>
              </div>

              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; color: #777; font-size: 14px; width: 35%;">Postcode</td>
                  <td style="padding: 12px 0; color: #333; font-size: 15px; font-weight: 500;">${appointment.postcode || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; color: #777; font-size: 14px;">Address</td>
                  <td style="padding: 12px 0; color: #333; font-size: 15px; font-weight: 500;">${appointment.address || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; color: #777; font-size: 14px;">Coordinates</td>
                  <td style="padding: 12px 0; color: #333; font-size: 14px;">
                    <a href="https://www.google.com/maps/search/?api=1&query=${appointment.latitude},${appointment.longitude}" style="color: #00468b; text-decoration: none;">
                      ${appointment.latitude || '0'}, ${appointment.longitude || '0'} 📍
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; color: #777; font-size: 14px;">Location Notes</td>
                  <td style="padding: 20px 0 0 0; color: #555; font-size: 14px; font-style: italic;" colspan="2">
                    ${appointment.locationNotes || 'No additional notes provided.'}
                  </td>
                </tr>
              </table>
            </div>
            
            <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
              <p style="margin: 0; color: #999; font-size: 12px;">© ${new Date().getFullYear()} Mobile Tyre Champions. All rights reserved.</p>
              <p style="margin: 5px 0 0 0; color: #999; font-size: 11px;">This is an automated notification from your backend system.</p>
            </div>
          </div>
        `;

        await transporter.sendMail({
          from: `"Mobile Tyre Champions" <${process.env.EMAIL_USER}>`,
          to: "mtyrechampions@gmail.com",
          subject: `🚀 New Appointment: ${appointment.fullName || 'Booking'}`,
          html: htmlContent,
        });

        console.log(`[Email Success] Premium notification sent for appointment: ${appointment.fullName}`);
      } catch (error) {
        console.error("[Email Error] Failed to send notification:", error);
      }
    },
  };
};
