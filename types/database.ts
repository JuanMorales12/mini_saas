/**
 * Database types for TypeScript
 * These match our Supabase database schema
 */

export type SubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'past_due'
  | 'incomplete'
  | 'trialing'

export type PlanType = 'free' | 'pro_monthly' | 'pro_yearly'

export interface User {
  id: string
  email: string
  stripe_customer_id: string | null
  plan: PlanType
  subscription_status: SubscriptionStatus | null
  current_period_end: string | null
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_subscription_id: string
  stripe_price_id: string
  status: SubscriptionStatus
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}
