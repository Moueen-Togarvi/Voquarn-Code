"use client";

import Link from "next/link";
import type { Service } from "@/lib/site-data";
import { Code2, Smartphone, Sparkles, Globe, Bot } from "lucide-react";
import { motion } from "framer-motion";

type ServiceCardProps = {
  service: Service;
  index?: number;
};

// Map service IDs to estimated starts-from pricing matching pricing plans
const getPriceEstimate = (id: string) => {
  switch (id) {
    case "web-dev":
      return "$650";
    case "app-dev":
      return "$1,500";
    case "saas-apps":
      return "$3,000";
    case "ai-workflows":
      return "$2,000";
    default:
      return "$1,000";
  }
};

// Map service IDs to elegant Lucide icons
const getServiceIcon = (id: string) => {
  switch (id) {
    case "web-dev":
      return <Globe className="w-5 h-5 text-white" />;
    case "app-dev":
      return <Smartphone className="w-5 h-5 text-white" />;
    case "saas-apps":
      return <Code2 className="w-5 h-5 text-white" />;
    case "ai-workflows":
      return <Bot className="w-5 h-5 text-white" />;
    default:
      return <Sparkles className="w-5 h-5 text-white" />;
  }
};

export function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group relative flex flex-col justify-between rounded-[32px] border border-neutral-200/80 bg-white p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)] h-full min-h-[380px]"
    >
      <div className="relative z-10 flex flex-col h-full justify-between">
        
        {/* ── Top Row: App Icon ── */}
        <div className="flex items-center">
          {/* Rounded Dark Square App Icon */}
          <div className="w-[46px] h-[46px] rounded-[14px] bg-[#1a1a1a] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] group-hover:scale-105 transition-transform duration-300">
            {getServiceIcon(service.id)}
          </div>
        </div>

        {/* ── Middle Section: Company, Title & Tags ── */}
        <div className="mt-6 flex-1 flex flex-col justify-center">
          {/* Company & Posting Time */}
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] font-medium text-neutral-800">Voquarn</span>
            <span className="text-[11px] text-neutral-400">7 days ago</span>
          </div>

          {/* Main Title */}
          <h3 className="mt-1.5 text-[22px] font-normal text-neutral-900 tracking-tight leading-[1.2] line-clamp-2">
            {service.title}
          </h3>

          {/* Deliverable Tags (Soft Gray Pill Style - Compact Size) */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {service.deliverables.slice(0, 2).map((item) => (
              <span
                key={item}
                className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[9px] font-semibold tracking-wide text-neutral-600"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ── Bottom Section: Price, Location & 3D Button ── */}
        <div className="mt-6 pt-2">
          {/* Price & Location Line */}
          <div className="flex items-baseline justify-between px-0.5">
            <div className="flex items-baseline">
              <span className="text-[18px] font-normal text-neutral-900 tracking-tight">
                {getPriceEstimate(service.id)}
              </span>
              <span className="text-[11px] font-normal text-neutral-500 ml-1">
                /project
              </span>
            </div>
            <span className="text-[12px] font-medium text-neutral-600">
              Remote, Global
            </span>
          </div>

          {/* Horizontal Divider */}
          <div className="my-4 border-t border-neutral-200/80" />

          {/* Spectacular 3D Glossy Black Pill Button */}
          <Link href={`/services/${service.id}`} className="w-full h-13 py-3.5 rounded-full bg-gradient-to-b from-[#2c2c2e] to-[#151516] text-white font-medium text-[13px] shadow-[0_8px_20px_rgba(0,0,0,0.2),inset_0_2px_1px_rgba(255,255,255,0.2)] flex items-center justify-center hover:from-[#3a3a3c] hover:to-[#1c1c1e] transition-all duration-300 active:scale-[0.98] cursor-pointer tracking-wide">
            View details
          </Link>
        </div>

      </div>
    </motion.article>
  );
}
