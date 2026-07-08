"use server"

import { requireAuth } from "@/lib/rbac"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export async function submitVendorRequest(formData: FormData) {
  const user = await requireAuth()

  const companyName = formData.get("companyName") as string
  const website = formData.get("website") as string

  if (!companyName) {
    throw new Error("Company name is required")
  }

  // Check if they already have a pending or approved request
  const existingRequest = await prisma.vendorRequest.findFirst({
    where: { userId: user.id }
  })

  if (existingRequest) {
    throw new Error("You have already submitted a request.")
  }

  await prisma.vendorRequest.create({
    data: {
      userId: user.id,
      companyName,
      website
    }
  })

  // Refresh page to show pending state
  redirect("/for-vendors")
}
