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
            
            <div style="background-color: #0c162d; color: #ffffff; padding: 40px 20px; text-align: center;">
              <img src="https://mobiletyrechampions.com/images/MTC%20logo%202.webp" alt="Mobile Tyre Champions Logo" style="width: 80px; height: auto; margin: 0 auto 20px auto; display: block;">
              <div style="margin-bottom: 25px;">
                <a href="https://www.mobiletyrechampions.com/about" style="color: #ffffff; text-decoration: none; font-size: 13px; margin: 0 8px;">About</a> |
                <a href="https://www.mobiletyrechampions.com/find-tyres" style="color: #ffffff; text-decoration: none; font-size: 13px; margin: 0 8px;">Find Tyres</a> |
                <a href="https://www.mobiletyrechampions.com/services" style="color: #ffffff; text-decoration: none; font-size: 13px; margin: 0 8px;">Services</a> |
                <a href="https://www.mobiletyrechampions.com/areas-we-cover" style="color: #ffffff; text-decoration: none; font-size: 13px; margin: 0 8px;">Areas We Cover</a> |
                <a href="https://www.mobiletyrechampions.com/contact" style="color: #ffffff; text-decoration: none; font-size: 13px; margin: 0 8px;">Contact</a>
              </div>
              <div style="margin: 25px 0;">
                <a href="https://www.facebook.com/mobiletyrechampions" style="display: inline-block; margin: 0 8px;"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" style="width: 24px; height: 24px;"></a>
                <a href="https://www.tiktok.com/@mobiletyrechampions" style="display: inline-block; margin: 0 8px;"><img src="https://cdn-icons-png.flaticon.com/512/3046/3046121.png" alt="TikTok" style="width: 24px; height: 24px;"></a>
                <a href="https://www.instagram.com/mobiletyrechampions" style="display: inline-block; margin: 0 8px;"><img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" style="width: 24px; height: 24px;"></a>
              </div>
              <p style="font-size: 13px; opacity: 0.9; margin: 20px 0 0 0; color: #ffffff;">
                Mobile Tyre Champions is a 24/7 mobile tyre fitting service<br>
                based at Grosvenor Road, Aldershot GU11 3HY.
              </p>
              <p style="font-size: 11px; opacity: 0.7; margin-top: 30px; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 20px; color: #ffffff;">
                &copy; ${new Date().getFullYear()} Mobile Tyre Champions. All rights reserved.
              </p>
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

    async sendUserConfirmationEmail(userEmail: string, userName: string, appointment: any) {
      try {
        if (!userEmail) {
          console.warn("[Email Warning] No user email provided, skipping confirmation email");
          return;
        }

        const htmlContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="color-scheme" content="light">
            <title>Booking Request Received</title>
            <style>
              /* Prevent dark mode override */
              * {
                color-scheme: light;
              }
              /* General Reset */
              body {
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
                font-family: Arial, sans-serif;
                -webkit-font-smoothing: antialiased;
              }
              table {
                border-spacing: 0;
                border-collapse: collapse;
                width: 100%;
              }
              img {
                border: 0;
                display: block;
                max-width: 100%;
                height: auto;
              }
              .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
              }
              /* Typography */
              p {
                font-size: 16px;
                color: #333333;
                line-height: 1.6;
                margin: 0 0 20px 0;
              }
              /* Buttons */
              .btn-container {
                padding: 10px 0 20px 0;
                text-align: center;
              }
              .button {
                background-color: #e67e22;
                color: #ffffff !important;
                padding: 14px 35px;
                text-decoration: none;
                border-radius: 25px;
                font-weight: bold;
                display: inline-block;
              }
              /* Logo Class */
              .logo {
                width: 80px;
                height: auto;
                margin: 0 auto 20px auto;
                display: block;
              }
              /* Footer */
              .footer {
                background-color: #0c162d;
                color: #ffffff;
                padding: 40px 20px;
                text-align: center;
              }
              .footer a {
                color: #ffffff;
                text-decoration: none;
                font-size: 13px;
                margin: 0 8px;
              }
              .social-icons {
                margin: 25px 0;
              }
              .social-icons img {
                display: inline-block;
                width: 24px;
                margin: 0 8px;
              }
              .address {
                font-size: 13px;
                opacity: 0.9;
                margin-top: 20px;
                color: #ffffff !important;
              }
              .copyright {
                font-size: 11px;
                opacity: 0.7;
                margin-top: 30px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                padding-top: 20px;
                color: #ffffff !important;
              }
              @media screen and (max-width: 600px) {
                .container {
                  width: 100% !important;
                }
                .padding-mobile {
                  padding: 30px 20px !important;
                }
                td[style*="#0c162d"] {
                  background-color: #0c162d !important;
                  color: #ffffff !important;
                  padding: 30px 15px !important;
                }
              }
              @media (prefers-color-scheme: dark) {
                td[style*="#0c162d"],
                div[style*="#0c162d"] {
                  background-color: #0c162d !important;
                  color: #ffffff !important;
                }
                a[style*="#ffffff"] {
                  color: #ffffff !important;
                }
                p[style*="#ffffff"] {
                  color: #ffffff !important;
                }
              }
            </style>
          </head>
          <body>
            <table role="presentation" class="container" align="center">
              <tr>
                <td>
                  <img src="https://res.cloudinary.com/dmrhxgy33/image/upload/v1778220254/mtc_social_media_30__converted_plln5x.webp"
                    alt="24/7 Mobile Tyre Help Across England" width="600" style="width: 100%; display: block;">
                </td>
              </tr>
              <tr>
                <td class="padding-mobile" style="padding: 40px 35px;">
                  <p>Hi ${userName || 'there'},</p>
                  <p><strong>Thanks for contacting Mobile Tyre Champions.</strong> We've received your booking request and our team is already reviewing the details.</p>
                  <p>One of our team members will be in touch shortly by phone to confirm your booking and finalise everything with you.</p>
                  <p>We appreciate you choosing us and look forward to helping you get back on the road quickly.</p>
                  <p style="margin-bottom: 5px;">Kind regards,</p>
                  <p style="color: #e67e22; font-weight: bold;">Mobile Tyre Champions</p>
                  <div class="btn-container">
                    <a href="https://mobiletyrechampions.com" class="button" target="_blank">Visit our website</a>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="background-color: #0c162d; color: #ffffff; padding: 40px 20px; text-align: center;">
                  <img src="https://www.mobiletyrechampions.com/images/MTC%20logo%202.png" alt="Mobile Tyre Champions Logo" style="width: 80px; height: auto; margin: 0 auto 20px auto; display: block;">
                  <div style="margin-bottom: 25px;">
                    <a href="https://www.mobiletyrechampions.com/about" style="color: #ffffff; text-decoration: none; font-size: 13px; margin: 0 8px;">About</a> |
                    <a href="https://www.mobiletyrechampions.com/find-tyres" style="color: #ffffff; text-decoration: none; font-size: 13px; margin: 0 8px;">Find Tyres</a> |
                    <a href="https://www.mobiletyrechampions.com/services" style="color: #ffffff; text-decoration: none; font-size: 13px; margin: 0 8px;">Services</a> |
                    <a href="https://www.mobiletyrechampions.com/areas-we-cover" style="color: #ffffff; text-decoration: none; font-size: 13px; margin: 0 8px;">Areas We Cover</a> |
                    <a href="https://www.mobiletyrechampions.com/contact" style="color: #ffffff; text-decoration: none; font-size: 13px; margin: 0 8px;">Contact</a>
                  </div>
                  <div style="margin: 25px 0;">
                    <a href="https://www.facebook.com/mobiletyrechampions" style="display: inline-block; margin: 0 8px;"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" style="width: 24px; height: 24px;"></a>
                    <a href="https://www.tiktok.com/@mobiletyrechampions" style="display: inline-block; margin: 0 8px;"><img src="https://cdn-icons-png.flaticon.com/512/3046/3046121.png" alt="TikTok" style="width: 24px; height: 24px;"></a>
                    <a href="https://www.instagram.com/mobiletyrechampions" style="display: inline-block; margin: 0 8px;"><img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" style="width: 24px; height: 24px;"></a>
                  </div>
                  <p style="font-size: 13px; opacity: 0.9; margin: 20px 0 0 0; color: #ffffff;">
                    Mobile Tyre Champions is a 24/7 mobile tyre fitting service<br>
                    based at Grosvenor Road, Aldershot GU11 3HY.
                  </p>
                  <p style="font-size: 11px; opacity: 0.7; margin-top: 30px; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 20px; color: #ffffff;">
                    &copy; ${new Date().getFullYear()} Mobile Tyre Champions. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `;

        await transporter.sendMail({
          from: `"Mobile Tyre Champions" <${process.env.EMAIL_USER}>`,
          to: userEmail,
          subject: "Thank You for Contacting Us",
          html: htmlContent,
        });

        console.log(`[Email Success] Confirmation email sent to user: ${userEmail}`);
      } catch (error) {
        console.error("[Email Error] Failed to send user confirmation email:", error);
        // Don't throw - let the appointment save even if email fails
      }
    },
  };
};
