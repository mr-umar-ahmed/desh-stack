interface MarqueeProps {
  items: string[]
  className?: string
}

/**
 * Infinite horizontal marquee. Pure CSS animation (see --animate-marquee):
 * content is duplicated once and translated -50%, so the loop is seamless.
 * Server component — ships zero JS.
 */
export function Marquee({ items, className = "" }: MarqueeProps) {
  const row = (ariaHidden: boolean) => (
    <div
      aria-hidden={ariaHidden || undefined}
      className="flex shrink-0 items-center gap-3 pr-3"
    >
      {items.map((item, i) => (
        <span
          key={i}
          className="whitespace-nowrap rounded-full border border-indigo/10 bg-white/70 px-4 py-1.5 text-xs font-semibold tracking-wide text-ink/60"
        >
          {item}
        </span>
      ))}
    </div>
  )

  return (
    <div className={`marquee-mask overflow-hidden ${className}`}>
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
