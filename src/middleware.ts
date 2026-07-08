import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const rateLimitMap = new Map<string, { count: number; timestamp: number }>()
const WINDOW_MS = 60 * 1000
const MAX_REQUESTS_PER_WINDOW = 200

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/publisher(.*)",
  "/admin(.*)",
])

export default clerkMiddleware(async (auth, req) => {
  // --- Rate Limiting ---
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1"
  const now = Date.now()
  const windowData = rateLimitMap.get(ip)

  if (!windowData) {
    rateLimitMap.set(ip, { count: 1, timestamp: now })
  } else {
    if (now - windowData.timestamp > WINDOW_MS) {
      rateLimitMap.set(ip, { count: 1, timestamp: now })
    } else {
      windowData.count++
      if (windowData.count > MAX_REQUESTS_PER_WINDOW) {
        return new NextResponse("Too Many Requests", { status: 429 })
      }
    }
  }

  // Check onboarding status
  const authSession = await auth()
  const { userId, sessionClaims } = authSession

  if (userId) {
    const isOnboarding = req.nextUrl.pathname === "/onboarding"
    const isApiRoute = req.nextUrl.pathname.startsWith("/api")
    const isStatic = req.nextUrl.pathname.includes(".") // very basic static check
    
    if (!isOnboarding && !isApiRoute && !isStatic) {
      const onboardingCookie = req.cookies.get(`onboarding_${userId}`)
      if (!onboardingCookie) {
        const url = new URL("/onboarding", req.url)
        return NextResponse.redirect(url)
      }
    }
  }

  // Protect routes that require authentication
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Clerk matcher
    "/__clerk/:path*",
  ],
}
