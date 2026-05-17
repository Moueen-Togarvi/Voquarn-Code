"use client";

import Link from "next/link";
import type { Service } from "@/lib/site-data";
import { 
  Monitor, 
  Smartphone, 
  Search, 
  Palette, 
  Layers, 
  Globe, 
  Code2, 
  ArrowUpRight 
} from "lucide-react";
import { motion } from "framer-motion";

type ServiceCardProps = {
  service: Service;
  index?: number;
};

// Map service IDs to modern high-fidelity Lucide React icons
const getServiceIcon = (id: string) => {
  switch (id) {
    case "web-dev":
      return <Monitor className="h-5 w-5 stroke-[1.8] text-[#ff5400] transition-colors duration-300" />;
    case "app-dev":
      return <Smartphone className="h-5 w-5 stroke-[1.8] text-[#ff5400] transition-colors duration-300" />;
    case "seo":
      return <Search className="h-5 w-5 stroke-[1.8] text-[#ff5400] transition-colors duration-300" />;
    case "design":
      return <Palette className="h-5 w-5 stroke-[1.8] text-[#ff5400] transition-colors duration-300" />;
    case "saas-apps":
      return <Layers className="h-5 w-5 stroke-[1.8] text-[#ff5400] transition-colors duration-300" />;
    case "wordpress":
      return <Globe className="h-5 w-5 stroke-[1.8] text-[#ff5400] transition-colors duration-300" />;
    default:
      return <Code2 className="h-5 w-5 stroke-[1.8] text-[#ff5400] transition-colors duration-300" />;
  }
};

export function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  return (
    <motion.article 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group relative flex flex-col justify-between rounded-3xl border border-black/10 bg-neutral-50/50 p-6 sm:p-7 transition-all duration-300 hover:bg-white hover:border-[#ff5400]/25 hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(255,84,0,0.06)]"
    >
      {/* Sleek dynamic orange bottom accent line */}
      <div className="absolute bottom-0 left-0 h-[2.5px] w-0 bg-[#ff5400] transition-all duration-300 group-hover:w-full rounded-b-3xl" />

      {/* Decorative clean radar dots in top-right */}
      <div className="absolute top-4 right-4 flex gap-1 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
        <span className="w-1 h-1 rounded-full bg-black" />
        <span className="w-1 h-1 rounded-full bg-black" />
        <span className="w-1 h-1 rounded-full bg-black" />
      </div>

      <div>
        {/* Dynamic Glowing Icon Badge */}
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black transition-all duration-300 group-hover:scale-105 group-hover:bg-[#ff5400]">
          <div className="group-hover:text-white transition-colors duration-300 flex items-center justify-center">
            {getServiceIcon(service.id)}
          </div>
        </div>

        {/* Premium Styled Title */}
        <h3 className="mt-6 font-display text-lg font-black uppercase tracking-tight text-black transition-colors duration-300 group-hover:text-[#ff5400]">
          {service.title}
        </h3>

        {/* Compact, clean description */}
        <p className="mt-3 text-xs sm:text-[13px] font-medium leading-relaxed text-black/60">
          {service.description}
        </p>
        
        {/* Deliverables tags */}
        <div className="mt-6 flex flex-wrap gap-1.5">
          {service.deliverables.map((item) => (
            <span 
              key={item} 
              className="rounded-lg border border-black/5 bg-black/[0.02] px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-black/40 transition-all duration-300 group-hover:bg-[#ff5400]/5 group-hover:text-[#ff5400]/70 group-hover:border-[#ff5400]/10"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Link to learn more */}
      <Link 
        href="/services" 
        className="mt-8 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#ff5400] transition-transform duration-300"
      >
        <span>Learn More</span>
        <ArrowUpRight className="h-3 w-3 stroke-[2.5] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </motion.article>
  );
}
