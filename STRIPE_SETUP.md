# Stripe Setup Guide - Step by Step

This guide walks you through setting up Stripe for your SaaS application.

## Step 1: Create a Stripe Account

1. Go to [https://stripe.com](https://stripe.com)
2. Click **"Start now"** and create an account
3. Complete the signup process
4. You'll start in **Test Mode** (perfect for development)

## Step 2: Create Products

Products represent what you're selling. We need two products: Pro Monthly and Pro Yearly.

### Create Pro Monthly Product

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Click **"Products"** in the left sidebar
3. Click **"+ Add product"**
4. Fill in the details:

```
Product name: Pro Monthly
Description: Professional plan with unlimited access (optional)

Pricing model: Standard pricing
Price: 10.00 USD
Billing period: Monthly
Payment type: Recurring
```

5. Click **"Add product"**
6. **IMPORTANT**: Copy the **Price ID** (starts with `price_`)
   - It will look like: `price_1234567890abcdef`
   - Save this for your `.env.local` file

### Create Pro Yearly Product

1. Click **"+ Add product"** again
2. Fill in the details:

```
Product name: Pro Yearly
Description: Professional plan - save 17% with yearly billing (optional)

Pricing model: Standard pricing
Price: 100.00 USD
Billing period: Yearly
Payment type: Recurring
```

3. Click **"Add product"**
4. **IMPORTANT**: Copy the **Price ID** (starts with `price_`)
5. Save this for your `.env.local` file

## Step 3: Get API Keys

1. In Stripe Dashboard, click **"Developers"** → **"API keys"**
2. You'll see two keys:
   - **Publishable key** (starts with `pk_test_`) - Safe to use in frontend
   - **Secret key** (starts with `sk_test_`) - NEVER expose in frontend

3. Copy both keys and add to `.env.local`:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

## Step 4: Enable Customer Portal

The Customer Portal lets users manage their subscriptions without your intervention.

1. Go to **"Settings"** → **"Billing"** → **"Customer portal"**
2. Click **"Activate test link"**
3. Configure settings:

### Features to enable:
- ✅ **Invoice history**: Let customers view past invoices
- ✅ **Update payment method**: Let customers update their card
- ✅ **Cancel subscriptions**: Let customers cancel

### Cancellation settings:
- **Cancellation behavior**: Cancel at end of billing period
- **Customer feedback**: Optional (helps you understand why users cancel)

### Update payment method:
- ✅ Allow customers to update their payment method

4. Click **"Save"**

## Step 5: Setup Webhooks for Local Development

Webhooks are how Stripe tells your app about events (payments, cancellations, etc.).

### Install Stripe CLI

**macOS:**
```bash
brew install stripe/stripe-cli/stripe
```

**Windows:**
1. Download from: https://github.com/stripe/stripe-cli/releases
2. Extract the ZIP file
3. Add to your PATH or run from the folder

**Linux:**
```bash
wget https://github.com/stripe/stripe-cli/releases/latest/download/stripe_*_linux_x86_64.tar.gz
tar -xvf stripe_*_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin/
```

### Login to Stripe CLI

```bash
stripe login
```

This will:
1. Open your browser
2. Ask you to allow access
3. Confirm in terminal

### Forward Webhooks to Localhost

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

You'll see output like:
```
> Ready! Your webhook signing secret is whsec_1234567890abcdef...
```

**IMPORTANT**: Copy the webhook signing secret (starts with `whsec_`) and add to `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Keep This Running

While developing, keep this terminal window open. Every time Stripe sends an event, you'll see it here.

## Step 6: Complete .env.local File

Your `.env.local` should now look like this:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Product IDs
STRIPE_PRICE_ID_PRO_MONTHLY=price_...  # From Step 2
STRIPE_PRICE_ID_PRO_YEARLY=price_...   # From Step 2

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 7: Test the Integration

### Test Cards

Stripe provides test cards for different scenarios:

| Card Number | Scenario |
|-------------|----------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 0002` | Card declined |
| `4000 0000 0000 9995` | Insufficient funds |
| `4000 0025 0000 3155` | Requires authentication (3D Secure) |

**For all test cards:**
- **Expiry**: Any future date (e.g., `12/34`)
- **CVC**: Any 3 digits (e.g., `123`)
- **ZIP**: Any 5 digits (e.g., `12345`)

### Testing Workflow

1. Start your dev server: `npm run dev`
2. Start Stripe webhook forwarding: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
3. Create an account at `/signup`
4. Go to `/pricing` and click **Subscribe** on a plan
5. Use test card `4242 4242 4242 4242`
6. Complete payment
7. Check webhook terminal - you should see:
   ```
   --> checkout.session.completed
   <-- [200] POST http://localhost:3000/api/stripe/webhook
   ```
8. Go to `/dashboard` - your plan should be updated

## Step 8: Production Webhook Setup

When you deploy to production (Vercel, etc.), you need to create a production webhook.

### Create Production Webhook

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Switch to **Live mode** (toggle in top right)
3. Click **"+ Add endpoint"**
4. Enter your production URL:
   ```
   https://your-domain.com/api/stripe/webhook
   ```
5. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`

6. Click **"Add endpoint"**
7. Click on the webhook you just created
8. Click **"Reveal signing secret"**
9. Copy the signing secret and add to your production environment variables

### Switch to Live Mode

When ready to accept real payments:

1. Complete Stripe account verification
2. Switch to **Live mode** (toggle in Stripe Dashboard)
3. Get your **live API keys**:
   - `pk_live_...` (Publishable key)
   - `sk_live_...` (Secret key)
4. Update production environment variables with live keys
5. Create live webhook (see above)

## Common Webhook Events

Here's what happens with each webhook event:

### `checkout.session.completed`
**When**: User completes payment
**What we do**:
- Create/update Stripe customer ID
- Activate subscription
- Update plan to pro_monthly or pro_yearly
- Set subscription_status to 'active'

### `customer.subscription.updated`
**When**: Subscription changes (upgrade, downgrade, renewal)
**What we do**:
- Update plan type
- Update subscription status
- Update current_period_end

### `customer.subscription.deleted`
**When**: Subscription is canceled
**What we do**:
- Set plan back to 'free'
- Set subscription_status to 'canceled'

### `invoice.payment_failed`
**When**: Payment fails (expired card, insufficient funds)
**What we do**:
- Set subscription_status to 'past_due'
- User keeps access temporarily (Stripe retries)

## Security Best Practices

### ✅ DO:
- Always verify webhook signatures
- Use environment variables for secrets
- Never expose secret key in frontend
- Use HTTPS in production

### ❌ DON'T:
- Trust frontend data for subscription status
- Hardcode API keys
- Skip webhook signature verification
- Allow frontend to update subscription status

## Troubleshooting

### "Webhook signature verification failed"
- Check `STRIPE_WEBHOOK_SECRET` matches webhook signing secret
- For local dev: Use secret from `stripe listen`
- For production: Use secret from Stripe Dashboard webhook

### "No such price"
- Check `STRIPE_PRICE_ID_PRO_MONTHLY` and `STRIPE_PRICE_ID_PRO_YEARLY` are correct
- Make sure you're using Price IDs, not Product IDs
- Verify you're in the right mode (test vs live)

### Webhooks not receiving
- Make sure `stripe listen` is running (local)
- Check webhook URL is correct (production)
- Verify endpoint is publicly accessible (production)

### User not upgrading after payment
- Check webhook is processing (look for logs)
- Verify email in Stripe matches user email in database
- Check database was updated (subscription_status, plan)

## Resources

- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Webhook Best Practices](https://stripe.com/docs/webhooks/best-practices)
- [Customer Portal Guide](https://stripe.com/docs/billing/subscriptions/integrating-customer-portal)

---

That's it! Your Stripe integration is ready for development and production.
