'use client'

import { signIn } from "../actions/auth";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}

function LoginContent() {
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      await signIn(formData)
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
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to home
        </Link>

        {/* Card */}
        <div className="glass-card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold gradient-text mb-2">
              Welcome back
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Sign in to your account to continue
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-300">
                <strong>Error:</strong> {error}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 max-w-sm mx-auto">
            <div className="space-y-3.5">
              {/* Email */}
              <div className="flex flex-col items-center">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 self-start"
                  style={{ marginLeft: "calc(50% - 140px)" }}
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
                  style={{ marginLeft: "calc(50% - 140px)" }}
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="input-field"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
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
                    Signing in...
                  </span>
                ) : (
                  "Sign in →"
                )}
              </button>
            </div>

            {/* Sign up link */}
            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>

        {/* Demo Credentials */}
        <div className="mt-4 glass-card p-5" style={{ border: '1px solid rgba(99, 102, 241, 0.3)' }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Demo Credentials
            </p>
          </div>
          <div className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
            <p><span className="font-medium text-slate-700 dark:text-slate-300">Email:</span> test@test.com</p>
            <p><span className="font-medium text-slate-700 dark:text-slate-300">Password:</span> test1234</p>
          </div>
          <button
            type="button"
            onClick={() => {
              const emailInput = document.getElementById('email') as HTMLInputElement
              const passwordInput = document.getElementById('password') as HTMLInputElement
              if (emailInput) emailInput.value = 'test@test.com'
              if (passwordInput) passwordInput.value = 'test1234'
            }}
            className="mt-3 w-full text-xs font-medium py-1.5 px-3 rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 transition-colors cursor-pointer"
          >
            Auto-fill credentials
          </button>
        </div>
      </div>
    </div>
  );
}
