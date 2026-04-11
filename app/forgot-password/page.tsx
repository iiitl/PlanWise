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
  const [message, setMessage] = useState<string | null>(null) 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setIsLoading(true)

    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Something went wrong")
      } else {
        setMessage(data.message) 
        setIsSuccess(true)
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Network error. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--primarybg)] via-[var(--secondarybg)]/30 to-[var(--primarybg)] relative overflow-hidden">
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[var(--accent2bg)]">PlanWise</h1>
              <p className="text-[var(--mutedbg)] text-sm">Stay focused, get things done</p>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-[var(--primarybg)]/80 backdrop-blur-sm rounded-2xl shadow-xl border border-[var(--secondarybg)] p-8">
            {!isSuccess ? (
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-full bg-[var(--secondarybg)] flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-[var(--accent1bg)]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[var(--accent2bg)] mb-2">Forgot Password?</h2>
                  <p className="text-[var(--mutedbg)]">
                    Enter your email and we’ll send a reset link.
                  </p>
                </div>

                {/* ❌ Error UI */}
                {error && (
                  <div className="mb-4 p-3 rounded bg-red-100 text-red-700 text-sm">
                    {error}
                  </div>
                )}

                {/* ✅ Success message BEFORE redirect */}
                {message && (
                  <div className="mb-4 p-3 rounded bg-green-100 text-green-700 text-sm">
                    {message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || !email} 
                    className="w-full"
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <Link href="/login" className="inline-flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Sign In
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center">
                <CheckCircle className="mx-auto mb-4 text-green-600" size={40} />

                <h2 className="text-xl font-bold mb-2">Check your email</h2>

                {/* ✅ IMPORTANT (reviewer wants this clarity) */}
                <p className="text-sm text-gray-600 mb-4">
                  {message || "If this email exists, a reset link has been sent."}
                </p>

                <p className="text-sm text-gray-500 mb-4">
                  Sent to: <strong>{email}</strong>
                </p>

                <Button
                  onClick={() => {
                    setIsSuccess(false)
                    setEmail("")
                    setMessage(null)
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Try again
                </Button>

                <div className="mt-4">
                  <Link href="/login" className="inline-flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to login
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}