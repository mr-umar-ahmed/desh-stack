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
