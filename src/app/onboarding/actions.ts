"use server"

import { auth, clerkClient } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

export async function completeOnboarding(roleSelection: "USER" | "VENDOR") {
  const { userId } = await auth()
  
  if (!userId) {
    redirect("/sign-in")
  }

  // 1. Update Clerk publicMetadata
  const client = await clerkClient()
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      onboardingComplete: true,
    }
  })

  // 2. Update or Create Prisma User
  const clerkUsr = await client.users.getUser(userId)
  const email = clerkUsr.emailAddresses[0]?.emailAddress || "unknown@deshstack.com"
  const name = clerkUsr.firstName ? `${clerkUsr.firstName} ${clerkUsr.lastName || ''}`.trim() : null

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { clerkId: userId },
        { email: email }
      ]
    }
  })

  if (existingUser) {
    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        clerkId: userId,
        name: name || existingUser.name,
        onboardingComplete: true
      }
    })
  } else {
    await prisma.user.create({
      data: {
        clerkId: userId,
        email: email,
        name: name,
        onboardingComplete: true
      }
    })
  }

  // 3. Set onboarding cookie
  const cookieStore = await cookies()
  cookieStore.set(`onboarding_${userId}`, "true", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  })

  // 4. Redirect based on selection
  if (roleSelection === "VENDOR") {
    redirect("/for-vendors")
  } else {
    redirect("/dashboard")
  }
}
