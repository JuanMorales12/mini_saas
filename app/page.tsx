import Link from 'next/link'
import { getUser } from './actions/auth'

/**
 * Home Page
 * Landing page with CTA to signup/login or go to dashboard
 */
export default async function Home() {
  const user = await getUser()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Mini SaaS</h1>
          <nav className="space-x-4">
            <Link href="/pricing" className="hover:underline">
              Pricing
            </Link>
            {user ? (
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="hover:underline">
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-3xl px-4">
          <h2 className="text-5xl font-bold mb-6">
            Build Your SaaS with Stripe Subscriptions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            A complete Next.js starter with authentication, subscription
            management, and payment processing. Production-ready and built with
            best practices.
          </p>

          <div className="flex gap-4 justify-center">
            {user ? (
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700"
                >
                  Get Started
                </Link>
                <Link
                  href="/pricing"
                  className="border border-gray-300 dark:border-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  View Pricing
                </Link>
              </>
            )}
          </div>

          {/* Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">
                Stripe Integration
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Complete payment flow with webhooks, subscriptions, and customer
                portal
              </p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">
                Supabase Auth
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Secure authentication with email/password and social providers
              </p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">
                Plan-based Access
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Built-in middleware to protect features based on subscription
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>Built with Next.js, Stripe, and Supabase</p>
        </div>
      </footer>
    </div>
  )
}
