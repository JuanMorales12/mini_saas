# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT SIDE                          │
├─────────────────────────────────────────────────────────────┤
│  Next.js App Router (React Server Components)               │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Home   │  │ Pricing  │  │  Login   │  │  Signup  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────────────────────┐                              │
│  │      Dashboard           │  (Protected Route)           │
│  │  - Subscription Status   │                              │
│  │  - Plan Details          │                              │
│  │  - Billing Management    │                              │
│  └──────────────────────────┘                              │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      NEXT.JS SERVER                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Middleware (Authentication & Route Protection)             │
│  ├── Check if user is authenticated                         │
│  └── Protect /dashboard and /billing routes                 │
│                                                              │
│  Server Actions                                             │
│  ├── auth.ts                                                │
│  │   ├── signUp()                                           │
│  │   ├── signIn()                                           │
│  │   ├── signOut()                                          │
│  │   └── getUserWithSubscription()                          │
│  │                                                           │
│  ├── subscription.ts                                        │
│  │   ├── createCheckoutSession()                            │
│  │   ├── createPortalSession()                              │
│  │   ├── checkProAccess()                                   │
│  │   └── requireProAccess()                                 │
│  │                                                           │
│  └── records.ts (Example)                                   │
│      ├── createRecord() - with plan limits                  │
│      └── exportData() - Pro only                            │
│                                                              │
│  API Routes                                                 │
│  └── /api/stripe/webhook                                    │
│      ├── Verify webhook signature                           │
│      ├── Handle subscription events                         │
│      └── Update database                                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
          │                    │                    │
          ▼                    ▼                    ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐
│   SUPABASE       │  │     STRIPE       │  │  STRIPE      │
│   (Database)     │  │      API         │  │  WEBHOOKS    │
├──────────────────┤  ├──────────────────┤  ├──────────────┤
│                  │  │                  │  │              │
│  Tables:         │  │  - Create        │  │  Events:     │
│  ├── users       │  │    Checkout      │  │  ├── checkout│
│  │   ├── id      │  │  - Create        │  │  │    .comp- │
│  │   ├── email   │  │    Portal        │  │  │    leted  │
│  │   ├── plan    │  │  - Retrieve      │  │  ├── subscr- │
│  │   ├── status  │  │    Subscription  │  │  │    iption │
│  │   └── ...     │  │  - Retrieve      │  │  │    .updat-│
│  │               │  │    Prices        │  │  │    ed     │
│  └── subscrip-   │  │                  │  │  ├── subscr- │
│      tions       │  │                  │  │  │    iption │
│      ├── id      │  │                  │  │  │    .dele- │
│      ├── user_id │  │                  │  │  │    ted    │
│      ├── stripe_ │  │                  │  │  └── invoice │
│      │   sub_id  │  │                  │  │       .paym- │
│      └── ...     │  │                  │  │       ent_f- │
│                  │  │                  │  │       ailed  │
│  Auth:           │  │                  │  │              │
│  └── Supabase    │  │                  │  │              │
│      Auth        │  │                  │  │              │
│                  │  │                  │  │              │
└──────────────────┘  └──────────────────┘  └──────────────┘
```

## Data Flow Diagrams

### 1. User Signup Flow

```
User                 Next.js              Supabase
  │                    │                     │
  ├─── Fill form ────→ │                     │
  │                    │                     │
  │                    ├─ signUp() ────────→ │
  │                    │                     │
  │                    │                     ├─ Create auth.user
  │                    │                     │
  │                    │                     ├─ Trigger: Create profile
  │                    │                     │  (users table)
  │                    │                     │
  │                    │  ←── Success ───────┤
  │                    │                     │
  │  ←── Redirect ─────┤                     │
  │   to /dashboard    │                     │
  │                    │                     │
```

### 2. Subscription Purchase Flow

```
User           Next.js          Stripe           Webhook Handler    Database
 │                │                │                    │               │
 ├─ Click ───────→│                │                    │               │
 │  "Subscribe"   │                │                    │               │
 │                │                │                    │               │
 │                ├─ Create ──────→│                    │               │
 │                │  Checkout      │                    │               │
 │                │  Session       │                    │               │
 │                │                │                    │               │
 │  ←─ Redirect ──┤                │                    │               │
 │   to Stripe    │                │                    │               │
 │                │                │                    │               │
 ├─ Enter ───────────────────────→ │                    │               │
 │  payment info  │                │                    │               │
 │                │                │                    │               │
 ├─ Complete ────────────────────→ │                    │               │
 │  payment       │                │                    │               │
 │                │                │                    │               │
 │                │                ├─ Send webhook ────→│               │
 │                │                │  (checkout.        │               │
 │                │                │   session.         │               │
 │                │                │   completed)       │               │
 │                │                │                    │               │
 │                │                │                    ├─ Verify ────→ │
 │                │                │                    │  signature    │
 │                │                │                    │               │
 │                │                │                    ├─ Update ────→ │
 │                │                │                    │  user:        │
 │                │                │                    │  - plan       │
 │                │                │                    │  - status     │
 │                │                │                    │  - period_end │
 │                │                │                    │               │
 │  ←─ Redirect ──────────────────┤                    │               │
 │   to Dashboard │                │                    │               │
 │                │                │                    │               │
```

### 3. Subscription Cancellation Flow

```
User           Customer Portal    Stripe          Webhook Handler    Database
 │                  │                │                   │               │
 ├─ Click ─────────→│                │                   │               │
 │  "Manage        │                │                   │               │
 │   Billing"      │                │                   │               │
 │                 │                │                   │               │
 │                 ├─ Create ──────→│                   │               │
 │                 │  Portal        │                   │               │
 │                 │  Session       │                   │               │
 │                 │                │                   │               │
 │  ←─ Redirect ───┤                │                   │               │
 │   to Portal     │                │                   │               │
 │                 │                │                   │               │
 ├─ Click "Cancel"───────────────→  │                   │               │
 │                 │                │                   │               │
 │                 │                ├─ Send webhook ───→│               │
 │                 │                │  (subscription.   │               │
 │                 │                │   deleted)        │               │
 │                 │                │                   │               │
 │                 │                │                   ├─ Update ─────→│
 │                 │                │                   │  user:        │
 │                 │                │                   │  - plan=free  │
 │                 │                │                   │  - status=    │
 │                 │                │                   │    canceled   │
 │                 │                │                   │               │
```

## Authentication Flow

```
┌──────────────────────────────────────────────────────────┐
│                     Authentication                        │
└──────────────────────────────────────────────────────────┘

Server Component
     │
     ├─── getUser() ──────→ Supabase Client
     │                           │
     │                           ├── Read cookie
     │                           │
     │                           ├── Verify JWT
     │                           │
     │                           └── Return user
     │
     ├─── if (!user) ──────→ redirect('/login')
     │
     └─── render protected content

Middleware (runs on EVERY request)
     │
     ├─── Check cookie
     │
     ├─── Verify session
     │
     ├─── if (protected route && !user)
     │         redirect('/login')
     │
     └─── continue
```

## Plan-based Access Control

```
┌──────────────────────────────────────────────────────────┐
│              Access Control Strategy                      │
└──────────────────────────────────────────────────────────┘

Server Action
     │
     ├─── checkProAccess()
     │        │
     │        ├─── Get user from auth
     │        │
     │        ├─── Query users table
     │        │        - plan
     │        │        - subscription_status
     │        │
     │        └─── return (plan === 'pro_*' && status === 'active')
     │
     ├─── if (!isPro && limit exceeded)
     │         throw Error('Upgrade required')
     │
     └─── perform action

All checks happen SERVER-SIDE
❌ NEVER trust frontend
✅ ALWAYS verify on server
```

## Database Schema Relationships

```
┌─────────────────────────┐
│    auth.users           │
│    (Supabase built-in)  │
│                         │
│  - id (UUID)            │
│  - email                │
│  - encrypted_password   │
│  - created_at           │
└───────────┬─────────────┘
            │
            │ Foreign Key
            │
┌───────────▼─────────────┐
│    public.users         │
│                         │
│  - id (FK → auth.users) │
│  - email                │
│  - stripe_customer_id   │◄───┐
│  - plan                 │    │
│  - subscription_status  │    │  Related via
│  - current_period_end   │    │  stripe_customer_id
│  - created_at           │    │
│  - updated_at           │    │
└───────────┬─────────────┘    │
            │                  │
            │                  │
┌───────────▼─────────────┐    │
│  public.subscriptions   │    │
│                         │    │
│  - id                   │    │
│  - user_id (FK)         │    │
│  - stripe_subscription_id    │
│  - stripe_price_id      │    │
│  - status               │    │
│  - current_period_start │    │
│  - current_period_end   │    │
│  - cancel_at_period_end │    │
│  - created_at           │    │
│  - updated_at           │    │
└─────────────────────────┘    │
                               │
┌──────────────────────────────┘
│
│  Stripe Customer
│  (External to our DB)
│
│  - customer_id
│  - email
│  - subscriptions[]
│  - payment_methods[]
```

## Security Layers

```
┌─────────────────────────────────────────────────────────┐
│                    Security Layers                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Middleware                                          │
│     └─ Check authentication on protected routes        │
│                                                          │
│  2. Row-Level Security (RLS)                            │
│     └─ Users can only access their own data            │
│                                                          │
│  3. Server Actions                                      │
│     └─ All business logic runs server-side             │
│                                                          │
│  4. Webhook Signature Verification                      │
│     └─ Verify all webhooks come from Stripe            │
│                                                          │
│  5. Environment Variables                               │
│     └─ Secret keys never exposed to client             │
│                                                          │
│  6. HTTPS Only (Production)                             │
│     └─ All traffic encrypted                            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Technology Decisions

### Why Next.js App Router?
- Server Components reduce client bundle size
- Server Actions simplify API calls
- Built-in middleware for route protection
- Great TypeScript support

### Why Supabase?
- Instant PostgreSQL database
- Built-in authentication
- Row-Level Security
- Real-time capabilities (for future features)
- Generous free tier

### Why Stripe?
- Industry standard for payments
- Excellent developer experience
- Built-in fraud protection
- Customer Portal (self-service)
- Automatic retry logic for failed payments
- Comprehensive webhooks

### Why Server Actions over API Routes?
- Type-safe by default
- Less boilerplate
- Automatic serialization
- Better error handling
- Still use API routes for webhooks (need public access)

## Performance Considerations

### Current Implementation
- Server Components for zero JS hydration
- Minimal client-side JavaScript
- Direct database queries (fast)
- Supabase connection pooling

### Future Optimizations
- Redis cache for subscription status
- Webhook idempotency (prevent duplicate processing)
- Database indexes on frequently queried fields
- Rate limiting on webhooks
- CDN for static assets

## Scalability Path

```
Current (Starter):
  - Direct database queries
  - Webhook processing in API route
  - No caching

→ Medium Scale (100s of users):
  - Add Redis for session caching
  - Implement webhook queue (e.g., BullMQ)
  - Add monitoring (Sentry)

→ Large Scale (1000s of users):
  - Separate webhook processing service
  - Database read replicas
  - Full caching layer
  - Background job processing
```

---

This architecture is designed to be:
- ✅ **Secure**: Multiple layers of validation
- ✅ **Scalable**: Clean separation of concerns
- ✅ **Maintainable**: Clear data flow
- ✅ **Professional**: Industry best practices
