import Link from "next/link"
import { DatabaseZap } from "lucide-react"

/**
 * Shown when a page can't reach the database instead of crashing into the
 * generic error boundary. Honest, specific messaging helps operators realise
 * the fix is a connection/config issue (e.g. Vercel DATABASE_URL), not a bug.
 */
export function ServiceUnavailable({
  title = "We couldn't load this page",
  description = "We're having trouble reaching our database right now. Please try again in a moment.",
}: {
  title?: string
  description?: string
}) {
  return (
    <div className="container mx-auto px-4 py-20 max-w-xl text-center animate-fade-in">
      <div className="w-16 h-16 bg-saffron/10 text-saffron rounded-2xl flex items-center justify-center mx-auto mb-6">
        <DatabaseZap className="w-8 h-8" />
      </div>
      <h2 className="font-heading text-3xl font-black text-ink mb-4">{title}</h2>
      <p className="text-ink/70 mb-8">{description}</p>
      <div className="flex justify-center gap-3">
        <Link
          href="/"
          className="bg-indigo text-paper font-semibold px-6 py-3 rounded-lg hover:bg-indigo/90 transition-colors shadow-sm"
        >
          Return Home
        </Link>
        <Link
          href="/products"
          className="bg-card border border-indigo/20 text-indigo font-semibold px-6 py-3 rounded-lg hover:bg-indigo/5 transition-colors shadow-sm"
        >
          Browse Products
        </Link>
      </div>
    </div>
  )
}
