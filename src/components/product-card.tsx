/* eslint-disable @next/next/no-img-element */
import Link from "next/link"
import { Star } from "lucide-react"

interface ProductCardProps {
  id: string
  name: string
  slug: string
  logoUrl?: string | null
  description?: string | null
  pricingText?: string | null
  averageRating: number
  reviewCount: number
}

export function ProductCard({
  name,
  slug,
  logoUrl,
  description,
  pricingText,
  averageRating,
  reviewCount,
}: ProductCardProps) {
  return (
    <Link href={`/products/${slug}`} className="group flex flex-col justify-between rounded-xl border border-indigo/10 bg-white p-6 shadow-sm transition-all hover:border-indigo/30 hover:shadow-md">
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-paper border border-indigo/5 text-xl font-bold text-indigo shrink-0 overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt={`${name} logo`} className="h-full w-full object-cover" />
            ) : (
              name.charAt(0)
            )}
          </div>
          {pricingText && (
            <span className="inline-flex items-center rounded-full bg-indigo/5 px-2.5 py-0.5 text-xs font-semibold text-indigo">
              {pricingText}
            </span>
          )}
        </div>
        <h3 className="font-heading text-lg font-bold text-ink mb-2 group-hover:text-indigo transition-colors">
          {name}
        </h3>
        <p className="text-sm text-ink/70 line-clamp-2 mb-4">
          {description}
        </p>
      </div>
      
      <div className="flex items-center justify-between border-t border-indigo/5 pt-4 mt-auto">
        <div className="flex items-center gap-1.5">
          <Star className="h-4 w-4 fill-saffron text-saffron" />
          <span className="text-sm font-bold text-ink">{averageRating.toFixed(1)}</span>
          <span className="text-xs text-ink/50">({reviewCount})</span>
        </div>
        <span className="text-sm font-medium text-indigo">View &rarr;</span>
      </div>
    </Link>
  )
}
