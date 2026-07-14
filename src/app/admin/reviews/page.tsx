import { prisma } from "@/lib/prisma"
import { approveReview, rejectReview } from "../actions"
import { Star, Check, X } from "lucide-react"

export default async function AdminReviewsPage() {
  const pendingReviews = await prisma.review.findMany({
    where: { status: "PENDING" },
    include: {
      product: { select: { name: true } },
      user: { select: { name: true, email: true } }
    },
    orderBy: { createdAt: 'asc' }
  })

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-ink mb-2">Review Moderation Queue</h1>
      <p className="text-ink/60 mb-8">Approve or reject pending reviews.</p>

      {pendingReviews.length === 0 ? (
        <div className="bg-card p-8 rounded-xl border border-indigo/10 text-center shadow-sm">
          <Check className="w-12 h-12 text-teal mx-auto mb-4" />
          <p className="text-ink font-medium">No pending reviews in the queue.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {pendingReviews.map(review => {
            const approve = approveReview.bind(null, review.id)
            const reject = rejectReview.bind(null, review.id)

            return (
              <div key={review.id} className="bg-card p-6 rounded-xl border border-indigo/10 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-start border-b border-indigo/10 pb-4">
                  <div>
                    <h3 className="font-bold text-lg text-ink mb-1">{review.title || 'Untitled Review'}</h3>
                    <p className="text-sm text-ink/70">
                      For <span className="font-semibold text-indigo">{review.product.name}</span> by {review.user.name || review.user.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`h-4 w-4 ${star <= review.overallRating ? 'fill-saffron text-saffron' : 'fill-muted text-muted'}`} 
                      />
                    ))}
                  </div>
                </div>

                <div className="text-ink/80 text-sm whitespace-pre-wrap">
                  {review.body}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                  <div>
                    <strong className="block text-ink mb-1">Pros:</strong>
                    <ul className="list-disc pl-4 text-ink/70">
                      {review.pros.length > 0 ? review.pros.map((p, i) => <li key={i}>{p}</li>) : <li>None provided</li>}
                    </ul>
                  </div>
                  <div>
                    <strong className="block text-ink mb-1">Cons:</strong>
                    <ul className="list-disc pl-4 text-ink/70">
                      {review.cons.length > 0 ? review.cons.map((c, i) => <li key={i}>{c}</li>) : <li>None provided</li>}
                    </ul>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-indigo/10 mt-2">
                  <form action={reject}>
                    <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-md font-medium text-red-700 bg-red-50 hover:bg-red-100 transition-colors">
                      <X className="w-4 h-4" /> Reject
                    </button>
                  </form>
                  <form action={approve}>
                    <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-md font-medium text-white bg-teal hover:bg-teal/90 transition-colors shadow-sm">
                      <Check className="w-4 h-4" /> Approve
                    </button>
                  </form>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
