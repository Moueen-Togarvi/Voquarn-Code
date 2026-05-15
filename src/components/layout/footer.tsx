import Link from "next/link";
import { NewsletterForm } from "@/components/ui/newsletter-form";
import { navItems, site } from "@/lib/site-data";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/50 transition-colors duration-300">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="space-y-5">
          <span className="eyebrow">Built from Lahore</span>
          <h2 className="font-display text-3xl font-semibold text-foreground">Need a site that feels like a serious business?</h2>
          <p className="max-w-2xl text-muted">
            We help brands move from patchwork digital presence to a system that looks credible, captures leads, and supports growth.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-muted">
            <a href={`mailto:${site.email}`} className="hover:text-foreground">
              {site.email}
            </a>
            <a href={`https://wa.me/${site.whatsapp}`} className="hover:text-foreground" target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <a href={site.socials.linkedin} className="hover:text-foreground" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <span>{site.location}</span>
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-2">
          <div className="space-y-4">
            <h3 className="font-display text-lg text-foreground">Routes</h3>
            <div className="grid gap-3 text-sm text-muted">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-foreground">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-lg text-foreground">Newsletter</h3>
            <p className="text-sm text-muted">
              Monthly notes on SEO, delivery systems, and practical AI workflows.
            </p>
            <NewsletterForm compact />
          </div>
        </div>
      </div>
    </footer>
  );
}
