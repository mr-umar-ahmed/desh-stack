import { SignUp } from "@clerk/nextjs"
import Link from "next/link"
import { Star, Building2 } from "lucide-react"

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>
}) {
  const { role } = await searchParams
  const isVendor = role === "vendor"

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold text-ink mb-2">
            {isVendor ? "List your software on DeshStack" : "Join DeshStack"}
          </h1>
          <p className="text-ink/60">
            {isVendor
              ? "Create a vendor account to publish and manage your products."
              : "Create your account and start discovering software built for Bharat."}
          </p>
        </div>

        {/* Role selector — captured at sign-up, no separate onboarding step. */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link
            href="/sign-up?role=user"
            className={`flex flex-col items-center text-center gap-1.5 p-4 rounded-xl border transition-all ${
              !isVendor
                ? "border-indigo bg-indigo/5 shadow-sm"
                : "border-indigo/10 bg-white hover:border-indigo/30"
            }`}
          >
            <Star className={`w-5 h-5 ${!isVendor ? "text-indigo" : "text-ink/40"}`} />
            <span className="text-sm font-semibold text-ink">I&apos;m a Reviewer</span>
            <span className="text-[11px] text-ink/50 leading-tight">Discover &amp; review software</span>
          </Link>
          <Link
            href="/sign-up?role=vendor"
            className={`flex flex-col items-center text-center gap-1.5 p-4 rounded-xl border transition-all ${
              isVendor
                ? "border-saffron bg-saffron/5 shadow-sm"
                : "border-indigo/10 bg-white hover:border-saffron/30"
            }`}
          >
            <Building2 className={`w-5 h-5 ${isVendor ? "text-saffron" : "text-ink/40"}`} />
            <span className="text-sm font-semibold text-ink">I&apos;m a Vendor</span>
            <span className="text-[11px] text-ink/50 leading-tight">List &amp; manage products</span>
          </Link>
        </div>

        <SignUp
          // The chosen role travels with the new user and is synced to the DB
          // on first authenticated request (see src/lib/rbac.ts).
          unsafeMetadata={{ role: isVendor ? "PUBLISHER" : "USER" }}
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-xl border border-indigo/10 rounded-2xl",
              headerTitle: "font-heading",
              formButtonPrimary: isVendor
                ? "bg-saffron hover:bg-saffron/90"
                : "bg-indigo hover:bg-indigo/90",
            },
          }}
        />
      </div>
    </div>
  )
}
