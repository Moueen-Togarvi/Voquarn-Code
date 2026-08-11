"use client";

import { useMemo, useState } from "react";
import type { Service } from "@/lib/site-data";
import { MessageCircle, Globe, Bot, Code2, Smartphone, Layers } from "lucide-react";
import { WhatsAppLink } from "@/components/ui/whatsapp-link";

type DisplayItem = {
  id: string;
  name: string;
  description: string;
  pricePkr: number;
  priceUsd: number;
  features: string[];
  featured?: boolean;
  badge?: { text: string; color: string } | null;
  categoryName: string;
};

const getPricingIcon = (categoryName: string, id: string) => {
  if (categoryName.toLowerCase().includes("web")) return <Globe className="w-5 h-5 text-white" />;
  if (categoryName.toLowerCase().includes("ai")) return <Bot className="w-5 h-5 text-white" />;
  if (id.toLowerCase().includes("saas")) return <Code2 className="w-5 h-5 text-white" />;
  if (categoryName.toLowerCase().includes("app")) return <Smartphone className="w-5 h-5 text-white" />;
  return <Layers className="w-5 h-5 text-white" />;
};

const featuredSubServiceIds = new Set(["ecommerce-web", "saas-web", "saas-app", "full-saas", "ai-agents"]);

const getSubServiceBadge = (id: string) => {
  switch (id) {
    case "ecommerce-web": return { text: "High ROI", color: "bg-[#ff5400] text-white" };
    case "saas-web": return { text: "Best for SaaS", color: "bg-neutral-900 text-white" };
    case "ai-web":
    case "ai-app": return { text: "AI-Powered", color: "bg-teal-600 text-white" };
    case "saas-app": return { text: "Most Popular", color: "bg-[#ff5400] text-white" };
    case "full-saas": return { text: "Scale Ready", color: "bg-indigo-600 text-white" };
    case "ai-agents": return { text: "Advanced", color: "bg-purple-600 text-white" };
    default: return null;
  }
};

type PricingToggleProps = {
  services: Service[];
  whatsapp: string;
  limit?: number;
};

export function PricingToggle({ services, whatsapp, limit }: PricingToggleProps) {
  const [currency, setCurrency] = useState<"PKR" | "USD">("PKR");
  const [activeServiceId, setActiveServiceId] = useState<string>(services[0]?.id ?? "");
  const activeService = services.find((s) => s.id === activeServiceId) ?? services[0];

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(currency === "PKR" ? "en-PK" : "en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }),
    [currency],
  );

  const displayItems = useMemo((): DisplayItem[] => {
    if (!activeService) return [];
    return (activeService.subServices || []).map((sub) => ({
      id: sub.id,
      name: sub.name,
      description: sub.description,
      pricePkr: sub.pricePkr,
      priceUsd: sub.priceUsd,
      features: sub.features,
      featured: featuredSubServiceIds.has(sub.id),
      badge: getSubServiceBadge(sub.id),
      categoryName: activeService.title,
    }));
  }, [activeService]);

  const itemsToDisplay = limit ? displayItems.slice(0, limit) : displayItems;

  if (services.length === 0) return null;

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-6 items-center justify-between lg:flex-row max-w-5xl mx-auto px-4">
        <div className="flex flex-wrap justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-sm max-w-full relative">
          {services.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => setActiveServiceId(service.id)}
              className={`relative rounded-full px-3 py-2 text-[11px] font-medium uppercase tracking-wide transition-colors duration-300 z-10 whitespace-nowrap sm:px-5 sm:py-2.5 sm:text-xs sm:tracking-wider ${
                activeServiceId === service.id ? "text-white" : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {activeServiceId === service.id && (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-[var(--foreground)] rounded-full -z-10"
                />
              )}
              {service.title}
            </button>
          ))}
        </div>

        <div className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-sm relative">
          {(["PKR", "USD"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setCurrency(option)}
              className={`relative rounded-full px-5 py-2 text-xs font-medium uppercase tracking-wider transition-colors duration-300 z-10 ${
                currency === option ? "text-white" : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {currency === option && (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-[#ff5400] rounded-full -z-10"
                />
              )}
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className={`grid gap-6 items-stretch max-w-7xl mx-auto px-4 md:grid-cols-2 lg:grid-cols-3 ${
        displayItems.length === 2 ? "max-w-4xl" : "xl:grid-cols-4"
      }`}>
        {itemsToDisplay.map((item) => {
          const price = currency === "PKR" ? item.pricePkr : item.priceUsd;

          return (
            <article
              key={item.id}
              className="group relative flex flex-col justify-between rounded-[32px] border border-[var(--border)] bg-[var(--panel)] p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)] h-full min-h-[380px]"
            >
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between w-full">
                  <div className="w-[46px] h-[46px] rounded-[14px] bg-[#1a1a1a] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] group-hover:scale-105 transition-transform duration-300">
                    {getPricingIcon(item.categoryName, item.id)}
                  </div>

                  {item.badge && (
                    <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wide ${item.badge.color}`}>
                      {item.badge.text}
                    </span>
                  )}
                  {!item.badge && item.featured && (
                    <span className="rounded-full bg-[#ff5400] text-white px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wide">
                      Recommended
                    </span>
                  )}
                </div>

                <div className="mt-6 flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-medium text-[var(--foreground)]">Voquarn</span>
                    <span className="text-[11px] text-[var(--muted)]">• {item.categoryName}</span>
                  </div>

                  <h3 className="mt-1.5 text-base sm:text-[18px] font-bold text-[var(--foreground)] tracking-tight leading-tight truncate">
                    {item.name}
                  </h3>

                  <p className="mt-1 text-[11px] text-[var(--muted)] line-clamp-2 leading-relaxed min-h-[32px]">
                    {item.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.features.slice(0, 3).map((feature) => (
                      <span
                        key={feature}
                        className="rounded-full bg-[var(--surface)] px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-[var(--muted)]"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-2">
                  <div className="flex items-baseline justify-between px-0.5">
                    <div className="flex items-baseline">
                      <span className="text-[18px] font-bold text-[var(--foreground)] tracking-tight">
                        {formatter.format(price)}
                      </span>
                      <span className="text-[11px] text-[var(--muted)] ml-1">/starting</span>
                    </div>
                  </div>

                  <div className="my-4 border-t border-[var(--border)]" />

                  <WhatsAppLink
                    href={`https://wa.me/${whatsapp}?text=Hi%20Voquarn%20Code,%20I%20want%20to%20discuss%20the%20${encodeURIComponent(item.categoryName + " - " + item.name)}%20package.`}
                    className={`w-full h-12 py-3 rounded-full text-white font-medium text-[13px] flex items-center justify-center transition-all duration-300 active:scale-[0.98] cursor-pointer tracking-wide ${
                      item.featured
                        ? "bg-gradient-to-b from-[#ff6b21] to-[#e04800] hover:from-[#ff7c3b] hover:to-[#f05000] shadow-[0_8px_20px_rgba(255,84,0,0.2),inset_0_2px_1px_rgba(255,255,255,0.2)]"
                        : "bg-gradient-to-b from-[#2c2c2e] to-[#151516] hover:from-[#3a3a3c] hover:to-[#1c1c1e] shadow-[0_8px_20px_rgba(0,0,0,0.2),inset_0_2px_1px_rgba(255,255,255,0.2)]"
                    }`}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" /> Discuss on WhatsApp
                  </WhatsAppLink>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
