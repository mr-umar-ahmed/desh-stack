"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { sponsoredProducts, type SponsoredProduct } from "./ad-data"
import { GoogleAd } from "./GoogleAd"
import { Megaphone, X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"

/**
 * If Google AdSense is configured (NEXT_PUBLIC_GOOGLE_ADSENSE_ID is set),
 * this renders a real Google Ad in horizontal/banner format.
 *
 * Otherwise, it falls back to the self-hosted sponsored product rotator.
 */
export function AdBanner() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [adBlocked, setAdBlocked] = useState(false)
  
  // Real AdSense needs a publisher ID AND an ad-unit slot ID (created in the
  // AdSense dashboard). Without both, we show the house sponsored rotator —
  // never a blank Google box.
  const bannerSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER
  const hasAdSense = !!process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID && !!bannerSlot

  const ads = sponsoredProducts
  const currentAd = ads[currentIndex]

  const goToNext = useCallback(() => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length)
      setIsAnimating(false)
    }, 300)
  }, [ads.length])

  const goToPrev = useCallback(() => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length)
      setIsAnimating(false)
    }, 300)
  }, [ads.length])

  useEffect(() => {
    if (isPaused || !isVisible || (hasAdSense && !adBlocked)) return
    const interval = setInterval(goToNext, 5000)
    return () => clearInterval(interval)
  }, [isPaused, isVisible, goToNext, hasAdSense, adBlocked])

  if (!isVisible) return null

  // ──── Google AdSense Mode ────
  if (hasAdSense && !adBlocked) {
    return (
      <section className="relative w-full border-y border-indigo/8 bg-gradient-to-r from-indigo/[0.02] via-transparent to-indigo/[0.02]">
        <div className="container mx-auto px-4 md:px-6 py-2">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1 shrink-0">
              <div className="flex items-center gap-1 text-ink/25 px-1">
                <Megaphone className="w-3 h-3" />
                <span className="text-[9px] font-semibold uppercase tracking-wider">Ad</span>
              </div>
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
              <GoogleAd
                slot={bannerSlot}
                format="horizontal"
                responsive
                style={{ minHeight: "60px", maxHeight: "100px" }}
                onAdBlock={() => setAdBlocked(true)}
              />
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-indigo/5 text-indigo/25 hover:text-indigo/50 transition-colors shrink-0"
              aria-label="Dismiss ad"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>
    )
  }

  // ──── Self-Hosted Fallback Mode ────
  if (ads.length === 0) return null

  return (
    <section
      className="relative w-full bg-gradient-to-r from-indigo/[0.03] via-saffron/[0.05] to-indigo/[0.03] border-y border-indigo/8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center gap-4">
          {/* Sponsored label */}
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <div className="flex items-center gap-1 bg-saffron/10 text-saffron px-2.5 py-1 rounded-full">
              <Megaphone className="w-3 h-3" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Sponsored</span>
            </div>
          </div>

          {/* Nav arrow left */}
          <button
            onClick={goToPrev}
            className="hidden md:flex items-center justify-center w-7 h-7 rounded-full bg-indigo/5 hover:bg-indigo/10 text-indigo/40 hover:text-indigo transition-colors shrink-0"
            aria-label="Previous ad"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Ad content */}
          <div className="flex-1 min-w-0">
            <AdContent ad={currentAd} isAnimating={isAnimating} />
          </div>

          {/* Nav arrow right */}
          <button
            onClick={goToNext}
            className="hidden md:flex items-center justify-center w-7 h-7 rounded-full bg-indigo/5 hover:bg-indigo/10 text-indigo/40 hover:text-indigo transition-colors shrink-0"
            aria-label="Next ad"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Dots indicator */}
          <div className="hidden sm:flex items-center gap-1 shrink-0">
            {ads.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setIsAnimating(true)
                  setTimeout(() => {
                    setCurrentIndex(i)
                    setIsAnimating(false)
                  }, 300)
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "bg-saffron w-4"
                    : "bg-indigo/20 hover:bg-indigo/40"
                }`}
                aria-label={`Go to ad ${i + 1}`}
              />
            ))}
          </div>

          {/* Dismiss */}
          <button
            onClick={() => setIsVisible(false)}
            className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-indigo/5 text-indigo/30 hover:text-indigo/60 transition-colors shrink-0"
            aria-label="Dismiss ads"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  )
}

function AdContent({
  ad,
  isAnimating,
}: {
  ad: SponsoredProduct
  isAnimating: boolean
}) {
  return (
    <Link
      href={ad.ctaUrl}
      className={`flex items-center gap-3 group transition-all duration-300 ${
        isAnimating ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
      }`}
    >
      {/* Logo placeholder */}
      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo to-indigo/80 flex items-center justify-center text-paper text-sm font-bold shrink-0 group-hover:scale-105 transition-transform shadow-sm">
        {ad.name.charAt(0)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-ink truncate">
            {ad.name}
          </span>
          {ad.highlight && (
            <span className="hidden lg:inline-flex text-[10px] font-medium text-teal bg-teal/10 px-2 py-0.5 rounded-full whitespace-nowrap">
              {ad.highlight}
            </span>
          )}
        </div>
        <p className="text-xs text-ink/50 truncate">{ad.tagline}</p>
      </div>

      <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-indigo bg-indigo/5 px-3 py-1.5 rounded-lg group-hover:bg-indigo group-hover:text-paper transition-all duration-200 whitespace-nowrap shrink-0">
        {ad.ctaText}
        <ExternalLink className="w-3 h-3" />
      </span>
    </Link>
  )
}
