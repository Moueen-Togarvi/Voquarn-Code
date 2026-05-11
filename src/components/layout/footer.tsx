import Link from "next/link";
import { NewsletterForm } from "@/components/ui/newsletter-form";
import { navItems, site } from "@/lib/site-data";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[rgba(4,12,18,0.92)]">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="space-y-5">
          <span className="eyebrow">Built from Lahore</span>
          <h2 className="font-display text-3xl font-semibold text-white">Need a site that feels like a serious business?</h2>
          <p className="max-w-2xl text-[rgba(233,238,242,0.72)]">
            We help brands move from patchwork digital presence to a system that looks credible, captures leads, and supports growth.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-[rgba(233,238,242,0.72)]">
            <a href={`mailto:${site.email}`} className="hover:text-white">
              {site.email}
            </a>
            <a href={`https://wa.me/${site.whatsapp}`} className="hover:text-white" target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <a href={site.socials.linkedin} className="hover:text-white" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <span>{site.location}</span>
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-2">
          <div className="space-y-4">
            <h3 className="font-display text-lg text-white">Routes</h3>
            <div className="grid gap-3 text-sm text-[rgba(233,238,242,0.72)]">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-lg text-white">Newsletter</h3>
            <p className="text-sm text-[rgba(233,238,242,0.72)]">
              Monthly notes on SEO, delivery systems, and practical AI workflows.
            </p>
            <NewsletterForm compact />
          </div>
        </div>
      </div>
    </footer>
  );
}
