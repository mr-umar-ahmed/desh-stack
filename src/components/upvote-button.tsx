"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { ChevronUp } from "lucide-react"
import { toast } from "sonner"
import { toggleUpvote } from "@/app/products/[slug]/actions"

interface UpvoteButtonProps {
  productId: string
  slug: string
  initialCount: number
  initialUpvoted: boolean
  /** True when the visitor is signed in; otherwise we route to sign-in. */
  isSignedIn: boolean
  /** "large" for the product page hero, "compact" for cards/lists. */
  size?: "large" | "compact"
}

/**
 * Product Hunt-style upvote toggle with optimistic UI: the count and state
 * flip instantly, then reconcile with the server response.
 */
export function UpvoteButton({
  productId,
  slug,
  initialCount,
  initialUpvoted,
  isSignedIn,
  size = "large",
}: UpvoteButtonProps) {
  const router = useRouter()
  const [count, setCount] = useState(initialCount)
  const [upvoted, setUpvoted] = useState(initialUpvoted)
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (!isSignedIn) {
      router.push("/sign-in")
      return
    }
    // Optimistic flip
    const nextUpvoted = !upvoted
    setUpvoted(nextUpvoted)
    setCount((c) => c + (nextUpvoted ? 1 : -1))

    startTransition(async () => {
      try {
        const res = await toggleUpvote(productId, slug)
        // Reconcile with the authoritative server state
        setUpvoted(res.upvoted)
        setCount(res.count)
      } catch {
        // Roll back on failure
        setUpvoted(!nextUpvoted)
        setCount((c) => c + (nextUpvoted ? -1 : 1))
        toast.error("Couldn't record your upvote. Please try again.")
      }
    })
  }

  if (size === "compact") {
    return (
      <button
        onClick={handleClick}
        disabled={isPending}
        aria-pressed={upvoted}
        aria-label={upvoted ? "Remove upvote" : "Upvote"}
        className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-bold transition-all ${
          upvoted
            ? "border-saffron bg-saffron text-white shadow-sm"
            : "border-indigo/15 bg-white text-ink/70 hover:border-saffron hover:text-saffron"
        }`}
      >
        <ChevronUp className={`h-3.5 w-3.5 ${upvoted ? "" : ""}`} strokeWidth={3} />
        {count}
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={upvoted}
      aria-label={upvoted ? "Remove upvote" : "Upvote"}
      className={`group flex w-20 flex-col items-center gap-0.5 rounded-xl border-2 px-4 py-3 transition-all hover:-translate-y-0.5 ${
        upvoted
          ? "border-saffron bg-saffron text-white shadow-lg"
          : "border-indigo/15 bg-white text-ink hover:border-saffron"
      }`}
    >
      <ChevronUp
        className={`h-5 w-5 transition-transform group-hover:-translate-y-0.5 ${
          upvoted ? "text-white" : "text-saffron"
        }`}
        strokeWidth={3}
      />
      <span className="font-heading text-lg font-black leading-none">{count}</span>
      <span className={`text-[10px] font-semibold uppercase tracking-wide ${upvoted ? "text-white/80" : "text-ink/40"}`}>
        {upvoted ? "Upvoted" : "Upvote"}
      </span>
    </button>
  )
}
