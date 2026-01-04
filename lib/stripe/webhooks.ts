import Stripe from 'stripe'
import { stripe } from './config'
import { createClient } from '@/lib/supabase/server'

/**
 * Handle checkout.session.completed event
 * This fires when a user successfully completes payment
 */
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  console.log('✅ Checkout completed:', session.id)

  const supabase = await createClient()
  const customerId = session.customer as string
  const subscriptionId = session.subscription as string

  // Get the subscription details
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  // Update user in database
  const { error } = await supabase
    .from('users')
    .update({
      stripe_customer_id: customerId,
      plan: getPlanFromPriceId(subscription.items.data[0].price.id),
      subscription_status: subscription.status,
      current_period_end: new Date(
        subscription.current_period_end * 1000
      ).toISOString(),
    })
    .eq('email', session.customer_email!)

  if (error) {
    console.error('Error updating user after checkout:', error)
  } else {
    console.log('✅ User activated successfully')
  }

  // Optionally: Store in subscriptions table
  const userId = await getUserIdByEmail(session.customer_email!)
  if (userId) {
    await supabase.from('subscriptions').upsert({
      user_id: userId,
      stripe_subscription_id: subscriptionId,
      stripe_price_id: subscription.items.data[0].price.id,
      status: subscription.status,
      current_period_start: new Date(
        subscription.current_period_start * 1000
      ).toISOString(),
      current_period_end: new Date(
        subscription.current_period_end * 1000
      ).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
    })
  }
}

/**
 * Handle customer.subscription.updated event
 * This fires when subscription changes (upgrade, downgrade, renewal)
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('🔄 Subscription updated:', subscription.id)

  const supabase = await createClient()

  const { error } = await supabase
    .from('users')
    .update({
      plan: getPlanFromPriceId(subscription.items.data[0].price.id),
      subscription_status: subscription.status,
      current_period_end: new Date(
        subscription.current_period_end * 1000
      ).toISOString(),
    })
    .eq('stripe_customer_id', subscription.customer as string)

  if (error) {
    console.error('Error updating subscription:', error)
  } else {
    console.log('✅ Subscription updated successfully')
  }

  // Update subscriptions table
  await supabase
    .from('subscriptions')
    .update({
      stripe_price_id: subscription.items.data[0].price.id,
      status: subscription.status,
      current_period_start: new Date(
        subscription.current_period_start * 1000
      ).toISOString(),
      current_period_end: new Date(
        subscription.current_period_end * 1000
      ).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
    })
    .eq('stripe_subscription_id', subscription.id)
}

/**
 * Handle customer.subscription.deleted event
 * This fires when subscription is canceled/deleted
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('❌ Subscription deleted:', subscription.id)

  const supabase = await createClient()

  const { error } = await supabase
    .from('users')
    .update({
      plan: 'free',
      subscription_status: 'canceled',
    })
    .eq('stripe_customer_id', subscription.customer as string)

  if (error) {
    console.error('Error handling subscription deletion:', error)
  } else {
    console.log('✅ User downgraded to free plan')
  }

  // Update subscriptions table
  await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
    })
    .eq('stripe_subscription_id', subscription.id)
}

/**
 * Handle invoice.payment_failed event
 * This fires when payment fails (expired card, insufficient funds, etc.)
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log('⚠️ Payment failed:', invoice.id)

  const supabase = await createClient()

  const { error } = await supabase
    .from('users')
    .update({
      subscription_status: 'past_due',
    })
    .eq('stripe_customer_id', invoice.customer as string)

  if (error) {
    console.error('Error updating payment failed status:', error)
  } else {
    console.log('✅ User marked as past_due')
  }
}

/**
 * Main webhook handler
 * Routes events to the appropriate handler
 */
export async function handleStripeWebhook(
  event: Stripe.Event
): Promise<{ success: boolean; error?: string }> {
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        )
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return { success: true }
  } catch (error) {
    console.error('Webhook error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Helper: Map Stripe Price ID to our plan type
 */
function getPlanFromPriceId(priceId: string): 'free' | 'pro_monthly' | 'pro_yearly' {
  if (priceId === process.env.STRIPE_PRICE_ID_PRO_MONTHLY) {
    return 'pro_monthly'
  }
  if (priceId === process.env.STRIPE_PRICE_ID_PRO_YEARLY) {
    return 'pro_yearly'
  }
  return 'free'
}

/**
 * Helper: Get user ID from email
 */
async function getUserIdByEmail(email: string): Promise<string | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  return data?.id || null
}
