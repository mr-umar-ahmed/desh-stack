/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/product-card"
import { MarketQuadrant } from "@/components/market-quadrant"
import { AdBanner } from "@/components/ads/AdBanner"
import { ScrollReveal } from "@/components/motion/scroll-reveal"
import { AnimatedCounter } from "@/components/motion/animated-counter"
import { Marquee } from "@/components/motion/marquee"
import {
  Star,
  Search,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Sparkles,
  IndianRupee,
  Building2,
} from "lucide-react"

const TRUST_ITEMS = [
  "🇮🇳 Made in India",
  "GST-Ready Invoicing",
  "DPDP Act Compliant",
  "UPI & Razorpay Payments",
  "Hindi + English Support",
  "Verified Peer Reviews",
  "No Pay-to-Play Rankings",
  "Data Hosted in India",
]

export default async function Home() {
  let categories: any[] = []
  let products: any[] = []
  let recentProducts: any[] = []
  let totalProducts = 0
  let totalReviews = 0
  let totalCategories = 0

  try {
    ;[categories, products, recentProducts, totalProducts, totalReviews, totalCategories] =
      await Promise.all([
        prisma.category.findMany({ take: 6, orderBy: { name: "asc" } }),
        prisma.product.findMany({
          where: { status: "APPROVED" },
          take: 8,
          include: {
            reviews: { select: { overallRating: true } },
            score: true,
            _count: { select: { upvotes: true } },
          },
        }),
        prisma.product.findMany({
          where: { status: "APPROVED" },
          take: 3,
          orderBy: { createdAt: "desc" },
          include: {
            reviews: { select: { overallRating: true } },
            _count: { select: { upvotes: true } },
          },
        }),
        prisma.product.count({ where: { status: "APPROVED" } }),
        prisma.review.count({ where: { status: "PUBLISHED" } }),
        prisma.category.count(),
      ])
  } catch (error) {
    console.error("Database connection error on homepage (check DATABASE_URL):", error)
  }

  const withRatings = (list: any[]) =>
    list.map((product) => {
      const reviewCount = product.reviews.length
      const averageRating =
        reviewCount > 0
          ? product.reviews.reduce((acc: number, rev: any) => acc + rev.overallRating, 0) /
            reviewCount
          : 0
      return { ...product, reviewCount, averageRating }
    })

  // Product Hunt-style ranking: community upvotes first, rating as tiebreak.
  const topProducts = withRatings(products).sort(
    (a, b) =>
      (b._count?.upvotes ?? 0) - (a._count?.upvotes ?? 0) ||
      b.averageRating - a.averageRating,
  )
  const latestProducts = withRatings(recentProducts)
  const hasStats = totalProducts > 0 || totalReviews > 0

  const quadrantProducts = products
    .filter((p) => p.score)
    .map((p) => {
      const vision = Math.min(100, Math.max(0, (p.score.visionScore / 5) * 100))
      const execution = Math.min(100, Math.max(0, (p.score.executionScore / 5) * 100))
      let quadrant: "Leaders" | "Challengers" | "Visionaries" | "Niche Players" = "Niche Players"
      if (vision >= 50 && execution >= 50) quadrant = "Leaders"
      else if (vision < 50 && execution >= 50) quadrant = "Challengers"
      else if (vision >= 50 && execution < 50) quadrant = "Visionaries"
      return { id: p.id, name: p.name, slug: p.slug, visionScore: vision, executionScore: execution, quadrant }
    })

  return (
    <div className="flex flex-col">
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="aurora grain relative overflow-hidden bg-indigo px-4 py-24 text-paper md:px-6 md:py-32">
        <div className="bg-dots-light pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float absolute -top-40 -right-40 h-96 w-96 rounded-full bg-saffron/15 blur-3xl" />
          <div
            className="animate-float absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-teal/15 blur-3xl"
            style={{ animationDelay: "3s" }}
          />
        </div>

        <div className="relative z-10 container mx-auto flex max-w-5xl flex-col items-center gap-8 text-center">
          <div className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold text-paper/85 backdrop-blur-sm">
            <Sparkles className="h-3 w-3 text-saffron" />
            India&apos;s independent B2B software review platform
          </div>

          <h1 className="animate-slide-up font-heading text-5xl font-black leading-[1.08] tracking-tight md:text-7xl">
            Discover Software
            <br />
            <span className="text-gradient-saffron">Built for Bharat</span>
          </h1>

          <p className="animate-slide-up stagger-2 max-w-2xl text-lg font-medium leading-relaxed text-paper/70 md:text-xl">
            Find GST-ready, DPDP-compliant tools trusted by Indian enterprises —
            ranked by verified peer reviews, never by who pays more.
          </p>

          <div className="animate-slide-up stagger-3 mt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/categories"
              className="shine flex transform items-center gap-2 rounded-xl bg-saffron px-8 py-4 font-bold text-indigo shadow-lg transition-all duration-200 hover:-translate-y-1 hover:bg-saffron/90 hover:shadow-xl"
            >
              <Search className="h-4 w-4" />
              Browse Categories
            </Link>
            <Link
              href="/for-vendors"
              className="transform rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-semibold text-paper backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:bg-white/20"
            >
              For Vendors
            </Link>
          </div>

          {hasStats && (
            <div className="animate-slide-up stagger-4 mt-12 flex w-full items-center justify-center gap-8 border-t border-white/10 pt-8 opacity-90">
              <div className="flex flex-col items-center">
                <AnimatedCounter
                  value={totalProducts}
                  suffix="+"
                  className="font-heading text-3xl font-black text-saffron"
                />
                <span className="text-xs font-semibold uppercase tracking-wider text-paper/60">
                  Products
                </span>
              </div>
              <div className="h-12 w-px bg-white/10" />
              <div className="flex flex-col items-center">
                <AnimatedCounter
                  value={totalReviews}
                  suffix="+"
                  className="font-heading text-3xl font-black text-teal"
                />
                <span className="text-xs font-semibold uppercase tracking-wider text-paper/60">
                  Verified Reviews
                </span>
              </div>
              <div className="hidden h-12 w-px bg-white/10 sm:block" />
              <div className="hidden flex-col items-center sm:flex">
                <AnimatedCounter
                  value={totalCategories}
                  className="font-heading text-3xl font-black text-paper"
                />
                <span className="text-xs font-semibold uppercase tracking-wider text-paper/60">
                  Categories
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── Trust marquee ────────────────────────────────────── */}
      <section className="border-b border-indigo/10 bg-paper-2/60 py-5">
        <Marquee items={TRUST_ITEMS} />
      </section>

      {/* ─── Market Quadrant ──────────────────────────────────── */}
      {quadrantProducts.length > 0 && (
        <section className="border-b border-indigo/10 bg-white py-16">
          <div className="container mx-auto px-4 md:px-6">
            <ScrollReveal>
              <div className="mb-10 text-center">
                <h2 className="font-heading text-2xl font-bold text-ink md:text-3xl">
                  Market Quadrant
                </h2>
                <p className="mx-auto mt-2 max-w-2xl text-ink/60">
                  Visualize the market landscape based on vision and execution scores from real
                  customer feedback.
                </p>
              </div>
              <MarketQuadrant products={quadrantProducts} />
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ─── Categories ───────────────────────────────────────── */}
      <section className="container mx-auto px-4 py-16 md:px-6">
        <ScrollReveal>
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="font-heading text-2xl font-bold text-ink md:text-3xl">
                Popular Categories
              </h2>
              <p className="mt-1 text-sm text-ink/50">Browse by industry and function</p>
            </div>
            <Link
              href="/categories"
              className="flex items-center gap-1 text-sm font-medium text-indigo hover:underline"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </ScrollReveal>

        {categories.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((category, i) => (
              <ScrollReveal key={category.id} delay={i * 60}>
                <Link
                  href={`/categories/${category.slug}`}
                  className="card-lift group flex flex-col items-center justify-center gap-3 rounded-xl border border-indigo/10 bg-white p-6 text-center shadow-sm hover:border-indigo/40"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo/5 text-indigo transition-all duration-300 group-hover:rotate-3 group-hover:scale-110 group-hover:bg-indigo group-hover:text-paper">
                    <span className="text-lg font-bold">{category.name.charAt(0)}</span>
                  </div>
                  <span className="text-sm font-semibold text-ink">{category.name}</span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <EmptyBand
            icon={Search}
            title="Catalog launching soon"
            body="We're onboarding India's best B2B tools right now. Vendors — claim your spot early."
            ctaHref="/for-vendors"
            ctaLabel="List your product"
          />
        )}
      </section>

      {/* ─── Sponsored banner ─────────────────────────────────── */}
      <AdBanner />

      {/* ─── Trending products ────────────────────────────────── */}
      <section className="container mx-auto px-4 py-16 md:px-6">
        <ScrollReveal>
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="font-heading text-2xl font-bold text-ink md:text-3xl">
                Trending Products
              </h2>
              <p className="mt-1 text-sm text-ink/50">Most upvoted by the community</p>
            </div>
            <Link
              href="/products"
              className="flex items-center gap-1 text-sm font-medium text-indigo hover:underline"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </ScrollReveal>

        {topProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {topProducts.slice(0, 4).map((product, i) => (
              <ScrollReveal key={product.id} delay={i * 80}>
                <ProductCard
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  logoUrl={product.logoUrl}
                  description={product.description}
                  pricingText={product.pricingText}
                  averageRating={product.averageRating}
                  reviewCount={product.reviewCount}
                  upvoteCount={product._count?.upvotes ?? 0}
                />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <EmptyBand
            icon={TrendingUp}
            title="Products are on their way"
            body="Verified reviews and rankings will appear here as vendors join the platform."
            ctaHref="/for-vendors"
            ctaLabel="Become a founding vendor"
          />
        )}
      </section>

      {/* ─── Recently added ───────────────────────────────────── */}
      {latestProducts.length > 0 && (
        <section className="border-y border-indigo/10 bg-indigo/5 py-16">
          <div className="container mx-auto px-4 md:px-6">
            <ScrollReveal>
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-ink md:text-3xl">
                    Recently Added
                  </h2>
                  <p className="mt-1 text-sm text-ink/50">Discover new B2B tools on DeshStack</p>
                </div>
                <Link
                  href="/products?sort=newest"
                  className="flex items-center gap-1 text-sm font-medium text-indigo hover:underline"
                >
                  View newest <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {latestProducts.map((product, i) => (
                <ScrollReveal key={product.id} delay={i * 80}>
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
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── How it works ─────────────────────────────────────── */}
      <section className="bg-dots relative bg-white py-20">
        <div className="container mx-auto max-w-5xl px-4 md:px-6">
          <ScrollReveal>
            <div className="mb-12 text-center">
              <h2 className="font-heading text-2xl font-bold text-ink md:text-3xl">
                How DeshStack Works
              </h2>
              <p className="mt-2 text-ink/60">Three simple steps to find the right software</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: Search,
                title: "Discover",
                desc: "Browse categories or search for software built specifically for the Indian market.",
                color: "bg-indigo/5 text-indigo",
              },
              {
                icon: Star,
                title: "Compare",
                desc: "Read verified peer reviews, check dimension scores, and view the Market Quadrant.",
                color: "bg-saffron/5 text-saffron",
              },
              {
                icon: ShieldCheck,
                title: "Decide",
                desc: "Make informed decisions backed by authentic reviews from real Indian businesses.",
                color: "bg-teal/5 text-teal",
              },
            ].map((step, i) => (
              <ScrollReveal key={step.title} delay={i * 120}>
                <div className="group flex flex-col items-center gap-4 rounded-2xl bg-white/80 p-6 text-center backdrop-blur-sm transition-colors hover:bg-paper">
                  <div className="relative">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-2xl ${step.color} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <step.icon className="h-7 w-7" />
                    </div>
                    <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-indigo text-xs font-bold text-paper">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-ink">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-ink/60">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Why India band ───────────────────────────────────── */}
      <section className="border-y border-indigo/10 bg-paper-2/50 py-14">
        <div className="container mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 sm:grid-cols-3 md:px-6">
          {[
            {
              icon: IndianRupee,
              title: "Priced for India",
              desc: "Transparent INR pricing, GST invoices, and UPI-first payments.",
            },
            {
              icon: ShieldCheck,
              title: "Compliance first",
              desc: "Every listing flags DPDP readiness and Indian data residency.",
            },
            {
              icon: Building2,
              title: "Local support",
              desc: "Vendors with real Hindi + English support for Indian teams.",
            },
          ].map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 100}>
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-teal shadow-sm">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-ink">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink/60">{item.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ─── Vendor CTA ───────────────────────────────────────── */}
      <section className="aurora grain relative overflow-hidden bg-indigo py-16 text-paper">
        <div className="relative z-10 container mx-auto max-w-3xl px-4 text-center md:px-6">
          <ScrollReveal>
            <TrendingUp className="mx-auto mb-4 h-10 w-10 text-saffron" />
            <h2 className="font-heading mb-4 text-3xl font-bold md:text-4xl">
              Are You a Software Vendor?
            </h2>
            <p className="mb-8 text-lg text-paper/70">
              List your product on DeshStack and reach thousands of Indian businesses looking for
              local, compliant solutions.
            </p>
            <Link
              href="/for-vendors"
              className="shine inline-flex transform items-center gap-2 rounded-xl bg-saffron px-8 py-4 font-bold text-indigo shadow-lg transition-all duration-200 hover:-translate-y-1 hover:bg-saffron/90 hover:shadow-xl"
            >
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}

/** Friendly filler when a data section has nothing to show yet. */
function EmptyBand({
  icon: Icon,
  title,
  body,
  ctaHref,
  ctaLabel,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  body: string
  ctaHref: string
  ctaLabel: string
}) {
  return (
    <div className="bg-dots rounded-2xl border border-dashed border-indigo/20 bg-white/60 px-6 py-14 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo/5 text-indigo">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-heading text-lg font-bold text-ink">{title}</h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-ink/60">{body}</p>
      <Link
        href={ctaHref}
        className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-indigo px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-indigo/90"
      >
        {ctaLabel} <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}
