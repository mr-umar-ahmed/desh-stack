"use client"

import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function SearchInput() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative hidden md:flex items-center">
      <input
        type="text"
        placeholder="Search software..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 pr-4 py-2 bg-indigo/5 border border-transparent rounded-full text-sm text-ink focus:border-indigo/20 focus:bg-card focus:outline-none transition-all w-64 focus:w-72"
      />
      <Search className="absolute left-3 w-4 h-4 text-ink/40 pointer-events-none" />
      <button type="submit" className="sr-only">Search</button>
    </form>
  )
}
