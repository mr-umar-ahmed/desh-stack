import type { Metadata } from "next";
import { Inter_Tight, Spline_Sans_Mono } from "next/font/google";
import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

// Inter Tight is the closest open alternative to PP Neue Montreal
// (the licensed grotesque in the brand reference) — one family for
// both headings and body, differentiated by weight.
const interTight = Inter_Tight({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const interTightBody = Inter_Tight({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const splineSansMono = Spline_Sans_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

// The Header renders on every route and reads Clerk auth (via `headers()`),
// so the whole app is inherently dynamic. Declaring it here avoids Next.js
// attempting static prerender and logging dynamic-server-usage noise at build.
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "DeshStack | Discover the Best Indian Software",
  description: "The launchpad for Indian software — discover, upvote, and review the best new products built for Bharat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID && (
            <Script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}`}
              crossOrigin="anonymous"
              strategy="afterInteractive"
            />
          )}
        </head>
        <body
          className={`${interTightBody.variable} ${interTight.variable} ${splineSansMono.variable} antialiased font-sans bg-paper text-ink min-h-screen flex flex-col`}
        >
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Toaster position="bottom-right" richColors />
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
