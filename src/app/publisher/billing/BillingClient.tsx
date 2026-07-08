"use client"

import Script from "next/script"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Confetti from "react-confetti"
import { useWindowSize } from "react-use"

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any
  }
}

export function BillingClient({ currentPlan }: { currentPlan: string }) {
  const [loading, setLoading] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const { width, height } = useWindowSize()
  const router = useRouter()

  const handleUpgrade = async (plan: "GROWTH" | "SCALE") => {
    setLoading(plan)
    try {
      // 1. Create order
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan })
      })

      if (!res.ok) {
        throw new Error("Failed to create order")
      }

      const order = await res.json()

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TAciLfTuJkL9C2",
        amount: order.amount,
        currency: order.currency,
        name: "DeshStack",
        description: `${plan} Plan Subscription`,
        order_id: order.id,
        handler: async function (response: Record<string, string>) {
          // 3. Verify Payment
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                plan: plan
              })
            })

            if (!verifyRes.ok) throw new Error("Payment verification failed")

            setShowConfetti(true)
            toast.success(`Successfully upgraded to ${plan}!`)
            
            // Stop confetti after 5 seconds
            setTimeout(() => {
              setShowConfetti(false)
              router.refresh()
            }, 5000)
          } catch (err: unknown) {
            const error = err as Error
            toast.error(error.message || "Payment verification failed.")
          }
        },
        theme: {
          color: "#1a1b3a" // Indigo
        }
      }

      const rzp1 = new window.Razorpay(options)
      rzp1.on('payment.failed', function (response: { error: { description: string } }){
        toast.error(`Payment Failed: ${response.error.description}`)
      })
      rzp1.open()

    } catch (e: unknown) {
      const error = e as Error
      toast.error(error.message || "Something went wrong")
    } finally {
      setLoading(null)
    }
  }

  return (
    <>
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} gravity={0.15} />}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <h2 className="font-heading text-2xl font-bold text-ink mb-6">Upgrade Your Plan</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Growth Plan */}
        <div className="bg-white p-8 rounded-xl border border-indigo/10 shadow-sm flex flex-col relative overflow-hidden">
          {currentPlan === "GROWTH" && (
            <div className="absolute top-0 right-0 bg-indigo text-paper text-xs font-bold px-3 py-1 rounded-bl-lg">
              ACTIVE
            </div>
          )}
          <h3 className="font-heading text-2xl font-bold text-ink mb-2">Growth</h3>
          <p className="text-ink/70 mb-6">For small teams building momentum.</p>
          <div className="text-4xl font-black text-indigo mb-6">₹14,999<span className="text-lg font-medium text-ink/50">/yr</span></div>
          
          <ul className="space-y-3 mb-8 flex-1">
            <li className="flex items-center gap-3"><span className="text-saffron font-bold">✓</span> Enhanced Listing Visibility</li>
            <li className="flex items-center gap-3"><span className="text-saffron font-bold">✓</span> Basic Analytics Dashboard</li>
            <li className="flex items-center gap-3"><span className="text-saffron font-bold">✓</span> Lead Generation (Up to 50/mo)</li>
          </ul>

          <button 
            onClick={() => handleUpgrade("GROWTH")}
            disabled={loading === "GROWTH" || currentPlan === "GROWTH" || currentPlan === "SCALE"}
            className="w-full bg-indigo text-paper font-bold py-3 rounded-lg hover:bg-indigo/90 transition-colors disabled:opacity-50"
          >
            {loading === "GROWTH" ? "Processing..." : (currentPlan === "GROWTH" ? "Current Plan" : "Upgrade to Growth")}
          </button>
        </div>

        {/* Scale Plan */}
        <div className="bg-indigo p-8 rounded-xl border border-indigo shadow-md flex flex-col relative overflow-hidden">
          {currentPlan === "SCALE" && (
            <div className="absolute top-0 right-0 bg-saffron text-indigo text-xs font-bold px-3 py-1 rounded-bl-lg">
              ACTIVE
            </div>
          )}
          <h3 className="font-heading text-2xl font-bold text-paper mb-2">Scale</h3>
          <p className="text-paper/70 mb-6">For established companies leading the market.</p>
          <div className="text-4xl font-black text-paper mb-6">₹49,999<span className="text-lg font-medium text-paper/50">/yr</span></div>
          
          <ul className="space-y-3 mb-8 flex-1 text-paper">
            <li className="flex items-center gap-3"><span className="text-saffron font-bold">✓</span> Premium Sponsored Placements</li>
            <li className="flex items-center gap-3"><span className="text-saffron font-bold">✓</span> Advanced Buyer Intent Data</li>
            <li className="flex items-center gap-3"><span className="text-saffron font-bold">✓</span> Unlimited Lead Generation</li>
            <li className="flex items-center gap-3"><span className="text-saffron font-bold">✓</span> Dedicated Account Manager</li>
          </ul>

          <button 
            onClick={() => handleUpgrade("SCALE")}
            disabled={loading === "SCALE" || currentPlan === "SCALE"}
            className="w-full bg-saffron text-indigo font-bold py-3 rounded-lg hover:bg-saffron/90 transition-colors disabled:opacity-50"
          >
            {loading === "SCALE" ? "Processing..." : (currentPlan === "SCALE" ? "Current Plan" : "Upgrade to Scale")}
          </button>
        </div>
      </div>
    </>
  )
}
