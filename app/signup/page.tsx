'use client'

import { signUp } from '../actions/auth'
import Link from 'next/link'
import { useState } from 'react'

/**
 * Sign Up Page
 * Modern registration page with glassmorphism design
 */
export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      await signUp(formData)
    } catch (error) {
      // The redirect throws an error, which is expected behavior
      // We don't need to reset loading state as the page will redirect
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Back to Home */}
        <Link href="/" className="back-link mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to home
        </Link>

        {/* Card */}
        <div className="glass-card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold gradient-text mb-2">Create your account</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Start your journey with Mini SaaS
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 max-w-sm mx-auto">
            <div className="space-y-3.5">
              {/* Email */}
              <div className="flex flex-col items-center">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 self-start"
                  style={{ marginLeft: 'calc(50% - 140px)' }}
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="input-field"
                  placeholder="you@example.com"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col items-center">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 self-start"
                  style={{ marginLeft: 'calc(50% - 140px)' }}
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  className="input-field"
                  placeholder="At least 6 characters"
                />
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 text-center w-[280px]">
                  Use 6 or more characters with a mix of letters and numbers
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 mt-4">
              <button
                type="submit"
                className="btn-auth"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  "Create Account →"
                )}
              </button>
            </div>

            {/* Sign in link */}
            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>

        {/* Benefits */}
        <div className="mt-8 glass-card p-6">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            What you'll get:
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Free plan to get started
            </li>
            <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Upgrade to Pro anytime
            </li>
            <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Cancel anytime
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
