# DeshStack Progress Tracker

This document tracks the execution phases, decisions made, known issues, and next steps for the DeshStack project.

## Current Status
- **Phase 3: Public Site** (Completed)

## Phases

### 1. Foundation (Completed)
- [x] Scaffold Next.js 15 (App Router) + TypeScript project using `pnpm`
- [x] Initialize shadcn/ui and configure Tailwind CSS
- [x] Define DeshStack brand tokens (Colors, Typography)
- [x] Set up PostgreSQL via Docker Compose
- [x] Initialize Prisma ORM with comprehensive schema
- [x] Create database seed script
- [x] Install and configure Vitest & Playwright
- [x] Verify build, lint, typecheck with zero errors

### 2. Auth & RBAC (Completed)
- [x] Install NextAuth v5, Prisma adapter, Resend, Zod
- [x] Configure Google OAuth and Email Magic Links
- [x] Set up Role-Based Access Control (RBAC) types and utilities
- [x] Create auth middleware for route protection

### 3. Public Site (Completed)
- [x] Create global Layout with Header and Footer components
- [x] Build reusable `ProductCard` component
- [x] Build Home Page (`/`) with Hero, popular categories, and trending products
- [x] Build Categories Index Page (`/categories`)
- [x] Build Category Details Page (`/categories/[slug]`)
- [x] Build Product Details Page (`/products/[slug]`)

### 4. User/Reviewer Panel (Completed)
- [x] Build Dashboard page (`/dashboard`) for reviewing user stats and bookmarked items
- [x] Implement comprehensive "Write a Review" form page (`/products/[slug]/review`)
- [x] Create strict Zod-validated Server Actions for submitting reviews
- [x] Implement "Save Product" toggle via Server Actions and integrate into the product details page

### 5. Admin & Moderation (Completed)
- [x] Build Admin Layout with sidebar navigation (`/admin/layout.tsx`)
- [x] Build Admin Dashboard for quick metrics (`/admin/page.tsx`)
- [x] Build Admin Reviews Queue for moderating reviews (`/admin/reviews/page.tsx`)
- [x] Build Admin Products Queue for moderating products (`/admin/products/page.tsx`)
- [x] Implement protected Server Actions for approving and rejecting

### 6. Publisher Panel (Completed)
- [x] Create Vendor Onboarding flow (`/for-vendors`) to automatically upgrade users to the `PUBLISHER` role.
- [x] Build Publisher Layout with sidebar navigation (`/publisher/layout.tsx`).
- [x] Build Publisher Dashboard to view listed products and aggregate review stats (`/publisher/page.tsx`).
- [x] Create Product Submission Form for publishers to list new software (`/publisher/products/new`).
- [x] Implement robust Server Actions with Zod validation to securely insert products into the database (`/publisher/products/actions.ts`).

### 7. Security Hardening & Polish (Completed)
- [x] Install `sonner` for toast notifications.
- [x] Add Global `loading.tsx`, `error.tsx`, and `not-found.tsx` to handle React Suspense transitions and runtime error boundaries gracefully.
- [x] Build reusable `<SubmitButton>` using React 19's `useFormStatus` to handle loading states automatically.
- [x] Refactor existing Server Actions and Forms (Reviews, Products) to handle results safely and display toast notifications via Client Component wrappers.
- [x] Implement Next.js Edge Middleware for basic IP-based rate limiting to protect against spam.

### 8. Razorpay Billing (Completed)
- [x] Install `razorpay` Node SDK and setup local environment variables.
- [x] Build backend API `POST /api/razorpay/create-order` to generate dynamic order IDs securely via the server.
- [x] Build backend API `POST /api/razorpay/verify` to validate Razorpay signatures, then create/update the `Subscription` and `Payment` records in the database.
- [x] Create Publisher UI (`/publisher/billing`) showcasing dynamic Pricing Tiers (Growth, Scale) and integrating the Razorpay Checkout modal widget.

### 9. Deploy & Handover (Completed)
- [x] Integrate `prisma generate` to the `postinstall` step in `package.json` for Vercel edge/serverless support.
- [x] Create comprehensive `README.md` with explicit local setup steps and production deployment instructions.
- [x] Final code verification (`pnpm run build`) completed successfully with 100% route generation!

## Decisions Log
- **Package Manager**: Decided to use `pnpm` (upgraded to v9 to support Node v20) as per initial master prompt preference.
- **Styling**: Proceeding with Tailwind CSS + shadcn/ui, adhering to the prototype's design system requirements.
- **Prisma**: Downgraded from v7 to v6 to maintain stability with Next.js 15 without experimental v7 config options.
- **Auth**: Implemented NextAuth.js v5 with Google and Resend providers, alongside a custom RBAC utility layer.
- **Data Fetching**: Used React Server Components to fetch data directly via Prisma in `page.tsx` routes, avoiding unnecessary API routes.
- **Form Actions**: Utilized Next.js Server Actions with Zod validation for form submissions, throwing errors to abort instead of sending complex state objects to avoid type conflicts with standard `<form action={...}>`.
- **Admin Routing**: Secured all `/admin` routes using the existing `requireRole` helper directly inside Server Components to guarantee only `ADMIN` and `MODERATOR` access.

## Known Issues
- None yet.

## Next Steps
- Begin Phase 6: Publisher Panel (Vendor onboarding, product management dashboard).
