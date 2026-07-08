import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { requireAuth } from "@/lib/rbac"
import { ReviewForm } from "./ReviewForm"
import Link from "next/link"

interface ReviewPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const user = await requireAuth()
  const resolvedParams = await params
  const { slug } = resolvedParams

  const product = await prisma.product.findUnique({
    where: { slug }
  })

  if (!product) {
    notFound()
  }

  // Check if already reviewed
  const existingReview = await prisma.review.findUnique({
    where: {
      userId_productId: {
        userId: user.id as string,
        productId: product.id
      }
    }
  })

  if (existingReview) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
        <div className="bg-white p-8 rounded-xl border border-indigo/10 shadow-sm">
          <h1 className="font-heading text-2xl font-bold text-ink mb-4">You&apos;ve already reviewed {product.name}</h1>
          <p className="text-ink/70 mb-6">Thank you for sharing your feedback!</p>
          <Link href="/dashboard" className="bg-indigo text-paper font-semibold px-6 py-3 rounded-lg hover:bg-indigo/90 transition-colors">
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 max-w-3xl">
      <div className="mb-8">
        <Link href={`/products/${product.slug}`} className="text-sm font-medium text-indigo hover:underline mb-4 inline-block">
          &larr; Back to {product.name}
        </Link>
        <h1 className="font-heading text-4xl font-bold text-ink mb-2">Write a Review</h1>
        <p className="text-ink/70 text-lg">Share your experience with {product.name}</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-xl border border-indigo/10 shadow-sm">
        <ReviewForm productId={product.id} />
      </div>
    </div>
  )
}
