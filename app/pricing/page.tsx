import Link from 'next/link'
import { getUser } from '../actions/auth'
import { createCheckoutSession } from '../actions/subscription'
import { STRIPE_PLANS } from '@/lib/stripe/config'

/**
 * Pricing Page
 * Shows all available plans and allows users to subscribe
 * Plans are configured in Stripe Dashboard and IDs stored in env vars
 */
export default async function PricingPage() {
  const user = await getUser()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Mini SaaS
          </Link>
          <nav className="space-x-4">
            {user ? (
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="hover:underline">
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Choose the plan that's right for you
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <div className="border rounded-lg p-8 flex flex-col">
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-gray-600 dark:text-gray-400">/month</span>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>3 records maximum</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Basic features</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Community support</span>
              </li>
            </ul>

            {user ? (
              <Link
                href="/dashboard"
                className="w-full border border-gray-300 dark:border-gray-700 text-center py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                Current Plan
              </Link>
            ) : (
              <Link
                href="/signup"
                className="w-full border border-gray-300 dark:border-gray-700 text-center py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Pro Monthly Plan */}
          <div className="border-2 border-blue-600 rounded-lg p-8 flex flex-col relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
              Popular
            </div>

            <h3 className="text-2xl font-bold mb-2">Pro Monthly</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold">
                ${STRIPE_PLANS.PRO_MONTHLY.price}
              </span>
              <span className="text-gray-600 dark:text-gray-400">/month</span>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Unlimited records</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>All features</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Priority support</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Advanced analytics</span>
              </li>
            </ul>

            {user ? (
              <form action={createCheckoutSession.bind(null, STRIPE_PLANS.PRO_MONTHLY.priceId)}>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                >
                  Subscribe
                </button>
              </form>
            ) : (
              <Link
                href="/signup"
                className="w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Pro Yearly Plan */}
          <div className="border rounded-lg p-8 flex flex-col">
            <div className="mb-2 flex justify-between items-start">
              <h3 className="text-2xl font-bold">Pro Yearly</h3>
              <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-2 py-1 rounded text-xs font-semibold">
                Save 17%
              </span>
            </div>

            <div className="mb-4">
              <span className="text-4xl font-bold">
                ${STRIPE_PLANS.PRO_YEARLY.price}
              </span>
              <span className="text-gray-600 dark:text-gray-400">/year</span>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Unlimited records</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>All features</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Priority support</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Advanced analytics</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>2 months free!</span>
              </li>
            </ul>

            {user ? (
              <form action={createCheckoutSession.bind(null, STRIPE_PLANS.PRO_YEARLY.priceId)}>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                >
                  Subscribe
                </button>
              </form>
            ) : (
              <Link
                href="/signup"
                className="w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>

        {/* FAQ or additional info */}
        <div className="mt-16 text-center text-gray-600 dark:text-gray-400">
          <p>All plans include a 14-day money-back guarantee</p>
          <p className="mt-2">Cancel anytime, no questions asked</p>
        </div>
      </main>
    </div>
  )
}
