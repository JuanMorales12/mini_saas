# Quick Start Guide - Get Running in 15 Minutes

Follow these steps to get the project running locally.

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] npm or yarn installed
- [ ] Stripe account created
- [ ] Supabase account created

## Step 1: Install Dependencies (2 minutes)

```bash
npm install
```

## Step 2: Setup Supabase (5 minutes)

### Create Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in details:
   - Name: `mini-saas` (or whatever you want)
   - Database Password: (generate a strong one)
   - Region: Choose closest to you

### Run Database Migration
1. Once project is created, go to **SQL Editor**
2. Click "New Query"
3. Copy entire contents of `supabase/schema.sql`
4. Paste and click "Run"
5. You should see "Success. No rows returned"

### Get API Credentials
1. Go to **Settings** → **API**
2. Copy these values:
   - `Project URL`
   - `anon public` key

## Step 3: Setup Stripe (5 minutes)

### Get API Keys
1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Make sure you're in **Test Mode** (toggle at top)
3. Go to **Developers** → **API keys**
4. Copy:
   - Publishable key (starts with `pk_test_`)
   - Secret key (starts with `sk_test_`)

### Create Products
1. Go to **Products** → **Add Product**

**Product 1:**
- Name: `Pro Monthly`
- Price: `$10.00` monthly recurring
- Click "Save product"
- **Copy the Price ID** (starts with `price_`)

**Product 2:**
- Name: `Pro Yearly`
- Price: `$100.00` yearly recurring
- Click "Save product"
- **Copy the Price ID** (starts with `price_`)

### Enable Customer Portal
1. Go to **Settings** → **Billing** → **Customer portal**
2. Click "Activate test link"
3. Enable these features:
   - ✅ Invoice history
   - ✅ Update payment method
   - ✅ Cancel subscriptions
4. Click "Save"

## Step 4: Configure Environment Variables (2 minutes)

1. Open `.env.local` in your editor
2. Fill in all the values you copied:

```env
# From Supabase (Step 2)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...

# From Stripe (Step 3)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# From Stripe Products (Step 3)
STRIPE_PRICE_ID_PRO_MONTHLY=price_...
STRIPE_PRICE_ID_PRO_YEARLY=price_...

# Leave this as is for now
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 5: Setup Webhooks (1 minute)

### Install Stripe CLI

**macOS:**
```bash
brew install stripe/stripe-cli/stripe
```

**Windows:** Download from [github.com/stripe/stripe-cli/releases](https://github.com/stripe/stripe-cli/releases)

### Login and Forward Webhooks

```bash
# Login
stripe login

# Forward webhooks (keep this running)
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

**Important**: Copy the webhook signing secret from the output (starts with `whsec_`)

Add it to `.env.local`:
```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Step 6: Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 7: Test It Out

### Create Account
1. Click "Sign Up"
2. Enter email: `test@example.com`
3. Enter password: `password123`
4. You'll be redirected to Dashboard

### Subscribe to Pro
1. Click "Upgrade to Pro"
2. Click "Subscribe" on Pro Monthly
3. You'll be redirected to Stripe Checkout

### Make Test Payment
Use test card:
- Card: `4242 4242 4242 4242`
- Expiry: `12/34`
- CVC: `123`
- ZIP: `12345`

### Verify Success
1. After payment, check the terminal running `stripe listen`
2. You should see:
   ```
   --> checkout.session.completed
   <-- [200] POST http://localhost:3000/api/stripe/webhook
   ```
3. Go back to Dashboard - your plan should now be "Pro Monthly"

### Test Customer Portal
1. Click "Manage Billing" on Dashboard
2. You'll see Stripe Customer Portal
3. Try canceling the subscription
4. Go back to Dashboard - status should update

## Troubleshooting

### "Invalid Supabase credentials"
- Double-check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Make sure there are no extra spaces

### "Webhook signature verification failed"
- Make sure `stripe listen` is running
- Copy the `whsec_` secret from the `stripe listen` output
- Restart dev server after updating `.env.local`

### "No such price"
- Verify `STRIPE_PRICE_ID_PRO_MONTHLY` and `STRIPE_PRICE_ID_PRO_YEARLY`
- Make sure you're using Price IDs, not Product IDs
- Price IDs start with `price_`, Product IDs start with `prod_`

### Plan not updating after payment
- Check `stripe listen` terminal - is the webhook being received?
- Look for errors in the webhook response
- Check your dev server terminal for error logs

### Can't login after signup
- Make sure you ran the `schema.sql` in Supabase
- Check Supabase **Authentication** → **Users** to see if user was created

## What's Next?

Once you have it running:

1. **Explore the code**:
   - Check out [lib/stripe/webhooks.ts](./lib/stripe/webhooks.ts) - webhook handlers
   - Look at [app/actions/subscription.ts](./app/actions/subscription.ts) - access control
   - Read [supabase/schema.sql](./supabase/schema.sql) - database design

2. **Customize it**:
   - Update pricing tiers
   - Add your own features
   - Change the styling

3. **Deploy it**:
   - See [README.md](./README.md) for deployment instructions
   - Set up production webhooks in Stripe Dashboard

## Resources

- [Full README](./README.md) - Complete documentation
- [Stripe Setup Guide](./STRIPE_SETUP.md) - Detailed Stripe configuration
- [Architecture](./ARCHITECTURE.md) - How everything works
- [Portfolio Guide](./PORTFOLIO_GUIDE.md) - How to present this project

---

That's it! You should now have a fully functional SaaS with subscriptions running locally.

If you run into issues, check the full [README.md](./README.md) or the troubleshooting section above.
