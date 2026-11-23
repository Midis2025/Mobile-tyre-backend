import { escapeHtml } from './resend';

// Shared footer component preserving brand information, social icons, and address
const renderEmailFooter = (showCopyright = true): string => `
  <div style="background-color: #0c162d; color: #ffffff; padding: 40px 20px; text-align: center;">
    <img src="https://www.mobiletyrechampions.com/images/MTC%20logo%202.webp" alt="Mobile Tyre Champions Logo" width="120" style="width: 120px; max-width: 120px; height: auto; margin: 0 auto 20px auto; display: block; border: 0;">
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
    ${showCopyright ? `
    <p style="font-size: 11px; opacity: 0.7; margin-top: 30px; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 20px; color: #ffffff;">
      &copy; ${new Date().getFullYear()} Mobile Tyre Champions. All rights reserved.
    </p>
    ` : ''}
  </div>
`;

/**
 * ─────────────────────────────────────────────────────────────
 * APPOINTMENT BOOKING TEMPLATES
 * ─────────────────────────────────────────────────────────────
 */

export const buildAppointmentAdminEmail = (appointment: any): string => {
  const fullName = escapeHtml(appointment.fullName) || 'N/A';
  const phoneNumber = escapeHtml(appointment.phoneNumber) || 'N/A';
  const email = escapeHtml(appointment.email) || 'N/A';
  const serviceType = escapeHtml(appointment.serviceType) || 'N/A';
  const tyreSize = escapeHtml(appointment.tyreSize) || 'N/A';
  const timingSlot = escapeHtml(appointment.timingSlot) || 'N/A';
  const bookingStatus = escapeHtml(appointment.bookingStatus) || 'Pending';
  const postcode = escapeHtml(appointment.postcode) || 'N/A';
  const address = escapeHtml(appointment.address) || 'N/A';
  const vehicleReg = escapeHtml(appointment.vehicleReg) || 'N/A';
  const lat = escapeHtml(appointment.latitude) || '0';
  const lng = escapeHtml(appointment.longitude) || '0';
  const locationNotes = escapeHtml(appointment.locationNotes) || 'No additional notes provided.';

  return `
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
            <td style="padding: 12px 0; color: #333; font-size: 15px; font-weight: 500;">${fullName}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #777; font-size: 14px;">Email</td>
            <td style="padding: 12px 0; color: #333; font-size: 15px; font-weight: 500;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #777; font-size: 14px;">Phone Number</td>
            <td style="padding: 12px 0; color: #333; font-size: 15px; font-weight: 500;">${phoneNumber}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #777; font-size: 14px;">Vehicle Reg</td>
            <td style="padding: 12px 0; color: #333; font-size: 15px; font-weight: 500;">${vehicleReg}</td>
          </tr>
        </table>

        <div style="margin-bottom: 25px; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">
          <h3 style="color: #00468b; margin: 0; font-size: 18px;">Service Details</h3>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <tr>
            <td style="padding: 12px 0; color: #777; font-size: 14px; width: 35%;">Service Type</td>
            <td style="padding: 12px 0; color: #333; font-size: 15px; font-weight: 500;">${serviceType}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #777; font-size: 14px;">Tyre Size</td>
            <td style="padding: 12px 0; color: #333; font-size: 15px; font-weight: 500;">${tyreSize}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #777; font-size: 14px;">Timing Slot</td>
            <td style="padding: 12px 0; color: #333; font-size: 15px; font-weight: 500;">${timingSlot}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #777; font-size: 14px;">Status</td>
            <td style="padding: 12px 0;">
              <span style="background-color: #e8f4fd; color: #00468b; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase;">
                ${bookingStatus}
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
            <td style="padding: 12px 0; color: #333; font-size: 15px; font-weight: 500;">${postcode}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #777; font-size: 14px;">Address</td>
            <td style="padding: 12px 0; color: #333; font-size: 15px; font-weight: 500;">${address}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #777; font-size: 14px;">Coordinates / Map</td>
            <td style="padding: 12px 0; color: #333; font-size: 14px;">
              <a href="https://www.google.com/maps/search/?api=1&query=${lat},${lng}" style="color: #00468b; text-decoration: none; font-weight: 500;">
                ${lat}, ${lng} 📍 (View on Google Maps)
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #777; font-size: 14px;">Location Notes</td>
            <td style="padding: 20px 0 0 0; color: #555; font-size: 14px; font-style: italic;" colspan="2">
              ${locationNotes}
            </td>
          </tr>
        </table>
      </div>
      
      ${renderEmailFooter(true)}
    </div>
  `;
};

export const buildAppointmentCustomerEmail = (userName?: string, appointment?: any): string => {
  const safeName = escapeHtml(userName) || 'there';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="color-scheme" content="light">
      <title>Booking Request Received</title>
      <style>
        * { color-scheme: light; }
        body {
          margin: 0; padding: 0; background-color: #f4f4f4;
          font-family: Arial, sans-serif; -webkit-font-smoothing: antialiased;
        }
        table { border-spacing: 0; border-collapse: collapse; width: 100%; }
        img { border: 0; display: block; max-width: 100%; height: auto; }
        .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        p { font-size: 16px; color: #333333; line-height: 1.6; margin: 0 0 20px 0; }
        .btn-container { padding: 10px 0 20px 0; text-align: center; }
        .button {
          background-color: #e67e22; color: #ffffff !important; padding: 14px 35px;
          text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;
        }
        .footer { background-color: #0c162d; color: #ffffff; padding: 40px 20px; text-align: center; }
        .footer a { color: #ffffff; text-decoration: none; font-size: 13px; margin: 0 8px; }
        .social-icons { margin: 25px 0; }
        .social-icons img { display: inline-block; width: 24px; margin: 0 8px; }
        @media screen and (max-width: 600px) {
          .container { width: 100% !important; }
          .padding-mobile { padding: 30px 20px !important; }
        }
        @media (prefers-color-scheme: dark) {
          td[style*="#0c162d"], div[style*="#0c162d"] { background-color: #0c162d !important; color: #ffffff !important; }
          a[style*="#ffffff"], p[style*="#ffffff"] { color: #ffffff !important; }
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
            <p>Hi ${safeName},</p>
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
            <img src="https://www.mobiletyrechampions.com/images/MTC%20logo%202.webp" alt="Mobile Tyre Champions Logo" width="120" style="width: 120px; max-width: 120px; height: auto; margin: 0 auto 20px auto; display: block; border: 0;">
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
};

/**
 * ─────────────────────────────────────────────────────────────
 * CONTACT ENQUIRY TEMPLATES
 * ─────────────────────────────────────────────────────────────
 */

export const buildContactAdminEmail = (contactRequest: any): string => {
  const fullName = escapeHtml(contactRequest.fullName) || 'N/A';
  const email = escapeHtml(contactRequest.email) || 'N/A';
  const phoneNumber = escapeHtml(contactRequest.phoneNumber) || 'N/A';
  const serviceRequired = escapeHtml(contactRequest.serviceRequired) || 'N/A';
  const postcode = escapeHtml(contactRequest.postcode) || 'N/A';
  const bookingStatus = escapeHtml(contactRequest.bookingStatus) || 'Pending';
  const message = escapeHtml(contactRequest.message) || 'No message provided.';

  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; border: none; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
      <div style="background: linear-gradient(135deg, #00468b 0%, #002d5a 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">New Contact Request</h1>
        <p style="color: #a5c7eb; margin: 10px 0 0 0; font-size: 14px;">Mobile Tyre Champions Notification</p>
      </div>
      
      <div style="padding: 30px; background-color: #ffffff;">
        <div style="margin-bottom: 25px; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">
          <h3 style="color: #00468b; margin: 0; font-size: 18px;">Customer Information</h3>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <tr>
            <td style="padding: 12px 0; color: #777; font-size: 14px; width: 35%;">Full Name</td>
            <td style="padding: 12px 0; color: #333; font-size: 15px; font-weight: 500;">${fullName}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #777; font-size: 14px;">Email</td>
            <td style="padding: 12px 0; color: #333; font-size: 15px; font-weight: 500;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #777; font-size: 14px;">Phone Number</td>
            <td style="padding: 12px 0; color: #333; font-size: 15px; font-weight: 500;">${phoneNumber}</td>
          </tr>
        </table>

        <div style="margin-bottom: 25px; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">
          <h3 style="color: #00468b; margin: 0; font-size: 18px;">Request Details</h3>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <tr>
            <td style="padding: 12px 0; color: #777; font-size: 14px; width: 35%;">Service Required</td>
            <td style="padding: 12px 0; color: #333; font-size: 15px; font-weight: 500;">${serviceRequired}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #777; font-size: 14px;">Postcode</td>
            <td style="padding: 12px 0; color: #333; font-size: 15px; font-weight: 500;">${postcode}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #777; font-size: 14px;">Status</td>
            <td style="padding: 12px 0;">
              <span style="background-color: #e8f4fd; color: #00468b; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase;">
                ${bookingStatus}
              </span>
            </td>
          </tr>
        </table>

        <div style="margin-bottom: 25px; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">
          <h3 style="color: #00468b; margin: 0; font-size: 18px;">Message</h3>
        </div>

        <div style="padding: 20px; background-color: #f9f9f9; border-left: 4px solid #e67e22; border-radius: 4px; margin-bottom: 20px;">
          <p style="margin: 0; color: #555; font-size: 14px; line-height: 1.6;">
            ${message}
          </p>
        </div>
      </div>
      
      ${renderEmailFooter(true)}
    </div>
  `;
};

export const buildContactCustomerEmail = (userName?: string): string => {
  const safeName = escapeHtml(userName) || 'there';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="color-scheme" content="light">
      <title>Request Received</title>
      <style>
        * { color-scheme: light; }
        body { margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif; -webkit-font-smoothing: antialiased; }
        table { border-spacing: 0; border-collapse: collapse; width: 100%; }
        img { border: 0; display: block; max-width: 100%; height: auto; }
        .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        p { font-size: 16px; color: #333333; line-height: 1.6; margin: 0 0 20px 0; }
        .btn-container { padding: 10px 0 20px 0; text-align: center; }
        .button { background-color: #e67e22; color: #ffffff !important; padding: 14px 35px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; }
        @media screen and (max-width: 600px) {
          .container { width: 100% !important; }
          .padding-mobile { padding: 30px 20px !important; }
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
            <p>Hi ${safeName},</p>
            <p><strong>Thanks for contacting Mobile Tyre Champions.</strong> We've received your request and our team is already reviewing the details.</p>
            <p>One of our team members will be in touch shortly to assist you with your inquiry.</p>
            <p>We appreciate you reaching out and look forward to helping you.</p>
            <p style="margin-bottom: 5px;">Kind regards,</p>
            <p style="color: #e67e22; font-weight: bold;">Mobile Tyre Champions</p>
            <div class="btn-container">
              <a href="https://mobiletyrechampions.com" class="button" target="_blank">Visit our website</a>
            </div>
          </td>
        </tr>
        <tr>
          <td style="background-color: #0c162d; color: #ffffff; padding: 40px 20px; text-align: center;">
            <img src="https://www.mobiletyrechampions.com/images/MTC%20logo%202.webp" alt="Mobile Tyre Champions Logo" width="120" style="width: 120px; max-width: 120px; height: auto; margin: 0 auto 20px auto; display: block; border: 0;">
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
};

/**
 * ─────────────────────────────────────────────────────────────
 * CALLBACK REQUEST TEMPLATES
 * ─────────────────────────────────────────────────────────────
 */

export const buildCallbackAdminEmail = (callbackRequest: any): string => {
  const mobileNumber = escapeHtml(callbackRequest.mobileNumber) || 'N/A';
  const email = escapeHtml(callbackRequest.email) || 'N/A';
  const brand = escapeHtml(callbackRequest.brand) || 'N/A';
  const width = escapeHtml(callbackRequest.width) || '-';
  const height = escapeHtml(callbackRequest.height) || '-';
  const diameter = escapeHtml(callbackRequest.diameter) || '-';
  const season = escapeHtml(callbackRequest.Season) || 'N/A';
  const regNumber = escapeHtml(callbackRequest.regNumber) || 'N/A';
  const postcode = escapeHtml(callbackRequest.postcode) || 'N/A';
  const title = escapeHtml(callbackRequest.title) || 'N/A';
  const productId = escapeHtml(callbackRequest.productId) || 'N/A';

  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; border: none; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
      <div style="background: linear-gradient(135deg, #00468b 0%, #002d5a 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">New Callback Request</h1>
        <p style="color: #a5c7eb; margin: 10px 0 0 0; font-size: 14px;">Mobile Tyre Champions Notification</p>
      </div>
      
      <div style="padding: 30px; background-color: #ffffff;">
        <div style="margin-bottom: 25px; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">
          <h3 style="color: #00468b; margin: 0; font-size: 18px;">Customer Information</h3>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <tr>
            <td style="padding: 12px 0; color: #777; font-size: 14px; width: 35%;">Mobile Number</td>
            <td style="padding: 12px 0; color: #333; font-size: 15px; font-weight: 500;">${mobileNumber}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #777; font-size: 14px;">Email</td>
            <td style="padding: 12px 0; color: #333; font-size: 15px; font-weight: 500;">${email}</td>
          </tr>
        </table>

        <div style="margin-bottom: 25px; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">
          <h3 style="color: #00468b; margin: 0; font-size: 18px;">Tyre Specifications</h3>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <tr>
            <td style="padding: 12px 0; color: #777; font-size: 14px; width: 35%;">Brand</td>
            <td style="padding: 12px 0; color: #333; font-size: 15px; font-weight: 500;">${brand}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #777; font-size: 14px;">Size (W/H/D)</td>
            <td style="padding: 12px 0; color: #333; font-size: 15px; font-weight: 500;">${width}/${height}/${diameter}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #777; font-size: 14px;">Season</td>
            <td style="padding: 12px 0; color: #333; font-size: 15px; font-weight: 500;">${season}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #777; font-size: 14px;">Registration</td>
            <td style="padding: 12px 0; color: #333; font-size: 15px; font-weight: 500;">${regNumber}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #777; font-size: 14px;">Postcode</td>
            <td style="padding: 12px 0; color: #333; font-size: 15px; font-weight: 500;">${postcode}</td>
          </tr>
        </table>

        <div style="margin-bottom: 25px; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">
          <h3 style="color: #00468b; margin: 0; font-size: 18px;">Product Information</h3>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; color: #777; font-size: 14px; width: 35%;">Title</td>
            <td style="padding: 12px 0; color: #333; font-size: 15px; font-weight: 500;">${title}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #777; font-size: 14px;">Product ID</td>
            <td style="padding: 12px 0; color: #333; font-size: 15px; font-weight: 500;">${productId}</td>
          </tr>
        </table>
      </div>
      
      ${renderEmailFooter(true)}
    </div>
  `;
};

export const buildCallbackCustomerEmail = (userName?: string): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="color-scheme" content="light">
      <title>Callback Request Received</title>
      <style>
        * { color-scheme: light; }
        body { margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif; -webkit-font-smoothing: antialiased; }
        table { border-spacing: 0; border-collapse: collapse; width: 100%; }
        img { border: 0; display: block; max-width: 100%; height: auto; }
        .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        p { font-size: 16px; color: #333333; line-height: 1.6; margin: 0 0 20px 0; }
        .btn-container { padding: 10px 0 20px 0; text-align: center; }
        .button { background-color: #e67e22; color: #ffffff !important; padding: 14px 35px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; }
        @media screen and (max-width: 600px) {
          .container { width: 100% !important; }
          .padding-mobile { padding: 30px 20px !important; }
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
            <p>Hi there,</p>
            <p><strong>Thanks for requesting a callback with Mobile Tyre Champions.</strong> We've received your request and our team will be in touch shortly.</p>
            <p>One of our team members will give you a call at the number you provided to discuss your tyre requirements and provide you with the best options.</p>
            <p>We appreciate your interest and look forward to serving you.</p>
            <p style="margin-bottom: 5px;">Kind regards,</p>
            <p style="color: #e67e22; font-weight: bold;">Mobile Tyre Champions</p>
            <div class="btn-container">
              <a href="https://mobiletyrechampions.com" class="button" target="_blank">Visit our website</a>
            </div>
          </td>
        </tr>
        <tr>
          <td style="background-color: #0c162d; color: #ffffff; padding: 40px 20px; text-align: center;">
            <img src="https://www.mobiletyrechampions.com/images/MTC%20logo%202.webp" alt="Mobile Tyre Champions Logo" width="120" style="width: 120px; max-width: 120px; height: auto; margin: 0 auto 20px auto; display: block; border: 0;">
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
};
