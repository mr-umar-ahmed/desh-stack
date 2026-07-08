import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/product-card"
import { MarketQuadrant } from "@/components/market-quadrant"
import { AdBanner } from "@/components/ads/AdBanner"
import { Star, Search, ShieldCheck, TrendingUp, Users, Package, ArrowRight } from "lucide-react"

export default async function Home() {
  const categories = await prisma.category.findMany({
    take: 6,
    orderBy: { name: "asc" },
  })

  const products = await prisma.product.findMany({
    where: { status: "APPROVED" },
    take: 8,
    include: {
      reviews: { select: { overallRating: true } },
      score: true,
    },
  })

  const topProducts = products
    .map((product) => {
      const reviewCount = product.reviews.length
      const averageRating =
        reviewCount > 0
          ? product.reviews.reduce((acc, rev) => acc + rev.overallRating, 0) / reviewCount
          : 0
      return { ...product, reviewCount, averageRating }
    })
    .sort((a, b) => b.averageRating - a.averageRating)

  const quadrantProducts = products
    .filter((p) => p.score)
    .map((p) => {
      const vision = Math.min(100, Math.max(0, (p.score!.visionScore / 5) * 100))
      const execution = Math.min(100, Math.max(0, (p.score!.executionScore / 5) * 100))
      
      let quadrant: "Leaders" | "Challengers" | "Visionaries" | "Niche Players" = "Niche Players"
      if (vision >= 50 && execution >= 50) quadrant = "Leaders"
      else if (vision < 50 && execution >= 50) quadrant = "Challengers"
      else if (vision >= 50 && execution < 50) quadrant = "Visionaries"

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        visionScore: vision,
        executionScore: execution,
        quadrant,
      }
    })

  // Stats
  const totalProducts = await prisma.product.count({ where: { status: "APPROVED" } })
  const totalReviews = await prisma.review.count({ where: { status: "PUBLISHED" } })
  const totalCategories = await prisma.category.count()

  return (
    <div className="flex flex-col pb-0">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-indigo text-paper py-24 md:py-32 px-4 md:px-6">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-saffron/10 blur-3xl animate-float" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-teal/10 blur-3xl animate-float" style={{ animationDelay: "3s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo/50 blur-3xl" />
        </div>

        <div className="container mx-auto max-w-5xl text-center flex flex-col items-center gap-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 text-paper/80 text-xs font-semibold px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-sm animate-fade-in">
            <Star className="w-3 h-3 fill-saffron text-saffron" />
            Trusted by Indian enterprises
          </div>

          <h1 className="font-heading text-5xl md:text-7xl font-black tracking-tight leading-[1.1] animate-slide-up">
            Discover Software{" "}
            <br />
            <span className="gradient-text" style={{ WebkitTextFillColor: "transparent", backgroundImage: "linear-gradient(135deg, #e8772e, #f5a623)" }}>
              Built for Bharat
            </span>
          </h1>

          <p className="text-lg md:text-xl text-paper/70 max-w-2xl font-medium animate-slide-up stagger-2 leading-relaxed">
            The trusted B2B review platform for Indian enterprises. Find GST-ready,
            DPDP-compliant tools with authentic peer reviews.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-2 animate-slide-up stagger-3">
            <Link
              href="/categories"
              className="bg-saffron text-indigo font-bold px-8 py-4 rounded-xl hover:bg-saffron/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Browse Categories
            </Link>
            <Link
              href="/for-vendors"
              className="bg-white/10 text-paper font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-all border border-white/20 backdrop-blur-sm hover:-translate-y-1 transform duration-200"
            >
              Claim Your Profile
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="bg-white border-b border-indigo/10">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto">
            <div className="text-center animate-count-up">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Package className="w-5 h-5 text-indigo" />
                <span className="font-heading text-3xl md:text-4xl font-black text-indigo">{totalProducts}+</span>
              </div>
              <p className="text-xs md:text-sm text-ink/50 font-medium">Products Listed</p>
            </div>
            <div className="text-center animate-count-up stagger-1">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Star className="w-5 h-5 text-saffron" />
                <span className="font-heading text-3xl md:text-4xl font-black text-saffron">{totalReviews}+</span>
              </div>
              <p className="text-xs md:text-sm text-ink/50 font-medium">Verified Reviews</p>
            </div>
            <div className="text-center animate-count-up stagger-2">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Users className="w-5 h-5 text-teal" />
                <span className="font-heading text-3xl md:text-4xl font-black text-teal">{totalCategories}</span>
              </div>
              <p className="text-xs md:text-sm text-ink/50 font-medium">Categories</p>
            </div>
          </div>
        </div>
      </section>

      {/* Market Quadrant */}
      {quadrantProducts.length > 0 && (
        <section className="container mx-auto px-4 md:px-6 py-16">
          <MarketQuadrant products={quadrantProducts} />
        </section>
      )}

      {/* Featured Categories */}
      <section className="container mx-auto px-4 md:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-ink">Popular Categories</h2>
            <p className="text-ink/50 text-sm mt-1">Browse by industry and function</p>
          </div>
          <Link href="/categories" className="text-indigo font-medium hover:underline text-sm flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, i) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className={`flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-white border border-indigo/10 shadow-sm hover:border-indigo hover:shadow-md transition-all text-center group animate-scale-in stagger-${i + 1}`}
            >
              <div className="w-12 h-12 rounded-xl bg-indigo/5 flex items-center justify-center text-indigo group-hover:bg-indigo group-hover:text-paper transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <span className="font-bold text-lg">{category.name.charAt(0)}</span>
              </div>
              <span className="font-semibold text-sm text-ink">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Sponsored Ad Banner */}
      <AdBanner />

      {/* Trending Products */}
      <section className="container mx-auto px-4 md:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-ink">Trending Products</h2>
            <p className="text-ink/50 text-sm mt-1">Highest rated software this quarter</p>
          </div>
          <Link href="/products" className="text-indigo font-medium hover:underline text-sm flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topProducts.map((product) => (
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
      </section>

      {/* How It Works */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-ink">How DeshStack Works</h2>
            <p className="text-ink/60 mt-2">Three simple steps to find the right software</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Search, title: "Discover", desc: "Browse categories or search for software built specifically for the Indian market.", color: "bg-indigo/5 text-indigo" },
              { icon: Star, title: "Compare", desc: "Read verified peer reviews, check dimension scores, and view the Market Quadrant.", color: "bg-saffron/5 text-saffron" },
              { icon: ShieldCheck, title: "Decide", desc: "Make informed decisions backed by authentic reviews from real Indian businesses.", color: "bg-teal/5 text-teal" },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-4 p-6 rounded-2xl hover:bg-paper transition-colors group">
                <div className="relative">
                  <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-7 h-7" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-indigo text-paper text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-heading text-lg font-bold text-ink">{step.title}</h3>
                <p className="text-sm text-ink/60 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-indigo text-paper py-16">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <TrendingUp className="w-10 h-10 text-saffron mx-auto mb-4" />
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Are You a Software Vendor?</h2>
          <p className="text-paper/70 text-lg mb-8">
            List your product on DeshStack and reach thousands of Indian businesses looking for local, compliant solutions.
          </p>
          <Link
            href="/for-vendors"
            className="inline-flex items-center gap-2 bg-saffron text-indigo font-bold px-8 py-4 rounded-xl hover:bg-saffron/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200"
          >
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
