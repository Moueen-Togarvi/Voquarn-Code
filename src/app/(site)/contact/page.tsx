import { ContactPanel } from "@/components/ui/contact-panel";
import { PageStructuredData } from "@/components/seo/page-structured-data";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/metadata";
import { getSiteSettings } from "@/lib/data";
import { GSAPReveal } from "@/components/ui/gsap-reveal";
import { WhatsAppLink } from "@/components/ui/whatsapp-link";

const pageTitle = "Contact Voquarn Code | Web Development & SEO Agency";
const pageDescription =
  "Contact Voquarn Code or book a consultation for website development, SEO, app development, SaaS builds, and AI automation projects.";
const pageKeywords = [
  "hire web development agency Pakistan",
  "hire Next.js developer Pakistan",
  "get website development quote",
  "SEO consultation Pakistan",
  "hire mobile app developers",
  "SaaS development consultation",
  "AI automation consultation Pakistan",
  "web development company Bahawalnagar contact",
  "software house Punjab Pakistan",
];

export const metadata = buildMetadata(
  pageTitle,
  pageDescription,
  "/contact",
  {
    keywords: pageKeywords,
  },
);

// Regenerated hourly so admin edits to site settings (email, phone, WhatsApp)
// reach the live page without a redeploy.
export const revalidate = 3600;

export default async function ContactPage() {
  const site = await getSiteSettings();

  return (
    <>
      <PageStructuredData
        path="/contact"
        name={pageTitle}
        description={pageDescription}
        type="ContactPage"
        keywords={pageKeywords}
      />
      <section className="page-section mt-14 lg:mt-16">
        <GSAPReveal direction="up">
          <SectionHeading
            eyebrow="Contact"
            title="Let's talk about the next version of your digital presence"
            headingLevel="h1"
          />
        </GSAPReveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <GSAPReveal direction="left" delay={0.1}>
            <ContactPanel />
          </GSAPReveal>

          <GSAPReveal direction="right" delay={0.2}>
            <div className="space-y-4">
              <div className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-sm">
                <div>
                  <h2 className="font-display text-[15px] font-bold text-[var(--foreground)]">Direct contact</h2>
                  <div className="mt-4 space-y-2.5 text-sm font-medium text-[var(--muted)]">
                    <p className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-[var(--muted)]/40" />{site.location}</p>
                    <a href={`mailto:${site.email}`} className="flex items-center gap-2 transition-colors hover:text-[var(--foreground)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff5400]/60" />{site.email}
                    </a>
                    <a href={`tel:${site.phone.replace(/\s+/g, "")}`} className="flex items-center gap-2 transition-colors hover:text-[var(--foreground)]">
                      <span className="size-1.5 rounded-full bg-[var(--muted)]/40" />{site.phone}
                    </a>
                  </div>
                  <div className="mt-5 flex gap-2">
                    <a href={site.socials.linkedin} target="_blank" rel="noreferrer" className="flex size-10 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--muted)] transition-all duration-300 hover:bg-[#0077b5] hover:text-white">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>
                    <a href={site.socials.instagram} target="_blank" rel="noreferrer" className="flex size-10 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--muted)] transition-all duration-300 hover:bg-[#E1306C] hover:text-white">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    </a>
                    <a href={site.socials.facebook} target="_blank" rel="noreferrer" className="flex size-10 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--muted)] transition-all duration-300 hover:bg-[#1877F2] hover:text-white">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </a>
                  </div>
                </div>

                <WhatsAppLink
                  href={`https://wa.me/${site.whatsapp}`}
                  className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-xl border border-[#25d366]/25 bg-[#25d366]/10 px-4 text-xs font-bold text-[#0f9d58] transition-all duration-300 hover:bg-[#25d366] hover:text-white"
                >
                  Message on WhatsApp
                </WhatsAppLink>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-sm">
                <iframe
                  title="Voquarn Code Bahawalnagar map"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=73.14%2C29.9%2C73.36%2C30.08&layer=mapnik"
                  className="h-[240px] w-full rounded-xl border-0 opacity-80 grayscale transition-all duration-700 hover:opacity-100 hover:grayscale-0"
                  loading="lazy"
                />
              </div>
            </div>
          </GSAPReveal>
        </div>
      </section>
    </>
  );
}
