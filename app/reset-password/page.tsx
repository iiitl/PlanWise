"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle, Lock, KeyRound } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong.");
      } else {
        setIsSuccess(true);
      }
    } catch (err: unknown) {
      setError("Network error. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token && !isSuccess && !error) {
    return (
      <div className="text-center">
        <Lock className="mx-auto mb-4 w-12 h-12 text-[var(--mutedbg)]" />
        <h2 className="text-xl font-bold mb-2">Invalid Link</h2>
        <p className="text-sm text-gray-500 mb-6">
          This password reset link is invalid or missing a token.
        </p>
        <Link href="/forgot-password">
          <Button className="w-full">Request New Link</Button>
        </Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="text-center">
        <CheckCircle className="mx-auto mb-4 text-green-600" size={40} />
        <h2 className="text-2xl font-bold mb-2 text-[var(--accent2bg)]">Password Reset!</h2>
        <p className="text-sm text-gray-600 mb-6">
          Your password has been successfully reset. You can now log in with your new password.
        </p>
        <Link href="/login">
          <Button className="w-full">Go to Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-[var(--secondarybg)] flex items-center justify-center mx-auto mb-4">
          <KeyRound className="w-8 h-8 text-[var(--accent1bg)]" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--accent2bg)] mb-2">Set New Password</h2>
        <p className="text-[var(--mutedbg)]">
          Please enter your new password below.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-100/80 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm mb-2 font-medium text-[var(--accent2bg)]">New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-2 font-medium text-[var(--accent2bg)]">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="pl-10"
              disabled={isLoading}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading || !password || !confirmPassword} 
          className="w-full"
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/login" className="inline-flex items-center text-sm text-[var(--mutedbg)] hover:text-[var(--accent1bg)] transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sign In
        </Link>
      </div>
    </>
  );
}

export default function ResetPasswordPage() {
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
            <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
