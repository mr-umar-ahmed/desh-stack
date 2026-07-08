"use client"

import { useEffect, useRef } from "react"

declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>
  }
}

interface GoogleAdProps {
  /**
   * The ad slot ID from your AdSense dashboard.
   * Create ad units at https://www.google.com/adsense → Ads → By ad unit
   */
  slot?: string
  /**
   * Ad format: "auto" (responsive), "horizontal", "vertical", "rectangle"
   */
  format?: "auto" | "horizontal" | "vertical" | "rectangle"
  /**
   * Whether the ad should be responsive
   */
  responsive?: boolean
  /**
   * Custom class name for the container
   */
  className?: string
  /**
   * Fixed height style for the ad container (e.g., "90px", "250px")
   */
  style?: React.CSSProperties
}

export function GoogleAd({
  slot,
  format = "auto",
  responsive = true,
  className = "",
  style,
}: GoogleAdProps) {
  const adRef = useRef<HTMLModElement>(null)
  const isAdLoaded = useRef(false)

  const pubId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID

  useEffect(() => {
    if (!pubId || isAdLoaded.current) return

    try {
      const adsbygoogle = window.adsbygoogle || []
      adsbygoogle.push({})
      isAdLoaded.current = true
    } catch (err) {
      console.error("AdSense error:", err)
    }
  }, [pubId])

  if (!pubId) return null

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle ${className}`}
      style={{
        display: "block",
        ...style,
      }}
      data-ad-client={pubId}
      data-ad-slot={slot || ""}
      data-ad-format={format}
      data-full-width-responsive={responsive ? "true" : "false"}
    />
  )
}
