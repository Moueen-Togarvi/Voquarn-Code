import { ContactForm } from "@/components/ui/contact-form";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/metadata";
import { site } from "@/lib/site-data";

export const metadata = buildMetadata(
  "Contact Voquarn Code",
  "Send a project inquiry, message Voquarn Code on WhatsApp, or find the Lahore office details.",
  "/contact",
);

export default function ContactPage() {
  return (
    <>
      <section className="page-section mt-24 lg:mt-32 pt-40 lg:pt-56">
        <SectionHeading
          eyebrow="Contact"
          title="Let’s talk about the next version of your digital presence"
          description="Use the form for a proper brief, reach out on WhatsApp for a faster conversation, or find us in Lahore, Pakistan."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <ContactForm />
          <div className="space-y-6">
            <div className="bg-white border border-neutral-200/80 shadow-sm rounded-[2.5rem] p-8 sm:p-10 flex flex-col justify-between">
              <div>
                <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight text-black">Direct contact</h2>
                <div className="mt-6 space-y-4 text-sm font-medium text-neutral-600">
                  <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-black/20" />{site.location}</p>
                  <a href={`mailto:${site.email}`} className="flex items-center gap-2 hover:text-black transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff5400]/60" />{site.email}
                  </a>
                  <a href={`tel:${site.phone.replace(/\s+/g, "")}`} className="flex items-center gap-2 hover:text-black transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-black/20" />{site.phone}
                  </a>
                </div>
                <div className="mt-8 flex flex-wrap gap-2">
                  <a href={site.socials.linkedin} target="_blank" rel="noreferrer" className="bg-neutral-100 text-neutral-700 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                    LinkedIn
                  </a>
                  <a href={site.socials.instagram} target="_blank" rel="noreferrer" className="bg-neutral-100 text-neutral-700 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#E1306C] hover:text-white transition-colors">
                    Instagram
                  </a>
                  <a href={site.socials.facebook} target="_blank" rel="noreferrer" className="bg-neutral-100 text-neutral-700 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#1877F2] hover:text-white transition-colors">
                    Facebook
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
        </div>
      </section>
    </>
  );
}
