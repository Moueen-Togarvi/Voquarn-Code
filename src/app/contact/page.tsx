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
      <section className="page-section">
        <SectionHeading
          eyebrow="Contact"
          title="Let’s talk about the next version of your digital presence"
          description="Use the form for a proper brief, reach out on WhatsApp for a faster conversation, or find us in Lahore, Pakistan."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <ContactForm />
          <div className="space-y-6">
            <div className="panel rounded-[2rem] p-8">
              <h2 className="font-display text-2xl text-white">Direct contact</h2>
              <div className="mt-5 space-y-3 text-[rgba(233,238,242,0.74)]">
                <p>{site.location}</p>
                <a href={`mailto:${site.email}`} className="block hover:text-white">
                  {site.email}
                </a>
                <a href={`tel:${site.phone.replace(/\s+/g, "")}`} className="block hover:text-white">
                  {site.phone}
                </a>
              </div>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-[rgba(233,238,242,0.72)]">
                <a href={site.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-white">
                  LinkedIn
                </a>
                <a href={site.socials.instagram} target="_blank" rel="noreferrer" className="hover:text-white">
                  Instagram
                </a>
                <a href={site.socials.facebook} target="_blank" rel="noreferrer" className="hover:text-white">
                  Facebook
                </a>
              </div>
              <a
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex rounded-full bg-[#25d366] px-5 py-3 text-sm font-semibold text-[#062312] hover:bg-[#4ade80]"
              >
                Message on WhatsApp
              </a>
            </div>

            <div className="panel rounded-[2rem] p-2">
              <iframe
                title="Voquarn Code Lahore map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=74.292%2C31.452%2C74.39%2C31.58&layer=mapnik"
                className="h-[320px] w-full rounded-[1.5rem] border-0"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
