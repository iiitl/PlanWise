// hooks/use-task-breakdown.ts
"use client"

import { useState } from "react"

interface Breakdown {
  subTasks: string[];
}

export function useTaskBreakdown() {
  const [breakdown, setBreakdown] = useState<Breakdown | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateBreakdown = async (taskTitle: string) => {
    setIsLoading(true)
    setError(null)
    setBreakdown(null)

    try {
      const response = await fetch('/api/ai/breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskTitle }),
      })
      if (!response.ok) {
        throw new Error("The AI couldn't break down this task.")
      }
      const data = await response.json()
      setBreakdown(data)
    } catch (err: unknown) { // Replaced `any` with `unknown`
      // Type-safe error checking
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unexpected error occurred.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const clearBreakdown = () => {
    setBreakdown(null)
    setError(null)
  }

  return { breakdown, isLoading, error, generateBreakdown, clearBreakdown }
}