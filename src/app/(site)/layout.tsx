import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { WhatsAppFloat } from "@/components/ui/whatsapp-float";
import { siteIdentityJsonLd } from "@/lib/schema";
import { getSiteSettings, getTestimonials } from "@/lib/data";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { HangingAstronaut } from "@/components/ui/hanging-astronaut";
import { IntroLoader } from "@/components/ui/intro-loader";
import { MobileDock } from "@/components/layout/mobile-dock";

// Site-only chrome (navbar, footer, WhatsApp button, cursor, intro loader,
// structured data). Scoped to this route group so /admin renders its own
// AdminShell instead — nothing here reaches the admin panel.
export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, testimonials] = await Promise.all([
    getSiteSettings(),
    getTestimonials(),
  ]);
  const structuredData = siteIdentityJsonLd(settings, testimonials);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <IntroLoader />
      <div className="relative flex min-h-screen flex-col overflow-x-clip pb-24 md:pb-0">
        <div className="pointer-events-none absolute inset-0 -z-50 bg-[radial-gradient(circle_at_top_left,var(--gradient-1),transparent_28%),radial-gradient(circle_at_top_right,var(--gradient-2),transparent_25%),var(--gradient-main)]" />
        <Navbar />
        <MobileDock />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
        <WhatsAppFloat whatsapp={settings.whatsapp} />
        <HangingAstronaut />
        <CustomCursor />
      </div>
    </>
  );
}
