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
        description: "GST-compliant accounting, invoicing, and tax filing software.",
        axisWeights: { "vision": ["VALUE", "INTEGRATIONS"], "execution": ["EASE_OF_USE", "LOCAL_SUPPORT"] }
      },
      {
        name: "HRMS & Payroll",
        slug: "hrms",
        description: "Human Resource Management Systems for Indian payroll and compliance.",
        axisWeights: { "vision": ["VALUE", "INTEGRATIONS"], "execution": ["EASE_OF_USE", "LOCAL_SUPPORT"] }
      },
      {
        name: "CRM",
        slug: "crm",
        description: "Customer Relationship Management and sales execution platforms.",
        axisWeights: { "vision": ["VALUE", "INTEGRATIONS"], "execution": ["EASE_OF_USE", "LOCAL_SUPPORT"] }
      },
      {
        name: "Payment Gateways",
        slug: "payment-gateways",
        description: "Online payment processing, checkout integrations, and payouts.",
        axisWeights: { "vision": ["VALUE", "INTEGRATIONS"], "execution": ["EASE_OF_USE", "LOCAL_SUPPORT"] }
      },
      {
        name: "Helpdesk",
        slug: "helpdesk",
        description: "Customer support, ticketing, and conversation management.",
        axisWeights: { "vision": ["VALUE", "INTEGRATIONS"], "execution": ["EASE_OF_USE", "LOCAL_SUPPORT"] }
      },
      {
        name: "Security & Compliance",
        slug: "security-compliance",
        description: "Security compliance automation, auditing, and DPDP frameworks.",
        axisWeights: { "vision": ["VALUE", "INTEGRATIONS"], "execution": ["EASE_OF_USE", "LOCAL_SUPPORT"] }
      },
      {
        name: "IT - Hardware",
        slug: "it-hardware",
        description: "Enterprise servers, office networking equipment, and computing devices.",
        axisWeights: { "vision": ["VALUE", "INTEGRATIONS"], "execution": ["EASE_OF_USE", "LOCAL_SUPPORT"] }
      },
      {
        name: "IT - Software",
        slug: "it-software",
        description: "Developer utilities, operating systems, and enterprise business applications.",
        axisWeights: { "vision": ["VALUE", "INTEGRATIONS"], "execution": ["EASE_OF_USE", "LOCAL_SUPPORT"] }
      },
      {
        name: "IT - Cloud",
        slug: "it-cloud",
        description: "Cloud infrastructure providers, database hosting, and web hosting.",
        axisWeights: { "vision": ["VALUE", "INTEGRATIONS"], "execution": ["EASE_OF_USE", "LOCAL_SUPPORT"] }
      },
      {
        name: "Food Industry - Soft Drink",
        slug: "food-soft-drink",
        description: "Beverage manufacturing, retail display, and soft drink distribution systems.",
        axisWeights: { "vision": ["VALUE", "INTEGRATIONS"], "execution": ["EASE_OF_USE", "LOCAL_SUPPORT"] }
      },
      {
        name: "Food Industry - Ready Made Packet",
        slug: "food-ready-made-packet",
        description: "Ready-to-eat meals, FMCG packaging, and inventory tracking tools.",
        axisWeights: { "vision": ["VALUE", "INTEGRATIONS"], "execution": ["EASE_OF_USE", "LOCAL_SUPPORT"] }
      },
      {
        name: "Construction - Structure",
        slug: "construction-structure",
        description: "Structural engineering models, building frameworks, and CAD/BIM software.",
        axisWeights: { "vision": ["VALUE", "INTEGRATIONS"], "execution": ["EASE_OF_USE", "LOCAL_SUPPORT"] }
      },
      {
        name: "Construction - Steel",
        slug: "construction-steel",
        description: "Steel procurement portals, heavy industry fabrication, and structural steel logs.",
        axisWeights: { "vision": ["VALUE", "INTEGRATIONS"], "execution": ["EASE_OF_USE", "LOCAL_SUPPORT"] }
      },
      {
        name: "Construction - Cement",
        slug: "construction-cement",
        description: "Cement supplier logistics, concrete mix management, and dealer portals.",
        axisWeights: { "vision": ["VALUE", "INTEGRATIONS"], "execution": ["EASE_OF_USE", "LOCAL_SUPPORT"] }
      },
      {
        name: "Construction - Interior",
        slug: "construction-interior",
        description: "Interior design software, commercial space fit-outs, and architectural visualization.",
        axisWeights: { "vision": ["VALUE", "INTEGRATIONS"], "execution": ["EASE_OF_USE", "LOCAL_SUPPORT"] }
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
