"use client"

import { toast } from "sonner"
import { SubmitButton } from "@/components/SubmitButton"
import { submitReview } from "./actions"
import { useRouter } from "next/navigation"

export function ReviewForm({ productId }: { productId: string }) {
  const router = useRouter()

  async function action(formData: FormData) {
    try {
      const res = await submitReview(formData)
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success("Review submitted successfully!")
        router.push("/dashboard")
      }
    } catch (e: unknown) {
      const error = e as Error
      toast.error(error.message || "An unexpected error occurred.")
    }
  }

  return (
    <form action={action} className="flex flex-col gap-6">
      <input type="hidden" name="productId" value={productId} />
      
      <div className="flex flex-col gap-2">
        <label htmlFor="overallRating" className="font-bold text-ink">Overall Rating (1-5) *</label>
        <input type="number" id="overallRating" name="overallRating" min="1" max="5" required className="border border-indigo/20 rounded-md p-3 focus:ring-2 focus:ring-indigo outline-none" />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="font-bold text-ink">Review Title *</label>
        <input type="text" id="title" name="title" required minLength={3} maxLength={100} placeholder="Summarize your experience" className="border border-indigo/20 rounded-md p-3 focus:ring-2 focus:ring-indigo outline-none" />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="body" className="font-bold text-ink">Review Details *</label>
        <textarea id="body" name="body" required minLength={20} maxLength={2000} rows={5} placeholder="What did you like or dislike? How did you use it?" className="border border-indigo/20 rounded-md p-3 focus:ring-2 focus:ring-indigo outline-none"></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="pros" className="font-bold text-ink">Pros (One per line)</label>
          <textarea id="pros" name="pros" rows={3} placeholder="Great customer support&#10;Easy to use" className="border border-indigo/20 rounded-md p-3 focus:ring-2 focus:ring-indigo outline-none"></textarea>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="cons" className="font-bold text-ink">Cons (One per line)</label>
          <textarea id="cons" name="cons" rows={3} placeholder="Pricing is steep&#10;Lacks integrations" className="border border-indigo/20 rounded-md p-3 focus:ring-2 focus:ring-indigo outline-none"></textarea>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="companySize" className="font-bold text-ink">Company Size (Optional)</label>
          <select id="companySize" name="companySize" className="border border-indigo/20 rounded-md p-3 focus:ring-2 focus:ring-indigo outline-none bg-white">
            <option value="">Select size...</option>
            <option value="JUST_ME">Just Me</option>
            <option value="SMALL_1_49">1-49 employees</option>
            <option value="MEDIUM_50_249">50-249 employees</option>
            <option value="LARGE_250_999">250-999 employees</option>
            <option value="ENTERPRISE_1000_PLUS">1000+ employees</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="usageDuration" className="font-bold text-ink">Usage Duration (Optional)</label>
          <select id="usageDuration" name="usageDuration" className="border border-indigo/20 rounded-md p-3 focus:ring-2 focus:ring-indigo outline-none bg-white">
            <option value="">Select duration...</option>
            <option value="LESS_THAN_6_MONTHS">Less than 6 months</option>
            <option value="SIX_TO_12_MONTHS">6-12 months</option>
            <option value="ONE_TO_2_YEARS">1-2 years</option>
            <option value="MORE_THAN_2_YEARS">More than 2 years</option>
          </select>
        </div>
      </div>

      <div className="pt-4 border-t border-indigo/10 mt-2">
        <SubmitButton className="w-full bg-indigo text-paper font-bold text-lg py-4 rounded-lg hover:bg-indigo/90 transition-colors shadow-sm">
          Submit Review
        </SubmitButton>
        <p className="text-xs text-ink/50 text-center mt-3">
          Your review will be analyzed by our moderation team before being published.
        </p>
      </div>
    </form>
  )
}
