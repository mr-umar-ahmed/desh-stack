# Deploying DeshStack to Production (Vercel)

This guide fixes the two production errors you may see in the browser console:

1. `Error: An error occurred in the Server Components render…` (digest) — **database not reachable**
2. `Clerk: Clerk has been loaded with development keys…` — **using test keys in production**

Both are **configuration** issues, not code bugs. Follow the steps below.

---

## 1. Fix the database connection (the #1 cause of Server Component errors)

**Why it breaks:** Supabase's *direct* connection host (`db.<ref>.supabase.co:5432`) only has an
**IPv6** address. Vercel's serverless functions are **IPv4-only**, so Prisma can never connect from
Vercel → every database query throws → "Server Components render error".

**Fix:** use the Supabase **connection pooler** (Supavisor), which is IPv4-compatible.

1. Go to **Supabase Dashboard → Project → Settings → Database → Connection string**.
2. Copy the two strings:
   - **Transaction pooler** (port `6543`) → this is your `DATABASE_URL`.
   - **Session pooler / direct** (port `5432`) → this is your `DIRECT_URL`.
3. In **Vercel → Project → Settings → Environment Variables**, set:

   ```
   DATABASE_URL = postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
   DIRECT_URL   = postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres
   ```

   > The `pgbouncer=true&connection_limit=1` on `DATABASE_URL` is important for serverless — it keeps
   > Prisma from exhausting the pooler's connections.

4. Redeploy.

You can verify the IPv6-only issue yourself: `nslookup db.<ref>.supabase.co` returns only an
IPv6 (`2406:…`) address and no IPv4.

---

## 2. Use Clerk production keys

**Why it warns:** `pk_test_…` / `sk_test_…` keys are for development only and are rate-limited.

1. In the **Clerk Dashboard**, create/switch to a **Production** instance for your live domain.
2. Copy its **`pk_live_…`** and **`sk_live_…`** keys.
3. In **Vercel → Environment Variables**, set:

   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_live_…
   CLERK_SECRET_KEY                  = sk_live_…
   ```

4. Add your production domain to Clerk's allowed origins, and (if using Clerk webhooks) set
   `CLERK_WEBHOOK_SECRET` from **Clerk → Webhooks**.

---

## 3. Full environment variable checklist (Vercel)

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | ✅ | Supabase **pooler** URL, port 6543 |
| `DIRECT_URL` | ✅ | Supabase direct/session URL, port 5432 (migrations) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ | `pk_live_…` in production |
| `CLERK_SECRET_KEY` | ✅ | `sk_live_…` in production |
| `CLERK_WEBHOOK_SECRET` | ⬜ | Only if using Clerk webhooks |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | ✅ | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | ✅ | `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | ✅ | `/dashboard` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | ✅ | `/dashboard` |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | ✅ | `rzp_live_…` in production |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | ✅ | Same as `RAZORPAY_KEY_ID` |
| `RAZORPAY_WEBHOOK_SECRET` | ⬜ | Only if using Razorpay webhooks |
| `RESEND_API_KEY` | ⬜ | For transactional email |
| `NEXT_PUBLIC_GOOGLE_ADSENSE_ID` | ⬜ | Leave empty to use self-hosted ads |

---

## 4. Run migrations against production

From your machine, with `DATABASE_URL`/`DIRECT_URL` pointing at the Supabase pooler:

```bash
npx prisma migrate deploy   # applies existing migrations
npx prisma db seed          # optional: seed categories/demo data
```

---

## 5. About `ERR_BLOCKED_BY_CLIENT`

This is caused by a **browser ad-blocker** blocking the Google AdSense script. It is harmless and
only appears for users who run an ad-blocker — nothing to fix in code. The app already detects a
blocked ad and falls back to self-hosted sponsored placements.

---

## Security note

Rotate any secret that has ever been shared in plain text (Supabase password, Clerk secret,
Razorpay secret, Resend key). `.env` is git-ignored and is **not** committed — keep it that way.
