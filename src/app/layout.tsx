import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { WhatsAppFloat } from "@/components/ui/whatsapp-float";
import { buildMetadata } from "@/lib/metadata";
import { siteIdentityJsonLd } from "@/lib/schema";
import { ThemeProvider } from "@/components/theme-provider";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { HangingAstronaut } from "@/components/ui/hanging-astronaut";
import { IntroLoader } from "@/components/ui/intro-loader";
import "./globals.css";

export const metadata: Metadata = buildMetadata(
  "Voquarn Code | Web Development, SEO, Apps, and AI Automation",
  "Voquarn Code builds conversion-focused websites, apps, SEO systems, and AI automation workflows for businesses in Pakistan and worldwide.",
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = siteIdentityJsonLd();

  return (
    <html lang="en" className="h-full scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
      </head>
      <body className="min-h-full bg-background text-foreground transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <IntroLoader />
          <div className="relative flex min-h-screen flex-col overflow-x-clip">
            <div className="pointer-events-none absolute inset-0 -z-50 bg-[radial-gradient(circle_at_top_left,var(--gradient-1),transparent_28%),radial-gradient(circle_at_top_right,var(--gradient-2),transparent_25%),var(--gradient-main)]" />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <WhatsAppFloat />
            <HangingAstronaut />
            <CustomCursor />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
