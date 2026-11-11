import { createHmac, timingSafeEqual } from 'node:crypto';

const defaultOrigins = [
  'https://lancy2176-netizen.github.io',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

function allowedOrigins() {
  const configured = process.env.ALLOWED_PAYMENT_ORIGINS?.split(',').map((value) => value.trim()).filter(Boolean) ?? [];
  return new Set([...defaultOrigins, ...configured]);
}

export function corsHeaders(request: Request): Headers {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  });
  const origin = request.headers.get('origin');
  if (origin && allowedOrigins().has(origin)) headers.set('Access-Control-Allow-Origin', origin);
  return headers;
}

export function optionsResponse(request: Request): Response {
  const headers = corsHeaders(request);
  if (request.headers.get('origin') && !headers.has('Access-Control-Allow-Origin')) {
    return Response.json({ error: 'Origin not allowed' }, { status: 403, headers });
  }
  return new Response(null, { status: 204, headers });
}

export function assertAllowedOrigin(request: Request): Response | null {
  const origin = request.headers.get('origin');
  const headers = corsHeaders(request);
  if (!origin || !headers.has('Access-Control-Allow-Origin')) {
    return Response.json({ error: 'Origin not allowed' }, { status: 403, headers });
  }
  return null;
}

export function jsonResponse(request: Request, body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: corsHeaders(request) });
}

export function razorpayKeys() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return { keyId, keySecret };
}

export function verifyCheckoutSignature(orderId: string, paymentId: string, signature: string, keySecret: string) {
  if (!orderId || !paymentId || !/^[a-f\d]{64}$/i.test(signature)) return false;
  const expected = createHmac('sha256', keySecret).update(`${orderId}|${paymentId}`).digest();
  const actual = Buffer.from(signature, 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
