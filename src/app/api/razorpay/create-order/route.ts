import { NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"
import { requireAuth } from "@/lib/rbac"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!
})

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth()
    
    // Only Publishers can buy plans
    if (user.role !== "PUBLISHER" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { plan } = await req.json()

    // Determine amount based on plan (in paise, so * 100)
    let amountInr = 0
    if (plan === "GROWTH") {
      amountInr = 14999 // ₹14,999
    } else if (plan === "SCALE") {
      amountInr = 49999 // ₹49,999
    } else {
      return NextResponse.json({ error: "Invalid plan selected" }, { status: 400 })
    }

    const options = {
      amount: amountInr * 100, // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `rct_${Date.now().toString().slice(-6)}_${user.id.substring(0, 10)}`,
      notes: {
        userId: user.id as string,
        plan: plan
      }
    }

    const order = await razorpay.orders.create(options)

    return NextResponse.json(order)
  } catch (error: unknown) {
    const err = error as Error
    console.error("Error creating Razorpay order:", err)
    return NextResponse.json({ error: err.message || "Failed to create order" }, { status: 500 })
  }
}
