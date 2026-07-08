/* eslint-disable */
import { submitVendorRequest } from "./actions"
import { currentUser } from "@clerk/nextjs/server"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Building2, IndianRupee, ShieldCheck, TrendingUp, Users, Zap, CheckCircle2, Star, Megaphone, ArrowRight, Check, AlertCircle } from "lucide-react"

async function VendorStatusSection({ userId }: { userId: string }) {
  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!dbUser) return null

  if (dbUser.role === "PUBLISHER" || dbUser.role === "ADMIN" || dbUser.role === "MODERATOR") {
    return (
      <Link href="/publisher" className="inline-flex items-center gap-2 bg-saffron text-indigo font-bold text-lg px-10 py-5 rounded-2xl hover:bg-saffron/90 transition-all shadow-lg hover:-translate-y-1 transform duration-200">
        Go to Publisher Dashboard <ArrowRight className="w-5 h-5" />
      </Link>
    )
  }

  const request = await prisma.vendorRequest.findFirst({
    where: { userId: dbUser.id },
    orderBy: { createdAt: "desc" }
  })

  if (request) {
    if (request.status === "PENDING") {
      return (
        <div className="bg-white/10 text-paper px-8 py-6 rounded-2xl border border-white/20 backdrop-blur-md max-w-md mx-auto text-left flex items-start gap-4">
          <AlertCircle className="w-8 h-8 text-saffron shrink-0" />
          <div>
            <h3 className="font-bold text-xl mb-1 text-saffron">Request Under Review</h3>
            <p className="text-paper/80">Your registration for {request.companyName} is currently being reviewed by our team. We&apos;ll notify you once approved!</p>
          </div>
        </div>
      )
    }
    
    if (request.status === "APPROVED") {
      return (
        <div className="bg-white/10 text-paper px-8 py-6 rounded-2xl border border-white/20 backdrop-blur-md max-w-md mx-auto text-left">
          <h3 className="font-bold text-xl mb-3 text-teal">Request Approved! 🎉</h3>
          <p className="text-paper/80 mb-6">Your publisher account is active. You can now list your first product for free.</p>
          <Link href="/publisher" className="bg-teal text-white w-full font-bold px-6 py-4 rounded-xl hover:bg-teal/90 transition-all text-center block">
            Go to Publisher Dashboard
          </Link>
        </div>
      )
    }

    if (request.status === "REJECTED") {
      return (
        <div className="bg-red-500/10 text-paper px-8 py-6 rounded-2xl border border-red-500/20 backdrop-blur-md max-w-md mx-auto text-left flex items-start gap-4">
          <AlertCircle className="w-8 h-8 text-red-400 shrink-0" />
          <div>
            <h3 className="font-bold text-xl mb-1 text-red-400">Request Denied</h3>
            <p className="text-paper/80">Unfortunately, your registration request was denied. Please contact support for more details.</p>
          </div>
        </div>
      )
    }
  }

  // No request found, show the form
  return (
    <form action={submitVendorRequest} className="bg-white/10 p-8 rounded-2xl border border-white/20 backdrop-blur-md max-w-md mx-auto text-left">
      <h3 className="font-bold text-2xl mb-6 text-paper">Request Registration</h3>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-paper/80 mb-1">Company Name *</label>
          <input type="text" name="companyName" required className="w-full bg-white text-ink px-4 py-3 rounded-lg focus:ring-2 focus:ring-saffron outline-none" placeholder="e.g. Acme Corp" />
        </div>
        <div>
          <label className="block text-sm font-medium text-paper/80 mb-1">Website URL</label>
          <input type="url" name="website" className="w-full bg-white text-ink px-4 py-3 rounded-lg focus:ring-2 focus:ring-saffron outline-none" placeholder="https://..." />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-saffron text-indigo font-bold text-lg px-6 py-4 rounded-xl hover:bg-saffron/90 transition-all shadow-lg hover:-translate-y-1 transform duration-200 flex items-center justify-center gap-2"
      >
        Submit Request <ArrowRight className="w-5 h-5" />
      </button>
    </form>
  )
}

export default async function ForVendorsPage() {
  const user = await currentUser()

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative bg-indigo text-paper py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-saffron/10 blur-3xl animate-float" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-teal/10 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 text-paper/80 text-xs font-semibold px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-sm mb-6">
            <Building2 className="w-3 h-3" />
            For Software Vendors
          </div>

          <h1 className="font-heading text-4xl md:text-6xl font-black text-paper mb-6 leading-tight">
            List Your Software on{" "}
            <span className="text-saffron">DeshStack</span>
          </h1>
          <p className="text-xl text-paper/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Reach thousands of Indian businesses looking for local, compliant, and cost-effective software solutions.
          </p>

          {user ? (
            <VendorStatusSection userId={user.id} />
          ) : (
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 bg-saffron text-indigo font-bold text-lg px-10 py-5 rounded-2xl hover:bg-saffron/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200"
            >
              Sign Up to Get Started <ArrowRight className="w-5 h-5" />
            </Link>
          )}
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="container mx-auto px-4 py-20 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl font-bold text-ink mb-3">Why List on DeshStack?</h2>
          <p className="text-ink/60 max-w-xl mx-auto">Join the fastest growing B2B software marketplace built specifically for the Indian market.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Users,
              title: "Reach B2B Buyers",
              desc: "Get discovered by businesses specifically looking for tools built for the Indian market.",
              color: "bg-indigo/5 text-indigo",
            },
            {
              icon: ShieldCheck,
              title: "Build Trust",
              desc: "Collect verified reviews and showcase your compliance (GST, DPDP) to win enterprise deals.",
              color: "bg-saffron/5 text-saffron",
            },
            {
              icon: TrendingUp,
              title: "Drive Revenue",
              desc: "Convert intent-driven traffic into paying customers directly through your DeshStack profile.",
              color: "bg-teal/5 text-teal",
            },
          ].map((benefit, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-2xl border border-indigo/10 shadow-sm hover:shadow-md transition-all text-center group hover:-translate-y-1 transform duration-200"
            >
              <div className={`w-14 h-14 ${benefit.color} rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform`}>
                <benefit.icon className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-bold text-ink text-lg mb-2">{benefit.title}</h3>
              <p className="text-ink/60 text-sm leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features List */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-ink mb-3">What You Get</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Dedicated product profile page",
              "Verified review collection",
              "Market Quadrant placement",
              "Category-level visibility",
              "Response to reviews",
              "Analytics dashboard",
              "Priority support",
              "Competitor benchmarking",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-xl hover:bg-paper transition-colors">
                <div className="w-6 h-6 rounded-full bg-teal/10 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-teal" />
                </div>
                <span className="text-sm font-medium text-ink">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-paper py-16">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <IndianRupee className="w-10 h-10 text-saffron mx-auto mb-4" />
          <h2 className="font-heading text-2xl font-bold text-ink mb-3">Ready to Grow?</h2>
          <p className="text-ink/60 mb-8">Listing your product is completely free. Upgrade anytime for premium features.</p>
          {user ? (
            <a
              href="#"
              className="inline-block bg-indigo text-paper font-bold px-8 py-4 rounded-xl hover:bg-indigo/90 transition-all shadow-lg hover:-translate-y-1 transform duration-200"
            >
              Go to Registration
            </a>
          ) : (
            <Link
              href="/sign-up"
              className="inline-block bg-indigo text-paper font-bold px-8 py-4 rounded-xl hover:bg-indigo/90 transition-all shadow-lg hover:-translate-y-1 transform duration-200"
            >
              Create an Account
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}
