/**
 * Sponsored product data for the ad system.
 *
 * In production, this would come from the database
 * (products with an active "Sponsored" subscription).
 * For now we use representative placeholder data.
 */

export interface SponsoredProduct {
  id: string
  name: string
  slug: string
  tagline: string
  logoUrl: string | null
  ctaText: string
  ctaUrl: string
  category: string
  highlight?: string
}

export const sponsoredProducts: SponsoredProduct[] = [
  {
    id: "sp-1",
    name: "TallyPrime",
    slug: "tallyprime",
    tagline: "India's #1 business management software — GST-ready accounting, inventory & payroll in one platform.",
    logoUrl: null,
    ctaText: "Learn More",
    ctaUrl: "/products/tallyprime",
    category: "Accounting",
    highlight: "Trusted by 7M+ businesses",
  },
  {
    id: "sp-2",
    name: "Zoho CRM",
    slug: "zoho-crm",
    tagline: "Supercharge your sales with AI-powered CRM built by an Indian company, for global enterprises.",
    logoUrl: null,
    ctaText: "Start Free Trial",
    ctaUrl: "/products/zoho-crm",
    category: "CRM",
    highlight: "250K+ businesses worldwide",
  },
  {
    id: "sp-3",
    name: "Razorpay",
    slug: "razorpay",
    tagline: "Accept payments, automate payouts & manage finances — the complete payment stack for Indian startups.",
    logoUrl: null,
    ctaText: "Get Started",
    ctaUrl: "/products/razorpay",
    category: "Payments",
    highlight: "Powers 10M+ businesses",
  },
  {
    id: "sp-4",
    name: "Freshdesk",
    slug: "freshdesk",
    tagline: "Delight customers with omnichannel support — ticketing, chat, phone & more from Freshworks.",
    logoUrl: null,
    ctaText: "Try Free",
    ctaUrl: "/products/freshdesk",
    category: "Customer Support",
    highlight: "60K+ companies trust us",
  },
]
