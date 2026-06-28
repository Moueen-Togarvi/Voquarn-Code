"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Activity } from "lucide-react";
import Link from "next/link";

const SUITES_DATA = [
  {
    id: "hospital",
    num: "01",
    tag: "SYS_HEALTHCARE",
    title: "Hospital Management CRM",
    description: "End-to-end hospital administration architecture designed for zero-latency patient care and resource optimization.",
    capabilities: ["Automated Patient Records (EHR)", "Smart Bed & OT Allocation", "Integrated Billing & Pharmacy Sync"],
    metrics: "99.99% Uptime · HIPAA Compliant",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "pos",
    num: "02",
    tag: "SYS_RETAIL_POS",
    title: "POS Softwares & Systems",
    description: "High-speed point of sale architectures engineered for multi-store cloud synchronization and real-time checkout.",
    capabilities: ["Multi-store Cloud Synchronization", "Real-time Inventory Tracking", "Barcode & RFID Hardware Integration"],
    metrics: "<12ms Checkout Latency",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "lab",
    num: "03",
    tag: "SYS_DIAGNOSTIC",
    title: "Lab Management CRM",
    description: "Advanced pathology and diagnostic workflow automation ensuring absolute sample traceability and rapid reporting.",
    capabilities: ["Automated Sample Barcoding", "Smart Diagnostic Report Generation", "Pathology & Equipment Interfacing"],
    metrics: "100% Sample Traceability",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "clinic",
    num: "04",
    tag: "SYS_CLINIC_MD",
    title: "Clinic Management CRMs",
    description: "Intelligent practitioner platforms tailored for seamless appointment scheduling and digital prescription management.",
    capabilities: ["Doctor Appointment Scheduling", "Electronic Health Records (EHR)", "Digital Prescription & Follow-ups"],
    metrics: "Zero Queue Waiting Workflows",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "hotel",
    num: "05",
    tag: "SYS_HOSPITALITY",
    title: "Hotel Management System",
    description: "Next-generation hospitality suites powering flawless guest experiences, room reservation engines, and dispatch.",
    capabilities: ["Room Reservation & Booking Engine", "Housekeeping & Dispatch Automation", "Guest Experience & Billing Portal"],
    metrics: "Omnichannel Guest Portal",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "dairy",
    num: "06",
    tag: "SYS_AGRI_TECH",
    title: "Dairy Farm Management CRM",
    description: "Precision agritech architectures tracking cattle health, milk yield analytics, and automated feed inventories.",
    capabilities: ["Cattle Health & Breeding Tracking", "IoT Milk Yield Analytics", "Feed & Inventory Automation"],
    metrics: "IoT Sensor Integration Ready",
    image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&q=80&w=800",
  },
];

export function EnterpriseSuites() {
  const [activeTabId, setActiveTabId] = useState("hospital");
  const activeTab = SUITES_DATA.find((s) => s.id === activeTabId) || SUITES_DATA[0];

  return (
    <section className="relative w-full py-16 md:py-20 bg-[var(--background)] text-[var(--foreground)] border-b border-[var(--section-border)] overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-2 h-2 rounded-full bg-[#ff5400] animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#ff5400]">
            Industry Architectures
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-display text-[var(--foreground)]">
          Enterprise Domain Suites
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-between border-t border-[var(--border)]">
            {SUITES_DATA.map((suite) => {
              const isActive = suite.id === activeTabId;
              return (
                <button
                  key={suite.id}
                  onClick={() => setActiveTabId(suite.id)}
                  onMouseEnter={() => setActiveTabId(suite.id)}
                  className={`w-full py-4 flex items-center justify-between border-b border-[var(--border)] text-left transition-all duration-300 group relative ${
                    isActive ? "pl-4 md:pl-6 bg-[var(--surface)]" : "hover:pl-2"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeSuiteIndicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-[#ff5400]"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}

                  <div className="flex items-center gap-4 md:gap-6 min-w-0 pr-4">
                    <span className={`text-xs md:text-sm font-mono font-bold transition-colors ${isActive ? "text-[#ff5400]" : "text-[var(--muted)]"}`}>
                      {suite.num}
                    </span>
                    <span className={`text-lg md:text-xl lg:text-2xl font-display font-medium tracking-tight truncate transition-colors ${
                      isActive ? "text-[var(--foreground)] font-semibold" : "text-[var(--muted)] group-hover:text-[var(--foreground)]"
                    }`}>
                      {suite.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0 pr-2">
                    <span className={`text-[10px] font-mono hidden sm:inline-block transition-opacity ${isActive ? "opacity-100 text-[#ff5400]" : "opacity-0 group-hover:opacity-50"}`}>
                      [ ACTIVE ]
                    </span>
                    <ArrowUpRight className={`w-4 h-4 transition-transform duration-300 ${isActive ? "text-[#ff5400] transform translate-x-1 -translate-y-1" : "text-[var(--muted)] group-hover:text-[var(--foreground)]"}`} />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-6 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab.id}
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -15 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[520px] p-5 md:p-6 rounded-3xl bg-[var(--panel)] border border-[var(--border)] shadow-lg relative overflow-hidden group flex flex-col justify-between h-[425px]"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle,rgba(255,84,0,0.08)_0%,transparent_70%)] pointer-events-none" />

                <div className="flex flex-col flex-1 min-h-0">
                  <div className="flex items-center justify-between gap-4 mb-2 flex-shrink-0">
                    <span className="text-[10px] font-mono font-bold px-3 py-0.5 rounded-full bg-[var(--background)] border border-[var(--border)] text-[#ff5400] tracking-widest uppercase">
                      {activeTab.tag}
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-[var(--muted)] flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-[#ff5400] animate-pulse" />
                      {activeTab.metrics}
                    </span>
                  </div>

                  <h3 className="text-lg md:text-xl font-bold font-display tracking-tight text-[var(--foreground)] mb-3 flex-shrink-0">
                    {activeTab.title}
                  </h3>

                  <div className="relative w-full flex-1 min-h-[250px] max-h-[300px] rounded-xl overflow-hidden mb-4 border border-[var(--border)] shadow-inner bg-[var(--surface)] group/img flex-shrink">
                    <img
                      src={activeTab.image}
                      alt={activeTab.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
                      {activeTab.capabilities.slice(0, 2).map((cap) => (
                        <span
                          key={cap}
                          className="rounded-full border border-white/30 bg-white/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-black"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <Link
                  href={`/contact?suite=${activeTab.id}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-[var(--foreground)] text-[var(--background)] text-[11px] font-bold uppercase tracking-widest hover:bg-[#ff5400] hover:text-white transition-colors duration-300 flex items-center justify-center gap-2 shadow flex-shrink-0"
                >
                  <span>Request Architecture Demo</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
