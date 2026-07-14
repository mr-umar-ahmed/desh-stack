import { requireAuth } from "@/lib/rbac"
/* eslint-disable */
import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/product-card"
import Link from "next/link"
import { Star, Bookmark, MessageSquare, TrendingUp } from "lucide-react"

import { redirect } from "next/navigation"
import { isNextControlFlowError } from "@/lib/errors"
import { ServiceUnavailable } from "@/components/ui/service-unavailable"

export default async function DashboardPage() {
  try {
    return await DashboardContent()
  } catch (error) {
    // Let redirect()/notFound() propagate; only swallow real (e.g. DB) errors.
    if (isNextControlFlowError(error)) throw error
    console.error("Dashboard failed to load (check DATABASE_URL):", error)
    return (
      <ServiceUnavailable
        title="We couldn't load your dashboard"
        description="We're having trouble reaching our database right now. Please try again in a moment."
      />
    )
  }
}

async function DashboardContent() {
  const user = await requireAuth()

  if (user.role === "ADMIN") {
    redirect("/admin")
  }

  if (user.role === "PUBLISHER") {
    redirect("/publisher")
  }

  const reviews = await prisma.review.findMany({
    where: { userId: user.id },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  })

  const savedProductsRecords = await prisma.savedProduct.findMany({
    where: { userId: user.id },
    include: {
      product: {
        include: {
          reviews: { select: { overallRating: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  const savedProducts = savedProductsRecords.map((record) => {
    const product = record.product
    const reviewCount = product.reviews.length
    const averageRating =
      reviewCount > 0
        ? product.reviews.reduce((acc, rev) => acc + rev.overallRating, 0) / reviewCount
        : 0
    return { ...product, reviewCount, averageRating }
  })

  const avgRatingGiven =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length
      : 0

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 animate-fade-in">
      <div className="mb-10">
        <h1 className="font-heading text-4xl font-bold text-ink mb-2">
          Welcome back{user.name ? `, ${user.name.split(" ")[0]}` : ""}! 👋
        </h1>
        <p className="text-ink/50">Manage your reviews and saved products.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: "Reviews Written", value: reviews.length, icon: MessageSquare, color: "text-indigo bg-indigo/5" },
          { label: "Saved Products", value: savedProducts.length, icon: Bookmark, color: "text-saffron bg-saffron/5" },
          { label: "Avg Rating Given", value: avgRatingGiven.toFixed(1), icon: Star, color: "text-teal bg-teal/5" },
        ].map((stat, i) => (
          <div key={i} className="bg-card p-5 rounded-2xl border border-indigo/10 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center shrink-0`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-ink font-heading">{stat.value}</p>
              <p className="text-xs text-ink/50">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Reviews */}
        <div className="lg:col-span-2">
          <h2 className="font-heading text-2xl font-bold text-ink mb-6 pb-3 border-b border-indigo/10 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo" />
            My Reviews
          </h2>
          {reviews.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-2xl border border-indigo/10 shadow-sm">
              <Star className="w-12 h-12 text-ink/15 mx-auto mb-4" />
              <p className="text-ink/50 mb-4">You haven&apos;t written any reviews yet.</p>
              <Link href="/categories" className="text-indigo font-medium hover:underline text-sm">
                Browse products to review →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-card p-5 rounded-2xl border border-indigo/10 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <Link
                        href={`/products/${review.product.slug}`}
                        className="font-bold text-indigo hover:underline text-lg"
                      >
                        {review.product.name}
                      </Link>
                      <p className="text-xs text-ink/40 mt-0.5">
                        {new Date(review.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3.5 w-3.5 ${
                              star <= review.overallRating
                                ? "fill-saffron text-saffron"
                                : "fill-muted text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          review.status === "PUBLISHED"
                            ? "bg-teal/10 text-teal"
                            : review.status === "REJECTED"
                            ? "bg-red-100 text-red-700"
                            : "bg-indigo/10 text-indigo"
                        }`}
                      >
                        {review.status}
                      </span>
                    </div>
                  </div>
                  {review.title && <h4 className="font-bold text-ink mb-1 text-sm">{review.title}</h4>}
                  <p className="text-ink/70 text-sm line-clamp-2">{review.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved Products */}
        <div>
          <h2 className="font-heading text-2xl font-bold text-ink mb-6 pb-3 border-b border-indigo/10 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-saffron" />
            Saved Products
          </h2>
          {savedProducts.length === 0 ? (
            <div className="text-center py-10 bg-card rounded-2xl border border-indigo/10 shadow-sm">
              <Bookmark className="w-10 h-10 text-ink/15 mx-auto mb-3" />
              <p className="text-ink/50 text-sm">No saved products.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {savedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  logoUrl={product.logoUrl}
                  description={product.description}
                  pricingText={product.pricingText}
                  averageRating={product.averageRating}
                  reviewCount={product.reviewCount}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
