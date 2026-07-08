import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get("x-razorpay-signature")
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET

    if (!signature || !secret) {
      return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 })
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex")

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const event = JSON.parse(rawBody)

    // Handle payment.captured event
    if (event.event === "payment.captured" || event.event === "order.paid") {
      const payment = event.payload.payment.entity
      const notes = payment.notes

      if (notes && notes.userId && notes.plan) {
        // Calculate subscription period (1 year from now)
        const currentPeriodEnd = new Date()
        currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1)

        // Upsert subscription
        const existing = await prisma.subscription.findFirst({
          where: { publisherId: notes.userId },
        })

        if (existing) {
          await prisma.subscription.update({
            where: { id: existing.id },
            data: {
              plan: notes.plan,
              status: "active",
              razorpaySubscriptionId: payment.order_id,
              currentPeriodEnd,
            },
          })
        } else {
          await prisma.subscription.create({
            data: {
              publisherId: notes.userId,
              plan: notes.plan,
              status: "active",
              razorpaySubscriptionId: payment.order_id,
              currentPeriodEnd,
            },
          })
        }
      }
    }

    return NextResponse.json({ status: "ok" })
  } catch (error) {
    console.error("Razorpay Webhook Error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
