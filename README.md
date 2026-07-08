# DeshStack

DeshStack is a modern, production-grade B2B software review platform tailored for the Indian market. It empowers businesses to discover, compare, and review software solutions that are GST-ready, DPDP-compliant, and built for Bharat.

## Features
- **Comprehensive Software Discovery:** Browse categories or search for specific Indian software solutions.
- **Authentic Peer Reviews:** Read verified reviews from real Indian businesses.
- **Market Quadrant:** Visualize the market landscape with interactive quadrants (Leaders, Challengers, Visionaries, Niche Players).
- **Vendor Portal:** Software vendors can list their products, manage reviews, and handle billing.
- **Admin Dashboard:** Powerful moderation tools to manage users, reviews, products, and payments.
- **Monetization:** Integrated Google AdSense and self-hosted sponsored product placements.

## Tech Stack
- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS v4, Lucide React
- **Backend:** Next.js Server Actions, Prisma ORM, PostgreSQL
- **Authentication:** Clerk
- **Payments:** Razorpay
- **Email:** Resend
- **Styling:** Custom design system with glassmorphism, micro-animations, and responsive layouts.

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL database
- Clerk Account
- Razorpay Account
- Resend Account (Optional for emails)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mr-umar-ahmed/desh-stack.git
   cd desh-stack
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and add your credentials:
   ```env
   DATABASE_URL="your_postgresql_connection_string"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
   CLERK_SECRET_KEY="your_clerk_secret_key"
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
   
   RAZORPAY_KEY_ID="your_razorpay_key_id"
   RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
   NEXT_PUBLIC_RAZORPAY_KEY_ID="your_razorpay_key_id"
   
   RESEND_API_KEY="your_resend_api_key"
   NEXT_PUBLIC_GOOGLE_ADSENSE_ID="your_adsense_id"
   ```

4. Run Database Migrations:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Start the Development Server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## Deployment
This project is optimized for deployment on Vercel. **See [DEPLOYMENT.md](DEPLOYMENT.md) for the full guide** — it covers the two most common production pitfalls:

- **Database:** on Vercel you must use the Supabase **connection pooler** URL (the direct `db.<ref>.supabase.co` host is IPv6-only and unreachable from Vercel's IPv4 functions). Set both `DATABASE_URL` (pooler, port 6543) and `DIRECT_URL` (direct, port 5432).
- **Auth:** use Clerk **production** keys (`pk_live_…` / `sk_live_…`), not the `pk_test_…` development keys.

Ensure all environment variables from [.env.example](.env.example) are configured in your Vercel project settings before deploying.

## License
MIT License
