"use server"

import { requireAuth } from "@/lib/rbac"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Basic slugify function
function slugify(text: string) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

const productSchema = z.object({
  name: z.string().min(2).max(100),
  categoryId: z.string().min(1),
  description: z.string().min(20).max(5000),
  website: z.string().url().or(z.literal('')),
  hqCity: z.string().max(100).optional(),
  pricingText: z.string().max(200).optional()
})

export async function submitProduct(formData: FormData) {
  const user = await requireAuth()

  const rawData = {
    name: formData.get('name'),
    categoryId: formData.get('categoryId'),
    description: formData.get('description'),
    website: formData.get('website'),
    hqCity: formData.get('hqCity'),
    pricingText: formData.get('pricingText')
  }

  const parsed = productSchema.safeParse(rawData)

  if (!parsed.success) {
    return { error: "Invalid form data. Please check your inputs." }
  }

  const data = parsed.data
  const baseSlug = slugify(data.name)
  let slug = baseSlug
  let counter = 1

  // Ensure unique slug
  while (true) {
    const existing = await prisma.product.findUnique({ where: { slug } })
    if (!existing) break
    slug = `${baseSlug}-${counter}`
    counter++
  }

  await prisma.product.create({
    data: {
      name: data.name,
      slug,
      categoryId: data.categoryId,
      publisherId: user.id as string,
      description: data.description,
      website: data.website || null,
      hqCity: data.hqCity || null,
      pricingText: data.pricingText || null,
      status: "PENDING"
    }
  })

  return { success: true }
}
