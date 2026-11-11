import { assertAllowedOrigin, jsonResponse, optionsResponse, razorpayKeys, verifyCheckoutSignature } from '../../server/razorpay';

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
    const data = await request.json() as Record<string, unknown>;
    const valid = verifyCheckoutSignature(
      String(data.razorpay_order_id || ''),
      String(data.razorpay_payment_id || ''),
      String(data.razorpay_signature || ''),
      keys.keySecret,
    );
    if (!valid) return jsonResponse(request, { verified: false, error: 'Payment signature could not be verified.' }, 400);
    return jsonResponse(request, { verified: true });
  } catch {
    return jsonResponse(request, { verified: false, error: 'Invalid payment verification request.' }, 400);
  }
}
