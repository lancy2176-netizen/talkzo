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

The frontend Razorpay flow lives in `src/services/razorpayService.ts`. It asks the API to create a real order, passes the returned `order_id` to Standard Checkout, then asks the API to verify Razorpay's payment signature. The service also reports checkout failure, dismissal and API errors to the existing UI.

Razorpay's Orders API uses Basic authentication and is documented as a server-side call. A browser request would send an `Authorization` header and trigger CORS preflight. I checked the Razorpay Orders endpoint's preflight response for this Pages origin: it returned HTTP 404 without `Access-Control-Allow-Origin`, so the browser cannot call it directly. The API key secret also must remain server-side. [Razorpay Standard Checkout integration](https://razorpay.com/docs/server-integration/python/test-app/) · [Razorpay API authentication](https://axisbank-docs.razorpay.com/payment-links/api/v1/).

The minimum backend endpoints are already present in `api/razorpay/create-order.ts` and `api/razorpay/verify-payment.ts`; the Vite middleware in `vite.config.ts` runs the equivalent routes during local development. Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` only in the backend environment. For a separately hosted API, set `VITE_RAZORPAY_API_URL` to its HTTPS origin before building the Pages frontend. GitHub Pages itself cannot run these endpoints, so the deployed Standard Checkout will not work until those routes are available at an API origin. Leave `VITE_RAZORPAY_API_URL` blank for local development.

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
# talkzo
