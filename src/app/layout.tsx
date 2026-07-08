import type { Metadata } from "next";
import { Fraunces, Spline_Sans, Spline_Sans_Mono } from "next/font/google";
import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const fraunces = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
});

const splineSans = Spline_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const splineSansMono = Spline_Sans_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DeshStack | Indian Software Reviews",
  description: "Production-grade, Gartner-style B2B software review SaaS focused on Indian-built software.",
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
          className={`${splineSans.variable} ${fraunces.variable} ${splineSansMono.variable} antialiased font-sans bg-paper text-ink min-h-screen flex flex-col`}
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
