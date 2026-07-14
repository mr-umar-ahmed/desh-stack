import Link from "next/link"
import { Megaphone, Star } from "lucide-react"
import type { SponsoredProduct } from "./ad-data"

interface SponsoredProductCardProps {
  ad: SponsoredProduct
}

export function SponsoredProductCard({ ad }: SponsoredProductCardProps) {
  return (
    <Link
      href={ad.ctaUrl}
      className="group relative flex flex-col rounded-2xl border border-saffron/20 bg-card p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden sponsored-glow"
    >
      {/* Sponsored badge */}
      <div className="absolute top-3 right-3 flex items-center gap-1 bg-gradient-to-r from-saffron to-saffron/80 text-paper px-2.5 py-1 rounded-full shadow-sm z-10">
        <Megaphone className="w-2.5 h-2.5" />
        <span className="text-[9px] font-bold uppercase tracking-wider">
          Sponsored
        </span>
      </div>

      {/* Logo + Name */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo to-indigo/80 flex items-center justify-center text-paper text-lg font-bold shrink-0 shadow-md group-hover:scale-105 transition-transform">
          {ad.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <h3 className="font-heading text-base font-bold text-ink group-hover:text-indigo transition-colors">
            {ad.name}
          </h3>
          <span className="text-xs text-ink/40 font-medium">{ad.category}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-ink/60 leading-relaxed mb-4 line-clamp-2 flex-1">
        {ad.tagline}
      </p>

      {/* Bottom row */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-indigo/5">
        {ad.highlight && (
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-saffron text-saffron" />
            <span className="text-[10px] font-semibold text-ink/50">
              {ad.highlight}
            </span>
          </div>
        )}
        <span className="text-xs font-semibold text-indigo group-hover:text-saffron transition-colors ml-auto">
          {ad.ctaText} →
        </span>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-saffron via-teal to-indigo opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Link>
  )
}
