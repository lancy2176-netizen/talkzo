# FlutterFix — Flutter bug-fixing service website

A responsive React + TypeScript single-page website for a Flutter bug-fixing service advertised at **₹999 onwards**.

## Run locally

```bash
npm install
cp .env.example .env.local
# Put your Razorpay TEST key ID and secret in .env.local
npm run dev
```

Open the Vite URL printed in the terminal. The app includes a ₹999 Razorpay checkout. The development API creates the order server-side and verifies the checkout signature server-side. Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `.env.local`; never put the secret in a `VITE_` variable or browser code. Use test keys until you are ready to take payments.

For production, deploy an API with equivalent create-order and signature-verification routes using the same server-only environment variables. The API middleware in `vite.config.ts` is for local development and is not included in static production builds.

## Compatibility

This source overlay is designed for the Vite + React + TypeScript project already created on your Mac. It uses only React, TypeScript and browser APIs — no additional npm packages are required. It does not change `package.json`, lockfiles, Vite, React or TypeScript versions.

## Install into the existing Desktop project

1. Download and extract `flutter-bug-fixing-site-source.zip`.
2. Copy/merge the extracted `src` folder, `public` folder and `index.html` into `~/Desktop/react-ts-project`, replacing the starter `src/App.tsx`, `src/index.css` and `index.html`.
3. In Terminal:

```bash
cd ~/Desktop/react-ts-project
npm run build
npm run dev
```

## Configure your business contact

Edit `src/config.ts`:

```ts
export const siteConfig = {
  brandName: 'FlutterFix',
  whatsappNumber: '919876543210', // digits only, with country code
  supportEmail: '',
};
```

Replace the example number with your real WhatsApp Business number before publishing. When a valid number is configured, the enquiry form opens WhatsApp with the customer's message prefilled. Until then, the form prepares the enquiry text and provides a copy button; it does not pretend to send the enquiry.

You should also replace the placeholder brand name with your own business name if required, then update the page title and metadata in `index.html`.

## Included

- Responsive landing page for desktop, tablet and mobile
- Flutter bug-fixing service categories
- Transparent ₹999 starting-price section and estimate disclaimer
- Three-step service process
- Expandable FAQ section
- Enquiry form with validation
- WhatsApp handoff when a number is configured; copy-message fallback otherwise
- SEO title, description, Open Graph metadata and favicon
- Accessibility labels, reduced-motion support and keyboard-friendly controls
# talkzo
