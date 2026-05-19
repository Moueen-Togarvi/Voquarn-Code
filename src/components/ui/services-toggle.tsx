"use client";

import { useMemo, useState } from "react";
import { site, services } from "@/lib/site-data";
import { Globe, Bot, Code2, Smartphone, Layers, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

type DisplayItem = {
  id: string;
  name: string;
  description: string;
  features: string[];
  categoryName: string;
  parentServiceId: string;
};

// Helper to determine badge for sub-services
const getPricingIcon = (categoryName: string, id: string) => {
  if (categoryName.toLowerCase().includes("web")) {
    return <Globe className="w-5 h-5 text-white" />;
  }
  if (categoryName.toLowerCase().includes("ai")) {
    return <Bot className="w-5 h-5 text-white" />;
  }
  if (id.toLowerCase().includes("saas")) {
    return <Code2 className="w-5 h-5 text-white" />;
  }
  if (categoryName.toLowerCase().includes("app")) {
    return <Smartphone className="w-5 h-5 text-white" />;
  }
  return <Layers className="w-5 h-5 text-white" />;
};

export function ServicesToggle({ limit }: { limit?: number }) {
  const [activeTab, setActiveTab] = useState<"websites" | "apps" | "ai">("websites");

  // Compile items based on the active tab
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
        parentServiceId: "app-dev", // Or saas-apps depending on where it came from, but for WhatsApp mapping categoryName works
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
      }));
    }

    return [];
  }, [activeTab]);

  const categories = [
    { id: "websites", label: "Websites" },
    { id: "apps", label: "Apps" },
    { id: "ai", label: "AI & Automation" },
  ] as const;

  const itemsToDisplay = limit ? displayItems.slice(0, limit) : displayItems;

  return (
    <div className="space-y-12 w-full">
      {/* Category selector row */}
      <div className="flex flex-col gap-6 items-center justify-center max-w-5xl mx-auto px-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center rounded-full border border-neutral-200 bg-neutral-50 p-1.5 shadow-sm max-w-full relative">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveTab(cat.id)}
              className={`relative rounded-full px-5 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors duration-300 z-10 ${
                activeTab === cat.id ? "text-white" : "text-neutral-600 hover:text-black"
              }`}
            >
              {activeTab === cat.id && (
                <motion.div
                  layoutId="activeServicesTab"
                  className="absolute inset-0 bg-neutral-900 rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Services Cards Grid (No Pricing) */}
      <div className="grid gap-6 items-stretch max-w-7xl mx-auto px-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {itemsToDisplay.map((item) => (
          <article
            key={item.id}
            className="group relative flex flex-col justify-between rounded-[32px] border border-neutral-200/80 bg-white p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)] h-full min-h-[380px]"
          >
            <div className="relative z-10 flex flex-col h-full justify-between">
              
              {/* ── Top Row: App Icon ── */}
              <div className="flex items-center justify-between w-full">
                {/* Rounded Dark Square App Icon */}
                <div className="w-[46px] h-[46px] rounded-[14px] bg-[#1a1a1a] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] group-hover:scale-105 transition-transform duration-300">
                  {getPricingIcon(item.categoryName, item.id)}
                </div>
              </div>

              {/* ── Middle Section: Category, Title, Short Desc & Tags ── */}
              <div className="mt-6 flex-1 flex flex-col justify-center">
                {/* Category & Tagline */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-medium text-neutral-800">Voquarn</span>
                  <span className="text-[11px] text-neutral-400">• {item.categoryName}</span>
                </div>

                {/* Main Title */}
                <h3 className="mt-1.5 text-base sm:text-[18px] font-bold text-neutral-900 tracking-tight leading-tight truncate">
                  {item.name}
                </h3>


                {/* Feature Tags */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {item.features.slice(0, 3).map((feature) => (
                    <span
                      key={feature}
                      className="rounded-full bg-neutral-100 px-2 py-0.5 text-[8px] font-semibold tracking-wide text-neutral-500"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* ── Bottom Section: Scope Button ── */}
              <div className="mt-6 pt-2">
                {/* Horizontal Divider */}
                <div className="my-4 border-t border-neutral-200/80" />

                {/* Spectacular 3D Glossy Black Button */}
                <a
                  href={`https://wa.me/${site.whatsapp}?text=Hi%20Voquarn%20Code,%20I%20want%20to%20discuss%20the%20${encodeURIComponent(item.categoryName + " - " + item.name)}%20package.`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full h-12 py-3 rounded-full text-white font-medium text-[13px] flex items-center justify-center transition-all duration-300 active:scale-[0.98] cursor-pointer tracking-wide bg-gradient-to-b from-[#2c2c2e] to-[#151516] hover:from-[#3a3a3c] hover:to-[#1c1c1e] shadow-[0_8px_20px_rgba(0,0,0,0.2),inset_0_2px_1px_rgba(255,255,255,0.2)]"
                >
                  <MessageCircle className="w-4 h-4 mr-2" /> Discuss on WhatsApp
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
