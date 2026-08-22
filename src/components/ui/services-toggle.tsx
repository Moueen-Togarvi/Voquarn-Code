"use client";

import { useMemo, useState } from "react";
import type { Service } from "@/lib/site-data";
import { Globe, Building2, Code2, Smartphone, Layers, ArrowRight, MessageCircle, Check, Star, Gift, Zap } from "lucide-react";
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
  offer: (typeof serviceOffers)[string] | null;
  plan: (typeof servicePlans)[string] | null;
};

const getPricingIcon = (categoryName: string, id: string) => {
  const category = categoryName.toLowerCase();
  if (category.includes("web")) return <Globe className="w-5 h-5" />;
  if (category.includes("crm") || category.includes("management")) return <Building2 className="w-5 h-5" />;
  if (id.toLowerCase().includes("saas")) return <Code2 className="w-5 h-5" />;
  if (category.includes("app")) return <Smartphone className="w-5 h-5" />;
  return <Layers className="w-5 h-5" />;
};

// The headline promise for a service, shown as a strip on every one of its
// cards. `covers` drops the feature bullet that would just repeat the strip.
// Services sold on a subscription: pricePkr/priceUsd carry the monthly entry
// point, and these are the other ways to buy the same system.
const servicePlans: Record<string, {
  unit: string;
  alternatives: { pkr: number; usd: number; label: string }[];
}> = {
  "crm-systems": {
    unit: "/month",
    alternatives: [
      { pkr: 20000, usd: 70, label: "per year" },
      { pkr: 30000, usd: 105, label: "one-time" },
    ],
  },
};

const serviceOffers: Record<string, {
  Icon: typeof Gift;
  title: string;
  note: string;
  covers?: RegExp;
}> = {
  "web-dev": {
    Icon: Gift,
    title: "Free domain + free hosting",
    note: "included for the first year",
  },
  "crm-systems": {
    Icon: Zap,
    title: "Working demo in 4 hours",
    note: "see it running before you commit",
    covers: /demo in 4 hours/i,
  },
};

// Keeps the same packages called out as the best choice wherever they're shown.
const featuredSubServiceIds = new Set(["ecommerce-web", "saas-web", "saas-app", "full-saas", "business-crm"]);
const serviceOrder = ["web-dev", "app-dev", "saas-apps", "crm-systems"];

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
  const [currency, setCurrency] = useState<"PKR" | "USD">("PKR");

  const displayItems = useMemo((): DisplayItem[] => {
    if (!activeService) return [];
    const offer = serviceOffers[activeService.id] ?? null;
    const plan = servicePlans[activeService.id] ?? null;
    return (activeService.subServices || []).map((sub) => ({
      id: sub.id,
      name: sub.name,
      description: sub.description,
      // The strip already states this promise, so don't repeat it as a bullet.
      features: offer?.covers ? sub.features.filter((f) => !offer.covers!.test(f)) : sub.features,
      categoryName: activeService.title,
      parentServiceId: activeService.id,
      pricePkr: sub.pricePkr,
      priceUsd: sub.priceUsd,
      featured: featuredSubServiceIds.has(sub.id),
      offer,
      plan,
    }));
  }, [activeService]);

  const itemsToDisplay = limit ? displayItems.slice(0, limit) : displayItems;

  if (orderedServices.length === 0) return null;

  return (
    <div className="space-y-12 w-full">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-2 pb-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-4">
        <div className="relative flex w-full items-center gap-0.5 overflow-x-auto rounded-full border border-[#ff5400]/15 bg-[var(--surface)] p-0.5 shadow-[0_10px_28px_rgba(255,84,0,0.08)] [scrollbar-width:none] sm:max-w-[820px] sm:flex-1 [&::-webkit-scrollbar]:hidden">
          {orderedServices.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => setActiveServiceId(service.id)}
              aria-pressed={activeServiceId === service.id}
              className={`relative z-10 inline-flex h-11 grow shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-center text-[10px] font-bold uppercase leading-none tracking-wide transition-colors duration-300 sm:text-[11px] ${
                activeServiceId === service.id ? "text-white" : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {activeServiceId === service.id && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0.5 inset-y-1.5 -z-10 rounded-full bg-[#ff5400] shadow-[0_8px_18px_rgba(255,84,0,0.26)]"
                />
              )}
              <span className="hidden shrink-0 items-center sm:inline-flex [&_svg]:h-3.5 [&_svg]:w-3.5">
                {getPricingIcon(service.title, service.id)}
              </span>
              <span className="leading-none">{service.title}</span>
            </button>
          ))}
        </div>

        <div className="relative inline-flex shrink-0 self-end rounded-full border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-sm sm:self-auto">
          {(["PKR", "USD"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setCurrency(option)}
              aria-pressed={currency === option}
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

      <div className="grid gap-6 items-stretch max-w-7xl mx-auto px-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {itemsToDisplay.map((item) => (
          <article
            key={item.id}
            className="group relative flex h-full flex-col overflow-hidden rounded-[22px] border border-[var(--border)] bg-[var(--panel)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-14px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-1 hover:border-[#ff5400]/35 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_26px_50px_-18px_rgba(255,84,0,0.32)]"
          >
            {/* Hairline sheen along the top edge, lit on hover. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#ff5400] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-70"
            />

            {item.featured && (
              <>
                <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 rounded-b-xl bg-gradient-to-r from-[#ff5400] to-[#ff8150] px-4 py-1 shadow-[0_8px_18px_-6px_rgba(255,84,0,0.55)]">
                  <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.12em] text-white">
                    <Star className="size-2.5 fill-white" aria-hidden="true" /> Best choice
                  </span>
                </div>
                <div className="pointer-events-none absolute left-1/2 top-0 h-14 w-48 -translate-x-1/2 bg-[#ff5400]/10 blur-2xl" aria-hidden="true" />
              </>
            )}

            <div className="flex flex-1 flex-col p-5 pt-7">
              <div className="flex items-start justify-between gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-b from-[#ff6b21] to-[#e64c00] text-white shadow-[0_6px_16px_-6px_rgba(255,84,0,0.7)] transition-transform duration-300 group-hover:scale-105">
                  {getPricingIcon(item.categoryName, item.id)}
                </span>
                <div className="text-right">
                  <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[var(--muted)]">Starting from</p>
                  <p className="mt-0.5 font-display text-[20px] font-black leading-none tracking-tight text-[var(--foreground)]">
                    <span className="text-[11px] font-bold text-[var(--muted)]">{currency} </span>
                    {(currency === "PKR" ? item.pricePkr : item.priceUsd).toLocaleString()}
                    {item.plan ? (
                      <span className="text-[11px] font-bold text-[var(--muted)]">{item.plan.unit}</span>
                    ) : null}
                  </p>
                </div>
              </div>

              <h3 className="mt-4 text-[17px] font-bold leading-snug tracking-tight text-[var(--foreground)]">
                {item.name}
              </h3>
              <p className="mt-1.5 line-clamp-2 text-[12px] font-medium leading-5 text-[var(--muted)]">
                {item.description}
              </p>

              {item.plan && (
                <p className="mt-3 rounded-lg bg-[var(--surface)] px-3 py-2 text-[11px] font-semibold text-[var(--muted)]">
                  <span className="text-[var(--foreground)]">Or</span>{" "}
                  {item.plan.alternatives
                    .map((alt) => `${currency} ${(currency === "PKR" ? alt.pkr : alt.usd).toLocaleString()} ${alt.label}`)
                    .join("  ·  ")}
                </p>
              )}

              {item.offer && (
                <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-[#ff5400]/25 bg-[#ff5400]/[0.07] px-3 py-2">
                  <item.offer.Icon className="size-4 shrink-0 text-[#ff5400]" aria-hidden="true" />
                  <p className="text-[11px] font-bold leading-tight text-[var(--foreground)]">
                    {item.offer.title}
                    <span className="block font-medium text-[var(--muted)]">{item.offer.note}</span>
                  </p>
                </div>
              )}

              <ul className="mt-4 space-y-2">
                {item.features.slice(0, 4).map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-[12px] font-medium leading-5 text-[var(--muted)]">
                    <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-[#ff5400]/12">
                      <Check className="size-2.5 text-[#ff5400]" strokeWidth={3.5} aria-hidden="true" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex gap-2 border-t border-[var(--border)] pt-5">
                <Link
                  href={`/services/${item.parentServiceId}`}
                  className="inline-flex h-11 flex-1 items-center justify-center gap-1 rounded-xl bg-gradient-to-b from-[#ff6b21] to-[#e04800] text-[12px] font-bold tracking-wide text-white shadow-[0_8px_20px_-8px_rgba(255,84,0,0.8)] transition-all duration-300 hover:from-[#ff7c3b] hover:to-[#f05000] active:scale-[0.98]"
                >
                  Learn more <ArrowRight size={14} aria-hidden="true" />
                </Link>
                <WhatsAppLink
                  href={`https://wa.me/${whatsapp}?text=Hi%20Voquarn%20Code,%20I%20want%20to%20discuss%20the%20${encodeURIComponent(item.categoryName + " - " + item.name)}%20package.`}
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-[#2c2c2e] to-[#151516] text-white transition-all duration-300 hover:from-[#3a3a3c] hover:to-[#1c1c1e] active:scale-[0.98]"
                  aria-label={`Discuss ${item.name} on WhatsApp`}
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                </WhatsAppLink>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
