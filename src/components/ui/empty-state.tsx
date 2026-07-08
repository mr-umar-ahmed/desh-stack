import { LucideIcon } from "lucide-react"
import Link from "next/link"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
}

export function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-indigo/10 shadow-sm">
      <div className="w-16 h-16 bg-indigo/5 rounded-2xl flex items-center justify-center mb-6 text-indigo">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="font-heading font-bold text-xl text-ink mb-2">{title}</h3>
      <p className="text-ink/60 max-w-md mb-8">{description}</p>
      
      {actionLabel && actionHref && (
        <Link 
          href={actionHref}
          className="bg-indigo text-paper px-6 py-3 rounded-xl font-bold hover:bg-indigo/90 transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
