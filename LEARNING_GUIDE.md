# Learning Guide - Understanding the Code

This guide explains the key concepts and code patterns used in this project. Perfect for learning and interview preparation.

## Table of Contents

1. [Understanding Webhooks](#understanding-webhooks)
2. [Server Actions Explained](#server-actions-explained)
3. [Authentication Flow](#authentication-flow)
4. [Plan-based Access Control](#plan-based-access-control)
5. [Database Design](#database-design)
6. [Common Patterns](#common-patterns)

---

## Understanding Webhooks

### What is a Webhook?

A webhook is a way for one system to send real-time data to another system when an event happens.

**Real-world analogy**:
- Without webhooks: You constantly check your mailbox to see if mail arrived (polling)
- With webhooks: The mail carrier rings your doorbell when mail arrives (push notification)

### Why We Use Webhooks

```typescript
// ❌ BAD: Trusting the frontend
// User clicks "Subscribe" → Frontend says "I'm pro now!"
// Problem: User can fake this in browser console!

// ✅ GOOD: Using webhooks
// User pays → Stripe tells our server → Server updates database
// User can't fake a Stripe webhook!
```

### Webhook Flow in Our App

```
1. User completes payment on Stripe Checkout
        ↓
2. Stripe sends webhook to our server:
   POST /api/stripe/webhook
        ↓
3. Our server verifies it's really from Stripe:
   stripe.webhooks.constructEvent(body, signature, secret)
        ↓
4. If verified, we update the database:
   - Set plan to 'pro_monthly'
   - Set status to 'active'
   - Save billing period end date
        ↓
5. User's dashboard now shows Pro plan
```

### Webhook Handler Code Explained

```typescript
// From: app/api/stripe/webhook/route.ts

export async function POST(req: Request) {
  // 1. Get the raw request body
  const body = await req.text()

  // 2. Get the signature from headers
  //    Stripe adds this to prove it's really them
  const signature = headersList.get('stripe-signature')

  // 3. Verify the webhook is from Stripe
  //    This throws an error if signature is invalid
  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  )

  // 4. Handle the event
  //    Different events need different actions
  await handleStripeWebhook(event)
}
```

### Why Signature Verification Matters

Without verification, anyone could send fake webhooks:

```bash
# Without verification, a hacker could do this:
curl -X POST https://yourapp.com/api/stripe/webhook \
  -d '{"type":"checkout.session.completed","customer":"fake_id"}'

# With verification, this fails because:
# 1. No valid signature in headers
# 2. Signature doesn't match webhook secret
# 3. Request is rejected before processing
```

---

## Server Actions Explained

### What are Server Actions?

Server Actions are functions that run on the server but can be called directly from React components.

**Before Server Actions (traditional API route):**
```typescript
// 1. Create API route: app/api/subscribe/route.ts
export async function POST(req: Request) {
  const { priceId } = await req.json()
  // ... logic
}

// 2. Call from frontend:
const response = await fetch('/api/subscribe', {
  method: 'POST',
  body: JSON.stringify({ priceId })
})
```

**With Server Actions (modern way):**
```typescript
// 1. Create server action: app/actions/subscription.ts
'use server'  // ← This makes it a Server Action

export async function createCheckoutSession(priceId: string) {
  // ... logic
}

// 2. Call from frontend:
<form action={createCheckoutSession.bind(null, priceId)}>
  <button type="submit">Subscribe</button>
</form>
```

### Benefits of Server Actions

1. **Type Safety**: TypeScript knows the exact input/output types
2. **Less Code**: No need to create separate API routes
3. **Automatic Serialization**: No JSON.stringify/parse needed
4. **Progressive Enhancement**: Works even if JavaScript is disabled

### Example: Authentication with Server Actions

```typescript
// From: app/actions/auth.ts

'use server'  // ← Runs on server only

export async function signIn(formData: FormData) {
  // 1. Get Supabase client (server-side)
  const supabase = await createClient()

  // 2. Extract form data
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // 3. Authenticate with Supabase
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  // 4. Handle errors
  if (error) {
    return { error: error.message }
  }

  // 5. Redirect on success
  redirect('/dashboard')
}
```

**How it's used in the component:**

```typescript
// From: app/login/page.tsx

export default function LoginPage() {
  return (
    <form action={signIn}>  {/* ← Pass Server Action directly */}
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Sign in</button>
    </form>
  )
}
```

**What happens when user submits:**
1. Form data is sent to server
2. `signIn` function runs on server
3. Supabase authenticates user
4. Server sets authentication cookie
5. User is redirected to dashboard

---

## Authentication Flow

### How Supabase Auth Works

```
┌─────────────────────────────────────────────────┐
│  User enters email & password                   │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  Server Action: signUp(formData)                │
│  - Calls Supabase Auth API                      │
│  - Creates user in auth.users table             │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  Database Trigger: handle_new_user()            │
│  - Automatically creates profile in users table │
│  - Sets default plan to 'free'                  │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  Supabase sets authentication cookie            │
│  - Contains JWT (JSON Web Token)                │
│  - Expires after session timeout                │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  User is redirected to /dashboard               │
└─────────────────────────────────────────────────┘
```

### How Protected Routes Work

```typescript
// From: middleware.ts

export async function middleware(request: NextRequest) {
  // 1. Create Supabase client with cookie access
  const supabase = createServerClient(...)

  // 2. Get current user from cookie
  const { data: { user } } = await supabase.auth.getUser()

  // 3. Check if route is protected
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    // 4. Not authenticated → redirect to login
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 5. Authenticated → allow access
  return NextResponse.next()
}
```

**Middleware runs on EVERY request:**
- Checks authentication cookie
- Verifies JWT is valid
- Protects routes that require login
- Runs before the page loads

---

## Plan-based Access Control

### The Two Approaches

#### 1. Check Access (Boolean)

Use when you want to show/hide features:

```typescript
// From: app/actions/subscription.ts

export async function checkProAccess(): Promise<boolean> {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  // Get subscription data
  const { data: userData } = await supabase
    .from('users')
    .select('plan, subscription_status')
    .eq('id', user.id)
    .single()

  // Return true if Pro and Active
  return (
    (userData?.plan === 'pro_monthly' || userData?.plan === 'pro_yearly') &&
    userData?.subscription_status === 'active'
  )
}
```

**Usage:**
```typescript
const isPro = await checkProAccess()

if (isPro) {
  // Show advanced features
} else {
  // Show upgrade prompt
}
```

#### 2. Require Access (Throws Error)

Use when you want to enforce access:

```typescript
export async function requireProAccess() {
  const hasAccess = await checkProAccess()

  if (!hasAccess) {
    throw new Error('Pro subscription required. Please upgrade.')
  }

  return true
}
```

**Usage:**
```typescript
export async function exportData() {
  // This throws error if user is not Pro
  await requireProAccess()

  // Only Pro users reach this code
  const data = await fetchData()
  return data
}
```

### Example: Enforcing Limits

```typescript
// From: app/actions/records.ts

export async function createRecord(name: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Check if user is Pro
  const isPro = await checkProAccess()

  if (!isPro) {
    // Free users have limits
    const { count } = await supabase
      .from('records')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    // Enforce 3-record limit for free users
    if (count && count >= 3) {
      throw new Error(
        'Free plan limit reached (3 records). ' +
        'Upgrade to Pro for unlimited records.'
      )
    }
  }

  // Create record (both free and pro can reach here)
  const { data } = await supabase
    .from('records')
    .insert({ user_id: user.id, name })
    .select()
    .single()

  return data
}
```

---

## Database Design

### Schema Explanation

```sql
-- From: supabase/schema.sql

-- Table 1: Users
CREATE TABLE public.users (
  id UUID PRIMARY KEY              -- Links to auth.users(id)
    REFERENCES auth.users(id)       -- Foreign key constraint
    ON DELETE CASCADE,              -- Delete user data if auth user deleted

  email TEXT NOT NULL UNIQUE,      -- User's email

  stripe_customer_id TEXT UNIQUE,  -- Links to Stripe customer

  plan TEXT NOT NULL DEFAULT 'free' -- Current plan
    CHECK (plan IN ('free', 'pro_monthly', 'pro_yearly')),

  subscription_status TEXT         -- Subscription state
    CHECK (subscription_status IN
      ('active', 'canceled', 'past_due', 'incomplete', 'trialing')),

  current_period_end TIMESTAMP,    -- When subscription renews

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Row-Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own data
CREATE POLICY "Users can read own data"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);
  --     ^^^^^^^^^^^      ^
  --     Current user     User ID in row
```

**What this means:**
```typescript
// User A (id: abc123) tries to query
const { data } = await supabase
  .from('users')
  .select('*')

// RLS automatically adds: WHERE id = 'abc123'
// User A can ONLY see their own data
// Even if they try: .eq('id', 'xyz789')
// RLS overrides it
```

### Automatic Triggers

```sql
-- Trigger: Auto-create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users        -- When user signs up
  FOR EACH ROW                      -- For each new user
  EXECUTE FUNCTION handle_new_user(); -- Run this function

-- Function: Create profile
CREATE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);      -- NEW = the user that just signed up
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**What this does:**
1. User signs up via Supabase Auth
2. Row created in `auth.users` table
3. Trigger fires automatically
4. Profile created in `public.users` table
5. All happens in one transaction

---

## Common Patterns

### Pattern 1: Server Component Data Fetching

```typescript
// Server Component (runs on server)
export default async function DashboardPage() {
  // ✅ Can directly access database
  const user = await getUserWithSubscription()

  // ✅ Can use async/await at top level
  if (!user) {
    redirect('/login')
  }

  // ✅ Can pass data directly to components
  return <Dashboard user={user} />
}
```

### Pattern 2: Client Component with Server Action

```typescript
// Client Component (runs in browser)
'use client'

export function SubscribeButton({ priceId }: { priceId: string }) {
  return (
    {/* ✅ Call Server Action from client */}
    <form action={createCheckoutSession.bind(null, priceId)}>
      <button type="submit">Subscribe</button>
    </form>
  )
}
```

### Pattern 3: Environment Variables

```typescript
// ✅ NEXT_PUBLIC_ = Exposed to browser
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

// ✅ No NEXT_PUBLIC_ = Server-only (secure)
const secretKey = process.env.STRIPE_SECRET_KEY
```

**Rule**: NEVER use server-only secrets in client components!

### Pattern 4: Error Handling

```typescript
export async function createRecord(name: string) {
  try {
    // Attempt operation
    const { data, error } = await supabase
      .from('records')
      .insert({ name })

    // Check for errors
    if (error) throw error

    return { success: true, data }
  } catch (error) {
    // Handle and return error message
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
```

---

## Key Takeaways

### 1. Never Trust the Frontend
```typescript
// ❌ NEVER do this
if (user.says.they.are.pro) {
  allowAccess()
}

// ✅ ALWAYS do this
const isPro = await checkProAccess() // Server-side check
if (isPro) {
  allowAccess()
}
```

### 2. Webhooks are Critical
- All subscription state changes happen via webhooks
- Always verify webhook signatures
- Handle all four critical events

### 3. Server Actions are Powerful
- Type-safe by default
- Less boilerplate than API routes
- Great for forms and mutations

### 4. Database Security Matters
- Use Row-Level Security (RLS)
- Never expose sensitive data
- Enforce constraints at database level

### 5. Environment Variables
- Use `NEXT_PUBLIC_` only for safe values
- Keep secrets server-side only
- Never commit `.env.local` to git

---

## Practice Questions

Test your understanding:

1. **Why do we verify webhook signatures?**
   <details>
   <summary>Answer</summary>
   To ensure the webhook actually came from Stripe and wasn't forged by an attacker trying to give themselves free Pro access.
   </details>

2. **What's the difference between `checkProAccess()` and `requireProAccess()`?**
   <details>
   <summary>Answer</summary>
   `checkProAccess()` returns boolean (true/false), used for conditional logic. `requireProAccess()` throws an error if user isn't Pro, used to enforce access.
   </details>

3. **Why do we use Server Actions instead of API routes?**
   <details>
   <summary>Answer</summary>
   Server Actions provide better type safety, less boilerplate, and work seamlessly with React Server Components. They're perfect for form submissions and database mutations.
   </details>

4. **What does Row-Level Security (RLS) do?**
   <details>
   <summary>Answer</summary>
   RLS automatically filters database queries so users can only access their own data, even if they try to query other users' data.
   </details>

---

Ready to dive into the code? Start with [QUICK_START.md](./QUICK_START.md) to get it running!
