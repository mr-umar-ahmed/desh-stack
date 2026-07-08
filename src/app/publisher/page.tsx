import { requireAuth } from "@/lib/rbac"
/* eslint-disable */
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ExternalLink, Star, Package, MessageSquare, TrendingUp } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"

export default async function PublisherDashboard() {
  const user = await requireAuth()

  const myProducts = await prisma.product.findMany({
    where: { publisherId: user.id },
    include: {
      reviews: { select: { overallRating: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const totalReviews = myProducts.reduce((sum, p) => sum + p.reviews.length, 0)
  const approvedCount = myProducts.filter((p) => p.status === "APPROVED").length
  const avgRating =
    totalReviews > 0
      ? myProducts.reduce(
          (sum, p) => sum + p.reviews.reduce((s, r) => s + r.overallRating, 0),
          0
        ) / totalReviews
      : 0

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-ink mb-1">My Products</h1>
          <p className="text-ink/50">Manage your software listings and view reviews.</p>
        </div>
        <Link
          href="/publisher/products/new"
          className="bg-saffron text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-saffron/90 transition-all shadow-sm text-center hover:shadow-md hover:-translate-y-0.5 transform duration-200 flex items-center gap-2 w-fit"
        >
          <Package className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Products", value: myProducts.length, icon: Package, color: "text-indigo bg-indigo/5" },
          { label: "Total Reviews", value: totalReviews, icon: MessageSquare, color: "text-saffron bg-saffron/5" },
          { label: "Avg Rating", value: avgRating.toFixed(1), icon: Star, color: "text-teal bg-teal/5" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-indigo/10 shadow-sm text-center">
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-2`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-ink font-heading">{stat.value}</p>
            <p className="text-xs text-ink/50">{stat.label}</p>
          </div>
        ))}
      </div>

      {myProducts.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No Products Yet"
          description="You haven't listed any products yet. Add your first software product to get started!"
          actionLabel="Create Your First Listing"
          actionHref="/publisher/products/new"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myProducts.map((product) => {
            const reviewCount = product.reviews.length
            const averageRating =
              reviewCount > 0
                ? product.reviews.reduce((acc, rev) => acc + rev.overallRating, 0) / reviewCount
                : 0

            return (
              <div
                key={product.id}
                className="bg-white p-6 rounded-2xl border border-indigo/10 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-xl text-ink">{product.name}</h3>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        product.status === "APPROVED"
                          ? "bg-teal/10 text-teal"
                          : product.status === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : "bg-indigo/10 text-indigo"
                      }`}
                    >
                      {product.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-saffron text-saffron" />
                      <span className="font-bold text-ink">{averageRating.toFixed(1)}</span>
                    </div>
                    <span className="text-sm text-ink/60">{reviewCount} reviews</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-indigo/10 flex items-center justify-between">
                  {product.status === "APPROVED" ? (
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-indigo text-sm font-medium hover:underline flex items-center gap-1"
                    >
                      View Public Page <ExternalLink className="w-3 h-3" />
                    </Link>
                  ) : (
                    <span className="text-sm text-ink/40">Pending Approval</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
