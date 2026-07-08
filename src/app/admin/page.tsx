import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { MessageSquare, Package, Users, TrendingUp, Clock, ArrowRight } from "lucide-react"

export default async function AdminDashboard() {
  const pendingReviewsCount = await prisma.review.count({ where: { status: "PENDING" } })
  const pendingProductsCount = await prisma.product.count({ where: { status: "PENDING" } })
  const totalUsersCount = await prisma.user.count()
  const publisherCount = await prisma.user.count({ where: { role: "PUBLISHER" } })

  const recentActivity = await prisma.review.findMany({
    where: { status: "PENDING" },
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } }, product: { select: { name: true } } },
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-ink mb-1">Moderation Dashboard</h1>
        <p className="text-ink/50">Overview of pending items and platform stats</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Pending Reviews", value: pendingReviewsCount, icon: MessageSquare, color: "text-indigo bg-indigo/5", href: "/admin/reviews" },
          { label: "Pending Products", value: pendingProductsCount, icon: Package, color: "text-saffron bg-saffron/5", href: "/admin/products" },
          { label: "Total Users", value: totalUsersCount, icon: Users, color: "text-teal bg-teal/5", href: "/admin/users" },
          { label: "Publishers", value: publisherCount, icon: TrendingUp, color: "text-indigo bg-indigo/5", href: "/admin/users" },
        ].map((stat, i) => (
          <Link
            key={i}
            href={stat.href}
            className="bg-white p-5 rounded-2xl border border-indigo/10 shadow-sm hover:shadow-md hover:border-indigo/20 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-ink/20 group-hover:text-indigo group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-3xl font-bold text-ink font-heading">{stat.value}</p>
            <p className="text-xs text-ink/50 font-medium mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-indigo/10 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-indigo/10 flex items-center justify-between">
          <h2 className="font-heading font-bold text-ink flex items-center gap-2">
            <Clock className="w-4 h-4 text-ink/40" />
            Recent Pending Reviews
          </h2>
          <Link href="/admin/reviews" className="text-xs text-indigo font-medium hover:underline">View all →</Link>
        </div>
        {recentActivity.length === 0 ? (
          <div className="p-8 text-center text-ink/40 text-sm">No pending reviews. All clear! 🎉</div>
        ) : (
          <div className="divide-y divide-indigo/5">
            {recentActivity.map((review) => (
              <div key={review.id} className="p-4 hover:bg-paper/50 transition-colors flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ink">{review.user.name || review.user.email}</p>
                  <p className="text-xs text-ink/50">
                    reviewed <span className="font-medium text-ink/70">{review.product.name}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-ink/40">{new Date(review.createdAt).toLocaleDateString()}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo/10 text-indigo">PENDING</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
