"use server"

import { requireRole } from "@/lib/rbac"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { sendProductApprovedEmail } from "@/lib/email"

export async function approveReview(id: string) {
  await requireRole(["ADMIN", "MODERATOR"])

  await prisma.review.update({
    where: { id },
    data: {
      status: "PUBLISHED",
      publishedAt: new Date()
    }
  })

  revalidatePath("/admin/reviews")
}

export async function rejectReview(id: string) {
  await requireRole(["ADMIN", "MODERATOR"])

  await prisma.review.update({
    where: { id },
    data: {
      status: "REJECTED"
    }
  })

  revalidatePath("/admin/reviews")
}

export async function approveProduct(id: string) {
  await requireRole(["ADMIN", "MODERATOR"])

  const product = await prisma.product.update({
    where: { id },
    data: {
      status: "APPROVED"
    },
    include: { publisher: true }
  })

  if (product.publisher.email) {
    await sendProductApprovedEmail(product.publisher.email, product.name, product.slug)
  }

  revalidatePath("/admin/products")
}

export async function rejectProduct(id: string) {
  await requireRole(["ADMIN", "MODERATOR"])

  await prisma.product.update({
    where: { id },
    data: {
      status: "REJECTED"
    }
  })

  revalidatePath("/admin/products")
}
