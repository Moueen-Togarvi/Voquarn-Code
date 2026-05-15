import { site } from "@/lib/site-data";

export function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${site.whatsapp}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#25d366] px-4 py-3 text-sm font-semibold text-[#062312] shadow-lg dark:shadow-[#25d366]/20 transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-[#062312]" />
      WhatsApp
    </a>
  );
}
