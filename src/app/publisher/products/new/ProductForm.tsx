"use client"

import { toast } from "sonner"
import { SubmitButton } from "@/components/SubmitButton"
import { submitProduct } from "../actions"
import { useRouter } from "next/navigation"

export function ProductForm({ categories }: { categories: { id: string; name: string }[] }) {
  const router = useRouter()
  async function action(formData: FormData) {
    try {
      const res = await submitProduct(formData)
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success("Product submitted successfully!")
        router.push("/publisher")
      }
    } catch (e: unknown) {
      const error = e as Error
      toast.error(error.message || "An unexpected error occurred.")
    }
  }

  return (
    <form action={action} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="font-bold text-ink">Product Name *</label>
        <input type="text" id="name" name="name" required minLength={2} maxLength={100} placeholder="e.g. DeshCRM" className="border border-indigo/20 rounded-md p-3 focus:ring-2 focus:ring-indigo outline-none" />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="categoryId" className="font-bold text-ink">Category *</label>
        <select id="categoryId" name="categoryId" required className="border border-indigo/20 rounded-md p-3 focus:ring-2 focus:ring-indigo outline-none bg-white">
          <option value="">Select a category...</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="website" className="font-bold text-ink">Website URL</label>
        <input type="url" id="website" name="website" placeholder="https://example.com" className="border border-indigo/20 rounded-md p-3 focus:ring-2 focus:ring-indigo outline-none" />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="font-bold text-ink">Product Description *</label>
        <textarea id="description" name="description" required minLength={20} maxLength={5000} rows={5} placeholder="Describe what your software does, who it's for, and your key features..." className="border border-indigo/20 rounded-md p-3 focus:ring-2 focus:ring-indigo outline-none"></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="pricingText" className="font-bold text-ink">Pricing Summary (Optional)</label>
          <input type="text" id="pricingText" name="pricingText" placeholder="e.g. Starts at ₹999/month" className="border border-indigo/20 rounded-md p-3 focus:ring-2 focus:ring-indigo outline-none" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="hqCity" className="font-bold text-ink">HQ City (Optional)</label>
          <input type="text" id="hqCity" name="hqCity" placeholder="e.g. Bangalore, India" className="border border-indigo/20 rounded-md p-3 focus:ring-2 focus:ring-indigo outline-none" />
        </div>
      </div>

      <div className="pt-4 border-t border-indigo/10 mt-2">
        <SubmitButton className="w-full bg-indigo text-paper font-bold text-lg py-4 rounded-lg hover:bg-indigo/90 transition-colors shadow-sm">
          Submit for Review
        </SubmitButton>
        <p className="text-xs text-ink/50 text-center mt-3">
          By submitting, you agree to our Terms of Service and Publisher Guidelines.
        </p>
      </div>
    </form>
  )
}
