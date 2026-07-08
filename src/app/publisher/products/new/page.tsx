import { prisma } from "@/lib/prisma"
import { ProductForm } from "./ProductForm"
import { requireRole } from "@/lib/rbac"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

export default async function NewProductPage() {
  const user = await requireRole(["PUBLISHER", "ADMIN"])

  const [categories, productCount, subscription] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.product.count({ where: { publisherId: user.id } }),
    prisma.subscription.findFirst({
      where: { publisherId: user.id, status: "active" },
      orderBy: { createdAt: "desc" }
    })
  ])

  // Limit check logic
  // If no subscription or FREE plan, limit to 1
  const activePlan = subscription?.plan || "FREE"
  let limit = 1
  if (activePlan === "GROWTH") limit = 5
  if (activePlan === "SCALE") limit = 9999

  if (productCount >= limit) {
    return (
      <div className="max-w-3xl">
        <h1 className="font-heading text-3xl font-bold text-ink mb-2">Add New Product</h1>
        <div className="bg-white p-8 rounded-xl border border-saffron shadow-sm text-center">
          <AlertCircle className="w-12 h-12 text-saffron mx-auto mb-4" />
          <h2 className="font-bold text-xl text-ink mb-2">Limit Reached</h2>
          <p className="text-ink/70 mb-6">You&apos;ve reached the maximum number of products ({limit}) allowed on your current plan.</p>
          <Link href="/publisher/billing" className="bg-indigo text-paper px-6 py-3 rounded-lg font-semibold hover:bg-indigo/90 transition-colors">
            Upgrade Plan to List More
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-heading text-3xl font-bold text-ink mb-2">Add New Product</h1>
      <p className="text-ink/70 mb-8">List your software on DeshStack. All submissions are reviewed by our team before going live.</p>

      <div className="bg-white p-6 md:p-8 rounded-xl border border-indigo/10 shadow-sm">
        <ProductForm categories={categories} />
      </div>
    </div>
  )
}
