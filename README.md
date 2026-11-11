# Talkzo — Codebase Marketplace

A responsive React + TypeScript storefront for browsing and purchasing ready-to-customise website and application codebases. Product cards include preview artwork, project details, technology tags and product-specific Razorpay checkout.

## Run locally

```bash
npm install
cp .env.example .env.local
# Put your Razorpay TEST key ID and secret in .env.local
npm run dev
```

Open the Vite URL printed in the terminal. The development API creates Razorpay orders on the server using the selected product's catalog price and verifies the checkout signature server-side. Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `.env.local`; never put the secret in a `VITE_` variable or browser code. Use test keys until you are ready to take payments.

The frontend Razorpay flow lives in `src/services/razorpayService.ts`. It sends the selected product ID to the configured order endpoint, passes the returned `order_id` to Standard Checkout, then verifies the payment signature through the configured verification endpoint. The service reports payment success, failure, dismissal and API errors in the storefront.

Razorpay documents Orders API creation as a server-side call. A browser request also fails CORS preflight against the Orders endpoint, so the Key Secret must stay on the server. Firebase Functions provide the minimal API backend while GitHub Pages continues hosting the frontend. [Razorpay Standard Checkout integration](https://razorpay.com/docs/server-integration/python/test-app/) · [Firebase HTTPS functions](https://firebase.google.com/docs/functions/http-events).

## Deploy Razorpay backend with Firebase Functions

Cloud Functions require a Firebase project on the Blaze plan. In the project root, install and authenticate the Firebase CLI, select your Firebase project, and save the test credentials as function secrets:

```bash
firebase login
firebase use --add
firebase functions:secrets:set RAZORPAY_KEY_ID
firebase functions:secrets:set RAZORPAY_KEY_SECRET
firebase deploy --only functions
```

The Functions source is in `functions/src/index.ts`; it exports `createRazorpayOrderWebTemp` and `verifyRazorpayPaymentWebTemp` and allows the GitHub Pages origin in CORS. Firebase prints both HTTPS function URLs after deployment. Put those URLs in the ignored `.env.local` file:

```dotenv
VITE_RAZORPAY_CREATE_ORDER_URL=https://asia-south1-YOUR_PROJECT_ID.cloudfunctions.net/createRazorpayOrderWebTemp
VITE_RAZORPAY_VERIFY_PAYMENT_URL=https://asia-south1-YOUR_PROJECT_ID.cloudfunctions.net/verifyRazorpayPaymentWebTemp
```

Then run `npm run deploy` to rebuild and publish the frontend to GitHub Pages. Keep both Razorpay credentials in Firebase Secret Manager and `.env.local` only; never use a `VITE_` prefix for either credential. Firebase Functions are billed under the Blaze plan, which has usage-based charges.

## Configure your business contact

Edit `src/config.ts` to change the brand name or WhatsApp contact:

```ts
export const siteConfig = {
  brandName: 'Talkzo',
  whatsappNumber: '', // digits only, with country code
  supportEmail: '',
};
```

Set the WhatsApp number with country code and digits only to enable the contact links.

Product names, prices and checkout allowlists are defined in `src/App.tsx`, `vite.config.ts`, `api/razorpay/create-order.ts` and `functions/src/index.ts`. Keep the catalog prices in sync in those places when changing products.

## Included

- Responsive codebase marketplace for desktop, tablet and mobile
- Five project listings with locally bundled image previews
- Technology tags and project descriptions
- Product-specific Razorpay order amounts with server-side catalog allowlists
- WhatsApp contact link when a number is configured
- SEO title, description, Open Graph metadata and favicon
# talkzo
# talkzo
