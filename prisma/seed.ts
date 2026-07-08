import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create Categories
  const categories = [
    { name: 'CRM', slug: 'crm', description: 'Customer Relationship Management', axisWeights: { vision: ['VALUE', 'INTEGRATIONS'], execution: ['EASE_OF_USE', 'LOCAL_SUPPORT'] } },
    { name: 'HRMS', slug: 'hrms', description: 'Human Resource Management System', axisWeights: { vision: ['VALUE', 'INTEGRATIONS'], execution: ['EASE_OF_USE', 'LOCAL_SUPPORT'] } },
    { name: 'Payment Gateways', slug: 'payment-gateways', description: 'Online payment processing', axisWeights: { vision: ['VALUE', 'INTEGRATIONS'], execution: ['EASE_OF_USE', 'LOCAL_SUPPORT'] } },
    { name: 'Helpdesk', slug: 'helpdesk', description: 'Customer support and ticketing', axisWeights: { vision: ['VALUE', 'INTEGRATIONS'], execution: ['EASE_OF_USE', 'LOCAL_SUPPORT'] } },
    { name: 'Accounting', slug: 'accounting', description: 'Financial accounting software', axisWeights: { vision: ['VALUE', 'INTEGRATIONS'], execution: ['EASE_OF_USE', 'LOCAL_SUPPORT'] } },
    { name: 'Security & Compliance', slug: 'security-compliance', description: 'Security and compliance automation', axisWeights: { vision: ['VALUE', 'INTEGRATIONS'], execution: ['EASE_OF_USE', 'LOCAL_SUPPORT'] } },
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
