"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowUpRight, CheckCircle2, ShieldCheck, Activity, Cpu, Sparkles,
  Target, Layers, Globe, Moon, Laptop, Server, Database, Code,
  Workflow, Zap, Terminal, Rocket, Compass, Radio, Disc
} from "lucide-react";

// Helper component for Rocket Image
const RocketImg = () => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src="/gk.png"
    alt="Voquarn Rocket"
    style={{
      width: "200px",
      height: "auto",
      objectFit: "contain",
      filter: "drop-shadow(0 12px 40px rgba(255,100,0,0.45)) drop-shadow(0 4px 16px rgba(0,0,0,0.35))",
    }}
    className="relative z-10 transition-transform duration-700 hover:scale-110"
  />
);

// Helper component for Astronaut Image
const AstronautImg = ({ imageUrl = "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&q=80&w=800" }) => (
  <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-[0_10px_30px_rgba(255,84,0,0.3)] z-10 group">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src={imageUrl}
      alt="Voquarn Astronaut"
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
  </div>
);

export default function SampleRocketPage() {
  const [selectedConcept, setSelectedConcept] = useState<number | null>(null);

  // Dynamic cycling words for Concept 1 (Earth to Moon)
  const cycleWords = ["Business", "Web App", "Mobile App", "Enterprise", "AI System"];
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % cycleWords.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [cycleWords.length]);

  const handleSelect = (num: number, name: string) => {
    setSelectedConcept(num);
    alert(`Concept ${num}: "${name}" selected! Let the AI know to integrate this into the main Hero section.`);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-black font-sans selection:bg-[#ff5400] selection:text-white pb-32">

      {/* ── Header ── */}
      <header className="w-full py-8 border-b border-neutral-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#ff5400] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff5400]">
                15 High-Fidelity Architectural Concepts
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight font-display">
              Hero Showcase Master Sandbox
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full border border-neutral-300 hover:border-black transition-colors bg-neutral-50 hover:bg-white"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* ── Page Intro ── */}
      <div className="max-w-7xl mx-auto px-6 py-12 border-b border-neutral-200 bg-white">
        <p className="text-lg md:text-xl text-neutral-600 max-w-4xl font-light leading-relaxed">
          Based on your feedback, we have designed **15 completely unique, storytelling-rich, and premium concepts**. Explore the dynamic Earth-to-Moon trajectory lines, the Mini-Astronaut tech series, quantum launchpads, and glassmorphism mission controls below. Click **"Select Concept"** on your favorite to integrate it into the homepage!
        </p>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          CATEGORY A: STORYTELLING & TRAJECTORY (CONCEPTS 1 - 3)
      ════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white py-12 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#ff5400] bg-[#ff5400]/10 px-3 py-1 rounded-full">
            Category A // Storytelling & Trajectory
          </span>
        </div>
      </div>

      {/* CONCEPT 1: THE EARTH-TO-MOON SCALING HUD */}
      <section className="py-20 border-b border-neutral-200 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-neutral-100 text-neutral-800 border border-neutral-200">
              CONCEPT 01
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff5400]">
              Earth-to-Moon Storyline (User Requested)
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-display">
            The Earth-to-Moon Trajectory HUD
          </h2>
          <p className="text-sm text-neutral-500 mt-1">An elegant animated trajectory connecting Earth to Moon, dynamically stating how we scale your Business, Web, and Apps.</p>
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="w-full h-[520px] rounded-3xl bg-neutral-900 text-white border border-neutral-800 shadow-2xl flex items-center justify-center relative overflow-hidden p-8 group">

            {/* Background stars */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,84,0,0.15)_0%,transparent_80%)] pointer-events-none" />

            {/* Earth Graphic (Bottom Left) */}
            <div className="absolute bottom-12 left-12 flex flex-col items-center gap-2 z-20">
              <div className="w-20 h-20 rounded-full bg-blue-600/30 border border-blue-400 flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.5)] animate-pulse">
                <Globe className="w-10 h-10 text-blue-400" />
              </div>
              <span className="text-xs font-mono font-bold tracking-widest text-blue-300">// EARTH_ORIGIN</span>
            </div>

            {/* Moon Graphic (Top Right) */}
            <div className="absolute top-12 right-12 flex flex-col items-center gap-2 z-20">
              <div className="w-20 h-20 rounded-full bg-neutral-100/20 border border-white flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                <Moon className="w-10 h-10 text-white animate-spin" style={{ animationDuration: '20s' }} />
              </div>
              <span className="text-xs font-mono font-bold tracking-widest text-neutral-300">// LUNAR_DESTINATION</span>
            </div>

            {/* Animated Dashed Trajectory Line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M 120 420 Q 450 100 880 100"
                fill="none"
                stroke="rgba(255,84,0,0.6)"
                strokeWidth="3"
                strokeDasharray="10 10"
                className="animate-[dash_3s_linear_infinite]"
              />
            </svg>
            <style dangerouslySetInnerHTML={{
              __html: `
              @keyframes dash {
                to { stroke-dashoffset: -40; }
              }
            `}} />

            {/* Central Rocket & Dynamic Text Callout */}
            <div className="relative z-30 flex flex-col items-center gap-6">
              <div className="flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-md bg-white/10 border border-white/20 shadow-xl">
                <span className="text-xs font-mono font-light text-neutral-300">Taking your</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={cycleWords[wordIndex]}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm font-mono font-bold text-[#ff5400] uppercase tracking-wider"
                  >
                    [{cycleWords[wordIndex]}]
                  </motion.span>
                </AnimatePresence>
                <span className="text-xs font-mono font-light text-neutral-300">from Earth to Moon</span>
              </div>

              <motion.div
                animate={{ y: [-8, 8, -8], rotate: [0, 2, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <RocketImg />
              </motion.div>
            </div>

            {/* Overlay Specs & CTA */}
            <div className="absolute bottom-6 right-6 z-40">
              <button
                onClick={() => handleSelect(1, "The Earth-to-Moon Trajectory HUD")}
                className="px-6 py-3 rounded-xl bg-[#ff5400] text-white font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors shadow-lg"
              >
                Select Concept 01
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CONCEPT 2: LUNAR ORBIT DELIVERY GRID */}
      <section className="py-20 border-b border-neutral-200 bg-neutral-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-neutral-200 text-neutral-800 border border-neutral-300">
              CONCEPT 02
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff5400]">
              Lunar Bento Deployment
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-display">
            Lunar Orbit Delivery Grid
          </h2>
          <p className="text-sm text-neutral-500 mt-1">The rocket arriving at a wireframe moon, deploying 3 floating bento boxes representing Web, Mobile, and AI Systems.</p>
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="w-full h-[520px] rounded-3xl bg-white border border-neutral-200 shadow-xl flex items-center justify-center relative overflow-hidden p-8 group">

            {/* Left side: Rocket */}
            <div className="absolute left-16 top-1/2 -translate-y-1/2 z-20">
              <motion.div animate={{ x: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                <RocketImg />
              </motion.div>
            </div>

            {/* Right side: 3 Floating Bento Boxes */}
            <div className="absolute right-16 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20 w-72">
              <motion.div animate={{ y: [-3, 3, -3] }} transition={{ duration: 4, repeat: Infinity }} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 shadow-md flex items-center gap-4">
                <Laptop className="w-6 h-6 text-[#ff5400]" />
                <div>
                  <h4 className="text-xs font-bold font-mono">WEB_ARCHITECTURE</h4>
                  <p className="text-[10px] text-neutral-500">React / Next.js High-Performance</p>
                </div>
              </motion.div>
              <motion.div animate={{ y: [3, -3, 3] }} transition={{ duration: 4.5, repeat: Infinity }} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 shadow-md flex items-center gap-4">
                <Cpu className="w-6 h-6 text-[#ff5400]" />
                <div>
                  <h4 className="text-xs font-bold font-mono">AI_INTEGRATION</h4>
                  <p className="text-[10px] text-neutral-500">Autonomous Agentic Workflows</p>
                </div>
              </motion.div>
              <motion.div animate={{ y: [-4, 4, -4] }} transition={{ duration: 5, repeat: Infinity }} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 shadow-md flex items-center gap-4">
                <Database className="w-6 h-6 text-[#ff5400]" />
                <div>
                  <h4 className="text-xs font-bold font-mono">CLOUD_INFRASTRUCTURE</h4>
                  <p className="text-[10px] text-neutral-500">Zero-Latency Global Edge</p>
                </div>
              </motion.div>
            </div>

            {/* Connecting lines */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-40">
              <div className="w-full h-[1px] bg-dashed border-t border-neutral-300" />
            </div>

            {/* CTA */}
            <div className="absolute bottom-6 right-6 z-40">
              <button onClick={() => handleSelect(2, "Lunar Orbit Delivery Grid")} className="px-6 py-3 rounded-xl bg-black text-white font-bold text-xs uppercase tracking-widest hover:bg-[#ff5400] transition-colors shadow">
                Select Concept 02
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CONCEPT 3: INTERSTELLAR WARP TUNNEL */}
      <section className="py-20 border-b border-neutral-200 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-neutral-100 text-neutral-800 border border-neutral-200">
              CONCEPT 03
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff5400]">
              Hyper-Velocity Warp Drive
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-display">
            Interstellar Warp Tunnel
          </h2>
          <p className="text-sm text-neutral-500 mt-1">High-speed vertical light streaks shooting past the rocket, symbolizing hyper-fast deployment and zero latency.</p>
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="w-full h-[520px] rounded-3xl bg-black border border-neutral-800 shadow-2xl flex items-center justify-center relative overflow-hidden p-8 group">

            {/* Warp streaks */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-[2px] bg-gradient-to-b from-white via-[#ff5400] to-transparent opacity-80"
                  style={{
                    left: `${Math.random() * 100}%`,
                    height: `${50 + Math.random() * 150}px`,
                  }}
                  animate={{
                    y: [-200, 700],
                  }}
                  transition={{
                    duration: 0.5 + Math.random() * 0.5,
                    repeat: Infinity,
                    ease: "linear",
                    delay: Math.random() * 1,
                  }}
                />
              ))}
            </div>

            <div className="relative z-20">
              <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                <RocketImg />
              </motion.div>
            </div>

            {/* CTA */}
            <div className="absolute bottom-6 right-6 z-40">
              <button onClick={() => handleSelect(3, "Interstellar Warp Tunnel")} className="px-6 py-3 rounded-xl bg-[#ff5400] text-white font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors shadow">
                Select Concept 03
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          CATEGORY B: THE MINI-ASTRONAUT SERIES (CONCEPTS 4 - 8)
      ════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white py-12 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#ff5400] bg-[#ff5400]/10 px-3 py-1 rounded-full">
            Category B // The Mini-Astronaut Tech Series
          </span>
        </div>
      </div>

      {/* CONCEPT 4: THE CODING ASTRONAUT */}
      <section className="py-20 border-b border-neutral-200 bg-neutral-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-neutral-200 text-neutral-800 border border-neutral-300">
              CONCEPT 04
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff5400]">
              Astronaut DevMode
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-display">
            The Coding Astronaut (DevMode)
          </h2>
          <p className="text-sm text-neutral-500 mt-1">A mini-astronaut floating in zero gravity while typing on a glowing MacBook, surrounded by floating code brackets.</p>
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="w-full h-[520px] rounded-3xl bg-white border border-neutral-200 shadow-xl flex items-center justify-center relative overflow-hidden p-8 group">

            <div className="relative z-20 flex flex-col items-center gap-6">
              <motion.div animate={{ y: [-10, 10, -10], rotate: [-1, 1, -1] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
                <AstronautImg imageUrl="https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&q=80&w=800" />
              </motion.div>
              <div className="px-6 py-2.5 rounded-full bg-black text-white text-xs font-mono font-bold flex items-center gap-2 shadow-lg">
                <Code className="w-4 h-4 text-[#ff5400]" />
                <span>git commit -m "Deploying Enterprise Architecture"</span>
              </div>
            </div>

            {/* Floating Brackets */}
            <motion.div animate={{ y: [-5, 5, -5], rotate: 10 }} transition={{ duration: 4, repeat: Infinity }} className="absolute left-24 top-24 text-4xl font-mono font-bold text-neutral-300 select-none">
              {"{"}
            </motion.div>
            <motion.div animate={{ y: [5, -5, 5], rotate: -10 }} transition={{ duration: 5, repeat: Infinity }} className="absolute right-24 bottom-24 text-4xl font-mono font-bold text-neutral-300 select-none">
              {"}"}
            </motion.div>

            {/* CTA */}
            <div className="absolute bottom-6 right-6 z-40">
              <button onClick={() => handleSelect(4, "The Coding Astronaut (DevMode)")} className="px-6 py-3 rounded-xl bg-black text-white font-bold text-xs uppercase tracking-widest hover:bg-[#ff5400] transition-colors shadow">
                Select Concept 04
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CONCEPT 5: THE SERVER MAINTENANCE ASTRONAUT */}
      <section className="py-20 border-b border-neutral-200 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-neutral-100 text-neutral-800 border border-neutral-200">
              CONCEPT 05
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff5400]">
              Infra & Uptime Security
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-display">
            The Server Maintenance Astronaut
          </h2>
          <p className="text-sm text-neutral-500 mt-1">An astronaut floating next to a glowing server rack graphic, holding a high-tech wrench ensuring 99.99% uptime.</p>
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="w-full h-[520px] rounded-3xl bg-neutral-900 text-white border border-neutral-800 shadow-2xl flex items-center justify-center relative overflow-hidden p-8 group">

            <div className="flex items-center gap-16 z-20">
              <motion.div animate={{ y: [-8, 8, -8] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
                <AstronautImg imageUrl="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800" />
              </motion.div>

              <div className="flex flex-col gap-4 bg-neutral-800/80 p-6 rounded-2xl border border-neutral-700 w-72 backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-neutral-700 pb-3">
                  <span className="text-xs font-mono font-bold text-neutral-300">// CLOUD_CLUSTER_01</span>
                  <Server className="w-5 h-5 text-[#ff5400]" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono"><span className="text-neutral-400">CPU LOAD:</span><span className="text-green-400">24.2%</span></div>
                  <div className="flex items-center justify-between text-xs font-mono"><span className="text-neutral-400">MEMORY:</span><span className="text-green-400">16.8 GB</span></div>
                  <div className="flex items-center justify-between text-xs font-mono"><span className="text-neutral-400">UPTIME:</span><span className="text-[#ff5400] font-bold">99.999%</span></div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="absolute bottom-6 right-6 z-40">
              <button onClick={() => handleSelect(5, "The Server Maintenance Astronaut")} className="px-6 py-3 rounded-xl bg-[#ff5400] text-white font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors shadow">
                Select Concept 05
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CONCEPT 6: THE AI PROMPT ENGINEER ASTRONAUT */}
      <section className="py-20 border-b border-neutral-200 bg-neutral-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-neutral-200 text-neutral-800 border border-neutral-300">
              CONCEPT 06
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff5400]">
              Neural Network Interfacing
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-display">
            The AI Prompt Engineer Astronaut
          </h2>
          <p className="text-sm text-neutral-500 mt-1">An astronaut interacting with a glowing AI core, with floating prompt bubbles and glowing synaptic lines.</p>
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="w-full h-[520px] rounded-3xl bg-white border border-neutral-200 shadow-xl flex items-center justify-center relative overflow-hidden p-8 group">

            <div className="relative z-20 flex flex-col items-center gap-6">
              <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                <AstronautImg imageUrl="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800" />
              </motion.div>
              <div className="px-6 py-3 rounded-2xl bg-neutral-900 text-white text-xs font-mono flex items-center gap-3 shadow-xl max-w-md text-center">
                <Sparkles className="w-5 h-5 text-[#ff5400] flex-shrink-0" />
                <span>"System prompt: Architect a flawless, zero-latency enterprise SaaS application."</span>
              </div>
            </div>

            {/* CTA */}
            <div className="absolute bottom-6 right-6 z-40">
              <button onClick={() => handleSelect(6, "The AI Prompt Engineer Astronaut")} className="px-6 py-3 rounded-xl bg-black text-white font-bold text-xs uppercase tracking-widest hover:bg-[#ff5400] transition-colors shadow">
                Select Concept 06
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CONCEPT 7: THE CRYPTO & WEB3 ASTRONAUT */}
      <section className="py-20 border-b border-neutral-200 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-neutral-100 text-neutral-800 border border-neutral-200">
              CONCEPT 07
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff5400]">
              DeFi & Blockchain Architecture
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-display">
            The Crypto & Web3 Astronaut
          </h2>
          <p className="text-sm text-neutral-500 mt-1">An astronaut floating with glowing 3D Ethereum coins and real-time blockchain transaction graphs.</p>
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="w-full h-[520px] rounded-3xl bg-neutral-900 text-white border border-neutral-800 shadow-2xl flex items-center justify-center relative overflow-hidden p-8 group">

            <div className="flex items-center gap-12 z-20">
              <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
                <AstronautImg imageUrl="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=800" />
              </motion.div>
              <div className="flex flex-col gap-4 bg-neutral-800 p-6 rounded-2xl border border-neutral-700 w-72">
                <div className="flex items-center justify-between border-b border-neutral-700 pb-3">
                  <span className="text-xs font-mono font-bold text-neutral-300">// ETH_SMART_CONTRACT</span>
                  <Disc className="w-5 h-5 text-[#ff5400]" />
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between"><span className="text-neutral-400">GAS FEE:</span><span className="text-green-400">12 Gwei</span></div>
                  <div className="flex justify-between"><span className="text-neutral-400">BLOCK:</span><span className="text-white">#1849201</span></div>
                  <div className="flex justify-between"><span className="text-neutral-400">STATUS:</span><span className="text-[#ff5400] font-bold">CONFIRMED</span></div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="absolute bottom-6 right-6 z-40">
              <button onClick={() => handleSelect(7, "The Crypto & Web3 Astronaut")} className="px-6 py-3 rounded-xl bg-[#ff5400] text-white font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors shadow">
                Select Concept 07
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CONCEPT 8: THE UI/UX ARCHITECT ASTRONAUT */}
      <section className="py-20 border-b border-neutral-200 bg-neutral-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-neutral-200 text-neutral-800 border border-neutral-300">
              CONCEPT 08
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff5400]">
              Design System Mastery
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-display">
            The UI/UX Architect Astronaut
          </h2>
          <p className="text-sm text-neutral-500 mt-1">An astronaut arranging floating Figma-style UI bento boxes and color palettes in zero gravity.</p>
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="w-full h-[520px] rounded-3xl bg-white border border-neutral-200 shadow-xl flex items-center justify-center relative overflow-hidden p-8 group">

            <div className="flex items-center gap-12 z-20">
              <motion.div animate={{ y: [-6, 6, -6] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}>
                <AstronautImg imageUrl="https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&q=80&w=800" />
              </motion.div>
              <div className="grid grid-cols-2 gap-4 w-72">
                <div className="p-4 bg-neutral-100 rounded-2xl border border-neutral-200 flex flex-col items-center justify-center shadow-sm"><span className="w-6 h-6 rounded-full bg-[#ff5400] mb-2" /><span className="text-[10px] font-mono font-bold">PRIMARY_ACCENT</span></div>
                <div className="p-4 bg-neutral-900 rounded-2xl border border-neutral-800 flex flex-col items-center justify-center text-white shadow-sm"><Layers className="w-6 h-6 text-white mb-2" /><span className="text-[10px] font-mono font-bold">AUTO_LAYOUT</span></div>
              </div>
            </div>

            {/* CTA */}
            <div className="absolute bottom-6 right-6 z-40">
              <button onClick={() => handleSelect(8, "The UI/UX Architect Astronaut")} className="px-6 py-3 rounded-xl bg-black text-white font-bold text-xs uppercase tracking-widest hover:bg-[#ff5400] transition-colors shadow">
                Select Concept 08
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          CATEGORY C: HIGH-FIDELITY AEROSPACE & CYBER-MINIMALISM (CONCEPTS 9 - 15)
      ════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white py-12 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#ff5400] bg-[#ff5400]/10 px-3 py-1 rounded-full">
            Category C // High-Fidelity Aerospace & Cyber-Minimalism
          </span>
        </div>
      </div>

      {/* CONCEPT 9: THE QUANTUM LAUNCHPAD */}
      <section className="py-20 border-b border-neutral-200 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-neutral-100 text-neutral-800 border border-neutral-200">
              CONCEPT 09
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff5400]">
              Magnetic Levitation
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-display">
            The Quantum Launchpad
          </h2>
          <p className="text-sm text-neutral-500 mt-1">The rocket sitting on a glowing magnetic levitation launchpad with pulsing energy rings and launch countdown telemetry.</p>
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="w-full h-[520px] rounded-3xl bg-neutral-900 text-white border border-neutral-800 shadow-2xl flex items-center justify-center relative overflow-hidden p-8 group">

            <div className="relative z-20 flex flex-col items-center">
              <motion.div animate={{ y: [-3, 3, -3] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                <RocketImg />
              </motion.div>
              {/* Levitation Pad */}
              <div className="w-72 h-12 rounded-full bg-[#ff5400]/20 border border-[#ff5400]/50 shadow-[0_0_40px_rgba(255,84,0,0.6)] flex items-center justify-center mt-4">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#ff5400]">// MAG-LEV_ACTIVE</span>
              </div>
            </div>

            {/* CTA */}
            <div className="absolute bottom-6 right-6 z-40">
              <button onClick={() => handleSelect(9, "The Quantum Launchpad")} className="px-6 py-3 rounded-xl bg-[#ff5400] text-white font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors shadow">
                Select Concept 09
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CONCEPT 10: GLASSMORPHISM MISSION CONTROL */}
      <section className="py-20 border-b border-neutral-200 bg-neutral-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-neutral-200 text-neutral-800 border border-neutral-300">
              CONCEPT 10
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff5400]">
              Command Dashboard
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-display">
            Glassmorphism Mission Control
          </h2>
          <p className="text-sm text-neutral-500 mt-1">The rocket surrounded by sleek frosted glass mission control panels displaying live server load, API latency, and firewalls.</p>
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="w-full h-[520px] rounded-3xl bg-white border border-neutral-200 shadow-xl flex items-center justify-center relative overflow-hidden p-8 group">

            <div className="absolute left-12 top-12 p-6 rounded-3xl backdrop-blur-md bg-white/80 border border-neutral-200 shadow-lg w-64 z-20">
              <h4 className="text-xs font-mono font-bold mb-2">FIREWALL_STATUS</h4><p className="text-xs text-green-600 font-mono">SECURE (0 BREACHES)</p>
            </div>
            <div className="absolute right-12 bottom-12 p-6 rounded-3xl backdrop-blur-md bg-white/80 border border-neutral-200 shadow-lg w-64 z-20">
              <h4 className="text-xs font-mono font-bold mb-2">GLOBAL_LATENCY</h4><p className="text-xs text-[#ff5400] font-mono font-bold">4.2ms (EDGE_ROUTED)</p>
            </div>

            <RocketImg />

            {/* CTA */}
            <div className="absolute bottom-6 right-6 z-40">
              <button onClick={() => handleSelect(10, "Glassmorphism Mission Control")} className="px-6 py-3 rounded-xl bg-black text-white font-bold text-xs uppercase tracking-widest hover:bg-[#ff5400] transition-colors shadow">
                Select Concept 10
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CONCEPT 11: THE SOLAR SAIL & ENERGY GRID */}
      <section className="py-20 border-b border-neutral-200 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-neutral-100 text-neutral-800 border border-neutral-200">
              CONCEPT 11
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff5400]">
              Geometric Solar Wings
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-display">
            The Solar Sail & Energy Grid
          </h2>
          <p className="text-sm text-neutral-500 mt-1">The rocket surrounded by glowing geometric solar wings absorbing ambient orange light particles.</p>
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="w-full h-[520px] rounded-3xl bg-neutral-900 text-white border border-neutral-800 shadow-2xl flex items-center justify-center relative overflow-hidden p-8 group">

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-30">
              <div className="w-96 h-96 border border-[#ff5400] rotate-45 rounded-3xl" />
              <div className="absolute w-96 h-96 border border-white rotate-12 rounded-3xl" />
            </div>

            <RocketImg />

            {/* CTA */}
            <div className="absolute bottom-6 right-6 z-40">
              <button onClick={() => handleSelect(11, "The Solar Sail & Energy Grid")} className="px-6 py-3 rounded-xl bg-[#ff5400] text-white font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors shadow">
                Select Concept 11
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CONCEPT 12: CYBERNETIC WIREFRAME MATRIX */}
      <section className="py-20 border-b border-neutral-200 bg-neutral-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-neutral-200 text-neutral-800 border border-neutral-300">
              CONCEPT 12
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff5400]">
              Laser Mesh Scanner
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-display">
            Cybernetic Wireframe Matrix
          </h2>
          <p className="text-sm text-neutral-500 mt-1">A dark cybernetic wireframe grid where the rocket is scanned by a horizontal orange laser beam revealing its mesh.</p>
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="w-full h-[520px] rounded-3xl bg-black text-white border border-neutral-800 shadow-2xl flex items-center justify-center relative overflow-hidden p-8 group">

            {/* Laser scanner line */}
            <motion.div animate={{ y: [-200, 200, -200] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="absolute w-full h-[2px] bg-[#ff5400] shadow-[0_0_20px_rgba(255,84,0,1)] z-20" />

            <RocketImg />

            {/* CTA */}
            <div className="absolute bottom-6 right-6 z-40">
              <button onClick={() => handleSelect(12, "Cybernetic Wireframe Matrix")} className="px-6 py-3 rounded-xl bg-[#ff5400] text-white font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors shadow">
                Select Concept 12
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CONCEPT 13: FLOATING GRAVITY WELL */}
      <section className="py-20 border-b border-neutral-200 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-neutral-100 text-neutral-800 border border-neutral-200">
              CONCEPT 13
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff5400]">
              Black Hole Singularity
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-display">
            Floating Gravity Well
          </h2>
          <p className="text-sm text-neutral-500 mt-1">A mesmerizing rotating gravity well accretion disk behind the rocket bending light rays around it.</p>
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="w-full h-[520px] rounded-3xl bg-neutral-900 text-white border border-neutral-800 shadow-2xl flex items-center justify-center relative overflow-hidden p-8 group">

            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute w-96 h-96 rounded-full border-8 border-dashed border-[#ff5400]/40 blur-sm pointer-events-none" />

            <RocketImg />

            {/* CTA */}
            <div className="absolute bottom-6 right-6 z-40">
              <button onClick={() => handleSelect(13, "Floating Gravity Well")} className="px-6 py-3 rounded-xl bg-[#ff5400] text-white font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors shadow">
                Select Concept 13
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CONCEPT 14: THE NEON CYBER-PUNK THRUSTER */}
      <section className="py-20 border-b border-neutral-200 bg-neutral-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-neutral-200 text-neutral-800 border border-neutral-300">
              CONCEPT 14
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff5400]">
              Vibrant Cyber Decals
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-display">
            The Neon Cyber-Punk Thruster
          </h2>
          <p className="text-sm text-neutral-500 mt-1">Intense vibrant cyan and orange neon lighting with high-contrast glowing exhaust plumes and cyber decals.</p>
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="w-full h-[520px] rounded-3xl bg-black text-white border border-neutral-800 shadow-2xl flex items-center justify-center relative overflow-hidden p-8 group">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.2)_0%,transparent_70%)] pointer-events-none" />

            <RocketImg />

            {/* CTA */}
            <div className="absolute bottom-6 right-6 z-40">
              <button onClick={() => handleSelect(14, "The Neon Cyber-Punk Thruster")} className="px-6 py-3 rounded-xl bg-cyan-500 text-black font-bold text-xs uppercase tracking-widest hover:bg-[#ff5400] hover:text-white transition-colors shadow">
                Select Concept 14
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CONCEPT 15: PURE APPLE-STYLE WHITEOUT MONOLITH */}
      <section className="py-20 border-b border-neutral-200 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-neutral-100 text-neutral-800 border border-neutral-200">
              CONCEPT 15
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff5400]">
              Ultimate Quiet Luxury
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-display">
            Pure Apple-Style Whiteout Monolith
          </h2>
          <p className="text-sm text-neutral-500 mt-1">Ultimate quiet luxury—pure white-on-white embossed aesthetics with ultra-subtle soft drop shadows and clean typography.</p>
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="w-full h-[520px] rounded-3xl bg-white border border-neutral-200 shadow-[0_20px_60px_rgba(0,0,0,0.05)] flex items-center justify-center relative overflow-hidden p-8 group">

            <RocketImg />

            {/* CTA */}
            <div className="absolute bottom-6 right-6 z-40">
              <button onClick={() => handleSelect(15, "Pure Apple-Style Whiteout Monolith")} className="px-6 py-3 rounded-xl bg-black text-white font-bold text-xs uppercase tracking-widest hover:bg-[#ff5400] transition-colors shadow">
                Select Concept 15
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer Selection Prompt ── */}
      <footer className="py-20 text-center bg-white border-t border-neutral-200">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight font-display mb-4">
            Ready for Main Homepage Integration?
          </h3>
          <p className="text-sm md:text-base text-neutral-600 font-light mb-8 max-w-2xl mx-auto leading-relaxed">
            Click on any of the "Select Concept" buttons above to test the interactive alert, then let us know which concept number you would like integrated directly into the main homepage Hero section.
          </p>
          {selectedConcept && (
            <div className="p-4 rounded-2xl bg-[#ff5400]/10 border border-[#ff5400]/30 text-[#ff5400] font-mono text-sm max-w-md mx-auto mb-6">
              Currently Selected: Concept {selectedConcept}
            </div>
          )}
          <Link
            href="/"
            className="px-8 py-4 rounded-full bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-[#ff5400] transition-colors shadow-lg inline-block"
          >
            Return to Homepage
          </Link>
        </div>
      </footer>

    </div>
  );
}
