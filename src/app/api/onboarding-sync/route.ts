import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { auth } from "@clerk/nextjs/server"

export async function GET(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const redirectTo = searchParams.get("redirect") || "/dashboard"
  
  const cookieStore = await cookies()
  cookieStore.set(`onboarding_${userId}`, "true", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    httpOnly: false,
  })
  
  return NextResponse.redirect(new URL(redirectTo, req.url))
}
