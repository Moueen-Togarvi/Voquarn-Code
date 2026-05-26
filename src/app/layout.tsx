import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { WhatsAppFloat } from "@/components/ui/whatsapp-float";
import { buildMetadata } from "@/lib/metadata";
import { site } from "@/lib/site-data";
import { getSiteUrl } from "@/lib/site-url";
import { ThemeProvider } from "@/components/theme-provider";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { HangingAstronaut } from "@/components/ui/hanging-astronaut";
import "./globals.css";

export const metadata: Metadata = buildMetadata(
  "Voquarn Code | Websites, Apps, SEO, and AI Systems",
  "A conversion-focused digital agency building websites, apps, SEO foundations, and AI workflows for growing businesses.",
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl = getSiteUrl();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: siteUrl.toString(),
    logo: new URL("/site-icon.png", siteUrl).toString(),
    sameAs: Object.values(site.socials),
  };

  return (
    <html lang="en" className="h-full scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-full bg-background text-foreground transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
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
