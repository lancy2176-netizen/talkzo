import { createHmac, timingSafeEqual } from 'node:crypto';
import { defineSecret } from 'firebase-functions/params';
import { onRequest } from 'firebase-functions/v2/https';

const razorpayKeyId = defineSecret('RAZORPAY_KEY_ID');
const razorpayKeySecret = defineSecret('RAZORPAY_KEY_SECRET');
const allowedOrigins = [
  'https://lancy2176-netizen.github.io',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

const commonOptions = {
  cors: allowedOrigins,
  secrets: [razorpayKeyId, razorpayKeySecret],
  region: 'asia-south1' as const,
};

export const createRazorpayOrderWebTemp = onRequest(commonOptions, async (request, response) => {
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const keyId = razorpayKeyId.value();
    const keySecret = razorpayKeySecret.value();
    if (!keyId.startsWith('rzp_test_')) {
      response.status(500).json({ error: 'This function is configured for Razorpay TEST credentials only.' });
      return;
    }
    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 99900,
        currency: 'INR',
        receipt: `talkzo_${Date.now()}`,
      }),
    });
    const order = await razorpayResponse.json() as {
      id?: string;
      amount?: number;
      currency?: string;
      error?: { description?: string };
    };

    if (!razorpayResponse.ok || !order.id || !order.amount || !order.currency) {
      response.status(502).json({ error: order.error?.description || 'Razorpay could not create the order.' });
      return;
    }

    response.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId });
  } catch {
    response.status(502).json({ error: 'Could not create a Razorpay order. Please try again.' });
  }
});

export const verifyRazorpayPaymentWebTemp = onRequest(commonOptions, (request, response) => {
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!razorpayKeyId.value().startsWith('rzp_test_')) {
    response.status(500).json({ verified: false, error: 'This function is configured for Razorpay TEST credentials only.' });
    return;
  }

  const body = request.body as Record<string, unknown> | undefined;
  const orderId = String(body?.razorpay_order_id || '');
  const paymentId = String(body?.razorpay_payment_id || '');
  const signature = String(body?.razorpay_signature || '');
  if (!orderId || !paymentId || !/^[a-f\d]{64}$/i.test(signature)) {
    response.status(400).json({ verified: false, error: 'Invalid payment verification details.' });
    return;
  }

  const expected = createHmac('sha256', razorpayKeySecret.value())
    .update(`${orderId}|${paymentId}`)
    .digest();
  const actual = Buffer.from(signature, 'hex');
  const verified = actual.length === expected.length && timingSafeEqual(actual, expected);
  if (!verified) {
    response.status(400).json({ verified: false, error: 'Payment signature could not be verified.' });
    return;
  }

  response.json({ verified: true });
});
