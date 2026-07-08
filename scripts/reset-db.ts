import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  console.log("Starting DB and Clerk reset...")
  
  const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY
  if (!CLERK_SECRET_KEY) {
    throw new Error("Missing CLERK_SECRET_KEY")
  }

  // 1. Wipe Prisma Database
  console.log("Wiping Prisma Database...")
  await prisma.auditLog.deleteMany()
  await prisma.savedProduct.deleteMany()
  await prisma.categoryFollow.deleteMany()
  await prisma.vendorResponse.deleteMany()
  await prisma.report.deleteMany()
  await prisma.reviewDimensionScore.deleteMany()
  await prisma.review.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.pricingTier.deleteMany()
  await prisma.productScore.deleteMany()
  await prisma.product.deleteMany()
  await prisma.vendorRequest.deleteMany()
  await prisma.user.deleteMany()
  await prisma.category.deleteMany()
  console.log("Prisma Database wiped.")

  // 2. Wipe Clerk Users
  console.log("Fetching Clerk users...")
  let users: any[] = []
  let res = await fetch("https://api.clerk.com/v1/users?limit=500", {
    headers: { Authorization: `Bearer ${CLERK_SECRET_KEY}` }
  })
  if (res.ok) {
    users = await res.json()
    console.log(`Found ${users.length} users in Clerk. Deleting...`)
    for (const user of users) {
      await fetch(`https://api.clerk.com/v1/users/${user.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${CLERK_SECRET_KEY}` }
      })
    }
    console.log("All Clerk users deleted.")
  } else {
    console.error("Failed to fetch Clerk users:", await res.text())
  }

  // 3. Create mylearning069@gmail.com in Clerk
  console.log("Creating mylearning069@gmail.com in Clerk...")
  const createRes = await fetch("https://api.clerk.com/v1/users", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CLERK_SECRET_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email_address: ["mylearning069@gmail.com"],
      password: "mylearning069",
      first_name: "Admin",
      last_name: "User",
      skip_password_checks: true
    })
  })

  if (!createRes.ok) {
    throw new Error(`Failed to create Clerk user: ${await createRes.text()}`)
  }
  
  const newClerkUser = await createRes.json()
  console.log("Clerk User Created:", newClerkUser.id)

  // 4. Create mylearning069@gmail.com in Prisma
  console.log("Creating mylearning069@gmail.com in Prisma...")
  await prisma.user.create({
    data: {
      clerkId: newClerkUser.id,
      email: "mylearning069@gmail.com",
      name: "Admin User",
      role: "ADMIN"
    }
  })
  
  // 5. Seed some basic categories so the app isn't completely empty
  await prisma.category.createMany({
    data: [
      {
        name: "Accounting",
        slug: "accounting",
        description: "Software for GST-compliant accounting and bookkeeping.",
        axisWeights: { "vision": ["VALUE"], "execution": ["EASE_OF_USE"] }
      },
      {
        name: "HRMS",
        slug: "hrms",
        description: "Human Resource Management Systems for Indian payroll and compliance.",
        axisWeights: { "vision": ["INTEGRATIONS"], "execution": ["LOCAL_SUPPORT"] }
      }
    ]
  })

  console.log("Reset Complete! Admin credentials:")
  console.log("Email: mylearning069@gmail.com")
  console.log("Password: mylearning069")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
