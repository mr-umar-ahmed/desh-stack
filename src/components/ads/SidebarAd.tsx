"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { sponsoredProducts } from "./ad-data"
import { GoogleAd } from "./GoogleAd"
import { Megaphone, ExternalLink, Sparkles } from "lucide-react"

/**
 * Sticky sidebar ad for the product detail page.
 *
 * If Google AdSense is configured, shows a real Google Ad (rectangle format).
 * Otherwise, falls back to the self-hosted sponsored product rotator.
 */
export function SidebarAd() {
  const [adIndex, setAdIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [adBlocked, setAdBlocked] = useState(false)
  const hasAdSense = !!process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID

  const ads = sponsoredProducts
  const ad = ads[adIndex]

  useEffect(() => {
    if (hasAdSense && !adBlocked) return
    // Rotate every 12 seconds (slower than banner since it's persistent)
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setAdIndex((prev) => (prev + 1) % ads.length)
        setIsAnimating(false)
      }, 300)
    }, 12000)
    return () => clearInterval(interval)
  }, [ads.length, hasAdSense, adBlocked])

  // ──── Google AdSense Mode ────
  if (hasAdSense && !adBlocked) {
    return (
      <div className="sticky top-24">
        <div className="rounded-2xl border border-indigo/8 bg-card overflow-hidden shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <div className="flex items-center gap-1.5">
              <Megaphone className="w-3 h-3 text-ink/25" />
              <span className="text-[9px] font-semibold uppercase tracking-wider text-ink/25">
                Ad
              </span>
            </div>
          </div>
          {/* Google Ad */}
          <div className="px-3 pb-3">
            <GoogleAd
              format="rectangle"
              responsive
              style={{ minHeight: "250px" }}
              onAdBlock={() => setAdBlocked(true)}
            />
          </div>
          {/* Bottom decoration */}
          <div className="h-1 bg-gradient-to-r from-saffron via-teal to-indigo opacity-20" />
        </div>

        {/* Advertise here link */}
        <div className="mt-3 text-center">
          <Link
            href="/for-vendors"
            className="text-[10px] text-ink/30 hover:text-indigo transition-colors"
          >
            Advertise on DeshStack →
          </Link>
        </div>
      </div>
    )
  }

  // ──── Self-Hosted Fallback Mode ────
  if (!ad) return null

  return (
    <div className="sticky top-24">
      <div
        className={`rounded-2xl border border-indigo/8 bg-gradient-to-br from-white via-white to-saffron/[0.03] shadow-sm overflow-hidden transition-all duration-300 ${
          isAnimating ? "opacity-0 scale-[0.98]" : "opacity-100 scale-100"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <div className="flex items-center gap-1.5">
            <Megaphone className="w-3 h-3 text-saffron" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-saffron">
              Sponsored
            </span>
          </div>
          <Sparkles className="w-3 h-3 text-indigo/20" />
        </div>

        {/* Content */}
        <div className="px-4 pb-4">
          {/* Logo */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo to-indigo/80 flex items-center justify-center text-paper text-lg font-bold mb-3 shadow-md">
            {ad.name.charAt(0)}
          </div>

          <h4 className="font-heading font-bold text-sm text-ink mb-1">
            {ad.name}
          </h4>

          <span className="inline-flex text-[10px] font-medium text-indigo/60 bg-indigo/5 px-2 py-0.5 rounded-full mb-2">
            {ad.category}
          </span>

          <p className="text-xs text-ink/50 leading-relaxed mb-3 line-clamp-3">
            {ad.tagline}
          </p>

          {ad.highlight && (
            <div className="flex items-center gap-1.5 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
              <span className="text-[10px] font-semibold text-teal">
                {ad.highlight}
              </span>
            </div>
          )}

          <Link
            href={ad.ctaUrl}
            className="flex items-center justify-center gap-1.5 w-full text-xs font-semibold text-paper bg-indigo px-4 py-2.5 rounded-xl hover:bg-indigo/90 transition-all duration-200 hover:shadow-md group"
          >
            {ad.ctaText}
            <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Bottom decoration */}
        <div className="h-1 bg-gradient-to-r from-saffron via-teal to-indigo opacity-30" />
      </div>

      {/* "Advertise here" link */}
      <div className="mt-3 text-center">
        <Link
          href="/for-vendors"
          className="text-[10px] text-ink/30 hover:text-indigo transition-colors"
        >
          Advertise on DeshStack →
        </Link>
      </div>
    </div>
  )
}
