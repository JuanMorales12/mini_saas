-- ========================================
-- MINI SAAS DATABASE SCHEMA
-- ========================================
-- This schema creates the tables needed for a SaaS with Stripe subscriptions
-- Run this in your Supabase SQL Editor

-- ========================================
-- 1. USERS TABLE
-- ========================================
-- Extends Supabase auth.users with subscription data
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT UNIQUE,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro_monthly', 'pro_yearly')),
  subscription_status TEXT CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'incomplete', 'trialing')),
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only read their own data
CREATE POLICY "Users can read own data"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- RLS Policy: Users can update their own data
CREATE POLICY "Users can update own data"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- ========================================
-- 2. SUBSCRIPTIONS TABLE (Optional but Pro)
-- ========================================
-- Stores detailed subscription history and data
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT NOT NULL UNIQUE,
  stripe_price_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'incomplete', 'trialing')),
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only read their own subscriptions
CREATE POLICY "Users can read own subscriptions"
  ON public.subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- ========================================
-- 3. FUNCTION: Auto-create user profile
-- ========================================
-- This function automatically creates a user profile when someone signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ========================================
-- 4. FUNCTION: Auto-update timestamps
-- ========================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update users.updated_at
DROP TRIGGER IF EXISTS set_updated_at ON public.users;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger: Update subscriptions.updated_at
DROP TRIGGER IF EXISTS set_updated_at ON public.subscriptions;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ========================================
-- 5. INDEXES for better performance
-- ========================================
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON public.users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON public.subscriptions(stripe_subscription_id);

-- ========================================
-- DONE!
-- ========================================
-- After running this, your database is ready for the SaaS application
