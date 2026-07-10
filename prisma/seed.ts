import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create Categories
  const categories = [
    { name: "Accounting", slug: "accounting", description: "GST-compliant accounting, invoicing, and tax filing software.", axisWeights: { "vision": ["VALUE", "INTEGRATIONS"], "execution": ["EASE_OF_USE", "LOCAL_SUPPORT"] } },
    { name: "HRMS & Payroll", slug: "hrms", description: "Human Resource Management Systems for Indian payroll and compliance.", axisWeights: { "vision": ["VALUE", "INTEGRATIONS"], "execution": ["EASE_OF_USE", "LOCAL_SUPPORT"] } },
    { name: "CRM", slug: "crm", description: "Customer Relationship Management and sales execution platforms.", axisWeights: { "vision": ["VALUE", "INTEGRATIONS"], "execution": ["EASE_OF_USE", "LOCAL_SUPPORT"] } },
    { name: "Payment Gateways", slug: "payment-gateways", description: "Online payment processing, checkout integrations, and payouts.", axisWeights: { "vision": ["VALUE", "INTEGRATIONS"], "execution": ["EASE_OF_USE", "LOCAL_SUPPORT"] } },
    { name: "Helpdesk", slug: "helpdesk", description: "Customer support, ticketing, and conversation management.", axisWeights: { "vision": ["VALUE", "INTEGRATIONS"], "execution": ["EASE_OF_USE", "LOCAL_SUPPORT"] } },
    { name: "Security & Compliance", slug: "security-compliance", description: "Security compliance automation, auditing, and DPDP frameworks.", axisWeights: { "vision": ["VALUE", "INTEGRATIONS"], "execution": ["EASE_OF_USE", "LOCAL_SUPPORT"] } },
    { name: "IT - Hardware", slug: "it-hardware", description: "Enterprise servers, office networking equipment, and computing devices.", axisWeights: { "vision": ["VALUE", "INTEGRATIONS"], "execution": ["EASE_OF_USE", "LOCAL_SUPPORT"] } },
    { name: "IT - Software", slug: "it-software", description: "Developer utilities, operating systems, and enterprise business applications.", axisWeights: { "vision": ["VALUE", "INTEGRATIONS"], "execution": ["EASE_OF_USE", "LOCAL_SUPPORT"] } },
    { name: "IT - Cloud", slug: "it-cloud", description: "Cloud infrastructure providers, database hosting, and web hosting.", axisWeights: { "vision": ["VALUE", "INTEGRATIONS"], "execution": ["EASE_OF_USE", "LOCAL_SUPPORT"] } },
    { name: "Food Industry - Soft Drink", slug: "food-soft-drink", description: "Beverage manufacturing, retail display, and soft drink distribution systems.", axisWeights: { "vision": ["VALUE", "INTEGRATIONS"], "execution": ["EASE_OF_USE", "LOCAL_SUPPORT"] } },
    { name: "Food Industry - Ready Made Packet", slug: "food-ready-made-packet", description: "Ready-to-eat meals, FMCG packaging, and inventory tracking tools.", axisWeights: { "vision": ["VALUE", "INTEGRATIONS"], "execution": ["EASE_OF_USE", "LOCAL_SUPPORT"] } },
    { name: "Construction - Structure", slug: "construction-structure", description: "Structural engineering models, building frameworks, and CAD/BIM software.", axisWeights: { "vision": ["VALUE", "INTEGRATIONS"], "execution": ["EASE_OF_USE", "LOCAL_SUPPORT"] } },
    { name: "Construction - Steel", slug: "construction-steel", description: "Steel procurement portals, heavy industry fabrication, and structural steel logs.", axisWeights: { "vision": ["VALUE", "INTEGRATIONS"], "execution": ["EASE_OF_USE", "LOCAL_SUPPORT"] } },
    { name: "Construction - Cement", slug: "construction-cement", description: "Cement supplier logistics, concrete mix management, and dealer portals.", axisWeights: { "vision": ["VALUE", "INTEGRATIONS"], "execution": ["EASE_OF_USE", "LOCAL_SUPPORT"] } },
    { name: "Construction - Interior", slug: "construction-interior", description: "Interior design software, commercial space fit-outs, and architectural visualization.", axisWeights: { "vision": ["VALUE", "INTEGRATIONS"], "execution": ["EASE_OF_USE", "LOCAL_SUPPORT"] } }
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }

  console.log('Categories seeded')

  // Create Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@deshstack.com' },
    update: {},
    create: { email: 'admin@deshstack.com', name: 'Admin User', role: 'ADMIN', status: 'ACTIVE' },
  })

  const publisher = await prisma.user.upsert({
    where: { email: 'publisher@zohocorp.com' },
    update: {},
    create: { email: 'publisher@zohocorp.com', name: 'Zoho Publisher', role: 'PUBLISHER', company: 'Zoho', status: 'ACTIVE' },
  })

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: { email: 'user@example.com', name: 'Regular User', role: 'USER', status: 'ACTIVE' },
  })

  console.log('Users seeded')

  // Create Products & Scores
  const crmCategory = await prisma.category.findUnique({ where: { slug: 'crm' } })
  const pgCategory = await prisma.category.findUnique({ where: { slug: 'payment-gateways' } })
  
  if (crmCategory) {
    // Zoho CRM (Leader)
    const zoho = await prisma.product.upsert({
      where: { slug: 'zoho-crm' },
      update: {},
      create: {
        name: 'Zoho CRM',
        slug: 'zoho-crm',
        categoryId: crmCategory.id,
        publisherId: publisher.id,
        description: 'Comprehensive CRM for Indian businesses.',
        hqCity: 'Chennai',
        pricingText: 'Starts at ₹900/user/month',
        status: 'APPROVED',
      },
    })
    
    await prisma.productScore.upsert({
      where: { productId: zoho.id },
      update: {},
      create: { productId: zoho.id, visionScore: 4.8, executionScore: 4.6, avgRating: 4.8, reviewCount: 15 }
    })

    // LeadSquared (Challenger)
    const leadsquared = await prisma.product.upsert({
      where: { slug: 'leadsquared' },
      update: {},
      create: {
        name: 'LeadSquared',
        slug: 'leadsquared',
        categoryId: crmCategory.id,
        publisherId: publisher.id, // using same publisher for brevity
        description: 'High velocity sales execution and marketing automation platform.',
        hqCity: 'Bengaluru',
        pricingText: 'Starts at ₹1250/user/month',
        status: 'APPROVED',
      },
    })

    await prisma.productScore.upsert({
      where: { productId: leadsquared.id },
      update: {},
      create: { productId: leadsquared.id, visionScore: 3.5, executionScore: 4.5, avgRating: 4.2, reviewCount: 8 }
    })
    
    // Freshsales (Visionary)
    const freshsales = await prisma.product.upsert({
      where: { slug: 'freshsales' },
      update: {},
      create: {
        name: 'Freshsales',
        slug: 'freshsales',
        categoryId: crmCategory.id,
        publisherId: publisher.id,
        description: 'AI-powered CRM that helps businesses grow.',
        hqCity: 'Chennai',
        pricingText: 'Starts at ₹1199/user/month',
        status: 'APPROVED',
      },
    })

    await prisma.productScore.upsert({
      where: { productId: freshsales.id },
      update: {},
      create: { productId: freshsales.id, visionScore: 4.7, executionScore: 3.9, avgRating: 4.5, reviewCount: 12 }
    })
  }

  if (pgCategory) {
    // Razorpay (Leader)
    const razorpay = await prisma.product.upsert({
      where: { slug: 'razorpay' },
      update: {},
      create: {
        name: 'Razorpay',
        slug: 'razorpay',
        categoryId: pgCategory.id,
        publisherId: publisher.id,
        description: 'The easiest way to accept, process and disburse digital payments.',
        hqCity: 'Bengaluru',
        pricingText: '2% per transaction',
        status: 'APPROVED',
      },
    })

    await prisma.productScore.upsert({
      where: { productId: razorpay.id },
      update: {},
      create: { productId: razorpay.id, visionScore: 4.9, executionScore: 4.8, avgRating: 4.9, reviewCount: 25 }
    })
  }

  console.log('Products and scores seeded')
  console.log('Seed completed successfully')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
