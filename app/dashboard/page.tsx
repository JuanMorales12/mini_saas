import { redirect } from 'next/navigation'
import { getUserWithSubscription, signOut } from '../actions/auth'
import { createPortalSession } from '../actions/subscription'
import Link from 'next/link'

// Force dynamic rendering to always get fresh data
export const dynamic = 'force-dynamic'

/**
 * Dashboard Page
 * Modern dashboard with glassmorphism design
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

  // Get status badge styles
  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'active':
        return {
          bg: 'bg-green-100 dark:bg-green-900/30',
          text: 'text-green-700 dark:text-green-400',
          icon: '✓',
        }
      case 'past_due':
        return {
          bg: 'bg-red-100 dark:bg-red-900/30',
          text: 'text-red-700 dark:text-red-400',
          icon: '!',
        }
      case 'canceled':
        return {
          bg: 'bg-gray-100 dark:bg-gray-900/30',
          text: 'text-gray-700 dark:text-gray-400',
          icon: '×',
        }
      default:
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/30',
          text: 'text-blue-700 dark:text-blue-400',
          icon: 'i',
        }
    }
  }

  const isPro = user.plan === 'pro_monthly' || user.plan === 'pro_yearly'
  const statusBadge = getStatusBadge(user.subscription_status)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass-card mx-4 mt-4 sticky top-4 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold gradient-text">
            Mini SaaS
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/pricing"
              className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
            >
              Pricing
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors"
              >
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 gradient-text">
            Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Welcome back, <span className="font-semibold">{user.email}</span>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Plan Card */}
          <div className="glass-card p-6 card-hover">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Current Plan</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white capitalize">
                  {user.plan?.replace('_', ' ') || 'Free'}
                </p>
              </div>
            </div>
          </div>

          {/* Status Card */}
          <div className="glass-card p-6 card-hover">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-12 h-12 ${statusBadge.bg} rounded-xl flex items-center justify-center`}>
                <span className={`text-2xl font-bold ${statusBadge.text}`}>
                  {statusBadge.icon}
                </span>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Status</p>
                <p className={`text-2xl font-bold capitalize ${statusBadge.text}`}>
                  {user.subscription_status || 'Free'}
                </p>
              </div>
            </div>
          </div>

          {/* Next Billing Card */}
          <div className="glass-card p-6 card-hover">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {isPro ? 'Next Billing' : 'Plan Type'}
                </p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {isPro ? formatDate(user.current_period_end) : 'Lifetime Free'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Subscription Management */}
          <div className="md:col-span-2 space-y-6">
            {/* Subscription Card */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Subscription
              </h2>

              <div className="space-y-6">
                {isPro ? (
                  <>
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                            {user.plan === 'pro_monthly' ? 'Pro Monthly' : 'Pro Yearly'}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400">
                            Active subscription
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold">
                          Active
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Renews on {formatDate(user.current_period_end)}
                      </div>
                    </div>

                    <form action={createPortalSession}>
                      <button type="submit" className="btn-primary w-full">
                        Manage Billing →
                      </button>
                    </form>
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                      Update payment method, view invoices, or cancel subscription
                    </p>
                  </>
                ) : (
                  <>
                    <div className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900/50 dark:to-blue-900/20 rounded-xl border border-slate-200 dark:border-slate-700">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                        Free Plan
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-4">
                        You're currently on the free plan with limited features
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Limited to 3 records
                        </li>
                        <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Basic features only
                        </li>
                      </ul>
                    </div>

                    <Link href="/pricing" className="btn-primary w-full text-center block">
                      Upgrade to Pro →
                    </Link>
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                      Get unlimited access and advanced features
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Features */}
          <div className="space-y-6">
            {/* Features Card */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Your Features
              </h3>

              <div className="space-y-3">
                <FeatureItem
                  icon="📊"
                  title="Records"
                  description={isPro ? 'Unlimited' : 'Up to 3'}
                  enabled={true}
                />
                <FeatureItem
                  icon="📈"
                  title="Analytics"
                  description="Advanced insights"
                  enabled={isPro}
                />
                <FeatureItem
                  icon="⚡"
                  title="Priority Support"
                  description="24/7 assistance"
                  enabled={isPro}
                />
                <FeatureItem
                  icon="💾"
                  title="Export Data"
                  description="Download anytime"
                  enabled={isPro}
                />
              </div>

              {!isPro && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
                    🚀 Unlock all features with Pro
                  </p>
                </div>
              )}
            </div>

            {/* Account Info */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Account Info
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Email</p>
                  <p className="text-slate-900 dark:text-white font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Member Since</p>
                  <p className="text-slate-900 dark:text-white font-medium">
                    {formatDate(user.created_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Helper Component for Feature Items
function FeatureItem({
  icon,
  title,
  description,
  enabled,
}: {
  icon: string
  title: string
  description: string
  enabled: boolean
}) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
        enabled
          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
          : 'bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-700 opacity-60'
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <div className="flex-1">
        <p className="font-semibold text-slate-900 dark:text-white text-sm">{title}</p>
        <p className="text-xs text-slate-600 dark:text-slate-400">{description}</p>
      </div>
      {enabled ? (
        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-10a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
    </div>
  )
}
