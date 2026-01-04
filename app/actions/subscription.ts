'use server'

import { stripe } from '@/lib/stripe/config'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Create Stripe Checkout Session for subscription
 * This is what happens when user clicks "Upgrade to Pro"
 */
export async function createCheckoutSession(priceId: string) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  // Get or create Stripe customer
  const { data: userData } = await supabase
    .from('users')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  let customerId = userData?.stripe_customer_id

  // If no customer exists, create one
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email!,
      metadata: {
        supabase_user_id: user.id,
      },
    })

    customerId = customer.id

    // Save customer ID to database
    await supabase
      .from('users')
      .update({ stripe_customer_id: customerId })
      .eq('id', user.id)
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    metadata: {
      supabase_user_id: user.id,
    },
  })

  if (!session.url) {
    throw new Error('Failed to create checkout session')
  }

  redirect(session.url)
}

/**
 * Create Stripe Customer Portal session
 * This allows users to manage their subscription, update payment method, etc.
 */
export async function createPortalSession() {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  // Get Stripe customer ID
  const { data: userData } = await supabase
    .from('users')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  if (!userData?.stripe_customer_id) {
    throw new Error('No subscription found')
  }

  // Create portal session
  const session = await stripe.billingPortal.sessions.create({
    customer: userData.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  })

  redirect(session.url)
}

/**
 * Check if user has access to pro features
 * This is the CRITICAL access control function
 */
export async function checkProAccess(): Promise<boolean> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return false
  }

  const { data: userData } = await supabase
    .from('users')
    .select('plan, subscription_status')
    .eq('id', user.id)
    .single()

  // User has pro access if they have a pro plan and active subscription
  return (
    (userData?.plan === 'pro_monthly' || userData?.plan === 'pro_yearly') &&
    userData?.subscription_status === 'active'
  )
}

/**
 * Require pro access - throws error if user doesn't have it
 * Use this in server actions that need pro access
 */
export async function requireProAccess() {
  const hasAccess = await checkProAccess()

  if (!hasAccess) {
    throw new Error('Pro subscription required. Please upgrade your plan.')
  }

  return true
}
