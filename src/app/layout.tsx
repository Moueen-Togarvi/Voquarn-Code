import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { buildMetadata } from "@/lib/metadata";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

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
    <html lang="en" className="h-full scroll-smooth" suppressHydrationWarning>
      <head>
        <GoogleAnalytics />
      </head>
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
