"use client"

import { useEffect, useRef, type CSSProperties } from "react"

interface ScrollRevealProps {
  children: React.ReactNode
  /** Delay in ms before the reveal starts once visible (for stagger). */
  delay?: number
  className?: string
}

/**
 * Reveals its children with a fade + rise the first time they scroll into
 * view. Pure IntersectionObserver + CSS (see [data-reveal] in globals.css) —
 * no animation library, ~zero bundle cost, and respects reduced motion.
 */
export function ScrollReveal({ children, delay = 0, className }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-revealed")
          io.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      data-reveal
      className={className}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  )
}
