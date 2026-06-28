"use client";

import { useMemo, useState } from "react";
import { site, services } from "@/lib/site-data";
import { Globe, Bot, Code2, Smartphone, Layers, ArrowRight, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

type DisplayItem = {
  id: string;
  name: string;
  description: string;
  features: string[];
  categoryName: string;
  parentServiceId: string;
  pricePkr: number;
  priceUsd: number;
};

const getPricingIcon = (categoryName: string, id: string) => {
  if (categoryName.toLowerCase().includes("web")) return <Globe className="w-6 h-6 text-white" />;
  if (categoryName.toLowerCase().includes("ai")) return <Bot className="w-6 h-6 text-white" />;
  if (id.toLowerCase().includes("saas")) return <Code2 className="w-6 h-6 text-white" />;
  if (categoryName.toLowerCase().includes("app")) return <Smartphone className="w-6 h-6 text-white" />;
  return <Layers className="w-6 h-6 text-white" />;
};

type ServicesToggleProps = {
  limit?: number;
  buttonVariant?: "dark" | "orange";
};

export function ServicesToggle({ limit, buttonVariant = "dark" }: ServicesToggleProps) {
  const [activeTab, setActiveTab] = useState<"websites" | "apps" | "ai">("websites");

  const displayItems = useMemo((): DisplayItem[] => {
    if (activeTab === "websites") {
      const webDev = services.find((s) => s.id === "web-dev");
      return (webDev?.subServices || []).map((sub) => ({
        id: sub.id,
        name: sub.name,
        description: sub.description,
        features: sub.features,
        categoryName: "Web Development",
        parentServiceId: "web-dev",
        pricePkr: sub.pricePkr,
        priceUsd: sub.priceUsd,
      }));
    }

    if (activeTab === "apps") {
      const appDev = services.find((s) => s.id === "app-dev");
      const saasApps = services.find((s) => s.id === "saas-apps");
      const appSubs = appDev?.subServices || [];
      const saasSubs = saasApps?.subServices || [];
      return [...appSubs, ...saasSubs].map((sub) => ({
        id: sub.id,
        name: sub.name,
        description: sub.description,
        features: sub.features,
        categoryName: "Apps & SaaS",
        parentServiceId: "app-dev",
        pricePkr: sub.pricePkr,
        priceUsd: sub.priceUsd,
      }));
    }

    if (activeTab === "ai") {
      const aiWorkflows = services.find((s) => s.id === "ai-workflows");
      return (aiWorkflows?.subServices || []).map((sub) => ({
        id: sub.id,
        name: sub.name,
        description: sub.description,
        features: sub.features,
        categoryName: "AI & Automation",
        parentServiceId: "ai-workflows",
        pricePkr: sub.pricePkr,
        priceUsd: sub.priceUsd,
      }));
    }

    return [];
  }, [activeTab]);

  const categories = [
    { id: "websites" as const, label: "Websites" },
    { id: "apps" as const, label: "Apps" },
    { id: "ai" as const, label: "AI & Automation" },
  ];

  const itemsToDisplay = limit ? displayItems.slice(0, limit) : displayItems;

  return (
    <div className="space-y-12 w-full">
      <div className="flex flex-col gap-6 items-center justify-center max-w-5xl mx-auto px-4">
        <div className="flex flex-nowrap justify-center rounded-full border border-[#ff5400]/15 bg-[var(--surface)] p-1.5 shadow-[0_10px_30px_rgba(255,84,0,0.08)] max-w-full relative">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveTab(cat.id)}
              className={`relative rounded-full px-3 py-2 text-[11px] font-medium uppercase tracking-wide transition-colors duration-300 z-10 whitespace-nowrap sm:px-5 sm:py-2.5 sm:text-xs sm:tracking-wider ${
                activeTab === cat.id ? "text-white" : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {activeTab === cat.id && (
                <motion.div
                  layoutId="activeServicesTab"
                  className="absolute inset-0 bg-[#ff5400] rounded-full -z-10 shadow-[0_8px_18px_rgba(255,84,0,0.28)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 items-stretch max-w-7xl mx-auto px-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {itemsToDisplay.map((item) => (
          <article
            key={item.id}
            className="group relative flex flex-col justify-between rounded-[32px] border border-[var(--border)] bg-[var(--panel)] p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)] h-full min-h-[380px]"
          >
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex items-center justify-between w-full">
                <div className="w-[54px] h-[54px] rounded-[16px] bg-[#1a1a1a] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-transform duration-300 group-hover:scale-105">
                  {getPricingIcon(item.categoryName, item.id)}
                </div>
                <span className="text-[11px] font-bold text-[var(--muted)] bg-[var(--surface)] px-3 py-1 rounded-full">
                  from PKR {item.pricePkr.toLocaleString()}
                </span>
              </div>

              <div className="mt-6 flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-medium text-[var(--foreground)]">Voquarn</span>
                  <span className="text-[11px] text-[var(--muted)]">• {item.categoryName}</span>
                </div>

                <h3 className="mt-1.5 text-base sm:text-[18px] font-bold text-[var(--foreground)] tracking-tight leading-tight truncate">
                  {item.name}
                </h3>

                <div className="mt-3 flex flex-wrap gap-1">
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
                <div className="my-4 border-t border-[var(--border)]" />

                <div className="flex gap-2">
                  <Link
                    href={`/services/${item.parentServiceId}`}
                    className="flex-1 h-11 py-2.5 rounded-full text-[var(--foreground)] font-medium text-[12px] flex items-center justify-center transition-all duration-300 active:scale-[0.98] cursor-pointer tracking-wide border border-[var(--border)] hover:border-[var(--foreground)] hover:bg-[var(--surface)]"
                  >
                    Learn More <ArrowRight size={14} className="ml-1" />
                  </Link>
                  <a
                    href={`https://wa.me/${site.whatsapp}?text=Hi%20Voquarn%20Code,%20I%20want%20to%20discuss%20the%20${encodeURIComponent(item.categoryName + " - " + item.name)}%20package.`}
                    target="_blank"
                    rel="noreferrer"
                    className={`h-11 w-11 py-2.5 rounded-full text-white font-medium text-[13px] flex items-center justify-center transition-all duration-300 active:scale-[0.98] cursor-pointer flex-shrink-0 ${
                      buttonVariant === "orange"
                        ? "bg-gradient-to-b from-[#ff6b21] to-[#e04800] hover:from-[#ff7c3b] hover:to-[#f05000] shadow-[0_8px_20px_rgba(255,84,0,0.2)]"
                        : "bg-gradient-to-b from-[#2c2c2e] to-[#151516] hover:from-[#3a3a3c] hover:to-[#1c1c1e] shadow-[0_8px_20px_rgba(0,0,0,0.2)]"
                    }`}
                    aria-label="Discuss on WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
