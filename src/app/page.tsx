/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { MarketQuadrant } from "@/components/market-quadrant"
import { AdBanner } from "@/components/ads/AdBanner"
import { SidebarAd } from "@/components/ads/SidebarAd"
import { ScrollReveal } from "@/components/motion/scroll-reveal"
import { AnimatedCounter } from "@/components/motion/animated-counter"
import { Marquee } from "@/components/motion/marquee"
import { UpvoteButton } from "@/components/upvote-button"
import {
  Star,
  MessageCircle,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Rocket,
  Flame,
  FolderOpen,
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
  let totalProducts = 0
  let totalReviews = 0
  let upvotedIds = new Set<string>()
  let isSignedIn = false

  try {
    ;[categories, products, totalProducts, totalReviews] = await Promise.all([
      prisma.category.findMany({
        take: 8,
        orderBy: { name: "asc" },
        include: { _count: { select: { products: { where: { status: "APPROVED" } } } } },
      }),
      prisma.product.findMany({
        where: { status: "APPROVED" },
        take: 12,
        include: {
          category: { select: { name: true, slug: true } },
          reviews: { select: { overallRating: true } },
          score: true,
          _count: { select: { upvotes: true, reviews: true } },
        },
      }),
      prisma.product.count({ where: { status: "APPROVED" } }),
      prisma.review.count({ where: { status: "PUBLISHED" } }),
    ])

    // Which of these has the signed-in visitor already upvoted?
    const clerkUser = await currentUser()
    isSignedIn = !!clerkUser
    if (clerkUser && products.length > 0) {
      const dbUser = await prisma.user.findUnique({
        where: { clerkId: clerkUser.id },
        select: { id: true },
      })
      if (dbUser) {
        const votes = await prisma.upvote.findMany({
          where: { userId: dbUser.id, productId: { in: products.map((p) => p.id) } },
          select: { productId: true },
        })
        upvotedIds = new Set(votes.map((v) => v.productId))
      }
    }
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
  const feed = withRatings(products).sort(
    (a, b) =>
      (b._count?.upvotes ?? 0) - (a._count?.upvotes ?? 0) ||
      b.averageRating - a.averageRating,
  )

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

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  return (
    <div>
      {/* ─── Compact ember hero ─────────────────────────────── */}
      <section className="aurora grain relative overflow-hidden border-b border-indigo/10 bg-paper-2 px-4 py-14 md:px-6 md:py-20">
        <div className="bg-dots-light pointer-events-none absolute inset-0 opacity-30" />
        <div className="relative z-10 container mx-auto max-w-4xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-ink/80 backdrop-blur-sm">
            <Sparkles className="h-3 w-3 text-saffron" />
            India&apos;s launchpad for software built for Bharat
          </div>
          <h1 className="font-heading text-4xl font-black leading-tight tracking-tight text-ink md:text-6xl">
            Discover the best new{" "}
            <span className="text-gradient-saffron">Indian software</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ink/60">
            Upvote launches, read verified peer reviews, and find GST-ready, DPDP-compliant
            tools — ranked by the community, never by who pays more.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/for-vendors"
              className="shine flex transform items-center gap-2 rounded-xl bg-indigo px-7 py-3.5 font-bold text-paper shadow-lg transition-all duration-200 hover:-translate-y-1 hover:bg-indigo/90"
            >
              <Rocket className="h-4 w-4" />
              Submit your product
            </Link>
            <Link
              href="/products"
              className="flex items-center gap-2 rounded-xl border border-ink/15 bg-white/5 px-7 py-3.5 font-semibold text-ink transition-all hover:border-indigo/40 hover:text-indigo"
            >
              Browse all products
            </Link>
          </div>
          {(totalProducts > 0 || totalReviews > 0) && (
            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-ink/50">
              <span>
                <AnimatedCounter value={totalProducts} className="font-heading font-bold text-ink" /> products
              </span>
              <span>
                <AnimatedCounter value={totalReviews} className="font-heading font-bold text-ink" /> verified reviews
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ─── Trust marquee ──────────────────────────────────── */}
      <section className="border-b border-indigo/10 bg-paper py-4">
        <Marquee items={TRUST_ITEMS} />
      </section>

      {/* ─── PH-style feed + sidebar ────────────────────────── */}
      <section className="container mx-auto grid grid-cols-1 gap-10 px-4 py-12 md:px-6 lg:grid-cols-[1fr_330px]">
        {/* Feed */}
        <div>
          <ScrollReveal>
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-saffron">
                  <Flame className="h-3.5 w-3.5" /> Top launches
                </p>
                <h2 className="font-heading text-2xl font-bold text-ink md:text-3xl">{today}</h2>
              </div>
              <Link
                href="/products"
                className="hidden items-center gap-1 text-sm font-semibold text-indigo hover:underline sm:flex"
              >
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </ScrollReveal>

          {feed.length === 0 ? (
            <div className="bg-dots rounded-2xl border border-dashed border-indigo/20 bg-card/60 px-6 py-14 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo/10 text-indigo">
                <Rocket className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-ink">No launches yet</h3>
              <p className="mx-auto mt-1 max-w-md text-sm text-ink/60">
                Be the first maker to launch on DeshStack — it takes two minutes and it&apos;s free.
              </p>
              <Link
                href="/for-vendors"
                className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-indigo px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-indigo/90"
              >
                Submit your product <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {feed.map((product, i) => (
                <ScrollReveal key={product.id} delay={Math.min(i, 6) * 60}>
                  <div className="group card-lift relative flex items-center gap-4 rounded-2xl border border-indigo/10 bg-card p-4 transition-colors hover:border-indigo/30">
                    {/* Rank */}
                    <span className="hidden w-6 shrink-0 text-center font-heading text-sm font-bold text-ink/30 sm:block">
                      {i + 1}
                    </span>

                    {/* Logo */}
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-indigo/10 bg-paper-2 text-xl font-black text-indigo">
                      {product.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={product.logoUrl} alt={`${product.name} logo`} className="h-full w-full object-cover" />
                      ) : (
                        product.name.charAt(0)
                      )}
                    </div>

                    {/* Info — the stretched link covers the row */}
                    <div className="min-w-0 flex-1">
                      <Link href={`/products/${product.slug}`} className="focus:outline-none">
                        <span className="absolute inset-0 z-0 rounded-2xl" aria-hidden />
                        <h3 className="truncate font-heading text-base font-bold text-ink transition-colors group-hover:text-indigo">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="mt-0.5 line-clamp-1 text-sm text-ink/60">
                        {product.description || "No description provided."}
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink/45">
                        <span className="rounded-md bg-indigo/10 px-1.5 py-0.5 font-semibold text-indigo">
                          {product.category?.name ?? "Software"}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {product._count?.reviews ?? 0}
                        </span>
                        {product.averageRating > 0 && (
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-saffron text-saffron" />
                            {product.averageRating.toFixed(1)}
                          </span>
                        )}
                        {product.pricingText && <span className="truncate">{product.pricingText}</span>}
                      </div>
                    </div>

                    {/* Upvote — sits above the stretched link */}
                    <div className="relative z-10 shrink-0">
                      <UpvoteButton
                        productId={product.id}
                        slug={product.slug}
                        initialCount={product._count?.upvotes ?? 0}
                        initialUpvoted={upvotedIds.has(product.id)}
                        isSignedIn={isSignedIn}
                        size="compact"
                      />
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}

          {/* In-feed ad */}
          <div className="mt-6">
            <AdBanner />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6">
          {/* Submit CTA */}
          <div className="aurora grain relative overflow-hidden rounded-2xl border border-indigo/20 bg-paper-2 p-6">
            <div className="relative z-10">
              <Rocket className="mb-3 h-6 w-6 text-saffron" />
              <h3 className="font-heading text-lg font-bold text-ink">Built something for Bharat?</h3>
              <p className="mt-1 text-sm text-ink/60">
                Launch it to thousands of Indian businesses. Free, in under two minutes.
              </p>
              <Link
                href="/for-vendors"
                className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-indigo px-4 py-2.5 text-sm font-bold text-paper transition-colors hover:bg-indigo/90"
              >
                Submit your product <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Sponsored */}
          <SidebarAd />

          {/* Categories */}
          <div className="rounded-2xl border border-indigo/10 bg-card p-6">
            <h3 className="mb-4 flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-wider text-ink/70">
              <FolderOpen className="h-4 w-4 text-saffron" /> Top categories
            </h3>
            <div className="flex flex-col gap-1">
              {categories.length === 0 ? (
                <p className="text-sm text-ink/50">Categories are loading…</p>
              ) : (
                categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-ink/75 transition-colors hover:bg-indigo/10 hover:text-indigo"
                  >
                    <span className="truncate">{cat.name}</span>
                    <span className="ml-2 shrink-0 text-xs text-ink/35">{cat._count?.products ?? 0}</span>
                  </Link>
                ))
              )}
            </div>
            <Link
              href="/categories"
              className="mt-3 flex items-center gap-1 text-sm font-semibold text-indigo hover:underline"
            >
              All categories <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Why DeshStack */}
          <div className="rounded-2xl border border-indigo/10 bg-card p-6">
            <h3 className="mb-4 font-heading text-sm font-bold uppercase tracking-wider text-ink/70">
              Why DeshStack
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-ink/70">
              <li className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                Verified peer reviews — never bought, never biased
              </li>
              <li className="flex items-start gap-2">
                <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-saffron" />
                Rankings driven by community upvotes
              </li>
              <li className="flex items-start gap-2">
                <Star className="mt-0.5 h-4 w-4 shrink-0 text-indigo" />
                GST, DPDP &amp; INR pricing front and centre
              </li>
            </ul>
          </div>
        </aside>
      </section>

      {/* ─── Market Quadrant ────────────────────────────────── */}
      {quadrantProducts.length > 0 && (
        <section className="border-t border-indigo/10 bg-paper-2/50 py-16">
          <div className="container mx-auto px-4 md:px-6">
            <ScrollReveal>
              <MarketQuadrant products={quadrantProducts} />
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ─── Maker CTA band ─────────────────────────────────── */}
      <section className="aurora grain relative overflow-hidden border-t border-indigo/10 bg-paper-2 py-16">
        <div className="bg-dots-light pointer-events-none absolute inset-0 opacity-30" />
        <div className="relative z-10 container mx-auto px-4 text-center md:px-6">
          <ScrollReveal>
            <h2 className="font-heading text-3xl font-black text-ink md:text-4xl">
              Are you a software maker?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-ink/60">
              Launch on DeshStack and get in front of thousands of Indian businesses actively
              searching for their next tool.
            </p>
            <Link
              href="/for-vendors"
              className="shine mt-8 inline-flex transform items-center gap-2 rounded-xl bg-saffron px-8 py-4 font-bold text-paper shadow-lg transition-all duration-200 hover:-translate-y-1 hover:bg-saffron/90 hover:shadow-xl"
            >
              Launch your product <ArrowRight className="h-4 w-4" />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
