import { requireRole } from "@/lib/rbac"
import Link from "next/link"
import { Building2, PlusCircle, LayoutDashboard, CreditCard } from "lucide-react"

export default async function PublisherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireRole(["PUBLISHER", "ADMIN", "MODERATOR"])

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-72 shrink-0">
          <div className="bg-white p-6 rounded-2xl border border-indigo/10 shadow-sm sticky top-24">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-indigo/10">
              <div className="w-10 h-10 rounded-xl bg-saffron/10 flex items-center justify-center text-saffron">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-ink text-lg">Publisher Portal</h2>
                <p className="text-xs text-ink/50">{user.name || user.email}</p>
              </div>
            </div>
            <nav className="flex flex-col gap-1">
              {[
                { href: "/publisher", label: "Dashboard", icon: LayoutDashboard },
                { href: "/publisher/products/new", label: "Add Product", icon: PlusCircle },
                { href: "/publisher/billing", label: "Billing & Plans", icon: CreditCard },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 text-ink/70 hover:text-saffron hover:bg-saffron/5 px-3 py-2.5 rounded-xl transition-all font-medium text-sm group"
                >
                  <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
