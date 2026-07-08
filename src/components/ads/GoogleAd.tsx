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
  /**
   * Callback fired if the ad is blocked by an adblocker or remains unfilled
   */
  onAdBlock?: () => void
}

export function GoogleAd({
  slot,
  format = "auto",
  responsive = true,
  className = "",
  style,
  onAdBlock,
}: GoogleAdProps) {
  const adRef = useRef<HTMLModElement>(null)
  const isAdLoaded = useRef(false)

  const pubId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID

  useEffect(() => {
    if (!pubId || isAdLoaded.current) return

    let timeoutId: NodeJS.Timeout

    try {
      const adsbygoogle = window.adsbygoogle || []
      adsbygoogle.push({})
      isAdLoaded.current = true
      
      timeoutId = setTimeout(() => {
        if (adRef.current) {
          const status = adRef.current.getAttribute("data-ad-status")
          if (status === "unfilled" || adRef.current.clientHeight === 0) {
            onAdBlock?.()
          }
        }
      }, 1500)
    } catch (err) {
      console.error("AdSense error:", err)
      onAdBlock?.()
    }
    
    return () => clearTimeout(timeoutId)
  }, [pubId, onAdBlock])

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
