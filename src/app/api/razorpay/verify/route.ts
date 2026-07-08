import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/rbac"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const user = await requireAuth()
    const body = await req.json()
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, plan } = body

    // 1. Verify signature
    const text = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest("hex")

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    if (!plan || (plan !== "GROWTH" && plan !== "SCALE")) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    // Determine amount
    const amountInr = plan === "GROWTH" ? 14999 : 49999

    // 2. Create Subscription & Payment record
    await prisma.$transaction(async (tx) => {
      await tx.payment.create({
        data: {
          razorpayPaymentId: razorpay_payment_id,
          amountInr: amountInr * 100,
          status: "SUCCESS",
          raw: body
        }
      })

      const existingSub = await tx.subscription.findFirst({
        where: { publisherId: user.id },
        orderBy: { createdAt: 'desc' }
      })

      if (existingSub) {
        await tx.subscription.update({
          where: { id: existingSub.id },
          data: {
            plan: plan,
            status: "active"
          }
        })
      } else {
        await tx.subscription.create({
          data: {
            publisherId: user.id,
            plan: plan,
            status: "active"
          }
        })
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Razorpay verification error:", error)
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
  }
}
