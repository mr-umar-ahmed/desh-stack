import Link from "next/link"
import { IndianRupee, ShieldCheck, Star, MapPin } from "lucide-react"

const LINK_GROUPS = [
  {
    heading: "Discover",
    links: [
      { href: "/categories", label: "All Categories" },
      { href: "/products", label: "Trending Products" },
      { href: "/products?sort=newest", label: "New Arrivals" },
    ],
  },
  {
    heading: "For Vendors",
    links: [
      { href: "/for-vendors", label: "Why List on DeshStack" },
      { href: "/sign-up?role=vendor", label: "Create Vendor Account" },
      { href: "/publisher", label: "Publisher Portal" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "#", label: "About Us" },
      { href: "#", label: "Privacy Policy" },
      { href: "#", label: "Terms of Service" },
      { href: "#", label: "Contact" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="aurora grain relative w-full overflow-hidden border-t border-indigo/10 bg-indigo text-paper/80">
      <div className="bg-dots-light pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative z-10 container mx-auto grid grid-cols-1 gap-10 px-4 py-16 md:grid-cols-4 md:px-6">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="font-heading flex items-center gap-2.5 text-2xl font-black tracking-tight text-paper"
          >
            <span className="logo-tile flex h-9 w-9 items-center justify-center rounded-xl text-sm font-black text-paper shadow-md">
              D
            </span>
            Desh<span className="text-saffron">Stack</span>
          </Link>
          <p className="text-sm leading-relaxed text-paper/60">
            The trusted B2B software discovery platform for India. Find, review, and buy the best
            tools for your business.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-paper/60">
              <ShieldCheck className="h-3.5 w-3.5 text-teal" />
              DPDP Compliant
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-paper/60">
              <IndianRupee className="h-3.5 w-3.5 text-saffron" />
              GST Ready
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-paper/60">
              <MapPin className="h-3.5 w-3.5 text-saffron" />
              Made in India
            </span>
          </div>
        </div>

        {/* Link columns */}
        {LINK_GROUPS.map((group) => (
          <nav key={group.heading} className="flex flex-col gap-3">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-paper">
              {group.heading}
            </h3>
            {group.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="w-fit text-sm text-paper/60 transition-colors hover:text-saffron"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ))}
      </div>

      <div className="relative z-10 container mx-auto flex flex-col items-center justify-between gap-4 border-t border-paper/10 px-4 py-6 md:flex-row md:px-6">
        <p className="text-xs text-paper/40">
          &copy; {new Date().getFullYear()} DeshStack. Built with ❤️ for Bharat.
        </p>
        <div className="flex items-center gap-1 text-xs text-paper/40">
          <Star className="h-3 w-3 fill-saffron text-saffron" />
          Trusted by Indian enterprises
        </div>
      </div>
    </footer>
  )
}
