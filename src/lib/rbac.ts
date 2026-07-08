import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"

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
    throw new Error("Unauthorized")
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
    if (user) {
      // Link existing user to Clerk
      user = await prisma.user.update({
        where: { email },
        data: { clerkId: clerkUser.id, name: clerkUser.fullName || user.name, image: clerkUser.imageUrl || user.image },
      })
    } else {
      user = await prisma.user.create({
        data: {
          clerkId: clerkUser.id,
          email,
          name: clerkUser.fullName,
          image: clerkUser.imageUrl,
        },
      })
    }
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
    throw new Error("Forbidden")
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
