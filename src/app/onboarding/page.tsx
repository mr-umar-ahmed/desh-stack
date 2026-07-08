import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { completeOnboarding } from "./actions"
import { Building2, Search, ArrowRight } from "lucide-react"
import { prisma } from "@/lib/prisma"

export default async function OnboardingPage() {
  const user = await currentUser()
  if (!user) {
    redirect("/sign-in")
  }

  // Check database first
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id }
  })

  const email = user.emailAddresses[0]?.emailAddress

  if (email === "mylearning069@gmail.com") {
    if (!dbUser || !dbUser.onboardingComplete || dbUser.role !== "ADMIN") {
      await prisma.user.upsert({
        where: { clerkId: user.id },
        update: { role: "ADMIN", onboardingComplete: true },
        create: {
          clerkId: user.id,
          email: email,
          name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : null,
          role: "ADMIN",
          onboardingComplete: true
        }
      })
    }
    redirect(`/api/onboarding-sync?redirect=/admin`)
  }

  if (dbUser?.onboardingComplete) {
    const isVendor = dbUser.role === "PUBLISHER" || dbUser.role === "ADMIN"
    const redirectUrl = dbUser.role === "ADMIN" ? "/admin" : (isVendor ? "/for-vendors" : "/dashboard")
    redirect(`/api/onboarding-sync?redirect=${redirectUrl}`)
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl font-black text-ink mb-4">Welcome to DeshStack! 👋</h1>
          <p className="text-ink/60 text-lg">To personalize your experience, please tell us how you plan to use the platform.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <form action={completeOnboarding.bind(null, "USER")}>
            <button type="submit" className="w-full text-left bg-white p-8 rounded-3xl border-2 border-transparent hover:border-indigo/20 shadow-sm hover:shadow-xl transition-all group h-full flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                <ArrowRight className="w-6 h-6 text-indigo" />
              </div>
              <div className="w-16 h-16 bg-indigo/10 rounded-2xl flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-indigo" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-ink mb-3">I&apos;m exploring software</h2>
              <p className="text-ink/60 flex-grow">I want to discover, compare, and review B2B software solutions built for the Indian market.</p>
            </button>
          </form>

          <form action={completeOnboarding.bind(null, "VENDOR")}>
            <button type="submit" className="w-full text-left bg-indigo p-8 rounded-3xl border-2 border-transparent hover:border-saffron/50 shadow-sm hover:shadow-xl transition-all group h-full flex flex-col relative overflow-hidden text-paper">
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                <ArrowRight className="w-6 h-6 text-saffron" />
              </div>
              <div className="w-16 h-16 bg-saffron/10 rounded-2xl flex items-center justify-center mb-6">
                <Building2 className="w-8 h-8 text-saffron" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-paper mb-3">I&apos;m a Software Vendor</h2>
              <p className="text-paper/70 flex-grow">I want to list my software, reach thousands of Indian businesses, and build trust with verified reviews.</p>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
