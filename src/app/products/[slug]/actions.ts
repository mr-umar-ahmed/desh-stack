"use server"

import { requireAuth } from "@/lib/rbac"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function toggleSaveProduct(productId: string, slug: string) {
  const user = await requireAuth()

  const existingSave = await prisma.savedProduct.findUnique({
    where: {
      userId_productId: {
        userId: user.id as string,
        productId: productId
      }
    }
  })

  if (existingSave) {
    await prisma.savedProduct.delete({
      where: {
        userId_productId: {
          userId: user.id as string,
          productId: productId
        }
      }
    })
  } else {
    await prisma.savedProduct.create({
      data: {
        userId: user.id as string,
        productId: productId
      }
    })
  }

  revalidatePath(`/products/${slug}`)
  revalidatePath('/dashboard')
}

/**
 * Product Hunt-style upvote toggle. Returns the new state so the client
 * button can reconcile its optimistic update.
 */
export async function toggleUpvote(productId: string, slug: string) {
  const user = await requireAuth()

  const key = { userId_productId: { userId: user.id, productId } }
  const existing = await prisma.upvote.findUnique({ where: key })

  if (existing) {
    await prisma.upvote.delete({ where: key })
  } else {
    await prisma.upvote.create({ data: { userId: user.id, productId } })
  }

  const count = await prisma.upvote.count({ where: { productId } })

  revalidatePath(`/products/${slug}`)
  revalidatePath('/')
  revalidatePath('/products')

  return { upvoted: !existing, count }
}
