# Mini SaaS - Stripe Subscription Starter

A production-ready SaaS boilerplate built with Next.js, Stripe, and Supabase. Features complete subscription management, authentication, and plan-based access control.

## Features

- **Authentication**: Secure email/password authentication with Supabase
- **Stripe Integration**: Complete payment flow with subscriptions
- **Webhooks**: Automated subscription management via Stripe webhooks
- **Plan-based Access**: Middleware and server actions for feature gating
- **Customer Portal**: Self-service subscription management
- **TypeScript**: Fully typed for better DX
- **Tailwind CSS**: Modern, responsive UI

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS
- **Backend**: Next.js Server Actions, Stripe API
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe Checkout & Customer Portal

## Project Structure

```
mini-saas-stripe/
├── app/
│   ├── actions/           # Server Actions
│   │   ├── auth.ts        # Authentication actions
│   │   ├── subscription.ts # Subscription actions
│   │   └── records.ts     # Example: Plan-based access control
│   ├── api/
│   │   └── stripe/
│   │       └── webhook/   # Stripe webhook handler
│   ├── dashboard/         # Protected dashboard page
│   ├── pricing/           # Pricing page
│   ├── login/             # Login page
│   └── signup/            # Signup page
├── lib/
│   ├── supabase/          # Supabase clients
│   │   ├── server.ts      # Server-side client
│   │   └── client.ts      # Client-side client
│   └── stripe/            # Stripe utilities
│       ├── config.ts      # Stripe client & plans
│       └── webhooks.ts    # Webhook handlers
├── types/
│   └── database.ts        # TypeScript types
└── supabase/
    └── schema.sql         # Database schema
```

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- A [Stripe account](https://stripe.com)
- A [Supabase account](https://supabase.com)

### 2. Clone & Install

```bash
git clone <your-repo-url>
cd mini-saas-stripe
npm install
```

### 3. Supabase Setup

1. Create a new project in [Supabase Dashboard](https://app.supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. Get your credentials:
   - Go to **Settings** → **API**
   - Copy `Project URL` and `anon/public` key

### 4. Stripe Setup

#### Create Products & Prices

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Products** → **Add Product**
3. Create two products:

**Product 1: Pro Monthly**
- Name: `Pro Monthly`
- Price: `$10.00` / month
- Copy the **Price ID** (starts with `price_`)

**Product 2: Pro Yearly**
- Name: `Pro Yearly`
- Price: `$100.00` / year
- Copy the **Price ID** (starts with `price_`)

#### Enable Customer Portal

1. Go to **Settings** → **Billing** → **Customer Portal**
2. Click **Activate**
3. Configure:
   - ✅ Allow customers to update payment methods
   - ✅ Allow customers to cancel subscriptions
   - ✅ Allow customers to switch plans

#### Setup Webhooks (for local development)

1. Install Stripe CLI:
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe

   # Windows
   # Download from: https://github.com/stripe/stripe-cli/releases
   ```

2. Login to Stripe CLI:
   ```bash
   stripe login
   ```

3. Forward webhooks to local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

4. Copy the **webhook signing secret** (starts with `whsec_`)

### 5. Environment Variables

1. Copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Stripe Price IDs
STRIPE_PRICE_ID_PRO_MONTHLY=price_xxx
STRIPE_PRICE_ID_PRO_YEARLY=price_xxx

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Testing the Subscription Flow

### 1. Create Account
1. Go to `/signup`
2. Create an account with email/password
3. You'll be redirected to `/dashboard`

### 2. Subscribe to Pro Plan
1. Click **"Upgrade to Pro"** or go to `/pricing`
2. Select a plan (Monthly or Yearly)
3. You'll be redirected to Stripe Checkout

### 3. Test Payment

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Expiry: Any future date (e.g., `12/34`)
- CVC: Any 3 digits (e.g., `123`)

### 4. Verify Webhook

After payment, check your terminal running `stripe listen`. You should see:
```
✅ Webhook verified: checkout.session.completed
✅ User activated successfully
```

### 5. Check Dashboard

1. Return to `/dashboard`
2. Your plan should now show **Pro Monthly** or **Pro Yearly**
3. Status should be **Active**

### 6. Manage Subscription

1. Click **"Manage Billing"** on dashboard
2. You'll be redirected to Stripe Customer Portal
3. Test:
   - Cancel subscription (will end at period end)
   - Update payment method
   - View invoices

## Webhook Events Handled

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Activate user subscription |
| `customer.subscription.updated` | Update subscription (plan change, renewal) |
| `customer.subscription.deleted` | Downgrade to free plan |
| `invoice.payment_failed` | Mark subscription as past_due |

## Plan-based Access Control

### Example: Limit Features by Plan

```typescript
import { checkProAccess } from '@/app/actions/subscription'

export async function createRecord(name: string) {
  const isPro = await checkProAccess()

  if (!isPro) {
    // Check limit for free users
    if (recordCount >= 3) {
      throw new Error('Upgrade to Pro for unlimited records')
    }
  }

  // Create record
}
```

### Example: Require Pro Access

```typescript
import { requireProAccess } from '@/app/actions/subscription'

export async function getAdvancedAnalytics() {
  // Throws error if user is not Pro
  await requireProAccess()

  // Return analytics
}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Webhook Setup for Production

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter URL: `https://your-domain.com/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Copy the **signing secret** and update `STRIPE_WEBHOOK_SECRET` in Vercel

## Database Schema

See [supabase/schema.sql](./supabase/schema.sql) for the complete schema.

### Tables

**users**
- Extends Supabase auth.users
- Stores: plan, subscription_status, stripe_customer_id, current_period_end

**subscriptions** (optional)
- Stores detailed subscription history
- Links to Stripe subscription ID

## Common Issues

### Webhook signature verification failed
- Make sure `STRIPE_WEBHOOK_SECRET` matches the one from `stripe listen`
- For production, use the webhook secret from Stripe Dashboard

### User not upgrading after payment
- Check webhook is running: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- Check terminal for webhook events
- Verify webhook handler is updating database

### Customer Portal not working
- Make sure you activated it in Stripe Dashboard
- Verify user has `stripe_customer_id` in database

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

## License

MIT

---

**Built with Next.js, Stripe, and Supabase**

Perfect for your portfolio and real-world SaaS applications.
