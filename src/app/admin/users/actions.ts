"use server"

import { requireRole } from "@/lib/rbac"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Role } from "@prisma/client"

export async function changeUserRole(userId: string, newRole: Role) {
  await requireRole(["ADMIN"])

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  })

  revalidatePath("/admin/users")
}

export async function suspendUser(userId: string) {
  await requireRole(["ADMIN"])

  await prisma.user.update({
    where: { id: userId },
    data: { status: "SUSPENDED" },
  })

  revalidatePath("/admin/users")
}

export async function activateUser(userId: string) {
  await requireRole(["ADMIN"])

  await prisma.user.update({
    where: { id: userId },
    data: { status: "ACTIVE" },
  })

  revalidatePath("/admin/users")
}
