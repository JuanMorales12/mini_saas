import { redirect } from 'next/navigation'
import { getUserWithSubscription, signOut } from '../actions/auth'
import { createPortalSession } from '../actions/subscription'
import Link from 'next/link'

/**
 * Dashboard Page
 * Protected route - only accessible to authenticated users
 * Shows subscription status and plan details
 */
export default async function DashboardPage() {
  const user = await getUserWithSubscription()

  if (!user) {
    redirect('/login')
  }

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Get status badge color
  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
      case 'past_due':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
      case 'canceled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
    }
  }

  const isPro = user.plan === 'pro_monthly' || user.plan === 'pro_yearly'

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Mini SaaS
          </Link>
          <nav className="flex items-center space-x-4">
            <Link href="/pricing" className="hover:underline">
              Pricing
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="text-gray-600 dark:text-gray-400 hover:underline"
              >
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {user.email}
          </p>
        </div>

        {/* Subscription Status Card */}
        <div className="border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Subscription Status</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Current Plan
              </p>
              <p className="text-2xl font-bold capitalize">
                {user.plan?.replace('_', ' ') || 'Free'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Status
              </p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                  user.subscription_status
                )}`}
              >
                {user.subscription_status || 'Free'}
              </span>
            </div>

            {isPro && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Next Billing Date
                </p>
                <p className="text-lg font-semibold">
                  {formatDate(user.current_period_end)}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-4">
            {isPro ? (
              <form action={createPortalSession}>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Manage Billing
                </button>
              </form>
            ) : (
              <Link
                href="/pricing"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 inline-block"
              >
                Upgrade to Pro
              </Link>
            )}
          </div>
        </div>

        {/* Feature Access Section */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Your Features</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div>
                <h3 className="font-semibold">Record Limit</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isPro ? 'Unlimited records' : 'Maximum 3 records'}
                </p>
              </div>
              {isPro ? (
                <span className="text-green-500 text-2xl">✓</span>
              ) : (
                <span className="text-gray-400 text-2xl">✗</span>
              )}
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div>
                <h3 className="font-semibold">Advanced Analytics</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Detailed insights and reports
                </p>
              </div>
              {isPro ? (
                <span className="text-green-500 text-2xl">✓</span>
              ) : (
                <span className="text-gray-400 text-2xl">✗</span>
              )}
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div>
                <h3 className="font-semibold">Priority Support</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  24/7 dedicated support
                </p>
              </div>
              {isPro ? (
                <span className="text-green-500 text-2xl">✓</span>
              ) : (
                <span className="text-gray-400 text-2xl">✗</span>
              )}
            </div>
          </div>

          {!isPro && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Upgrade to Pro to unlock all features and get unlimited access!
              </p>
              <Link
                href="/pricing"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline mt-2 inline-block"
              >
                View pricing →
              </Link>
            </div>
          )}
        </div>

        {/* Account Info */}
        <div className="mt-6 p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Account Information</h3>
          <div className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
            <p>
              <span className="font-medium">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-medium">Member since:</span>{' '}
              {formatDate(user.created_at)}
            </p>
            {user.stripe_customer_id && (
              <p className="text-xs mt-2 font-mono">
                Customer ID: {user.stripe_customer_id}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
