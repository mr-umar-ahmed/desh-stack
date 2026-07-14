/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from "react"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { AdBanner } from "@/components/ads/AdBanner"
import { SponsoredProductCard } from "@/components/ads/SponsoredProductCard"
import { InFeedAd } from "@/components/ads/InFeedAd"
import { sponsoredProducts } from "@/components/ads/ad-data"
import Link from "next/link"

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function CategoryDetails({ params }: CategoryPageProps) {
  const resolvedParams = await params
  const { slug } = resolvedParams

  let category: any = null

  try {
    category = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          include: {
            reviews: {
              select: { overallRating: true }
            }
          }
        }
      }
    })
  } catch (error) {
    console.error("Database error in category page:", error)
  }

  if (!category) {
    notFound()
  }

  const products = category.products.map((product: any) => {
    const reviewCount = product.reviews.length
    const averageRating = reviewCount > 0 
      ? product.reviews.reduce((acc: any, rev: any) => acc + rev.overallRating, 0) / reviewCount
      : 0

    return {
      ...product,
      reviewCount,
      averageRating
    }
  }).sort((a: any, b: any) => b.averageRating - a.averageRating)

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="mb-8">
        <Link href="/categories" className="text-sm font-medium text-indigo hover:underline mb-4 inline-block">
          &larr; All Categories
        </Link>
        <h1 className="font-heading text-4xl font-bold text-ink mb-4">{category.name}</h1>
        {category.description && (
          <p className="text-ink/70 text-lg max-w-3xl">
            {category.description}
          </p>
        )}
      </div>

      {/* Sponsored Ad Banner */}
      <div className="mb-6">
        <AdBanner />
      </div>

      {products.length === 0 ? (
        <div className="py-12 text-center bg-card rounded-xl border border-indigo/10">
          <p className="text-ink/60 mb-4">No products found in this category yet.</p>
          <Link href="/for-vendors" className="text-indigo font-medium hover:underline">
            Are you a vendor? List your product.
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: any, index: number) => (
            <Fragment key={product.id}>
              {/* Insert sponsored card at position 3 */}
              {index === 2 && (
                <SponsoredProductCard ad={sponsoredProducts[0]} />
              )}
              {/* Insert Google Ad at position 6 */}
              {index === 5 && <InFeedAd />}
              <ProductCard
                id={product.id}
                name={product.name}
                slug={product.slug}
                logoUrl={product.logoUrl}
                description={product.description}
                pricingText={product.pricingText}
                averageRating={product.averageRating}
                reviewCount={product.reviewCount}
              />
            </Fragment>
          ))}
        </div>
      )}
    </div>
  )
}
