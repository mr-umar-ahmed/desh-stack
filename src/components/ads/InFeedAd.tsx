"use client"
import { useState } from "react"

import { GoogleAd } from "./GoogleAd"
import { Megaphone } from "lucide-react"

/**
 * In-feed Google AdSense unit that blends into product grids.
 * Renders a Google Ad in "auto" format inside a card-shaped container
 * that matches the ProductCard dimensions.
 *
 * Only renders when AdSense is configured.
 */
export function InFeedAd() {
  const [adBlocked, setAdBlocked] = useState(false)
  // Requires a real ad-unit slot ID; renders nothing until one is configured
  // so the grid never shows a blank Google box.
  const infeedSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_INFEED
  const hasAdSense = !!process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID && !!infeedSlot

  if (!hasAdSense || adBlocked) return null

  return (
    <div className="relative flex flex-col rounded-2xl border border-indigo/8 bg-card p-4 shadow-sm overflow-hidden">
      {/* Sponsored badge */}
      <div className="flex items-center gap-1 mb-2">
        <Megaphone className="w-3 h-3 text-ink/25" />
        <span className="text-[9px] font-semibold uppercase tracking-wider text-ink/25">
          Ad
        </span>
      </div>

      {/* Google Ad */}
      <div className="flex-1 min-h-[200px]">
        <GoogleAd
          slot={infeedSlot}
          format="auto"
          responsive
          style={{ minHeight: "200px" }}
          onAdBlock={() => setAdBlocked(true)}
        />
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-saffron via-teal to-indigo opacity-20" />
    </div>
  )
}
