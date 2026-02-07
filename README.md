# Mini SaaS - Stripe Subscription Starter

Full-stack SaaS boilerplate with subscription management, authentication, and plan-based access control.

**Demo credentials:** `test@test.com` / `test1234`

## Tech Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Stripe** — Checkout, Webhooks, Customer Portal
- **Supabase** — PostgreSQL, Auth, Row-Level Security
- **Tailwind CSS** — Responsive UI with dark mode

## Features

- Email/password authentication with protected routes
- Stripe Checkout integration (monthly & yearly plans)
- Webhook-driven subscription lifecycle management
- Server-side plan enforcement via Server Actions
- Self-service billing through Stripe Customer Portal
- Row-Level Security for data isolation

## Project Structure

```
app/
├── actions/           # Server Actions (auth, subscription, records)
├── api/stripe/webhook # Stripe webhook endpoint
├── dashboard/         # Protected dashboard
├── pricing/           # Pricing page with Stripe Checkout
├── login/             # Login with demo credentials
└── signup/            # Registration
lib/
├── supabase/          # Server & client Supabase clients
└── stripe/            # Stripe config & webhook handlers
supabase/
└── schema.sql         # Database schema with RLS policies
```

## Quick Start

```bash
git clone https://github.com/JuanMorales12/mini_saas.git
cd mini_saas
npm install
cp .env.local.example .env.local
# Fill in your Supabase & Stripe credentials
npm run dev
```

## Webhook Events

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Activates subscription |
| `customer.subscription.updated` | Syncs plan changes |
| `customer.subscription.deleted` | Downgrades to free |
| `invoice.payment_failed` | Marks as past due |

## License

MIT
