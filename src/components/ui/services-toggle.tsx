"use client";

import { useMemo, useState } from "react";
import type { Service } from "@/lib/site-data";
import { Globe, Bot, Code2, Smartphone, Layers, ArrowRight, MessageCircle, CheckCircle2, Star } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { WhatsAppLink } from "@/components/ui/whatsapp-link";

type DisplayItem = {
  id: string;
  name: string;
  description: string;
  features: string[];
  categoryName: string;
  parentServiceId: string;
  pricePkr: number;
  priceUsd: number;
  featured: boolean;
};

const getPricingIcon = (categoryName: string, id: string) => {
  if (categoryName.toLowerCase().includes("web")) return <Globe className="w-6 h-6" />;
  if (categoryName.toLowerCase().includes("ai")) return <Bot className="w-6 h-6" />;
  if (id.toLowerCase().includes("saas")) return <Code2 className="w-6 h-6" />;
  if (categoryName.toLowerCase().includes("app")) return <Smartphone className="w-6 h-6" />;
  return <Layers className="w-6 h-6" />;
};

// Matches the "Best for SaaS" / "Most Popular" style badges already used in
// pricing-toggle.tsx, so the same packages get called out as the best choice
// wherever they're shown.
const featuredSubServiceIds = new Set(["ecommerce-web", "saas-web", "saas-app", "full-saas", "ai-agents"]);
const serviceOrder = ["web-dev", "app-dev", "saas-apps", "ai-workflows"];

type ServicesToggleProps = {
  services: Service[];
  whatsapp: string;
  limit?: number;
};

export function ServicesToggle({ services, whatsapp, limit }: ServicesToggleProps) {
  const orderedServices = useMemo(
    () =>
      [...services].sort((a, b) => {
        const aIndex = serviceOrder.indexOf(a.id);
        const bIndex = serviceOrder.indexOf(b.id);
        return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
      }),
    [services],
  );
  const [activeServiceId, setActiveServiceId] = useState<string>(orderedServices[0]?.id ?? "");
  const activeService = orderedServices.find((s) => s.id === activeServiceId) ?? orderedServices[0];

  const displayItems = useMemo((): DisplayItem[] => {
    if (!activeService) return [];
    return (activeService.subServices || []).map((sub) => ({
      id: sub.id,
      name: sub.name,
      description: sub.description,
      features: sub.features,
      categoryName: activeService.title,
      parentServiceId: activeService.id,
      pricePkr: sub.pricePkr,
      priceUsd: sub.priceUsd,
      featured: featuredSubServiceIds.has(sub.id),
    }));
  }, [activeService]);

  const itemsToDisplay = limit ? displayItems.slice(0, limit) : displayItems;

  if (orderedServices.length === 0) return null;

  return (
    <div className="space-y-12 w-full">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center px-2 pb-2 sm:px-4">
        <div className="relative grid w-full grid-cols-4 items-center gap-0.5 rounded-full border border-[#ff5400]/15 bg-[var(--surface)] p-0.5 shadow-[0_10px_28px_rgba(255,84,0,0.08)] lg:w-1/2">
          {orderedServices.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => setActiveServiceId(service.id)}
              className={`relative z-10 inline-flex h-11 w-full min-w-0 items-center justify-center gap-0.5 whitespace-nowrap rounded-full px-0.5 text-center text-[7px] font-semibold uppercase leading-none tracking-[0.01em] transition-colors duration-300 sm:gap-1 sm:px-1.5 sm:text-[9px] sm:tracking-wide lg:text-[10px] ${
                activeServiceId === service.id ? "text-white" : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {activeServiceId === service.id && (
                <motion.div
                  layoutId="activeServicesTab"
                  className="absolute inset-x-0.5 inset-y-1.5 -z-10 rounded-full bg-[#ff5400] shadow-[0_8px_18px_rgba(255,84,0,0.26)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="hidden shrink-0 items-center sm:inline-flex [&_svg]:h-3.5 [&_svg]:w-3.5">
                {getPricingIcon(service.title, service.id)}
              </span>
              <span className="block text-center leading-none">{service.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 items-stretch max-w-7xl mx-auto px-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {itemsToDisplay.map((item) => (
          <article
            key={item.id}
            className="group relative flex flex-col justify-between rounded-[24px] border border-[#ff5400]/14 bg-[var(--panel)] p-6 sm:p-7 pt-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)] h-full min-h-[380px]"
          >
            {item.featured && (
              <div className="absolute left-1/2 top-0 z-20 w-40 -translate-x-1/2 overflow-hidden rounded-b-[18px] bg-gradient-to-r from-[#ff5400] to-[#ff8150] py-1.5 shadow-[0_10px_22px_rgba(255,84,0,0.30)]">
                <span className="flex items-center justify-center gap-1 text-[9px] font-black uppercase tracking-wider text-white">
                  <Star className="w-2.5 h-2.5 fill-white" /> Best Choice
                </span>
              </div>
            )}
            {item.featured && (
              <div className="pointer-events-none absolute left-1/2 top-0 h-16 w-56 -translate-x-1/2 bg-[#ff5400]/10 blur-2xl" />
            )}

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex items-start justify-between w-full pt-2">
                <div className="w-[54px] h-[54px] rounded-[16px] bg-[#ff5400] text-white flex items-center justify-center shadow-[0_4px_12px_rgba(255,84,0,0.25)] transition-transform duration-300 group-hover:scale-105">
                  {getPricingIcon(item.categoryName, item.id)}
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-semibold uppercase tracking-wide text-[var(--muted)]">from</p>
                  <p className="text-sm font-bold text-[var(--foreground)]">
                    PKR <span className="text-[#ff5400]">{item.pricePkr.toLocaleString()}</span>
                  </p>
                </div>
              </div>

              <div className="mt-6 flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-medium text-[var(--foreground)]">Voquarn</span>
                  <span className="text-[11px] text-[var(--muted)]">• {item.categoryName}</span>
                </div>

                <h3 className="mt-1.5 text-base sm:text-[18px] font-bold text-[var(--foreground)] tracking-tight leading-tight truncate">
                  {item.name}
                </h3>

                <div className="my-4 border-t border-[var(--border)]" />

                <ul className="space-y-2">
                  {item.features.slice(0, 3).map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-[12px] font-medium text-[var(--muted)]">
                      <CheckCircle2 className="w-4 h-4 text-[#ff5400] flex-shrink-0" />
                      <span className="truncate">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-2">
                <div className="my-4 border-t border-[var(--border)]" />

                <div className="flex gap-2">
                  <Link
                    href={`/services/${item.parentServiceId}`}
                    className="flex-1 h-11 py-2.5 rounded-full text-white font-medium text-[12px] flex items-center justify-center transition-all duration-300 active:scale-[0.98] cursor-pointer tracking-wide bg-gradient-to-b from-[#ff6b21] to-[#e04800] hover:from-[#ff7c3b] hover:to-[#f05000] shadow-[0_8px_20px_rgba(255,84,0,0.2)]"
                  >
                    Learn More <ArrowRight size={14} className="ml-1" />
                  </Link>
                  <WhatsAppLink
                    href={`https://wa.me/${whatsapp}?text=Hi%20Voquarn%20Code,%20I%20want%20to%20discuss%20the%20${encodeURIComponent(item.categoryName + " - " + item.name)}%20package.`}
                    className="h-11 w-11 py-2.5 rounded-full text-white font-medium text-[13px] flex items-center justify-center transition-all duration-300 active:scale-[0.98] cursor-pointer flex-shrink-0 bg-gradient-to-b from-[#2c2c2e] to-[#151516] hover:from-[#3a3a3c] hover:to-[#1c1c1e] shadow-[0_8px_20px_rgba(0,0,0,0.2)]"
                    aria-label="Discuss on WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </WhatsAppLink>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
