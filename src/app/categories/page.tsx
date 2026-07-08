import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Layers } from "lucide-react"

export const metadata = {
  title: "Browse Categories | DeshStack",
  description: "Discover the best Indian B2B software by category.",
}

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { products: true } },
    },
  })

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 animate-fade-in">
      <div className="mb-12">
        <h1 className="font-heading text-4xl font-bold text-ink mb-3">Browse Categories</h1>
        <p className="text-ink/60 text-lg max-w-2xl">
          Discover the best software for your business, categorized by industry and function.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, i) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className={`flex items-center gap-5 p-6 rounded-2xl bg-white border border-indigo/10 shadow-sm hover:border-indigo hover:shadow-md transition-all group animate-scale-in stagger-${Math.min(i + 1, 6)}`}
          >
            <div className="w-14 h-14 shrink-0 rounded-xl bg-indigo/5 flex items-center justify-center text-indigo group-hover:bg-indigo group-hover:text-paper transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              <span className="font-bold text-xl">{category.name.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <h2 className="font-heading font-bold text-ink group-hover:text-indigo transition-colors text-lg">
                {category.name}
              </h2>
              {category.description && (
                <p className="text-xs text-ink/50 mt-0.5 line-clamp-1">{category.description}</p>
              )}
              <p className="text-xs text-ink/40 mt-1 font-medium">{category._count.products} products</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
