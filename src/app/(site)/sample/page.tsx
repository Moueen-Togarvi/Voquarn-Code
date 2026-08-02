"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, Sparkles, TrendingUp, Users, ArrowRight, 
  CheckCircle2, AlertCircle, ShieldCheck, Zap, Rocket,
  Laptop, Check, ChevronRight, Sliders
} from "lucide-react";
import Image from "next/image";

export default function SamplePage() {
  // State for Idea 5 (AI Terminal Prompt Simulator)
  const [activePromptTab, setActivePromptTab] = useState<"saas" | "ecommerce" | "agent">("saas");

  const terminalData = {
    saas: {
      prompt: "Build a high-conversion SaaS app with AI lead scoring and automated onboarding workflows...",
      title: "Voquarn SaaS Core v2.4",
      metrics: "+340% Conversion Velocity",
      codeSnippet: `import { VoquarnAI } from "@voquarn/core";\n\nconst workflow = new VoquarnAI.Workflow({\n  mode: "autonomous_lead_gen",\n  conversionEngine: "v2_turbo",\n  autoOptimize: true\n});\n\nawait workflow.deploy();`,
      features: ["Smart Lead Scoring", "Automated Nurturing", "Predictive Analytics"]
    },
    ecommerce: {
      prompt: "Design an immersive e-commerce platform with real-time AI product recommendations and 1-click checkout...",
      title: "Voquarn Commerce Engine v3",
      metrics: "$45M+ Generated GMV",
      codeSnippet: `import { CommerceAI } from "@voquarn/commerce";\n\nconst store = new CommerceAI.Store({\n  recommendations: "hyper_personalized",\n  checkoutFlow: "one_click_instant",\n  abandonmentRecovery: "ai_sms_email"\n});\n\nawait store.initialize();`,
      features: ["AI Personalization", "Instant Checkout", "Dynamic Pricing"]
    },
    agent: {
      prompt: "Deploy an autonomous AI customer support agent that resolves 85% of complex technical tickets instantly...",
      title: "Voquarn Autonomous Agent v1.0",
      metrics: "85% Ticket Deflection Rate",
      codeSnippet: `import { AgenticSupport } from "@voquarn/agents";\n\nconst agent = new AgenticSupport.Bot({\n  llm: "gemini_pro_ultra",\n  knowledgeBase: "./company_docs",\n  escalationThreshold: 0.15\n});\n\nawait agent.startListening();`,
      features: ["24/7 Resolution Flow", "Multi-lingual Support", "Human Escalation"]
    }
  };

  // State for Idea 8 (ROI Calculator)
  const [monthlyVisitors, setMonthlyVisitors] = useState(25000);
  const [currentConversion, setCurrentConversion] = useState(1.2);

  const projectedConversion = (currentConversion * 2.5).toFixed(1);
  const currentLeads = Math.round((monthlyVisitors * currentConversion) / 100);
  const projectedLeads = Math.round((monthlyVisitors * Number(projectedConversion)) / 100);
  const additionalRevenue = ((projectedLeads - currentLeads) * 120).toLocaleString();

  // State for Idea 7 (Before/After Mirror Slider)
  const [mirrorSlider, setMirrorSlider] = useState(50);

  return (
    <div className="min-h-screen bg-white text-black pt-32 pb-24 px-4 sm:px-8 max-w-7xl mx-auto overflow-x-hidden">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff5400]/10 border border-[#ff5400]/20 mb-6">
          <Sparkles className="w-4 h-4 text-[#ff5400]" />
          <span className="text-xs font-black uppercase tracking-[0.2em] text-[#ff5400]">Hero Section Playground</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-display font-black tracking-tight uppercase mb-6 leading-none">
          Hero Section <span className="text-[#ff5400]">Interactive Concepts</span>
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 font-medium leading-relaxed">
          Explore and test 4 world-class, fully interactive concepts designed to replace the empty space in your hero section. Experience them live below and choose your favorite for the main homepage!
        </p>
      </div>

      <div className="space-y-32">

        {/* ════════════════════════════════════════════════════════════
            IDEA 5: INTERACTIVE AI TERMINAL / PROMPT SIMULATOR
        ════════════════════════════════════════════════════════════ */}
        <section className="border border-neutral-200 rounded-[3rem] p-8 sm:p-12 bg-neutral-50/50 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
            <Terminal className="w-96 h-96 text-black" />
          </div>

          <div className="max-w-2xl mb-12 relative z-10">
            <div className="inline-block px-3 py-1 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-wider mb-4">
              Concept 01
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold uppercase tracking-tight mb-4">
              Interactive <span className="text-[#ff5400]">"Prompt to Reality"</span> AI Simulator
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
              Showcases your agency&apos;s AI expertise by allowing visitors to select different business goals. Watch the terminal instantly simulate typing the prompt and deploying the exact high-fidelity architecture and code.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Column: Logo + Tab Selectors */}
            <div className="lg:col-span-5 flex flex-col gap-8 justify-center items-center lg:items-start">
              {/* Agency Logo */}
              <div className="w-64 sm:w-80 h-auto relative bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-lg flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/final-logo.png" alt="Voquarn Logo" className="w-full h-auto object-contain" />
                <div className="absolute -bottom-3 -right-3 bg-[#ff5400] text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md">
                  AI Engine Active
                </div>
              </div>

              {/* Tab Selectors */}
              <div className="w-full space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Select Simulation Mode:</p>
                <div className="grid grid-cols-3 gap-2">
                  {(["saas", "ecommerce", "agent"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActivePromptTab(tab)}
                      className={`px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                        activePromptTab === tab 
                          ? "bg-black text-white border-black shadow-md scale-105" 
                          : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-100"
                      }`}
                    >
                      {tab === "saas" && "SaaS App"}
                      {tab === "ecommerce" && "E-Commerce"}
                      {tab === "agent" && "AI Agent"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Simulated Terminal Window */}
            <div className="lg:col-span-7 w-full">
              <div className="bg-neutral-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-neutral-800 font-mono relative overflow-hidden">
                {/* macOS Window Bar */}
                <div className="flex items-center justify-between pb-6 border-b border-neutral-800 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="text-[11px] text-neutral-400 font-medium tracking-wider flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-[#ff5400]" />
                    voquarn-ai-deployer.sh
                  </div>
                  <div className="text-[10px] bg-neutral-800 text-neutral-300 px-2.5 py-1 rounded-full">
                    v2.4-stable
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePromptTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                  >
                    {/* Simulated Typing Prompt */}
                    <div>
                      <p className="text-neutral-500 text-xs mb-2 flex items-center gap-2 font-sans font-bold uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-[#ff5400] animate-pulse" />
                        Client Prompt Input:
                      </p>
                      <p className="text-sm sm:text-base text-emerald-400 leading-relaxed font-semibold bg-black/40 p-4 rounded-2xl border border-emerald-500/20">
                        &gt; {terminalData[activePromptTab].prompt}
                      </p>
                    </div>

                    {/* Simulated Output & Code */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="bg-neutral-800/60 p-5 rounded-2xl border border-neutral-700/50 space-y-3">
                        <div className="text-xs text-neutral-400 uppercase tracking-wider font-sans font-bold">Architecture Output</div>
                        <div className="text-lg font-bold text-white font-sans">{terminalData[activePromptTab].title}</div>
                        <div className="text-[#ff5400] text-sm font-bold font-sans flex items-center gap-1.5">
                          <Zap className="w-4 h-4" />
                          {terminalData[activePromptTab].metrics}
                        </div>
                        <div className="space-y-1.5 pt-2 border-t border-neutral-700/50">
                          {terminalData[activePromptTab].features.map((feat, idx) => (
                            <div key={idx} className="text-xs text-neutral-300 flex items-center gap-2 font-sans">
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              {feat}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-black/60 p-5 rounded-2xl border border-neutral-800 flex flex-col justify-between overflow-x-auto">
                        <div>
                          <div className="text-[10px] text-neutral-500 uppercase tracking-wider font-sans font-bold mb-3 flex items-center justify-between">
                            <span>Compiled Production Code</span>
                            <span className="text-emerald-400 lowercase font-mono">ts</span>
                          </div>
                          <pre className="text-xs text-neutral-300 leading-relaxed font-mono">
                            {terminalData[activePromptTab].codeSnippet}
                          </pre>
                        </div>
                        <div className="mt-4 pt-3 border-t border-neutral-800 text-[10px] text-neutral-400 flex items-center gap-2 font-sans">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          Deployed successfully to Edge Network
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>


        {/* ════════════════════════════════════════════════════════════
            IDEA 8: GAMIFIED ROI CALCULATOR WIDGET
        ════════════════════════════════════════════════════════════ */}
        <section className="border border-neutral-200 rounded-[3rem] p-8 sm:p-12 bg-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
            <Sliders className="w-96 h-96 text-black" />
          </div>

          <div className="max-w-2xl mb-12 relative z-10">
            <div className="inline-block px-3 py-1 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-wider mb-4">
              Concept 02
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold uppercase tracking-tight mb-4">
              Gamified <span className="text-[#ff5400]">Client ROI & Growth</span> Calculator
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
              Turns the hero space into an interactive lead generator. Visitors drag sliders for their current traffic and conversion rates to instantly see the projected revenue and lead boost Voquarn&apos;s redesign and AI workflows can generate.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left Column: Sliders */}
            <div className="lg:col-span-6 space-y-8 bg-neutral-50 p-8 rounded-3xl border border-neutral-200">
              <h3 className="text-xl font-display font-bold uppercase tracking-tight text-black flex items-center gap-3 mb-6">
                <Sliders className="w-5 h-5 text-[#ff5400]" />
                Adjust Your Current Metrics
              </h3>

              {/* Slider 1: Monthly Visitors */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm font-bold uppercase tracking-wider">
                  <span className="text-neutral-600">Monthly Website Visitors</span>
                  <span className="text-black bg-white px-3 py-1 rounded-full border border-neutral-200 shadow-sm">
                    {monthlyVisitors.toLocaleString()}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="5000" 
                  max="100000" 
                  step="2500"
                  value={monthlyVisitors}
                  onChange={(e) => setMonthlyVisitors(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#ff5400]"
                />
                <div className="flex justify-between text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  <span>5K</span>
                  <span>50K</span>
                  <span>100K</span>
                </div>
              </div>

              {/* Slider 2: Current Conversion Rate */}
              <div className="space-y-4 pt-4 border-t border-neutral-200">
                <div className="flex justify-between items-center text-sm font-bold uppercase tracking-wider">
                  <span className="text-neutral-600">Current Conversion Rate</span>
                  <span className="text-black bg-white px-3 py-1 rounded-full border border-neutral-200 shadow-sm">
                    {currentConversion}%
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0.5" 
                  max="5.0" 
                  step="0.1"
                  value={currentConversion}
                  onChange={(e) => setCurrentConversion(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#ff5400]"
                />
                <div className="flex justify-between text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  <span>0.5%</span>
                  <span>2.5%</span>
                  <span>5.0%</span>
                </div>
              </div>
            </div>

            {/* Right Column: Projected Impact Counters */}
            <div className="lg:col-span-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Counter 1: Projected Leads */}
                <div className="bg-black text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between border border-neutral-800 relative overflow-hidden group hover:border-[#ff5400]/50 transition-colors duration-300">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <TrendingUp className="w-24 h-24 text-[#ff5400]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">Projected Monthly Leads</div>
                    <div className="text-5xl font-display font-black text-white mb-2">{projectedLeads}</div>
                    <div className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <ArrowRight className="w-3.5 h-3.5 -rotate-45" />
                      Up from {currentLeads} leads/mo
                    </div>
                  </div>
                  <div className="mt-8 pt-4 border-t border-neutral-800 text-[11px] text-neutral-400 font-medium">
                    Based on {projectedConversion}% AI-optimized conversion rate
                  </div>
                </div>

                {/* Counter 2: Estimated Revenue Boost */}
                <div className="bg-gradient-to-br from-[#ff5400] to-[#ff7a33] text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform duration-500">
                    <Zap className="w-24 h-24 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-white/80 mb-2">Est. Annual Revenue Boost</div>
                    <div className="text-5xl font-display font-black text-white mb-2">${additionalRevenue}</div>
                    <div className="text-xs text-white font-bold flex items-center gap-1 bg-white/20 w-fit px-2.5 py-1 rounded-full backdrop-blur-md">
                      <Sparkles className="w-3.5 h-3.5" />
                      High-Intent Leads Pipeline
                    </div>
                  </div>
                  <div className="mt-8 pt-4 border-t border-white/20 text-[11px] text-white/90 font-medium">
                    Calculated at $120 avg. customer lifetime value
                  </div>
                </div>

              </div>

              {/* CTA Button */}
              <button className="w-full py-5 rounded-2xl bg-black text-white text-sm font-black uppercase tracking-widest shadow-lg hover:bg-[#ff5400] transition-colors duration-300 flex items-center justify-center gap-2 group">
                Claim This Growth Strategy
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>


        {/* ════════════════════════════════════════════════════════════
            IDEA 1: FLOATING BENTO WIDGETS (APPLE/VERCEL STYLE)
        ════════════════════════════════════════════════════════════ */}
        <section className="border border-neutral-200 rounded-[3rem] p-8 sm:p-12 bg-neutral-50/50 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
            <Users className="w-96 h-96 text-black" />
          </div>

          <div className="max-w-2xl mb-16 relative z-10">
            <div className="inline-block px-3 py-1 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-wider mb-4">
              Concept 03
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold uppercase tracking-tight mb-4">
              Floating Glassmorphism <span className="text-[#ff5400]">Bento Widgets</span>
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
              Surrounds your central agency logo with sleek, floating glassmorphism mini-cards and active agency momentum badges. Demonstrates immediate social proof and high-end aesthetic appeal.
            </p>
          </div>

          <div className="relative w-full py-20 flex items-center justify-center min-h-[500px]">
            {/* Central Agency Logo */}
            <div className="w-72 sm:w-88 h-auto relative bg-white p-10 rounded-[2.5rem] border border-neutral-200 shadow-2xl flex items-center justify-center z-20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/final-logo.png" alt="Voquarn Logo" className="w-full h-auto object-contain" />
            </div>

            {/* Floating Widget 1: Top Right */}
            <motion.div 
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-4 sm:top-12 right-4 sm:right-24 bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-neutral-200 shadow-xl z-30 max-w-[260px]"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider text-black">Available for Q3</span>
              </div>
              <p className="text-xs text-neutral-600 mb-3 leading-relaxed">
                Partnering with 4 new growth-focused brands this quarter.
              </p>
              <div className="flex items-center gap-1 text-xs font-extrabold text-black bg-neutral-100 px-3 py-1.5 rounded-xl w-fit">
                <span>★ 4.9/5 Rating</span>
                <span className="text-neutral-400 font-normal">(40+ Reviews)</span>
              </div>
            </motion.div>

            {/* Floating Widget 2: Bottom Left */}
            <motion.div 
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-4 sm:bottom-12 left-4 sm:left-24 bg-black/90 backdrop-blur-md p-6 rounded-3xl border border-neutral-800 text-white shadow-xl z-30 max-w-[260px]"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Client Velocity</span>
                <TrendingUp className="w-4 h-4 text-[#ff5400]" />
              </div>
              <div className="text-3xl font-display font-black text-white mb-2">+310%</div>
              <p className="text-[11px] text-neutral-300 leading-relaxed font-medium">
                Average organic traffic and conversion boost within 90 days of deployment.
              </p>
            </motion.div>

            {/* Floating Widget 3: Bottom Right */}
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute bottom-6 sm:bottom-16 right-8 sm:right-36 bg-gradient-to-r from-[#ff5400] to-[#ff7a33] text-white p-5 rounded-3xl shadow-xl z-30 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-white/90">Enterprise Grade</div>
                <div className="text-sm font-black text-white">Flawless Architecture</div>
              </div>
            </motion.div>
          </div>
        </section>


        {/* ════════════════════════════════════════════════════════════
            IDEA 7: BEFORE / AFTER MIRROR SLIDER
        ════════════════════════════════════════════════════════════ */}
        <section className="border border-neutral-200 rounded-[3rem] p-8 sm:p-12 bg-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
            <Laptop className="w-96 h-96 text-black" />
          </div>

          <div className="max-w-2xl mb-12 relative z-10">
            <div className="inline-block px-3 py-1 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-wider mb-4">
              Concept 04
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold uppercase tracking-tight mb-4">
              Interactive <span className="text-[#ff5400]">"Before & After"</span> Transformation Mirror
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
              Allows visitors to drag the slider back and forth across the preview window to instantly compare a cluttered, low-converting legacy website against Voquarn&apos;s breathtaking, high-fidelity AI-driven masterpiece.
            </p>
          </div>

          {/* Interactive Split Window */}
          <div className="relative w-full rounded-3xl overflow-hidden border border-neutral-200 shadow-2xl bg-neutral-900 min-h-[450px] flex items-center select-none">
            
            {/* Background Layer: AFTER VOQUARN (High Fidelity) */}
            <div className="absolute inset-0 w-full h-full bg-neutral-950 text-white p-8 sm:p-12 flex flex-col justify-between">
              <div className="flex justify-between items-center border-b border-neutral-800 pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#ff5400] flex items-center justify-center font-bold text-white text-sm">
                    VQ
                  </div>
                  <div>
                    <div className="text-sm font-bold">Voquarn Code v3.0</div>
                    <div className="text-[10px] text-emerald-400 font-mono">⚡ Fully Optimized AI Architecture</div>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" /> 99.9% Performance Score
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-auto pt-6">
                <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-[#ff5400]/20 flex items-center justify-center text-[#ff5400]">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="text-lg font-bold">AI Lead Scoring</div>
                  <p className="text-xs text-neutral-400 leading-relaxed">Autonomous workflows identify and capture high-intent buyers instantly.</p>
                </div>
                <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div className="text-lg font-bold">310% Conversion Boost</div>
                  <p className="text-xs text-neutral-400 leading-relaxed">Streamlined checkout and intuitive UI eliminate friction entirely.</p>
                </div>
                <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-lg font-bold">Flawless Delivery</div>
                  <p className="text-xs text-neutral-400 leading-relaxed">Built on scalable Next.js and Supabase backend foundations.</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-neutral-800 text-xs text-neutral-500">
                <span>Secured by Voquarn Edge Systems</span>
                <span className="text-[#ff5400] font-bold uppercase tracking-wider">After Voquarn Overhaul</span>
              </div>
            </div>

            {/* Foreground Overlay Layer: BEFORE VOQUARN (Cluttered Wireframe) */}
            <div 
              className="absolute inset-y-0 left-0 bg-neutral-100 text-neutral-800 p-8 sm:p-12 flex flex-col justify-between overflow-hidden border-r border-black/20 shadow-2xl transition-all duration-75"
              style={{ width: `${mirrorSlider}%` }}
            >
              <div className="flex justify-between items-center border-b border-neutral-300 pb-6 w-[800px] max-w-[80vw]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-300 flex items-center justify-center font-bold text-neutral-600 text-sm">
                    OLD
                  </div>
                  <div>
                    <div className="text-sm font-bold text-neutral-700">Generic Business Site</div>
                    <div className="text-[10px] text-red-500 font-mono">⚠️ High Bounce Rate & Cluttered UI</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-full text-red-600 text-xs font-bold">
                  <AlertCircle className="w-4 h-4" /> 42% Performance Score
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 my-auto pt-6 w-[800px] max-w-[80vw]">
                <div className="bg-white p-6 rounded-2xl border border-neutral-300 space-y-3 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-500">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div className="text-lg font-bold text-neutral-800">Confusing Navigation</div>
                  <p className="text-xs text-neutral-500 leading-relaxed">Visitors get lost in complex dropdowns and leave without buying.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-neutral-300 space-y-3 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div className="text-lg font-bold text-neutral-800">Slow Load Times</div>
                  <p className="text-xs text-neutral-500 leading-relaxed">Unoptimized assets and bloated code frustrate mobile users.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-neutral-300 space-y-3 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-500">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div className="text-lg font-bold text-neutral-800">Zero AI Integration</div>
                  <p className="text-xs text-neutral-500 leading-relaxed">Manual lead collection results in lost opportunities and slow followups.</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-neutral-300 text-xs text-neutral-500 w-[800px] max-w-[80vw]">
                <span>Legacy Patchwork Setup</span>
                <span className="text-red-600 font-bold uppercase tracking-wider">Before Voquarn</span>
              </div>
            </div>

            {/* Draggable Handle */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-[#ff5400] cursor-ew-resize z-30 flex items-center justify-center shadow-[0_0_20px_rgba(255,84,0,0.8)]"
              style={{ left: `calc(${mirrorSlider}% - 2px)` }}
            >
              <div className="w-8 h-8 rounded-full bg-[#ff5400] text-white flex items-center justify-center shadow-lg border-2 border-white">
                <span className="text-[10px] font-black">↔</span>
              </div>
            </div>

          </div>

          {/* Slider Control for Touch/Easy Access */}
          <div className="mt-8 max-w-md mx-auto space-y-2 text-center">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Drag Slider to Compare Before & After:
            </label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={mirrorSlider}
              onChange={(e) => setMirrorSlider(Number(e.target.value))}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#ff5400]"
            />
            <div className="flex justify-between text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              <span>100% Old Site</span>
              <span>50/50 Split</span>
              <span>100% Voquarn Overhaul</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
