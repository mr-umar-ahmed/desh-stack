import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/product-card"
import { Search } from "lucide-react"

function searchProducts(query: string) {
  return prisma.product.findMany({
    where: {
      status: "APPROVED",
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { category: { name: { contains: query, mode: "insensitive" } } },
      ],
    },
    include: {
      category: true,
      reviews: { select: { overallRating: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = q || ""

  let products: Awaited<ReturnType<typeof searchProducts>> = []
  try {
    products = await searchProducts(query)
  } catch (error) {
    console.error("Database error in search page:", error)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 border-b border-indigo/10 pb-6">
        <h1 className="font-heading text-3xl font-bold text-ink flex items-center gap-3">
          <Search className="w-8 h-8 text-indigo" />
          Search Results for &quot;{query}&quot;
        </h1>
        <p className="text-ink/60 mt-2 text-lg">Found {products.length} products</p>
      </div>

      {products.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-indigo/10 text-center shadow-sm max-w-xl mx-auto">
          <Search className="w-12 h-12 text-ink/20 mx-auto mb-4" />
          <h3 className="font-heading text-xl font-bold text-ink mb-2">No results found</h3>
          <p className="text-ink/60 mb-6">We couldn&apos;t find any software matching &quot;{query}&quot;.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => {
            const reviewCount = product.reviews.length
            const averageRating = reviewCount > 0 
              ? product.reviews.reduce((acc, rev) => acc + rev.overallRating, 0) / reviewCount
              : 0

            return (
              <ProductCard
                key={product.id}
                id={product.id}
                slug={product.slug}
                name={product.name}
                logoUrl={product.logoUrl}
                description={product.description || ""}
                pricingText={product.pricingText}
                reviewCount={reviewCount}
                averageRating={averageRating}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
