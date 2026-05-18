"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, CheckCircle2, ChevronRight, Plus, Minus, Server, Activity, ShieldCheck, Database, Cpu } from "lucide-react";
import Link from "next/link";

// Shared Enterprise Data
const SUITES_DATA = [
  {
    id: "hospital",
    num: "01",
    tag: "SYS_HEALTHCARE",
    title: "Hospital Management CRM",
    description: "End-to-end hospital administration architecture designed for zero-latency patient care and resource optimization.",
    capabilities: ["Automated Patient Records (EHR)", "Smart Bed & OT Allocation", "Integrated Billing & Pharmacy Sync"],
    metrics: "99.99% Uptime | HIPAA Compliant",
  },
  {
    id: "pos",
    num: "02",
    tag: "SYS_RETAIL_POS",
    title: "POS Softwares & Systems",
    description: "High-speed point of sale architectures engineered for multi-store cloud synchronization and real-time checkout.",
    capabilities: ["Multi-store Cloud Synchronization", "Real-time Inventory Tracking", "Barcode & RFID Hardware Integration"],
    metrics: "<12ms Checkout Latency",
  },
  {
    id: "lab",
    num: "03",
    tag: "SYS_DIAGNOSTIC",
    title: "Lab Management CRM",
    description: "Advanced pathology and diagnostic workflow automation ensuring absolute sample traceability and rapid reporting.",
    capabilities: ["Automated Sample Barcoding", "Smart Diagnostic Report Generation", "Pathology & Equipment Interfacing"],
    metrics: "100% Sample Traceability",
  },
  {
    id: "clinic",
    num: "04",
    tag: "SYS_CLINIC_MD",
    title: "Clinic Management CRMs",
    description: "Intelligent practitioner platforms tailored for seamless appointment scheduling and digital prescription management.",
    capabilities: ["Doctor Appointment Scheduling", "Electronic Health Records (EHR)", "Digital Prescription & Follow-ups"],
    metrics: "Zero Queue Waiting Workflows",
  },
  {
    id: "hotel",
    num: "05",
    tag: "SYS_HOSPITALITY",
    title: "Hotel Management System",
    description: "Next-generation hospitality suites powering flawless guest experiences, room reservation engines, and dispatch.",
    capabilities: ["Room Reservation & Booking Engine", "Housekeeping & Dispatch Automation", "Guest Experience & Billing Portal"],
    metrics: "Omnichannel Guest Portal",
  },
  {
    id: "dairy",
    num: "06",
    tag: "SYS_AGRI_TECH",
    title: "Dairy Farm Management CRM",
    description: "Precision agritech architectures tracking cattle health, milk yield analytics, and automated feed inventories.",
    capabilities: ["Cattle Health & Breeding Tracking", "IoT Milk Yield Analytics", "Feed & Inventory Automation"],
    metrics: "IoT Sensor Integration Ready",
  },
];

export default function SampleSuitesPage() {
  // State for Concept 1 (Tabbed Showcase)
  const [activeTabId, setActiveTabId] = useState("hospital");

  // State for Concept 3 (Accordion Showcase)
  const [expandedAccordionId, setExpandedAccordionId] = useState<string | null>("hospital");

  const activeTab = SUITES_DATA.find((s) => s.id === activeTabId) || SUITES_DATA[0];

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#ff5400] selection:text-white pb-32">
      
      {/* ── Header ── */}
      <header className="w-full py-12 border-b border-neutral-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#ff5400] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff5400]">
                Design System Preview
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight font-display">
              Voquarn Enterprise Suites
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full border border-neutral-300 hover:border-black transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* ── Page Intro ── */}
      <div className="max-w-7xl mx-auto px-6 py-12 border-b border-neutral-200">
        <p className="text-lg md:text-xl text-neutral-600 max-w-3xl font-light leading-relaxed">
          Below are the three premium minimalist design concepts engineered for your Enterprise Management Software & CRMs. Review the interactivity, typography, and layout of each option, then let us know which concept you would like integrated into the main homepage.
        </p>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          CONCEPT 1: THE SWISS INTERACTIVE TABBED SHOWCASE
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 border-b border-neutral-200 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-neutral-100 text-neutral-800 border border-neutral-200">
              CONCEPT 01
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff5400]">
              Swiss Tabbed Architecture (Recommended)
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-display">
            Interactive Suite Index
          </h2>
          <p className="text-sm text-neutral-500 mt-1">Hover or click items on the left to instantly update the architectural specifications on the right.</p>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Index List */}
            <div className="lg:col-span-7 flex flex-col border-t border-neutral-200">
              {SUITES_DATA.map((suite) => {
                const isActive = suite.id === activeTabId;
                return (
                  <button
                    key={suite.id}
                    onClick={() => setActiveTabId(suite.id)}
                    onMouseEnter={() => setActiveTabId(suite.id)}
                    className={`w-full py-6 md:py-8 flex items-center justify-between border-b border-neutral-200 text-left transition-all duration-300 group ${
                      isActive ? "pl-4 md:pl-6 bg-neutral-50/80 border-l-4 border-l-[#ff5400]" : "hover:pl-2"
                    }`}
                  >
                    <div className="flex items-center gap-6 md:gap-8 min-w-0 pr-4">
                      <span className={`text-xs md:text-sm font-mono font-bold transition-colors ${isActive ? "text-[#ff5400]" : "text-neutral-400"}`}>
                        {suite.num}
                      </span>
                      <span className={`text-xl md:text-2xl lg:text-3xl font-display font-medium tracking-tight truncate transition-colors ${
                        isActive ? "text-black font-semibold" : "text-neutral-600 group-hover:text-black"
                      }`}>
                        {suite.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 pr-4">
                      <span className={`text-xs font-mono hidden sm:inline-block transition-opacity ${isActive ? "opacity-100 text-[#ff5400]" : "opacity-0 group-hover:opacity-50"}`}>
                        [ ACTIVE ]
                      </span>
                      <ArrowUpRight className={`w-5 h-5 transition-transform duration-300 ${isActive ? "text-[#ff5400] transform translate-x-1 -translate-y-1" : "text-neutral-300 group-hover:text-black"}`} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Active Suite Specification Display */}
            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="w-full p-8 md:p-10 rounded-3xl bg-neutral-50 border border-neutral-200/80 shadow-lg relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle,rgba(255,84,0,0.08)_0%,transparent_70%)] pointer-events-none" />
                  
                  {/* Eyebrow tag */}
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-white border border-neutral-200 text-[#ff5400] tracking-widest uppercase">
                      {activeTab.tag}
                    </span>
                    <span className="text-xs font-mono font-semibold text-neutral-500 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff5400] animate-ping" />
                      {activeTab.metrics}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-2xl md:text-3xl font-bold font-display tracking-tight text-black mb-4">
                    {activeTab.title}
                  </h3>
                  <p className="text-sm md:text-base text-neutral-600 font-light leading-relaxed mb-8">
                    {activeTab.description}
                  </p>

                  {/* Capabilities List */}
                  <div className="border-t border-neutral-200/80 pt-6 mb-8">
                    <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4 font-mono">
                      // Core Architecture Capabilities
                    </p>
                    <ul className="space-y-3.5">
                      {activeTab.capabilities.map((cap, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-neutral-800 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-[#ff5400] flex-shrink-0 mt-0.5" />
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Interactive Mock CTA */}
                  <button 
                    onClick={() => alert(`Initiating deployment sequence for ${activeTab.title}...`)}
                    className="w-full py-4 px-6 rounded-2xl bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-[#ff5400] transition-colors duration-300 flex items-center justify-center gap-2 shadow-md group-hover:shadow-xl"
                  >
                    <span>Request Architecture Demo</span>
                    <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>

                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          CONCEPT 2: THE ARCHITECTURAL BENTO GRID
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 border-b border-neutral-200 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-neutral-100 text-neutral-800 border border-neutral-200">
              CONCEPT 02
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff5400]">
              Architectural Bento Grid
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-display">
            Modular Bento Dashboard
          </h2>
          <p className="text-sm text-neutral-500 mt-1">A clean, high-density dashboard layout featuring subtle hover elevations and signature orange outlines.</p>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SUITES_DATA.map((suite) => (
              <div
                key={suite.id}
                className="p-8 rounded-3xl bg-neutral-50/60 border border-neutral-200/80 hover:border-[#ff5400]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Background ambient glow on hover */}
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#ff5400]/5 rounded-full blur-2xl group-hover:bg-[#ff5400]/15 transition-all duration-500 pointer-events-none" />

                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <span className="text-xs font-mono font-bold text-neutral-400 group-hover:text-[#ff5400] transition-colors">
                      {suite.num} // {suite.tag}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-neutral-300 group-hover:bg-[#ff5400] transition-colors" />
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-xl md:text-2xl font-bold font-display tracking-tight text-black mb-3 group-hover:text-[#ff5400] transition-colors">
                    {suite.title}
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-600 font-light leading-relaxed mb-6">
                    {suite.description}
                  </p>

                  {/* Capabilities */}
                  <ul className="space-y-2 mb-8 border-t border-neutral-200/60 pt-4">
                    {suite.capabilities.map((cap, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-neutral-700 font-medium">
                        <span className="w-1 h-1 rounded-full bg-[#ff5400]" />
                        <span className="truncate">{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Footer CTA */}
                <div className="pt-4 border-t border-neutral-200/60 flex items-center justify-between">
                  <span className="text-[11px] font-mono font-semibold text-neutral-500">
                    {suite.metrics}
                  </span>
                  <button 
                    onClick={() => alert(`Exploring ${suite.title} specs...`)}
                    className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center group-hover:bg-[#ff5400] group-hover:border-[#ff5400] group-hover:text-white transition-colors shadow-sm"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          CONCEPT 3: THE MINIMAL EDITORIAL ACCORDION
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 border-b border-neutral-200 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-neutral-100 text-neutral-800 border border-neutral-200">
              CONCEPT 03
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff5400]">
              Minimal Editorial Accordion
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-display">
            Editorial Drawer List
          </h2>
          <p className="text-sm text-neutral-500 mt-1">A sophisticated, full-width expanding drawer layout designed for maximum typography elegance.</p>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="border-t border-neutral-200">
            {SUITES_DATA.map((suite) => {
              const isExpanded = expandedAccordionId === suite.id;
              return (
                <div key={suite.id} className="border-b border-neutral-200 overflow-hidden transition-colors duration-300">
                  
                  {/* Accordion Header */}
                  <button
                    onClick={() => setExpandedAccordionId(isExpanded ? null : suite.id)}
                    className="w-full py-8 flex items-center justify-between text-left group"
                  >
                    <div className="flex items-center gap-6 md:gap-12 min-w-0 pr-4">
                      <span className={`text-sm md:text-base font-mono font-bold transition-colors ${isExpanded ? "text-[#ff5400]" : "text-neutral-400 group-hover:text-black"}`}>
                        {suite.num}
                      </span>
                      <span className={`text-xl md:text-3xl font-display font-medium tracking-tight truncate transition-colors ${
                        isExpanded ? "text-black font-semibold" : "text-neutral-700 group-hover:text-black"
                      }`}>
                        {suite.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0 pr-2">
                      <span className="text-xs font-mono font-semibold text-neutral-400 hidden md:inline-block">
                        {suite.tag}
                      </span>
                      <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${
                        isExpanded ? "bg-black border-black text-white" : "border-neutral-200 bg-neutral-50 text-neutral-600 group-hover:border-black group-hover:bg-white"
                      }`}>
                        {isExpanded ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                      </div>
                    </div>
                  </button>

                  {/* Accordion Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="pb-10 pt-2 px-4 md:px-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-t border-neutral-100 mt-2">
                          
                          {/* Left: Description & Metrics */}
                          <div className="lg:col-span-6 space-y-6 pt-4">
                            <p className="text-base text-neutral-600 font-light leading-relaxed">
                              {suite.description}
                            </p>
                            <div className="flex items-center gap-6 pt-2">
                              <div className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-800 bg-neutral-100 px-3 py-1.5 rounded-lg border border-neutral-200">
                                <Activity className="w-4 h-4 text-[#ff5400]" />
                                <span>{suite.metrics}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-800 bg-neutral-100 px-3 py-1.5 rounded-lg border border-neutral-200">
                                <ShieldCheck className="w-4 h-4 text-[#ff5400]" />
                                <span>Enterprise Grade SSL</span>
                              </div>
                            </div>
                          </div>

                          {/* Right: Capabilities & CTA */}
                          <div className="lg:col-span-6 bg-neutral-50 p-6 md:p-8 rounded-3xl border border-neutral-200 flex flex-col justify-between space-y-6">
                            <div>
                              <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4 font-mono">
                                // Core System Specifications
                              </p>
                              <ul className="space-y-3">
                                {suite.capabilities.map((cap, i) => (
                                  <li key={i} className="flex items-center gap-3 text-sm text-neutral-800 font-medium">
                                    <CheckCircle2 className="w-4 h-4 text-[#ff5400] flex-shrink-0" />
                                    <span>{cap}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <button 
                              onClick={() => alert(`Requesting ${suite.title} documentation...`)}
                              className="w-full py-3.5 px-6 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-[#ff5400] transition-colors duration-300 flex items-center justify-center gap-2 shadow"
                            >
                              <span>Deploy System Architecture</span>
                              <ArrowUpRight className="w-4 h-4" />
                            </button>
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Footer Selection Prompt ── */}
      <footer className="py-20 text-center bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight font-display mb-4">
            Ready to Integrate?
          </h3>
          <p className="text-sm md:text-base text-neutral-600 font-light mb-8 max-w-2xl mx-auto leading-relaxed">
            Choose your preferred design architecture above. Once you select Concept 1, 2, or 3, we will extract the component and place it directly into the homepage flow.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button 
              onClick={() => alert("Concept 1 selected! Let the AI know to integrate Concept 1 into the homepage.")}
              className="px-8 py-4 rounded-full bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-[#ff5400] transition-colors shadow-lg"
            >
              Select Concept 01 (Swiss Tabbed)
            </button>
            <button 
              onClick={() => alert("Concept 2 selected! Let the AI know to integrate Concept 2 into the homepage.")}
              className="px-8 py-4 rounded-full bg-white text-black border border-neutral-300 text-xs font-bold uppercase tracking-widest hover:border-black transition-colors shadow"
            >
              Select Concept 02 (Bento Grid)
            </button>
            <button 
              onClick={() => alert("Concept 3 selected! Let the AI know to integrate Concept 3 into the homepage.")}
              className="px-8 py-4 rounded-full bg-white text-black border border-neutral-300 text-xs font-bold uppercase tracking-widest hover:border-black transition-colors shadow"
            >
              Select Concept 03 (Accordion)
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
