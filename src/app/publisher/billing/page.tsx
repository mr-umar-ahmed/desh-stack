import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/rbac"
import { BillingClient } from "./BillingClient"

export default async function BillingPage() {
  const user = await requireAuth()

  const subscription = await prisma.subscription.findFirst({
    where: { publisherId: user.id as string }
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-ink mb-2">Billing & Plans</h1>
        <p className="text-ink/70">Manage your subscription and upgrade to premium features.</p>
      </div>

      <div className="mb-8 p-6 bg-card rounded-xl border border-indigo/10 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-ink/60 uppercase tracking-wider mb-1">Current Plan</p>
          <p className="text-2xl font-bold text-indigo">{subscription?.plan || "FREE"}</p>
        </div>
        {subscription?.currentPeriodEnd && (
          <div className="text-right">
            <p className="text-sm font-bold text-ink/60 uppercase tracking-wider mb-1">Expires On</p>
            <p className="text-lg font-medium text-ink">{subscription.currentPeriodEnd.toLocaleDateString()}</p>
          </div>
        )}
      </div>

      <BillingClient currentPlan={subscription?.plan || "FREE"} />
    </div>
  )
}
