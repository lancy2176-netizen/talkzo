type PaymentResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type CheckoutFailure = {
  error?: { description?: string; reason?: string; code?: string };
};

type RazorpayOrder = {
  orderId?: string;
  amount?: number;
  currency?: string;
  keyId?: string;
  error?: string;
};

type CheckoutOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: PaymentResponse) => void;
  modal: { ondismiss: () => void };
  theme: { color: string };
};

type RazorpayCheckout = {
  open: () => void;
  close: () => void;
  on: (event: 'payment.failed', callback: (response: CheckoutFailure) => void) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: CheckoutOptions) => RazorpayCheckout;
  }
}

export type PaymentOutcome =
  | { status: 'success'; paymentId: string }
  | { status: 'failure'; message: string }
  | { status: 'cancelled' };

const apiBase = (import.meta.env.VITE_RAZORPAY_API_URL || '').replace(/\/$/, '');

async function readJson<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error(
      'The payment API returned a web page instead of JSON. Standard Checkout needs the Razorpay order API running on a server; GitHub Pages cannot run it.',
    );
  }
  return response.json() as Promise<T>;
}

async function loadCheckout(): Promise<void> {
  if (window.Razorpay) return;
  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-razorpay-checkout]');
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Razorpay Checkout failed to load.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.dataset.razorpayCheckout = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Razorpay Checkout failed to load. Check your connection and try again.'));
    document.body.appendChild(script);
  });
}

async function createOrder(): Promise<Required<Pick<RazorpayOrder, 'orderId' | 'amount' | 'currency' | 'keyId'>>> {
  if (import.meta.env.PROD && !apiBase) {
    throw new Error('Standard Checkout needs a server API URL. GitHub Pages cannot create Razorpay orders by itself.');
  }

  const response = await fetch(`${apiBase}/api/razorpay/create-order`, { method: 'POST' });
  const order = await readJson<RazorpayOrder>(response);
  if (!response.ok || !order.orderId || !order.amount || !order.currency || !order.keyId) {
    throw new Error(order.error || 'The server could not create a Razorpay order.');
  }
  return order as Required<Pick<RazorpayOrder, 'orderId' | 'amount' | 'currency' | 'keyId'>>;
}

async function verifyPayment(payment: PaymentResponse): Promise<void> {
  const response = await fetch(`${apiBase}/api/razorpay/verify-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payment),
  });
  const result = await readJson<{ verified?: boolean; error?: string }>(response);
  if (!response.ok || !result.verified) {
    throw new Error(result.error || 'Razorpay could not verify this payment. Contact support before retrying.');
  }
}

/** Creates an order on the server, opens Standard Checkout, and verifies its callback. */
export async function startRazorpayCheckout(brandName: string): Promise<PaymentOutcome> {
  await loadCheckout();
  const order = await createOrder();
  const Razorpay = window.Razorpay;
  if (!Razorpay) throw new Error('Razorpay Checkout is unavailable. Please refresh and try again.');

  return new Promise<PaymentOutcome>((resolve, reject) => {
    let settled = false;
    const finish = (outcome: PaymentOutcome) => {
      if (settled) return;
      settled = true;
      resolve(outcome);
    };

    const checkout = new Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: brandName,
      description: 'Flutter bug fixing — starting payment',
      order_id: order.orderId,
      theme: { color: '#1f755d' },
      modal: { ondismiss: () => finish({ status: 'cancelled' }) },
      handler: (payment) => {
        void verifyPayment(payment)
          .then(() => finish({ status: 'success', paymentId: payment.razorpay_payment_id }))
          .catch((error: unknown) => rejectOnce(error));
      },
    });

    function rejectOnce(error: unknown) {
      if (settled) return;
      settled = true;
      reject(error);
    }

    checkout.on('payment.failed', (failure) => {
      checkout.close();
      finish({ status: 'failure', message: failure.error?.description || failure.error?.reason || 'Razorpay reported that the payment failed.' });
    });
    checkout.open();
  });
}
