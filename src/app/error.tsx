"use client"

import { useEffect } from "react"
import { AlertOctagon } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertOctagon className="w-8 h-8" />
      </div>
      <h2 className="font-heading text-3xl font-black text-ink mb-4">Something went wrong!</h2>
      <p className="text-ink/70 mb-8 max-w-md mx-auto">
        We encountered an unexpected error while trying to load this page. Our team has been notified.
      </p>
      <button
        onClick={() => reset()}
        className="bg-indigo text-paper font-semibold px-6 py-3 rounded-lg hover:bg-indigo/90 transition-colors shadow-sm"
      >
        Try Again
      </button>
    </div>
  )
}
