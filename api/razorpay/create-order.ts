import { assertAllowedOrigin, jsonResponse, optionsResponse, razorpayKeys } from '../../server/razorpay';

export function OPTIONS(request: Request): Response {
  return optionsResponse(request);
}

export async function POST(request: Request): Promise<Response> {
  const rejected = assertAllowedOrigin(request);
  if (rejected) return rejected;
  if (request.method !== 'POST') return jsonResponse(request, { error: 'Method not allowed' }, 405);

  const keys = razorpayKeys();
  if (!keys) return jsonResponse(request, { error: 'Razorpay server credentials are not configured.' }, 503);

  try {
    const upstream = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${keys.keyId}:${keys.keySecret}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: 99900, currency: 'INR', receipt: `flutterfix_${Date.now()}` }),
    });
    const order = await upstream.json() as { id?: string; amount?: number; currency?: string; error?: { description?: string } };
    if (!upstream.ok || !order.id) {
      return jsonResponse(request, { error: order.error?.description || 'Could not create Razorpay order.' }, 502);
    }
    return jsonResponse(request, { orderId: order.id, amount: order.amount, currency: order.currency, keyId: keys.keyId });
  } catch {
    return jsonResponse(request, { error: 'Could not connect to Razorpay. Please try again.' }, 502);
  }
}
