import Link from 'next/link'
import { getUser } from './actions/auth'

/**
 * Home Page
 * Modern landing page with gradient design and animations
 */
export default async function Home() {
  const user = await getUser()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass-card mx-4 mt-4 sticky top-4 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold gradient-text">Mini SaaS</h1>
          <nav className="flex items-center gap-6">
            <Link
              href="/pricing"
              className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
            >
              Pricing
            </Link>
            {user ? (
              <Link
                href="/dashboard"
                className="btn-primary"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-5xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-8">
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              🚀 Production-Ready SaaS Starter
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Build Your SaaS with{' '}
            <span className="gradient-text">Stripe</span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Complete Next.js starter with authentication, subscription management,
            and payment processing. Built with best practices and ready for production.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            {user ? (
              <Link
                href="/dashboard"
                className="btn-primary text-lg"
              >
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="btn-primary text-lg"
                >
                  Get Started Free →
                </Link>
                <Link
                  href="/pricing"
                  className="btn-secondary text-lg"
                >
                  View Pricing
                </Link>
              </>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {/* Feature 1 */}
            <div className="glass-card p-8 card-hover group">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                Stripe Integration
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Complete payment flow with webhooks, subscriptions, and customer portal
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card p-8 card-hover group">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                Secure Authentication
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Powered by Supabase with email/password and social providers
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card p-8 card-hover group">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                Plan-based Access
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Built-in middleware to protect features based on subscription
              </p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mt-20 glass-card p-8">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6">
              Built with Modern Technologies
            </p>
            <div className="flex flex-wrap justify-center gap-8 items-center">
              <span className="text-slate-700 dark:text-slate-300 font-semibold">Next.js 15</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-slate-700 dark:text-slate-300 font-semibold">React 19</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-slate-700 dark:text-slate-300 font-semibold">Stripe</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-slate-700 dark:text-slate-300 font-semibold">Supabase</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-slate-700 dark:text-slate-300 font-semibold">TypeScript</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-600 dark:text-slate-400">
            Built with ❤️ using Next.js, Stripe, and Supabase
          </p>
        </div>
      </footer>
    </div>
  )
}
