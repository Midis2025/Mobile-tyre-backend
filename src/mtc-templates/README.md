# Mobile Tyre Champions (MTC) - Premium Admin Notification Email

A production-grade, responsive HTML email design for **Mobile Tyre Champions (MTC)**. This email template notifies the company's dispatch and operations administration team immediately whenever a customer submits an appointment or service request through the website.

Designed and tested to match the official MTC visual brand identity, respecting the exact circular logo, automotive styling, and rigorous email client compatibility (Outlook, Apple Mail, Gmail, Yahoo, and mobile clients).

---

## 📁 Project Structure & File Inventory

```text
mtc-templates/
├── admin-appointment-email-preview.html   # Standalone preview file with embedded high-res assets & sample data
├── admin-appointment-email-strapi.html    # Production template for Strapi (Mustache / Handlebars syntax)
├── admin-appointment-email-template.html  # Alternative template with EJS / Lodash syntax (<%= data.* %>)
├── preview_desktop.png                   # Rendered screenshot at Desktop viewport (800x1400)
├── preview_mobile_430.png                # Rendered screenshot at 430px (iPhone 14/15 Pro Max)
├── preview_mobile_375.png                # Rendered screenshot at 375px (iPhone standard)
├── preview_mobile_320.png                # Rendered screenshot at 320px (Compact mobile)
├── README.md                             # Comprehensive design and integration guide
└── assets/
    ├── mtc_logo.png                      # Official MTC circular logo (pristine, antialiased PNG)
    ├── header_tyre_blended.png           # Header tyre photography with feathered edge
    ├── header_separator_curve.png        # Orange and white dynamic swoosh divider
    ├── footer_tread_blended.png          # Subtle tyre tread pattern for footer
    ├── icons/
    │   ├── icon_bell.png                 # Notification bell with ringing soundwaves (#FF7900)
    │   ├── icon_user.png                 # Customer profile icon
    │   ├── icon_calendar.png             # Booking details calendar icon
    │   ├── icon_message.png              # Customer message speech bubble icon
    │   ├── icon_dashboard.png            # Admin dashboard target/link icon
    │   ├── icon_247.png                  # 24/7 service trust badge icon (#FF7900)
    │   ├── icon_pin.png                  # Location pin icon (#FF7900)
    │   └── icon_shield.png               # Reliability trust shield icon (#FF7900)
    └── extracted/                        # High-resolution crops from the approved brand mockup
```

---

## 🎨 Brand Identity & Palette

| Element | Hex Code | Purpose / Application |
| :--- | :--- | :--- |
| **Primary Navy Blue** | `#0C162D` | Header background, notification hero base, card subheadings, footer |
| **Brand Blue** | `#203F7F` | Subtle gradients, borders, email links, postcode accents |
| **Primary Orange** | `#FF7900` | CTA button, notification bell, accent lines, "CHAMPIONS" lettering, trust icons |
| **Pure White** | `#FFFFFF` | Main card backgrounds, typography against navy, clean contrast |
| **Light Background** | `#F4F7FC` | Email outer canvas background, card separation |
| **Text Primary** | `#101D38` | Primary labels, values, customer message |
| **Text Muted** | `#64748B` | Field label descriptors |
| **UK Reg Yellow** | `#FFDB00` | Authentic UK vehicle registration plate styling |

---

## 📧 Email Sections & Architecture

### 1. Header
- **Deep Navy Background (`#0C162D`)**: Features subtle automotive tyre tread detailing.
- **Official Circular Logo**: Sourced directly from `https://mobiletyrechampions.com/images/MTC%20logo%202.webp` at 82×82px with crisp antialiased rendering.
- **Brand Typography**: Prominent, modern typography reading `MOBILE TYRE CHAMPIONS` (with orange emphasis) and `24/7 MOBILE TYRE FITTING` subtitle.
- **Tyre Photography**: High-end realistic tyre detail on the right with a feathered fade into the navy background.
- **Dynamic Curved Divider**: Orange and white separator swoosh leading seamlessly into the content.

### 2. Notification Hero Section
- **Vibrant Orange Bell Icon (`#FF7900`)**: Prominent ringing bell icon for fast visual recognition in inbox.
- **Bold Headline**: `NEW APPOINTMENT RECEIVED` in high-contrast white and orange italic styling.
- **Subtext**: `"A customer has submitted a new appointment request. Here are the details:"`

### 3. Customer Details Card
- White elevated card with subtle border (`#DCE4EF`) and deep navy pill header (`#0C162D`) with user icon.
- Two-column aligned desktop layout with clean micro-dividers.
- **Customer Name**: Clear, bold font.
- **Email Address**: Formatted `mailto:` hyperlink.
- **Phone Number**: Direct `tel:` link with interactive "Call" badge.
- **Vehicle Registration**: Styled as an authentic UK number plate (`#FFDB00` yellow badge with bold black lettering `AB12 CDE`).

### 4. Booking Details Card
- White elevated card with deep navy pill header and calendar icon.
- **Service Required**: Highlighted with an orange checkmark tag (e.g. `✓ New Tyres`).
- **Preferred Date & Time**: `27 November 2026 – 10:00 AM`.
- **Postcode**: Highlighted in Brand Blue (`#203F7F`) for fast routing and dispatch.
- **Full Address**: Complete customer premises / breakdown location.

### 5. Customer Message Card
- Dedicated card with navy pill header and speech bubble icon.
- Lightly shaded callout box (`#F8FAFD`) with a **4px orange accent border** (`#FF7900`) and italicized quote.
- **Fallback / Empty Handling**: Includes conditional logic (`{{#if customerMessage}}...{{else}}...{{/if}}`) to render a polite fallback note or hide gracefully if no customer message is provided.

### 6. Admin Dashboard CTA Button
- Full-width, high-contrast **Primary Orange (`#FF7900`)** button.
- Outlook bulletproof VML button (`<v:roundrect>`) for 100% desktop Outlook compatibility.
- Interactive hover effects for modern webmail and mobile clients.
- Direct link to the actual appointment record in the admin portal (`{{ adminDashboardUrl }}`).

### 7. Footer
- Dark Navy footer with `"Keeping you on the move"` headline and orange separator.
- **Three Compact Trust Indicators**:
  1. `24/7 Service` (with 24/7 clock icon)
  2. `Across Surrey, Hampshire & West London` (with location pin icon)
  3. `Trusted & Reliable` (with security shield icon)
- Company name, automated system disclaimer, and confidentiality notice.

---

## 🛠️ Responsive & Email Client Compatibility

- **Target Container Width**: 600px desktop maximum.
- **Mobile Breakpoints**: Fully fluid and tested at **320px**, **375px**, and **430px**.
- **Two-Column to Single-Column Stacking**: On mobile screens (`max-width: 620px`), labels and values stack cleanly to eliminate cramped fields.
- **Email Client Testing**:
  - **Microsoft Outlook (2016, 2019, 365, MSO engine)**: Bulletproof tables, explicit cell dimensions, MSO conditional comments, and VML CTA button.
  - **Gmail (Web, iOS, Android)**: All CSS inlined on table elements, no external font dependencies, no stripped tags.
  - **Apple Mail (macOS, iOS)**: Full Retina sharpness and smooth antialiasing.
  - **Samsung Mail & Yahoo**: Clean fallbacks with robust HTML table markup.

---

## ⚙️ Strapi Backend Integration Guide

### Step 1: Upload Image Assets
Upload the files in `assets/` to your Strapi media library or CDN:
```text
https://cdn.mobiletyrechampions.co.uk/email/mtc_logo.png
https://cdn.mobiletyrechampions.co.uk/email/header_tyre_blended.png
https://cdn.mobiletyrechampions.co.uk/email/header_separator_curve.png
https://cdn.mobiletyrechampions.co.uk/email/hero_bell.png
https://cdn.mobiletyrechampions.co.uk/email/icons/icon_user.png
...
```

### Step 2: Strapi Email Template Configuration
In Strapi (via the **Email Designer** plugin or custom service), paste the contents of `admin-appointment-email-strapi.html`.

Map your appointment schema fields to the template variables:
```json
{
  "customerName": appointment.name,
  "email": appointment.email,
  "phone": appointment.phone,
  "vehicleRegistration": appointment.vehicleReg,
  "serviceRequired": appointment.service,
  "preferredDate": appointment.date,
  "preferredTime": appointment.time,
  "postcode": appointment.postcode,
  "fullAddress": appointment.address,
  "customerMessage": appointment.message,
  "adminDashboardUrl": `https://admin.mobiletyrechampions.co.uk/admin/content-manager/collectionType/api::appointment.appointment/${appointment.id}`,
  "assetsUrl": "https://cdn.mobiletyrechampions.co.uk/email"
}
```

### Step 3: Strapi Service Dispatch Example
```javascript
// src/api/appointment/controllers/appointment.js (or lifecycle hook)
await strapi.plugins['email'].services.email.sendTemplatedEmail(
  {
    to: 'dispatch@mobiletyrechampions.co.uk',
    from: 'notifications@mobiletyrechampions.co.uk',
    replyTo: appointment.email,
  },
  {
    templateId: 'admin-appointment-notification', // or template reference
  },
  {
    customerName: appointment.customerName,
    email: appointment.email,
    phone: appointment.phone,
    vehicleRegistration: appointment.vehicleRegistration,
    serviceRequired: appointment.serviceRequired,
    preferredDate: appointment.preferredDate,
    preferredTime: appointment.preferredTime,
    postcode: appointment.postcode,
    fullAddress: appointment.fullAddress,
    customerMessage: appointment.notes || '',
    adminDashboardUrl: `https://admin.mobiletyrechampions.co.uk/appointments/${appointment.id}`,
    assetsUrl: 'https://cdn.mobiletyrechampions.co.uk/email'
  }
);
```
