import { ContactForm } from "@/components/ui/contact-form";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/metadata";
import { site } from "@/lib/site-data";
import { GSAPReveal } from "@/components/ui/gsap-reveal";

export const metadata = buildMetadata(
  "Contact Voquarn Code",
  "Send a project inquiry, message Voquarn Code on WhatsApp, or find the Bahawalnagar office details.",
  "/contact",
);

export default function ContactPage() {
  return (
    <>
      <section className="page-section mt-24 lg:mt-32 pt-40 lg:pt-56">
        <GSAPReveal direction="up">
          <SectionHeading
            eyebrow="Contact"
            title="Let's talk about the next version of your digital presence"
            description="Use the form for a proper brief, reach out on WhatsApp for a faster conversation, or find us in Bahawalnagar, Punjab, Pakistan."
          />
        </GSAPReveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <GSAPReveal direction="left" delay={0.1}>
            <ContactForm />
          </GSAPReveal>

          <GSAPReveal direction="right" delay={0.2}>
            <div className="space-y-6">
              <div className="bg-white border border-neutral-200/80 shadow-sm rounded-[2.5rem] p-8 sm:p-10 flex flex-col justify-between">
                <div>
                  <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight text-black">Direct contact</h2>
                  <div className="mt-6 space-y-4 text-sm font-medium text-neutral-600">
                    <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-black/20" />Bahawalnagar, Punjab, Pakistan</p>
                    <a href={`mailto:${site.email}`} className="flex items-center gap-2 hover:text-black transition-colors">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff5400]/60" />{site.email}
                    </a>
                    <a href={`tel:${site.phone.replace(/\s+/g, "")}`} className="flex items-center gap-2 hover:text-black transition-colors">
                      <span className="w-1.5 h-1.5 rounded-full bg-black/20" />{site.phone}
                    </a>
                  </div>
                  <div className="mt-8 flex gap-3">
                    <a href={site.socials.linkedin} target="_blank" rel="noreferrer" className="flex items-center justify-center w-12 h-12 bg-neutral-100 text-neutral-600 rounded-full hover:bg-[#0077b5] hover:text-white transition-all duration-300">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>
                    <a href={site.socials.instagram} target="_blank" rel="noreferrer" className="flex items-center justify-center w-12 h-12 bg-neutral-100 text-neutral-600 rounded-full hover:bg-[#E1306C] hover:text-white transition-all duration-300">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    </a>
                    <a href={site.socials.facebook} target="_blank" rel="noreferrer" className="flex items-center justify-center w-12 h-12 bg-neutral-100 text-neutral-600 rounded-full hover:bg-[#1877F2] hover:text-white transition-all duration-300">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </a>
                  </div>
                </div>

                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-10 inline-flex w-full items-center justify-center rounded-full bg-[#25d366]/10 border border-[#25d366]/20 px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-[#075E54] hover:bg-[#25d366] hover:text-white transition-all duration-300 shadow-sm"
                >
                  Message on WhatsApp
                </a>
              </div>

              <div className="bg-neutral-50 border border-neutral-200/80 shadow-sm rounded-[2.5rem] p-2">
                <iframe
                  title="Voquarn Code Lahore map"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=74.292%2C31.452%2C74.39%2C31.58&layer=mapnik"
                  className="h-[300px] w-full rounded-[2rem] border-0 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
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
