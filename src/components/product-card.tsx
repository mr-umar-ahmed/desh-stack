/* eslint-disable @next/next/no-img-element */
import Link from "next/link"
import { Star, ShieldCheck, ArrowRight, ChevronUp } from "lucide-react"

interface ProductCardProps {
  id: string
  name: string
  slug: string
  logoUrl?: string | null
  description?: string | null
  pricingText?: string | null
  averageRating: number
  reviewCount: number
  /** Community upvotes (Product Hunt-style); chip hidden when undefined. */
  upvoteCount?: number
}

export function ProductCard({
  name,
  slug,
  logoUrl,
  description,
  pricingText,
  averageRating,
  reviewCount,
  upvoteCount,
}: ProductCardProps) {
  return (
    <Link
      href={`/products/${slug}`}
      className="group card-lift shine relative flex h-full flex-col justify-between rounded-2xl bg-card p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
    >
      <div className="absolute inset-0 rounded-2xl border border-indigo/10 transition-colors group-hover:border-indigo/30" />
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo/[0.02] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-paper to-indigo/5 border border-indigo/10 text-2xl font-black text-indigo shrink-0 overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-300">
            {logoUrl ? (
              <img src={logoUrl} alt={`${name} logo`} className="h-full w-full object-cover" />
            ) : (
              name.charAt(0)
            )}
          </div>
          {pricingText && (
            <span className="inline-flex items-center rounded-full bg-teal/10 px-3 py-1 text-xs font-bold text-teal shadow-sm border border-teal/20">
              {pricingText}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1.5 mb-2">
          <h3 className="font-heading text-xl font-bold text-ink group-hover:text-indigo transition-colors line-clamp-1">
            {name}
          </h3>
          <ShieldCheck className="w-4 h-4 text-indigo shrink-0" />
        </div>
        
        <p className="text-sm text-ink/65 line-clamp-2 mb-6 leading-relaxed">
          {description || "No description provided."}
        </p>
      </div>
      
      <div className="relative z-10 flex items-center justify-between border-t border-indigo/5 pt-5 mt-auto">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-saffron/10 px-2.5 py-1 rounded-lg border border-saffron/20">
            <Star className="h-4 w-4 fill-saffron text-saffron" />
            <span className="text-sm font-bold text-ink">{averageRating > 0 ? averageRating.toFixed(1) : "New"}</span>
            <span className="text-xs font-medium text-ink/50 ml-0.5">
              {reviewCount > 0 ? `(${reviewCount})` : ""}
            </span>
          </div>
          {upvoteCount !== undefined && (
            <div className="flex items-center gap-0.5 bg-indigo/5 px-2 py-1 rounded-lg border border-indigo/10">
              <ChevronUp className="h-3.5 w-3.5 text-indigo" strokeWidth={3} />
              <span className="text-xs font-bold text-ink">{upvoteCount}</span>
            </div>
          )}
        </div>
        <span className="text-sm font-bold text-indigo flex items-center gap-1 group-hover:gap-2 transition-all">
          View <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  )
}
