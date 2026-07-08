/* eslint-disable @next/next/no-img-element */
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Star, CheckCircle2, ShieldCheck, IndianRupee, BookmarkPlus, BookmarkCheck, X } from "lucide-react"
import { currentUser } from "@clerk/nextjs/server"
import { toggleSaveProduct } from "./actions"
import { SidebarAd } from "@/components/ads/SidebarAd"

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: {
        include: {
          user: {
            select: { name: true, role: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  })
}

export default async function ProductDetails({ params }: ProductPageProps) {
  const resolvedParams = await params
  const { slug } = resolvedParams

  let product: Awaited<ReturnType<typeof getProduct>> = null
  try {
    product = await getProduct(slug)
  } catch (error) {
    console.error("Database error in product detail page:", error)
  }

  if (!product) {
    notFound()
  }

  const reviewCount = product.reviews.length
  const averageRating = reviewCount > 0 
    ? product.reviews.reduce((acc, rev) => acc + rev.overallRating, 0) / reviewCount
    : 0

  let clerkUser = null
  let isSaved = false

  try {
    clerkUser = await currentUser()
    if (clerkUser) {
      const dbUser = await prisma.user.findUnique({ where: { clerkId: clerkUser.id } })
      if (dbUser) {
        const saved = await prisma.savedProduct.findUnique({
          where: {
            userId_productId: {
              userId: dbUser.id,
              productId: product.id,
            },
          },
        })
        isSaved = !!saved
      }
    }
  } catch (error) {
    console.error("Auth/DB error loading saved state on product page:", error)
  }

  const toggleSave = toggleSaveProduct.bind(null, product.id, product.slug)

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="mb-8">
        <Link href={`/categories/${product.category.slug}`} className="text-sm font-medium text-indigo hover:underline mb-6 inline-block">
          &larr; Back to {product.category.name}
        </Link>
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-2xl bg-white border-2 border-indigo/10 flex items-center justify-center text-4xl font-bold text-indigo overflow-hidden shadow-sm">
            {product.logoUrl ? (
              <img src={product.logoUrl} alt={`${product.name} logo`} className="h-full w-full object-cover" />
            ) : (
              product.name.charAt(0)
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="font-heading text-4xl font-black text-ink mb-2">{product.name}</h1>
                <p className="text-xl text-ink/70">{product.description}</p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <a href={product.website ?? "#"} target="_blank" rel="noopener noreferrer" className="bg-indigo text-paper font-semibold px-6 py-3 rounded-lg hover:bg-indigo/90 transition-colors text-center shadow-sm">
                  Visit Website
                </a>
                <Link href={`/products/${product.slug}/review`} className="bg-white text-indigo border border-indigo font-semibold px-6 py-3 rounded-lg hover:bg-indigo/5 transition-colors text-center">
                  Write a Review
                </Link>
                {clerkUser && (
                  <form action={toggleSave}>
                    <button type="submit" className="w-full flex items-center justify-center gap-2 bg-white text-ink border border-indigo/20 font-semibold px-6 py-3 rounded-lg hover:bg-indigo/5 transition-colors text-center mt-2">
                      {isSaved ? <BookmarkCheck className="w-5 h-5 text-indigo" /> : <BookmarkPlus className="w-5 h-5" />}
                      {isSaved ? "Saved" : "Save for later"}
                    </button>
                  </form>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`h-5 w-5 ${star <= Math.round(averageRating) ? 'fill-saffron text-saffron' : 'fill-muted text-muted'}`} 
                    />
                  ))}
                </div>
                <span className="font-bold text-lg text-ink">{averageRating.toFixed(1)}</span>
                <span className="text-sm text-ink/60">({reviewCount} reviews)</span>
              </div>
              
              {product.status === "APPROVED" && (
                <div className="flex items-center gap-1.5 text-teal font-medium bg-teal/10 px-3 py-1 rounded-full text-sm">
                  <ShieldCheck className="h-4 w-4" />
                  Verified Vendor
                </div>
              )}
              
              {product.pricingText && (
                <div className="flex items-center gap-1.5 text-ink/80 font-medium bg-indigo/5 px-3 py-1 rounded-full text-sm border border-indigo/10">
                  <IndianRupee className="h-4 w-4" />
                  {product.pricingText}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-16">
        <div className="lg:col-span-2">
          <section className="mb-12">
            <h2 className="font-heading text-2xl font-bold text-ink mb-6 pb-2 border-b border-indigo/10">About {product.name}</h2>
            <div className="prose prose-indigo max-w-none text-ink/80">
              {product.description ? (
                <p className="whitespace-pre-wrap">{product.description}</p>
              ) : (
                <p>No detailed description provided yet.</p>
              )}
            </div>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-ink mb-6 pb-2 border-b border-indigo/10">Reviews</h2>
            {product.reviews.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-indigo/10">
                <p className="text-ink/60 mb-4">No reviews yet. Be the first to review this product!</p>
                <Link href={`/products/${product.slug}/review`} className="bg-indigo text-paper font-semibold px-6 py-3 rounded-lg hover:bg-indigo/90 transition-colors inline-block">
                  Write a Review
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {product.reviews.map(review => (
                  <div key={review.id} className="bg-white p-6 rounded-xl border border-indigo/10 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo/10 flex items-center justify-center text-indigo font-bold">
                          {review.user.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-ink flex items-center gap-2">
                            {review.user.name || 'Anonymous User'}
                            {review.isVerified && (
                              <span className="inline-flex items-center text-xs text-teal font-medium bg-teal/10 px-2 py-0.5 rounded">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Verified Buyer
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-ink/50">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`h-4 w-4 ${star <= review.overallRating ? 'fill-saffron text-saffron' : 'fill-muted text-muted'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    {review.title && <h4 className="font-bold text-ink mb-2">{review.title}</h4>}
                    <p className="text-ink/80 whitespace-pre-wrap mb-4">{review.body}</p>
                    
                    {(review.pros.length > 0 || review.cons.length > 0) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-indigo/10">
                        {review.pros.length > 0 && (
                          <div>
                            <h5 className="font-bold text-teal mb-2 flex items-center gap-1 text-sm">
                              <CheckCircle2 className="w-4 h-4" /> Pros
                            </h5>
                            <ul className="list-disc list-inside text-sm text-ink/80 space-y-1">
                              {review.pros.map((pro, i) => (
                                <li key={i}>{pro}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {review.cons.length > 0 && (
                          <div>
                            <h5 className="font-bold text-red-600 mb-2 flex items-center gap-1 text-sm">
                              <X className="w-4 h-4" /> Cons
                            </h5>
                            <ul className="list-disc list-inside text-sm text-ink/80 space-y-1">
                              {review.cons.map((con, i) => (
                                <li key={i}>{con}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
        
        <div>
          <div className="bg-white p-6 rounded-xl border border-indigo/10 shadow-sm sticky top-24">
            <h3 className="font-heading font-bold text-lg text-ink mb-4 pb-2 border-b border-indigo/10">Product Highlights</h3>
            {/* Mock highlights */}
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2 text-sm text-ink/80">
                <CheckCircle2 className="h-5 w-5 text-teal shrink-0" />
                <span>GST Invoicing Ready</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-ink/80">
                <CheckCircle2 className="h-5 w-5 text-teal shrink-0" />
                <span>DPDP Act Compliant</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-ink/80">
                <CheckCircle2 className="h-5 w-5 text-teal shrink-0" />
                <span>Indian Local Server Hosting</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-ink/80">
                <CheckCircle2 className="h-5 w-5 text-teal shrink-0" />
                <span>24/7 Phone Support (Hindi/English)</span>
              </li>
            </ul>
            <div className="flex flex-col gap-3">
              <a href={product.website ?? "#"} target="_blank" rel="noopener noreferrer" className="bg-indigo text-paper font-semibold px-4 py-3 rounded-lg hover:bg-indigo/90 transition-colors text-center w-full">
                Get a Demo
              </a>
            </div>
          </div>

          {/* Sidebar Sponsored Ad */}
          <div className="mt-6">
            <SidebarAd />
          </div>
        </div>
      </div>
    </div>
  )
}
