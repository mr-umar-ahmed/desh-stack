import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

/**
 * Diagnostic endpoint: visit /api/health on the deployed site to see the REAL
 * reason the app can't load data. Production hides Server Component errors
 * behind an opaque "digest", so this surfaces the actual database error and
 * whether the critical environment variables are configured.
 *
 * Safe to keep: it never returns secret values, only presence/type flags and
 * the database driver's error message.
 */
export async function GET() {
  // 1. Database connectivity — the usual culprit on Vercel + Supabase.
  let database: { ok: boolean; error?: string; code?: string }
  try {
    await prisma.$queryRaw`SELECT 1`
    database = { ok: true }
  } catch (e) {
    const err = e as { message?: string; code?: string }
    database = {
      ok: false,
      error: err?.message ?? String(e),
      code: err?.code,
    }
  }

  // 2. Environment config — presence/type only, never the actual secrets.
  const pk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? ""
  const sk = process.env.CLERK_SECRET_KEY ?? ""
  const env = {
    DATABASE_URL: process.env.DATABASE_URL
      ? describeDbUrl(process.env.DATABASE_URL)
      : "MISSING",
    DIRECT_URL: process.env.DIRECT_URL ? "set" : "missing (optional)",
    clerkMode: pk.startsWith("pk_live")
      ? "production ✅"
      : pk.startsWith("pk_test")
        ? "development ⚠️ (using test keys)"
        : "MISSING",
    clerkSecret: sk.startsWith("sk_live")
      ? "production ✅"
      : sk.startsWith("sk_test")
        ? "development ⚠️"
        : "MISSING",
    razorpay: process.env.RAZORPAY_KEY_ID ? "set" : "missing",
  }

  const ok = database.ok
  return NextResponse.json(
    {
      ok,
      hint: ok
        ? "Database reachable. If pages still fail, check that migrations were run (npx prisma migrate deploy)."
        : "Database NOT reachable. On Vercel + Supabase this is almost always because DATABASE_URL points at the IPv6-only direct host — switch it to the Supabase POOLER (…pooler.supabase.com:6543). See DEPLOYMENT.md.",
      database,
      env,
      timestamp: new Date().toISOString(),
    },
    { status: ok ? 200 : 503 },
  )
}

/** Reveal only the host:port style of the DB URL, never credentials. */
function describeDbUrl(url: string): string {
  try {
    const u = new URL(url)
    const isPooler = u.hostname.includes("pooler.supabase.com")
    return `host=${u.hostname} port=${u.port || "5432"} ${
      isPooler ? "(pooler ✅)" : "(direct — may be IPv6-only ⚠️)"
    }`
  } catch {
    return "set (unparseable)"
  }
}
