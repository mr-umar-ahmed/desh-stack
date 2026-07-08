"use server"

import { requireAuth } from "@/lib/rbac"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const reviewSchema = z.object({
  productId: z.string().min(1),
  overallRating: z.coerce.number().min(1).max(5),
  title: z.string().min(3).max(100),
  body: z.string().min(20).max(2000),
  pros: z.string().transform(str => str.split('\n').filter(p => p.trim() !== '')),
  cons: z.string().transform(str => str.split('\n').filter(c => c.trim() !== '')),
  companySize: z.enum(['JUST_ME', 'SMALL_1_49', 'MEDIUM_50_249', 'LARGE_250_999', 'ENTERPRISE_1000_PLUS']).optional().or(z.literal('')),
  usageDuration: z.enum(['LESS_THAN_6_MONTHS', 'SIX_TO_12_MONTHS', 'ONE_TO_2_YEARS', 'MORE_THAN_2_YEARS']).optional().or(z.literal(''))
})

export async function submitReview(formData: FormData) {
  const user = await requireAuth()

  const rawData = {
    productId: formData.get('productId'),
    overallRating: formData.get('overallRating'),
    title: formData.get('title'),
    body: formData.get('body'),
    pros: formData.get('pros'),
    cons: formData.get('cons'),
    companySize: formData.get('companySize'),
    usageDuration: formData.get('usageDuration'),
  }

  const parsed = reviewSchema.safeParse(rawData)

  if (!parsed.success) {
    return { error: "Invalid form data. Please check your inputs." }
  }

  const data = parsed.data

  // Check if review already exists
  const existingReview = await prisma.review.findUnique({
    where: {
      userId_productId: {
        userId: user.id as string,
        productId: data.productId
      }
    }
  })

  if (existingReview) {
    return { error: "You have already reviewed this product." }
  }

  await prisma.review.create({
    data: {
      userId: user.id as string,
      productId: data.productId,
      overallRating: data.overallRating,
      title: data.title,
      body: data.body,
      pros: data.pros,
      cons: data.cons,
      companySize: data.companySize || null,
      usageDuration: data.usageDuration || null,
      status: 'PENDING'
    }
  })

  return { success: true }
}
