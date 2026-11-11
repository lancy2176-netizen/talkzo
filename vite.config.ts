import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { createHmac, timingSafeEqual } from 'node:crypto'
import type { Plugin } from 'vite'

function razorpayApi(env: Record<string, string | undefined>): Plugin {
  return {
    name: 'razorpay-api',
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        if (!request.url?.startsWith('/api/razorpay/')) return next()
        response.setHeader('Content-Type', 'application/json')
        const keyId = env.RAZORPAY_KEY_ID
        const keySecret = env.RAZORPAY_KEY_SECRET
        if (!keyId || !keySecret) {
          response.statusCode = 503
          response.end(JSON.stringify({ error: 'Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local.' }))
          return
        }
        if (request.method !== 'POST') {
          response.statusCode = 405
          response.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        try {
          let body = ''
          for await (const chunk of request) body += chunk
          const data = JSON.parse(body || '{}') as Record<string, unknown>

          if (request.url === '/api/razorpay/create-order') {
            const upstream = await fetch('https://api.razorpay.com/v1/orders', {
              method: 'POST',
              headers: {
                Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ amount: 99900, currency: 'INR', receipt: `flutterfix_${Date.now()}` }),
            })
            const order = await upstream.json() as { id?: string; amount?: number; currency?: string; error?: { description?: string } }
            if (!upstream.ok || !order.id) throw new Error(order.error?.description || 'Could not create Razorpay order')
            response.end(JSON.stringify({ orderId: order.id, amount: order.amount, currency: order.currency, keyId }))
            return
          }

          if (request.url === '/api/razorpay/verify-payment') {
            const orderId = String(data.razorpay_order_id || '')
            const paymentId = String(data.razorpay_payment_id || '')
            const signature = String(data.razorpay_signature || '')
            const expected = createHmac('sha256', keySecret).update(`${orderId}|${paymentId}`).digest()
            const actual = Buffer.from(signature, 'hex')
            const valid = Boolean(orderId && paymentId && actual.length === expected.length && timingSafeEqual(actual, expected))
            if (!valid) {
              response.statusCode = 400
              response.end(JSON.stringify({ verified: false, error: 'Payment signature could not be verified.' }))
              return
            }
            response.end(JSON.stringify({ verified: true }))
            return
          }

          response.statusCode = 404
          response.end(JSON.stringify({ error: 'Not found' }))
        } catch (error) {
          response.statusCode = 502
          response.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Payment request failed' }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd(), '') }
  return {
    plugins: [react(), razorpayApi(env)],
  }
})
