import Link from 'next/link'

/**
 * Signup Success Page
 * Shows confirmation message after successful registration
 */
export default function SignupSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Success Card */}
        <div className="glass-card p-8 text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Header */}
          <h2 className="text-3xl font-bold gradient-text mb-3">
            Account Created!
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Your account has been successfully created. You can now sign in and start using Mini SaaS.
          </p>

          {/* Action Button */}
          <Link href="/login" className="btn-primary inline-block">
            Sign in to your account →
          </Link>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              💡 Start with our free plan and upgrade anytime to unlock all features.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
