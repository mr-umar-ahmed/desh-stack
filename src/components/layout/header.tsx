import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { Search, Menu, X, Shield, Building2, LayoutDashboard } from "lucide-react"
import { SearchInput } from "@/components/SearchInput"

export async function Header() {
  let clerkUser = null
  let role = null

  try {
    clerkUser = await currentUser()
  } catch (error) {
    console.error("Clerk auth error (check CLERK_SECRET_KEY):", error)
  }
  
  if (clerkUser) {
    try {
      const user = await prisma.user.findUnique({ where: { clerkId: clerkUser.id } })
      role = user?.role || null
    } catch (error) {
      console.error("Database connection error (check DATABASE_URL):", error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-indigo/10 glass">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-heading text-2xl font-bold text-indigo tracking-tight flex items-center gap-2 group">
            <span className="w-8 h-8 rounded-lg bg-indigo flex items-center justify-center text-paper text-sm font-black group-hover:animate-pulse-glow transition-shadow">
              D
            </span>
            <span className="hidden sm:inline">DeshStack</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/categories" className="text-sm font-medium text-ink/70 hover:text-indigo hover:bg-indigo/5 px-3 py-2 rounded-lg transition-all">
              Categories
            </Link>
            <Link href="/products" className="text-sm font-medium text-ink/70 hover:text-indigo hover:bg-indigo/5 px-3 py-2 rounded-lg transition-all">
              Products
            </Link>
            <Link href="/for-vendors" className="text-sm font-medium text-ink/70 hover:text-indigo hover:bg-indigo/5 px-3 py-2 rounded-lg transition-all">
              For Vendors
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <SearchInput />

          {!clerkUser ? (
            <>
              <Link
                href="/sign-in"
                className="text-sm font-medium text-ink/80 hover:text-indigo transition-colors hidden sm:block"
              >
                Log in
              </Link>
              <Link
                href="/sign-up"
                className="text-sm font-semibold bg-indigo text-paper px-4 py-2 rounded-lg hover:bg-indigo/90 transition-all hover:shadow-lg hover:-translate-y-0.5 transform duration-200"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              {/* Role-aware navigation */}
              <div className="hidden sm:flex items-center gap-1">
                <Link href="/dashboard" className="text-sm font-medium text-ink/70 hover:text-indigo hover:bg-indigo/5 px-3 py-2 rounded-lg transition-all flex items-center gap-1.5">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </Link>
                {(role === "PUBLISHER" || role === "ADMIN" || role === "MODERATOR") && (
                  <Link href="/publisher" className="text-sm font-medium text-ink/70 hover:text-saffron hover:bg-saffron/5 px-3 py-2 rounded-lg transition-all flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    Publisher
                  </Link>
                )}
                {(role === "ADMIN" || role === "MODERATOR") && (
                  <Link href="/admin" className="text-sm font-medium text-ink/70 hover:text-teal hover:bg-teal/5 px-3 py-2 rounded-lg transition-all flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    Admin
                  </Link>
                )}
              </div>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 ring-2 ring-indigo/20 hover:ring-indigo/40 transition-all",
                  },
                }}
              />
            </>
          )}
        </div>
      </div>
    </header>
  )
}
