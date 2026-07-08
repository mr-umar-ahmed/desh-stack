"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Shield, Building2, LayoutDashboard } from "lucide-react"

interface MobileNavProps {
  isSignedIn: boolean
  role: string | null
}

export function MobileNav({ isSignedIn, role }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close the menu whenever the route changes.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Prevent background scroll while the menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="flex items-center justify-center w-9 h-9 rounded-lg text-ink/70 hover:text-indigo hover:bg-indigo/5 transition-colors"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-16 z-40 bg-ink/20 backdrop-blur-sm animate-fade-in"
            onClick={() => setOpen(false)}
          />
          {/* Panel */}
          <nav className="fixed inset-x-0 top-16 z-50 bg-paper border-b border-indigo/10 shadow-lg animate-slide-down">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              <MobileLink href="/categories">Categories</MobileLink>
              <MobileLink href="/products">Products</MobileLink>
              <MobileLink href="/for-vendors">For Vendors</MobileLink>

              {isSignedIn && (
                <>
                  <div className="my-2 h-px bg-indigo/10" />
                  <MobileLink href="/dashboard" icon={LayoutDashboard}>
                    Dashboard
                  </MobileLink>
                  {(role === "PUBLISHER" || role === "ADMIN" || role === "MODERATOR") && (
                    <MobileLink href="/publisher" icon={Building2}>
                      Publisher
                    </MobileLink>
                  )}
                  {(role === "ADMIN" || role === "MODERATOR") && (
                    <MobileLink href="/admin" icon={Shield}>
                      Admin
                    </MobileLink>
                  )}
                </>
              )}

              {!isSignedIn && (
                <>
                  <div className="my-2 h-px bg-indigo/10" />
                  <Link
                    href="/sign-in"
                    className="px-3 py-2.5 rounded-lg text-sm font-medium text-ink/80 hover:bg-indigo/5 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/sign-up"
                    className="px-3 py-2.5 rounded-lg text-sm font-semibold bg-indigo text-paper text-center hover:bg-indigo/90 transition-colors"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </>
      )}
    </div>
  )
}

function MobileLink({
  href,
  children,
  icon: Icon,
}: {
  href: string
  children: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-ink/80 hover:text-indigo hover:bg-indigo/5 transition-colors"
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </Link>
  )
}
