-- ========================================
-- FIX MISSING USERS
-- ========================================
-- This script creates missing user records in public.users
-- for any auth.users that don't have a corresponding profile

-- Insert missing users from auth.users into public.users
INSERT INTO public.users (id, email, plan, subscription_status)
SELECT
  au.id,
  au.email,
  'free',
  NULL
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Verify the trigger exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    RAISE NOTICE 'Trigger on_auth_user_created does not exist! Run schema.sql first.';
  ELSE
    RAISE NOTICE 'Trigger on_auth_user_created exists - new signups will auto-create profiles.';
  END IF;
END $$;

-- Show all users
SELECT
  au.id,
  au.email as auth_email,
  pu.email as profile_email,
  pu.plan,
  pu.subscription_status,
  pu.created_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
ORDER BY au.created_at DESC;
