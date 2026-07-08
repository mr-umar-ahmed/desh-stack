import { prisma } from "@/lib/prisma"
import { approveProduct, rejectProduct } from "../actions"
import { Check, X, ExternalLink, Package } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"

export default async function AdminProductsPage() {
  const pendingProducts = await prisma.product.findMany({
    where: { status: "PENDING" },
    include: {
      category: { select: { name: true } },
      publisher: { select: { name: true, email: true } }
    },
    orderBy: { createdAt: 'asc' }
  })

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-ink mb-2">Product Moderation Queue</h1>
      <p className="text-ink/60 mb-8">Approve or reject pending product listings.</p>

      {pendingProducts.length === 0 ? (
        <EmptyState
          icon={Package}
          title="All Caught Up!"
          description="There are currently no pending products waiting for moderation."
        />
      ) : (
        <div className="flex flex-col gap-6">
          {pendingProducts.map(product => {
            const approve = approveProduct.bind(null, product.id)
            const reject = rejectProduct.bind(null, product.id)

            return (
              <div key={product.id} className="bg-white p-6 rounded-xl border border-indigo/10 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-start border-b border-indigo/10 pb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-2xl text-ink">{product.name}</h3>
                      <span className="text-xs font-semibold px-2 py-1 rounded bg-indigo/10 text-indigo">
                        {product.category.name}
                      </span>
                    </div>
                    <p className="text-sm text-ink/70">
                      Submitted by: <span className="font-medium text-ink">{product.publisher.name || product.publisher.email}</span>
                    </p>
                  </div>
                  {product.website && (
                    <a href={product.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-indigo hover:underline font-medium">
                      Visit Website <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-2">
                  <div>
                    <h4 className="font-bold text-ink mb-2 text-sm uppercase tracking-wider">Description</h4>
                    <p className="text-ink/80 text-sm whitespace-pre-wrap">{product.description || 'No description provided.'}</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div>
                      <h4 className="font-bold text-ink mb-1 text-sm uppercase tracking-wider">Pricing Info</h4>
                      <p className="text-ink/80 text-sm">{product.pricingText || 'Not specified'}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-ink mb-1 text-sm uppercase tracking-wider">HQ City</h4>
                      <p className="text-ink/80 text-sm">{product.hqCity || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-indigo/10 mt-2">
                  <form action={reject}>
                    <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-md font-medium text-red-700 bg-red-50 hover:bg-red-100 transition-colors">
                      <X className="w-4 h-4" /> Reject Product
                    </button>
                  </form>
                  <form action={approve}>
                    <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-md font-medium text-white bg-teal hover:bg-teal/90 transition-colors shadow-sm">
                      <Check className="w-4 h-4" /> Approve & Publish
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
