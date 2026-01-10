import Link from 'next/link'
import { getUser } from '../actions/auth'
import { createCheckoutSession } from '../actions/subscription'
import { STRIPE_PLANS } from '@/lib/stripe/config'

/**
 * Pricing Page
 * Modern pricing page with attractive card designs
 */
export default async function PricingPage() {
  const user = await getUser()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass-card mx-4 mt-4 sticky top-4 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold gradient-text">
            Mini SaaS
          </Link>
          <nav className="flex items-center gap-6">
            {user ? (
              <Link
                href="/dashboard"
                className="btn-primary"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              💎 Simple, transparent pricing
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Choose your <span className="gradient-text">plan</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Start for free, upgrade when you need more. Cancel anytime, no questions asked.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {/* Free Plan */}
          <div className="glass-card p-8 flex flex-col card-hover">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Free</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold gradient-text">$0</span>
                <span className="text-slate-500 dark:text-slate-400">/month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-700 dark:text-slate-300">3 records maximum</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-700 dark:text-slate-300">Basic features</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-700 dark:text-slate-300">Community support</span>
              </li>
            </ul>

            {user ? (
              <Link
                href="/dashboard"
                className="btn-secondary w-full text-center"
              >
                Current Plan
              </Link>
            ) : (
              <Link
                href="/signup"
                className="btn-secondary w-full text-center"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Pro Monthly Plan - Featured */}
          <div className="glass-card p-8 flex flex-col card-hover relative border-2 border-blue-500 shadow-2xl scale-105">
            {/* Popular Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-sm font-bold shadow-lg">
              MOST POPULAR
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Pro Monthly</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold gradient-text">${STRIPE_PLANS.PRO_MONTHLY.price}</span>
                <span className="text-slate-500 dark:text-slate-400">/month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-700 dark:text-slate-300"><strong>Unlimited records</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-700 dark:text-slate-300">All features</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-700 dark:text-slate-300">Priority support</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-700 dark:text-slate-300">Advanced analytics</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-700 dark:text-slate-300">Export data</span>
              </li>
            </ul>

            {user ? (
              <form action={createCheckoutSession.bind(null, STRIPE_PLANS.PRO_MONTHLY.priceId)}>
                <button
                  type="submit"
                  className="btn-primary w-full"
                >
                  Subscribe Now →
                </button>
              </form>
            ) : (
              <Link
                href="/signup"
                className="btn-primary w-full text-center"
              >
                Get Started →
              </Link>
            )}
          </div>

          {/* Pro Yearly Plan */}
          <div className="glass-card p-8 flex flex-col card-hover">
            <div className="mb-8">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Pro Yearly</h3>
                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold">
                  SAVE 17%
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold gradient-text">${STRIPE_PLANS.PRO_YEARLY.price}</span>
                <span className="text-slate-500 dark:text-slate-400">/year</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                That's just ${Math.round(STRIPE_PLANS.PRO_YEARLY.price / 12)}/month
              </p>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-700 dark:text-slate-300"><strong>Unlimited records</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-700 dark:text-slate-300">All features</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-700 dark:text-slate-300">Priority support</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-700 dark:text-slate-300">Advanced analytics</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-700 dark:text-slate-300"><strong>2 months free!</strong></span>
              </li>
            </ul>

            {user ? (
              <form action={createCheckoutSession.bind(null, STRIPE_PLANS.PRO_YEARLY.priceId)}>
                <button
                  type="submit"
                  className="btn-primary w-full"
                >
                  Subscribe Now →
                </button>
              </form>
            ) : (
              <Link
                href="/signup"
                className="btn-primary w-full text-center"
              >
                Get Started →
              </Link>
            )}
          </div>
        </div>

        {/* FAQ / Additional Info */}
        <div className="max-w-3xl mx-auto glass-card p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            All plans include
          </h3>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-1">14-day guarantee</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Money-back guarantee</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Secure payments</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Powered by Stripe</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Cancel anytime</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">No questions asked</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-600 dark:text-slate-400">
            Have questions? <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">Contact us</Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
