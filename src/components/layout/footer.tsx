import Link from "next/link"
import { IndianRupee, ShieldCheck, Star } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t border-indigo/10 bg-indigo text-paper/80">
      <div className="container mx-auto grid grid-cols-1 gap-10 md:grid-cols-4 px-4 md:px-6 py-16">
        <div className="flex flex-col gap-4 md:col-span-1">
          <Link href="/" className="font-heading text-2xl font-bold text-paper tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-saffron flex items-center justify-center text-indigo text-sm font-black">
              D
            </span>
            DeshStack
          </Link>
          <p className="text-sm text-paper/60 leading-relaxed">
            The trusted B2B software discovery platform for India. Find, review, and buy the best tools for your business.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-xs text-paper/50">
              <ShieldCheck className="w-3.5 h-3.5 text-teal" />
              DPDP Compliant
            </div>
            <div className="flex items-center gap-1.5 text-xs text-paper/50">
              <IndianRupee className="w-3.5 h-3.5 text-saffron" />
              GST Ready
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="font-heading font-semibold text-paper text-sm uppercase tracking-wider">Discover</h3>
          <Link href="/categories" className="text-sm text-paper/60 hover:text-saffron transition-colors">All Categories</Link>
          <Link href="/products" className="text-sm text-paper/60 hover:text-saffron transition-colors">Trending Products</Link>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="font-heading font-semibold text-paper text-sm uppercase tracking-wider">For Vendors</h3>
          <Link href="/for-vendors" className="text-sm text-paper/60 hover:text-saffron transition-colors">Claim Your Profile</Link>
          <Link href="/publisher" className="text-sm text-paper/60 hover:text-saffron transition-colors">Publisher Portal</Link>
          <Link href="/sign-in" className="text-sm text-paper/60 hover:text-saffron transition-colors">Vendor Login</Link>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="font-heading font-semibold text-paper text-sm uppercase tracking-wider">Company</h3>
          <Link href="#" className="text-sm text-paper/60 hover:text-saffron transition-colors">About Us</Link>
          <Link href="#" className="text-sm text-paper/60 hover:text-saffron transition-colors">Privacy Policy</Link>
          <Link href="#" className="text-sm text-paper/60 hover:text-saffron transition-colors">Terms of Service</Link>
          <Link href="#" className="text-sm text-paper/60 hover:text-saffron transition-colors">Contact</Link>
        </div>
      </div>
      <div className="container mx-auto border-t border-paper/10 py-6 px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-paper/40">
          &copy; {new Date().getFullYear()} DeshStack. Built with ❤️ for Bharat.
        </p>
        <div className="flex items-center gap-1 text-xs text-paper/40">
          <Star className="w-3 h-3 fill-saffron text-saffron" />
          Trusted by Indian enterprises
        </div>
      </div>
    </footer>
  )
}
