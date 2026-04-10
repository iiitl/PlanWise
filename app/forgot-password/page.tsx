"use client"

import type React from "react"
import { useState } from "react"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    // ✅ Email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    try {
      await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      // ✅ Always show success (security best practice)
      setIsSuccess(true)

    } catch {
      // ✅ Still show success (avoid email enumeration)
      setIsSuccess(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--primarybg)] via-[var(--secondarybg)]/30 to-[var(--primarybg)] relative overflow-hidden">
      
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, var(--mutedbg) 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          <div className="flex items-center justify-center gap-3 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[var(--accent2bg)]">PlanWise</h1>
              <p className="text-[var(--mutedbg)] text-sm">Stay focused, get things done</p>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-[var(--primarybg)]/80 backdrop-blur-sm rounded-2xl shadow-xl border border-[var(--secondarybg)] p-8">
            
            {!isSuccess ? (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-full bg-[var(--secondarybg)] flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-[var(--accent1bg)]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[var(--accent2bg)] mb-2">
                    Forgot Password?
                  </h2>
                  <p className="text-[var(--mutedbg)] leading-relaxed">
                    No worries! Enter your email address and we&apos;ll send you a link to reset your password.
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 dark:bg-red-950 dark:border-red-800">
                    <p className="text-red-800 dark:text-red-200 text-sm font-medium">
                      {error}
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--accent2bg)] mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--mutedbg)]" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email address"
                        className="pl-10 h-12 border-[var(--secondarybg)] bg-[var(--primarybg)] text-[var(--accent2bg)]"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-[var(--accent1bg)] text-white"
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <Link href="/login" className="text-[var(--accent1bg)]">
                    <ArrowLeft className="w-4 h-4 inline mr-2" />
                    Back to Sign In
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center">
                <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Check Your Email</h2>
                <p>
                  If an account exists for{" "}
                  <strong>{email}</strong>, you will receive a reset link.
                </p>

                <Button
                  onClick={() => {
                    setIsSuccess(false)
                    setEmail("")
                  }}
                  className="mt-4"
                >
                  Try Again
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}