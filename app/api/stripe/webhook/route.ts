import { stripe } from '@/lib/stripe/config'
import { handleStripeWebhook } from '@/lib/stripe/webhooks'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

/**
 * Stripe Webhook Handler
 *
 * This is THE MOST IMPORTANT endpoint in the app!
 * Stripe sends events here when subscriptions change.
 *
 * CRITICAL SECURITY:
 * - We verify the webhook signature to ensure it's really from Stripe
 * - NEVER trust data from the frontend about subscription status
 * - Always update subscription state based on webhooks
 *
 * How to test:
 * 1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
 * 2. Run: stripe listen --forward-to localhost:3000/api/stripe/webhook
 * 3. Copy the webhook signing secret to .env.local
 */
export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    console.error('❌ No signature found')
    return NextResponse.json(
      { error: 'No signature found' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  console.log('✅ Webhook verified:', event.type)

  // Handle the event
  const result = await handleStripeWebhook(event)

  if (!result.success) {
    console.error('❌ Webhook handling failed:', result.error)
    return NextResponse.json(
      { error: result.error },
      { status: 500 }
    )
  }

  return NextResponse.json({ received: true })
}
