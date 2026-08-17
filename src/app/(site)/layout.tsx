import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { WhatsAppFloat } from "@/components/ui/whatsapp-float";
import { siteIdentityJsonLd } from "@/lib/schema";
import { getSiteSettings, getTestimonials } from "@/lib/data";
import { DeferredSiteEffects } from "@/components/layout/deferred-site-effects";
import { MetaPixel } from "@/components/analytics/meta-pixel";
import { TikTokPixel } from "@/components/analytics/tiktok-pixel";

// Regenerated hourly so admin edits (site settings, testimonials) reach the
// live site without a redeploy — same ISR window used across the rest of
// the DB-backed (site) routes.
export const revalidate = 3600;

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
      {/* Ad pixels are scoped to (site) only, so /admin never loads ad-tracking scripts. */}
      <MetaPixel />
      <TikTokPixel />
      <div className="relative flex min-h-screen flex-col overflow-x-clip">
        <div className="pointer-events-none absolute inset-0 -z-50 bg-[radial-gradient(circle_at_top_left,var(--gradient-1),transparent_28%),radial-gradient(circle_at_top_right,var(--gradient-2),transparent_25%),var(--gradient-main)]" />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
        <WhatsAppFloat whatsapp={settings.whatsapp} />
        <DeferredSiteEffects />
      </div>
    </>
  );
}
