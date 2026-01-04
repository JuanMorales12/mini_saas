import Stripe from 'stripe'

/**
 * Stripe server-side client
 * NEVER use this on the client side - it contains your secret key!
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
  typescript: true,
})

/**
 * Stripe price configurations
 * These IDs come from your Stripe Dashboard after creating products
 */
export const STRIPE_PLANS = {
  PRO_MONTHLY: {
    priceId: process.env.STRIPE_PRICE_ID_PRO_MONTHLY!,
    name: 'Pro Monthly',
    price: 10,
    interval: 'month' as const,
  },
  PRO_YEARLY: {
    priceId: process.env.STRIPE_PRICE_ID_PRO_YEARLY!,
    name: 'Pro Yearly',
    price: 100,
    interval: 'year' as const,
  },
} as const

/**
 * Get all available pricing plans from Stripe
 * This ensures prices are always up-to-date from Stripe Dashboard
 */
export async function getStripePrices() {
  try {
    const prices = await stripe.prices.list({
      active: true,
      expand: ['data.product'],
    })
    return prices.data
  } catch (error) {
    console.error('Error fetching Stripe prices:', error)
    return []
  }
}
