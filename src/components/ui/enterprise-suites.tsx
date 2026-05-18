"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Activity } from "lucide-react";

// Premium Enterprise Data with High-End SaaS/Dashboard Unsplash Images
const SUITES_DATA = [
  {
    id: "hospital",
    num: "01",
    tag: "SYS_HEALTHCARE",
    title: "Hospital Management CRM",
    description: "End-to-end hospital administration architecture designed for zero-latency patient care and resource optimization.",
    capabilities: ["Automated Patient Records (EHR)", "Smart Bed & OT Allocation", "Integrated Billing & Pharmacy Sync"],
    metrics: "99.99% Uptime | HIPAA Compliant",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800", // Clean Dashboard
  },
  {
    id: "pos",
    num: "02",
    tag: "SYS_RETAIL_POS",
    title: "POS Softwares & Systems",
    description: "High-speed point of sale architectures engineered for multi-store cloud synchronization and real-time checkout.",
    capabilities: ["Multi-store Cloud Synchronization", "Real-time Inventory Tracking", "Barcode & RFID Hardware Integration"],
    metrics: "<12ms Checkout Latency",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=800", // Code / Sync
  },
  {
    id: "lab",
    num: "03",
    tag: "SYS_DIAGNOSTIC",
    title: "Lab Management CRM",
    description: "Advanced pathology and diagnostic workflow automation ensuring absolute sample traceability and rapid reporting.",
    capabilities: ["Automated Sample Barcoding", "Smart Diagnostic Report Generation", "Pathology & Equipment Interfacing"],
    metrics: "100% Sample Traceability",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800", // High tech lab / screen
  },
  {
    id: "clinic",
    num: "04",
    tag: "SYS_CLINIC_MD",
    title: "Clinic Management CRMs",
    description: "Intelligent practitioner platforms tailored for seamless appointment scheduling and digital prescription management.",
    capabilities: ["Doctor Appointment Scheduling", "Electronic Health Records (EHR)", "Digital Prescription & Follow-ups"],
    metrics: "Zero Queue Waiting Workflows",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800", // Medical tech tablet
  },
  {
    id: "hotel",
    num: "05",
    tag: "SYS_HOSPITALITY",
    title: "Hotel Management System",
    description: "Next-generation hospitality suites powering flawless guest experiences, room reservation engines, and dispatch.",
    capabilities: ["Room Reservation & Booking Engine", "Housekeeping & Dispatch Automation", "Guest Experience & Billing Portal"],
    metrics: "Omnichannel Guest Portal",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800", // Luxury hotel / modern arch
  },
  {
    id: "dairy",
    num: "06",
    tag: "SYS_AGRI_TECH",
    title: "Dairy Farm Management CRM",
    description: "Precision agritech architectures tracking cattle health, milk yield analytics, and automated feed inventories.",
    capabilities: ["Cattle Health & Breeding Tracking", "IoT Milk Yield Analytics", "Feed & Inventory Automation"],
    metrics: "IoT Sensor Integration Ready",
    image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&q=80&w=800", // Agritech / clean landscape
  },
];

export function EnterpriseSuites() {
  const [activeTabId, setActiveTabId] = useState("hospital");

  const activeTab = SUITES_DATA.find((s) => s.id === activeTabId) || SUITES_DATA[0];

  return (
    <section className="relative w-full py-16 md:py-20 bg-white text-black border-b border-neutral-200 overflow-hidden select-none">
      
      {/* ── Section Header (Compact & Crisp) ── */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-2 h-2 rounded-full bg-[#ff5400] animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff5400]">
            Industry Architectures
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-display text-black">
          Enterprise Domain Suites
        </h2>
      </div>

      {/* ── Main 2-Column Swiss Grid (Perfectly Balanced Height & Width) ── */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* LEFT COLUMN: Compact Index List */}
          <div className="lg:col-span-6 flex flex-col justify-between border-t border-neutral-200">
            {SUITES_DATA.map((suite) => {
              const isActive = suite.id === activeTabId;
              return (
                <button
                  key={suite.id}
                  onClick={() => setActiveTabId(suite.id)}
                  onMouseEnter={() => setActiveTabId(suite.id)}
                  className={`w-full py-4 md:py-4 flex items-center justify-between border-b border-neutral-200 text-left transition-all duration-300 group relative ${
                    isActive ? "pl-4 md:pl-6 bg-neutral-50/80" : "hover:pl-2"
                  }`}
                >
                  {/* Left orange active indicator bar */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeSuiteIndicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-[#ff5400]" 
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}

                  <div className="flex items-center gap-4 md:gap-6 min-w-0 pr-4">
                    <span className={`text-xs md:text-sm font-mono font-bold transition-colors ${isActive ? "text-[#ff5400]" : "text-neutral-400"}`}>
                      {suite.num}
                    </span>
                    <span className={`text-lg md:text-xl lg:text-2xl font-display font-medium tracking-tight truncate transition-colors ${
                      isActive ? "text-black font-semibold" : "text-neutral-600 group-hover:text-black"
                    }`}>
                      {suite.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0 pr-2">
                    <span className={`text-[10px] font-mono hidden sm:inline-block transition-opacity ${isActive ? "opacity-100 text-[#ff5400]" : "opacity-0 group-hover:opacity-50"}`}>
                      [ ACTIVE ]
                    </span>
                    <ArrowUpRight className={`w-4 h-4 transition-transform duration-300 ${isActive ? "text-[#ff5400] transform translate-x-1 -translate-y-1" : "text-neutral-300 group-hover:text-black"}`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* RIGHT COLUMN: Active Suite Card (Balanced Width & Height ~425px) */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab.id}
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -15 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[520px] p-5 md:p-6 rounded-3xl bg-neutral-50 border border-neutral-200/80 shadow-lg relative overflow-hidden group flex flex-col justify-between h-[425px]"
              >
                {/* Ambient glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle,rgba(255,84,0,0.08)_0%,transparent_70%)] pointer-events-none" />
                
                <div className="flex flex-col flex-1 min-h-0">
                  {/* Eyebrow tag & Metrics */}
                  <div className="flex items-center justify-between gap-4 mb-2 flex-shrink-0">
                    <span className="text-[10px] font-mono font-bold px-3 py-0.5 rounded-full bg-white border border-neutral-200 text-[#ff5400] tracking-widest uppercase">
                      {activeTab.tag}
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-neutral-500 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-[#ff5400] animate-pulse" />
                      {activeTab.metrics}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg md:text-xl font-bold font-display tracking-tight text-black mb-3 flex-shrink-0">
                    {activeTab.title}
                  </h3>

                  {/* INTEGRATED CARD IMAGE (FLEX-1 EXPANDS INTO FREED SPACE) */}
                  <div className="relative w-full flex-1 min-h-[250px] max-h-[300px] rounded-xl overflow-hidden mb-4 border border-neutral-200 shadow-inner bg-neutral-100 group/img flex-shrink">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={activeTab.image} 
                      alt={activeTab.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white text-[9px] font-mono font-bold tracking-wider z-10">
                      <span>// LIVE_PREVIEW_ACTIVE</span>
                      <span className="flex items-center gap-1 text-[#ff5400]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff5400] animate-ping" />
                        SECURE_STREAM
                      </span>
                    </div>
                  </div>
                </div>

                {/* Interactive Deploy CTA */}
                <button 
                  onClick={() => alert(`Initiating deployment sequence for ${activeTab.title}...`)}
                  className="w-full py-2.5 px-4 rounded-xl bg-black text-white text-[11px] font-bold uppercase tracking-widest hover:bg-[#ff5400] transition-colors duration-300 flex items-center justify-center gap-2 shadow flex-shrink-0"
                >
                  <span>Request Architecture Demo</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
