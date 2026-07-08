import Link from "next/link"
import { SearchX } from "lucide-react"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-2xl text-center">
      <div className="w-20 h-20 bg-indigo/5 text-indigo rounded-full flex items-center justify-center mx-auto mb-6">
        <SearchX className="w-10 h-10" />
      </div>
      <h2 className="font-heading text-4xl font-black text-ink mb-4">404 - Page Not Found</h2>
      <p className="text-xl text-ink/70 mb-10 max-w-md mx-auto">
        We couldn&apos;t find the page or software product you were looking for.
      </p>
      <div className="flex justify-center gap-4">
        <Link href="/" className="bg-indigo text-paper font-semibold px-6 py-3 rounded-lg hover:bg-indigo/90 transition-colors shadow-sm">
          Return Home
        </Link>
        <Link href="/categories" className="bg-white border border-indigo/20 text-indigo font-semibold px-6 py-3 rounded-lg hover:bg-indigo/5 transition-colors shadow-sm">
          Browse Categories
        </Link>
      </div>
    </div>
  )
}
