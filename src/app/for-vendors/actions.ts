"use server"

import { requireAuth } from "@/lib/rbac"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

/**
 * Product Hunt model: any signed-in user can start listing products.
 * Upgrades a plain USER to PUBLISHER and sends them straight to the
 * submit flow. Staff roles are never touched.
 */
export async function becomeVendor() {
  const user = await requireAuth()

  if (user.role === "USER") {
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "PUBLISHER" },
    })
  }

  redirect("/publisher/products/new")
}
