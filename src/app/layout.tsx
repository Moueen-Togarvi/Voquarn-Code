import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { buildMetadata } from "@/lib/metadata";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

// Self-hosted at build time and preloaded — replaces the old @import from
// fonts.googleapis.com, which cost two blocking round-trips (CSS, then the
// font file) before any text could render. That's the difference between an
// instant first paint and a multi-second one on high-latency connections.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = buildMetadata(
  "Voquarn Code | Web Development, SEO, Apps, and AI Automation",
  "Voquarn Code builds conversion-focused websites, apps, SEO systems, and AI automation workflows for businesses in Pakistan and worldwide.",
);

// True root: html/body + theming only. Site chrome (navbar, footer, etc.)
// lives in app/(site)/layout.tsx so /admin doesn't inherit it.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full scroll-smooth ${inter.variable}`} suppressHydrationWarning>
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
