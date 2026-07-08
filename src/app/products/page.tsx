import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/product-card"
import { Search } from "lucide-react"

export const metadata = {
  title: "All Products | DeshStack",
  description: "Browse all Indian B2B software products on DeshStack. Find GST-ready, DPDP-compliant tools.",
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>
}) {
  const params = await searchParams
  const query = params.q || ""
  const categoryFilter = params.category || ""
  const sortBy = params.sort || "rating"

  let products: any[] = []
  let categories: any[] = []

  try {
    products = await prisma.product.findMany({
      where: {
        status: "APPROVED",
        ...(query ? { name: { contains: query, mode: "insensitive" } } : {}),
        ...(categoryFilter ? { category: { slug: categoryFilter } } : {}),
      },
      include: {
        reviews: { select: { overallRating: true } },
        category: { select: { name: true, slug: true } },
      },
      orderBy: sortBy === "newest" ? { createdAt: "desc" } : { name: "asc" },
    })
    categories = await prisma.category.findMany({ orderBy: { name: "asc" } })
  } catch (error) {
    console.error("Database error in products page:", error)
  }

  const enrichedProducts = products
    .map((product) => {
      const reviewCount = product.reviews.length
      const averageRating =
        reviewCount > 0
          ? product.reviews.reduce((acc: any, rev: any) => acc + rev.overallRating, 0) / reviewCount
          : 0
      return { ...product, reviewCount, averageRating }
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.averageRating - a.averageRating
      if (sortBy === "reviews") return b.reviewCount - a.reviewCount
      return 0
    })

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 animate-fade-in">
      <div className="mb-10">
        <h1 className="font-heading text-4xl font-bold text-ink mb-2">All Products</h1>
        <p className="text-ink/60 text-lg">Discover B2B software built for the Indian market</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 bg-white p-4 rounded-xl border border-indigo/10 shadow-sm">
        <form className="flex-1 relative" action="/products" method="GET">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
          <input
            type="text"
            name="q"
            placeholder="Search products..."
            defaultValue={query}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-indigo/10 bg-paper text-sm focus:outline-none focus:ring-2 focus:ring-indigo/20 focus:border-indigo/30 transition-all"
          />
          {categoryFilter && <input type="hidden" name="category" value={categoryFilter} />}
          {sortBy && <input type="hidden" name="sort" value={sortBy} />}
        </form>
        <div className="flex gap-3">
          <form action="/products" method="GET" className="flex gap-3">
            {query && <input type="hidden" name="q" value={query} />}
            {sortBy && <input type="hidden" name="sort" value={sortBy} />}
            <select
              name="category"
              defaultValue={categoryFilter}
              className="px-3 py-2.5 rounded-lg border border-indigo/10 bg-paper text-sm focus:outline-none focus:ring-2 focus:ring-indigo/20 text-ink/70"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
            <button type="submit" className="px-3 py-2 bg-indigo/5 hover:bg-indigo/10 text-indigo rounded-lg text-sm font-medium transition-colors">Apply</button>
          </form>
          <form action="/products" method="GET" className="flex gap-3">
            {query && <input type="hidden" name="q" value={query} />}
            {categoryFilter && <input type="hidden" name="category" value={categoryFilter} />}
            <select
              name="sort"
              defaultValue={sortBy}
              className="px-3 py-2.5 rounded-lg border border-indigo/10 bg-paper text-sm focus:outline-none focus:ring-2 focus:ring-indigo/20 text-ink/70"
            >
              <option value="rating">Top Rated</option>
              <option value="reviews">Most Reviewed</option>
              <option value="newest">Newest</option>
            </select>
            <button type="submit" className="px-3 py-2 bg-indigo/5 hover:bg-indigo/10 text-indigo rounded-lg text-sm font-medium transition-colors">Apply</button>
          </form>
        </div>
      </div>

      {/* Results */}
      {enrichedProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-indigo/10 shadow-sm">
          <Search className="w-12 h-12 text-ink/20 mx-auto mb-4" />
          <h3 className="font-heading text-xl font-bold text-ink mb-2">No products found</h3>
          <p className="text-ink/50">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-ink/50 mb-6">{enrichedProducts.length} product{enrichedProducts.length !== 1 ? "s" : ""} found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrichedProducts.map((product) => (
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
        </>
      )}
    </div>
  )
}
