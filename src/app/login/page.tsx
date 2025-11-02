"use client"

import { signIn, useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Icon } from "@iconify/react"
import Link from "next/link"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/home"

  // Redirect if already authenticated
  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push(callbackUrl)
    }
  }, [status, session, router, callbackUrl])

  const handleGitHubLogin = async () => {
    setIsLoading(true)
    try {
      await signIn("github", { 
        callbackUrl: callbackUrl,
        redirect: true 
      })
    } catch (error) {
      console.error("Login error:", error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-black via-zinc-950 to-black">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-[var(--primary)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-4 w-96 h-96 bg-[var(--primary)]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-2">
            <h1 className="text-3xl font-bold tracking-tight text-[var(--primary)]">
              Stackboxd
            </h1>
          </Link>
          <p className="text-[var(--text-muted)] text-sm">
            Log, rate, and reflect on your developer stack
          </p>
        </div>

        {/* Login Card */}
        <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 backdrop-blur-xl p-8 shadow-2xl">
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--primary)]/10 via-transparent to-transparent opacity-50 pointer-events-none" />
          
          <div className="relative space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold">Welcome back</h2>
              <p className="text-sm text-[var(--text-muted)]">
                Sign in to continue to your account
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleGitHubLogin}
                disabled={isLoading}
                className="group relative w-full rounded-xl bg-[var(--primary)] px-6 py-3.5 text-base font-semibold text-black shadow-[0_0_0_1px_#00FF8F40,_0_8px_30px_rgba(0,255,143,0.3)] disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:shadow-[0_0_0_1px_#00FF8F60,_0_12px_40px_rgba(0,255,143,0.4)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <Icon icon="svg-spinners:3-dots-scale" className="w-5 h-5" />
                    <span>Connecting to GitHub...</span>
                  </>
                ) : (
                  <>
                    <Icon icon="mdi:github" className="w-6 h-6" />
                    <span>Continue with GitHub</span>
                  </>
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--border)]" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[var(--surface)] px-2 text-[var(--text-muted)]">
                    Secure authentication
                  </span>
                </div>
              </div>

              <div className="text-center space-y-3 text-xs text-[var(--text-muted)]">
                <p>
                  By continuing, you agree to Stackboxd's{" "}
                  <Link href="/terms" className="text-[var(--primary)] hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-[var(--primary)] hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer links */}
        <div className="mt-8 text-center">
          <p className="text-sm text-[var(--text-muted)]">
            Don't have an account?{" "}
            <Link href="/onboarding" className="text-[var(--primary)] hover:underline font-medium">
              Get started
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
