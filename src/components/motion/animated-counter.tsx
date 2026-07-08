"use client"

import { useEffect, useRef, useState } from "react"

interface AnimatedCounterProps {
  /** Final value to count up to. */
  value: number
  /** Rendered after the number, e.g. "+" or "%". */
  suffix?: string
  /** Duration of the count in ms. */
  duration?: number
  className?: string
}

/**
 * Counts from 0 to `value` with ease-out once scrolled into view.
 * requestAnimationFrame-driven — no library, respects reduced motion by
 * jumping straight to the final value.
 */
export function AnimatedCounter({
  value,
  suffix = "",
  duration = 1400,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced || value === 0) {
      setDisplay(value)
      return
    }

    let raf = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration)
          const eased = 1 - Math.pow(1 - t, 3) // ease-out cubic
          setDisplay(Math.round(eased * value))
          if (t < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value, duration])

  return (
    <span ref={ref} className={className}>
      {display.toLocaleString("en-IN")}
      {suffix}
    </span>
  )
}
