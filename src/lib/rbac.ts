import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"
import { redirect } from "next/navigation"

export type AuthUser = {
  id: string
  clerkId: string
  email: string
  name: string | null
  role: Role
  image: string | null
}

export async function requireAuth(): Promise<AuthUser> {
  const clerkUser = await currentUser()
  if (!clerkUser) {
    redirect("/sign-in")
  }

  // Find or create the user in our DB
  let user = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  })

  if (!user) {
    // Auto-create user on first access
    const email = clerkUser.emailAddresses[0]?.emailAddress
    if (!email) throw new Error("No email found")

    // Check if a user with this email already exists (e.g., from seed data)
    user = await prisma.user.findUnique({ where: { email } })
    const isMasterAdmin = email === "mylearning069@gmail.com"

    // Role chosen at sign-up travels in Clerk unsafeMetadata. Only USER and
    // PUBLISHER are self-selectable; ADMIN is reserved for the master email.
    const requestedRole =
      (clerkUser.unsafeMetadata?.role as string) === "PUBLISHER"
        ? Role.PUBLISHER
        : Role.USER
    const assignedRole = isMasterAdmin ? Role.ADMIN : requestedRole

    if (user) {
      // Link existing user to Clerk
      user = await prisma.user.update({
        where: { email },
        data: { 
          clerkId: clerkUser.id, 
          name: clerkUser.fullName || user.name, 
          image: clerkUser.imageUrl || user.image,
          role: isMasterAdmin ? Role.ADMIN : user.role
        },
      })
    } else {
      user = await prisma.user.create({
        data: {
          clerkId: clerkUser.id,
          email,
          name: clerkUser.fullName,
          image: clerkUser.imageUrl,
          role: assignedRole
        },
      })
    }
  } else if (user.email === "mylearning069@gmail.com" && user.role !== Role.ADMIN) {
    // If the master admin somehow isn't marked as ADMIN, force-update it
    user = await prisma.user.update({
      where: { id: user.id },
      data: { role: Role.ADMIN }
    })
  } else if (
    user.role === Role.USER &&
    (clerkUser.unsafeMetadata?.role as string) === "PUBLISHER"
  ) {
    // The Clerk webhook used to create users as USER regardless of the role
    // they chose at sign-up. Honor the original vendor choice here so those
    // accounts aren't locked out of the publisher portal. Staff roles are
    // never changed by this path.
    user = await prisma.user.update({
      where: { id: user.id },
      data: { role: Role.PUBLISHER },
    })
  }

  return {
    id: user.id,
    clerkId: user.clerkId!,
    email: user.email,
    name: user.name,
    role: user.role,
    image: user.image,
  }
}

export async function requireRole(allowedRoles: Role[]): Promise<AuthUser> {
  const user = await requireAuth()
  if (!allowedRoles.includes(user.role)) {
    redirect("/")
  }
  return user
}

export async function isAdmin(): Promise<boolean> {
  try {
    const user = await requireAuth()
    return user.role === Role.ADMIN
  } catch {
    return false
  }
}

export async function isModerator(): Promise<boolean> {
  try {
    const user = await requireAuth()
    return user.role === Role.MODERATOR || user.role === Role.ADMIN
  } catch {
    return false
  }
}

export async function isPublisher(): Promise<boolean> {
  try {
    const user = await requireAuth()
    return user.role === Role.PUBLISHER
  } catch {
    return false
  }
}
