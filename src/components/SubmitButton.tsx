"use client"

import { useFormStatus } from "react-dom"
import { Loader2 } from "lucide-react"

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  pendingText?: string
}

export function SubmitButton({ children, pendingText = "Submitting...", className, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending || props.disabled}
      className={`flex items-center justify-center gap-2 ${className}`}
      {...props}
    >
      {pending && <Loader2 className="w-4 h-4 animate-spin" />}
      {pending ? pendingText : children}
    </button>
  )
}
