import Link from "next/link";
import { site } from "@/lib/site-data";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full px-4 py-8 lg:px-8 bg-neutral-100 transition-colors duration-300">
      <div className="mx-auto max-w-7xl rounded-[2.5rem] bg-white border border-neutral-200 p-8 md:p-12 lg:p-16">

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">

          {/* Left Column - Logo, Paragraph & Map (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col space-y-7">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 w-fit group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/final-logo.png"
                alt="Voquarn Logo"
                className="h-24 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            <p className="text-[13px] text-neutral-500 max-w-sm leading-relaxed font-semibold">
              We design and build fast, growth-ready digital products — websites, apps, AI workflows, and brand systems for businesses that want sharp execution.
            </p>

            {/* Map Frame */}
            <div className="w-full max-w-sm h-32 rounded-2xl overflow-hidden border border-neutral-200 relative shadow-sm">
              <iframe
                title="Bahawalnagar Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110196.26252996614!2d73.1818296!3d29.9954705!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x393d2568f56191a3%3A0x62953deeb75024b3!2sBahawalnagar%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              />
            </div>
          </div>

          {/* Center Column - Navigation Links (lg:col-span-4) */}
          <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-3 gap-10 pt-2 lg:pl-4">
            <div className="flex flex-col space-y-4">
              <h4 className="text-[13px] font-bold text-black uppercase tracking-widest">Product</h4>
              <Link href="/services" className="text-[13px] text-neutral-500 hover:text-black transition-colors">Features</Link>
              <Link href="/pricing" className="text-[13px] text-neutral-500 hover:text-black transition-colors">Pricing</Link>
              <Link href="/portfolio" className="text-[13px] text-neutral-500 hover:text-black transition-colors">Portfolio</Link>
              <Link href="/services" className="text-[13px] text-neutral-500 hover:text-black transition-colors">Updates</Link>
            </div>

            <div className="flex flex-col space-y-4">
              <h4 className="text-[13px] font-bold text-black uppercase tracking-widest">Resources</h4>
              <Link href="/services" className="text-[13px] text-neutral-500 hover:text-black transition-colors">Documentation</Link>
              <Link href="/services" className="text-[13px] text-neutral-500 hover:text-black transition-colors">Guides</Link>
              <Link href="/services" className="text-[13px] text-neutral-500 hover:text-black transition-colors">Blog</Link>
              <Link href="/services" className="text-[13px] text-neutral-500 hover:text-black transition-colors">Support</Link>
            </div>

            <div className="flex flex-col space-y-4 col-span-2 sm:col-span-1">
              <h4 className="text-[13px] font-bold text-black uppercase tracking-widest">Company</h4>
              <Link href="/about" className="text-[13px] text-neutral-500 hover:text-black transition-colors">About</Link>
              <Link href="/careers" className="text-[13px] text-neutral-500 hover:text-black transition-colors">Careers</Link>
              <Link href="/team" className="text-[13px] text-neutral-500 hover:text-black transition-colors">Team</Link>
              <Link href="/contact" className="text-[13px] text-neutral-500 hover:text-black transition-colors">Contact</Link>
            </div>
          </div>

          {/* Right Column - Email, Phone, Address & Socials (lg:col-span-3) */}
          <div className="lg:col-span-3 flex flex-col space-y-7 pt-2">
            <h4 className="text-[13px] font-bold text-black uppercase tracking-widest">Direct Contact</h4>
            
            {/* Contact Info Card */}
            <div className="space-y-4">
              <a
                href="mailto:hello@voquarn.com"
                className="flex items-center gap-3 group w-fit"
              >
                <div className="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200/60 flex items-center justify-center group-hover:bg-black transition-colors duration-300">
                  <Mail className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="text-[13px] font-bold text-neutral-700 group-hover:text-black transition-colors duration-300">
                  hello@voquarn.com
                </span>
              </a>

              <a
                href="tel:+923241940988"
                className="flex items-center gap-3 group w-fit"
              >
                <div className="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200/60 flex items-center justify-center group-hover:bg-black transition-colors duration-300">
                  <Phone className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="text-[13px] font-bold text-neutral-700 group-hover:text-black transition-colors duration-300">
                  +92 324 1940988
                </span>
              </a>

              <div className="flex items-center gap-3 w-fit">
                <div className="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200/60 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-neutral-600" />
                </div>
                <span className="text-[13px] font-bold text-neutral-600 max-w-[200px] leading-snug">
                  Bahawalnagar, Punjab, Pakistan
                </span>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              {/* LinkedIn */}
              <a
                href={site.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center hover:bg-[#0077B5] hover:border-[#0077B5] transition-all duration-300 group"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href={site.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#e6683c] hover:to-[#bc1888] hover:border-transparent transition-all duration-300 group"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>

              {/* Facebook */}
              <a
                href={site.socials.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center hover:bg-[#1877F2] hover:border-[#1877F2] transition-all duration-300 group"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center hover:bg-[#25D366] hover:border-[#25D366] transition-all duration-300 group"
                aria-label="WhatsApp"
              >
                <svg className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Section - Full Width Divider then Legal */}
        <div className="mt-16 pt-8 border-t border-neutral-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-[12px] text-neutral-400 order-2 md:order-1">
              © {new Date().getFullYear()} Voquarn Code. All rights reserved.
            </p>

            {/* Legal Links - pill style */}
            <div className="flex items-center gap-1 bg-neutral-50 border border-neutral-200 rounded-full px-1.5 py-1 order-1 md:order-2">
              <Link
                href="/terms"
                className="px-4 py-1.5 rounded-full text-[11px] font-medium text-neutral-500 hover:text-black hover:bg-white hover:shadow-sm transition-all duration-200"
              >
                Terms of Service
              </Link>
              <div className="w-px h-3 bg-neutral-300" />
              <Link
                href="/privacy"
                className="px-4 py-1.5 rounded-full text-[11px] font-medium text-neutral-500 hover:text-black hover:bg-white hover:shadow-sm transition-all duration-200"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
