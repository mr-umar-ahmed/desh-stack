"use server"

import { requireRole } from "@/lib/rbac"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { sendVendorApprovedEmail } from "@/lib/email"

export async function approveVendorRequest(requestId: string) {
  await requireRole(["ADMIN", "MODERATOR"])
  
  let approvedUserEmail = ""
  let approvedUserName = ""

  // Update request status and user role in a transaction
  await prisma.$transaction(async (tx) => {
    const req = await tx.vendorRequest.update({
      where: { id: requestId },
      data: { status: "APPROVED" },
      include: { user: true }
    })
    
    approvedUserEmail = req.user.email
    approvedUserName = req.user.name || req.companyName

    await tx.user.update({
      where: { id: req.userId },
      data: { role: "PUBLISHER" }
    })
  })
  
  if (approvedUserEmail) {
    await sendVendorApprovedEmail(approvedUserEmail, approvedUserName)
  }

  revalidatePath("/admin/vendors")
}

export async function rejectVendorRequest(requestId: string) {
  await requireRole(["ADMIN", "MODERATOR"])
  await prisma.vendorRequest.update({
    where: { id: requestId },
    data: { status: "REJECTED" }
  })
  revalidatePath("/admin/vendors")
}
