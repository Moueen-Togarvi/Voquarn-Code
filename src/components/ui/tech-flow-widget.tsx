"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TechNode {
  id: number;
  name: string;
  type: string;
  desc: string;
  icon: React.ReactNode;
  x: number;
  y: number;
  path: string; // SVG path from node to Voquarn Center core
}

export function TechFlowWidget() {
  const [activeIndex, setActiveIndex] = useState(1); // Default to React / Next.js

  const TECH_NODES: TechNode[] = [
    {
      id: 0,
      name: "Figma Pro",
      type: "UI/UX DESIGN",
      desc: "Premium, ultra-responsive design prototypes",
      icon: (
        <svg viewBox="0 0 38 57" className="w-3.5 h-5 fill-current">
          <path d="M19 0C13.75 0 9.5 4.25 9.5 9.5C9.5 14.75 13.75 19 19 19C24.25 19 28.5 14.75 28.5 9.5C28.5 4.25 24.25 0 19 0Z" fill="#F24E1E"/>
          <path d="M9.5 28.5C9.5 23.25 13.75 19 19 19C24.25 19 28.5 23.25 28.5 28.5C28.5 33.75 24.25 38 19 38C13.75 38 9.5 33.75 9.5 28.5Z" fill="#A259FF"/>
          <path d="M9.5 47.5C9.5 42.25 13.75 38 19 38V57C13.75 57 9.5 52.75 9.5 47.5Z" fill="#0ACF83"/>
          <path d="M19 38C24.25 38 28.5 42.25 28.5 47.5C28.5 52.75 24.25 57 19 57C13.75 57 9.5 52.75 9.5 47.5Z" fill="#1ABCFE"/>
          <path d="M9.5 9.5C9.5 14.75 13.75 19 19 19V0C13.75 0 9.5 4.25 9.5 9.5Z" fill="#FF7262"/>
        </svg>
      ),
      x: 90,
      y: 120,
      path: "M 90 120 C 150 120, 200 100, 268 100",
    },
    {
      id: 1,
      name: "Next.js 16",
      type: "FRONTEND CORE",
      desc: "Next-gen SSR react platforms",
      icon: (
        <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-5 h-5">
          <circle cx="0" cy="0" r="2.05" fill="#ff5400"/>
          <g stroke="#000000" strokeWidth="1.2" fill="none">
            <ellipse rx="11" ry="4.2"/>
            <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
            <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
          </g>
        </svg>
      ),
      x: 190,
      y: 100,
      path: "M 190 100 L 268 100",
    },
    {
      id: 2,
      name: "Gemini Pro AI",
      type: "INTELLIGENCE",
      desc: "Reasoning models & autonomous capabilities",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M12 2L14.85 9.15L22 12L14.85 14.85L12 22L9.15 14.85L2 12L9.15 9.15L12 2Z" fill="url(#geminiGrad)" />
          <defs>
            <linearGradient id="geminiGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ff5400" />
              <stop offset="100%" stopColor="#ff9a00" />
            </linearGradient>
          </defs>
        </svg>
      ),
      x: 410,
      y: 100,
      path: "M 410 100 L 332 100",
    },
    {
      id: 3,
      name: "Drizzle / Data",
      type: "CLOUD ARCHITECTURE",
      desc: "Type-safe database relations and serverless scaling",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current text-neutral-800" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
        </svg>
      ),
      x: 510,
      y: 120,
      path: "M 510 120 C 450 120, 400 100, 332 100",
    },
  ];

  // Auto-cycle nodes for the data flow animation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TECH_NODES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const activeNode = TECH_NODES[activeIndex];

  return (
    <div className="w-full max-w-2xl mt-6 rounded-[24px] bg-white/60 backdrop-blur-xl border border-black/10 shadow-[0_12px_24px_rgba(0,0,0,0.02)] p-6 relative overflow-hidden group select-none">
      {/* Dynamic Dotted grid overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-45"
        style={{
          backgroundImage: "radial-gradient(rgba(0, 0, 0, 0.08) 1.2px, transparent 1.2px)",
          backgroundSize: "16px 16px",
        }}
      />

      {/* Widget Header */}
      <div className="relative z-10 flex flex-col items-center mb-1 text-center">
        <span className="text-[9px] font-extrabold tracking-widest text-[#ff5400] uppercase mb-1 bg-[#ff5400]/5 px-2.5 py-0.5 rounded-full">
          Live Ecosystem
        </span>
        <h3 className="text-[13px] font-black uppercase tracking-tight text-neutral-800">
          How We Build Your Digital Miracle
        </h3>
      </div>

      {/* SVG Canvas for flow visualization */}
      <div className="relative w-full aspect-[600/225] mt-1 z-10">
        <svg viewBox="0 0 600 225" className="w-full h-full">
          {/* Keyframes style injection */}
          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes tech-dash {
                to {
                  stroke-dashoffset: -20;
                }
              }
              .flow-path-inactive {
                stroke: rgba(0, 0, 0, 0.06);
                stroke-width: 1.5px;
                fill: none;
              }
              .flow-path-glow {
                stroke: rgba(255, 84, 0, 0.12);
                stroke-width: 4px;
                fill: none;
              }
              .flow-path-active {
                stroke: #ff5400;
                stroke-width: 2px;
                fill: none;
                stroke-dasharray: 6 6;
                animation: tech-dash 1.2s linear infinite;
              }
            `
          }} />

          {/* Connection Lines from satellite nodes to Voquarn Center */}
          {TECH_NODES.map((node) => {
            const isActive = node.id === activeIndex;
            return (
              <g key={node.id}>
                {/* Inactive line */}
                <path d={node.path} className="flow-path-inactive" />
                
                {/* Active Line with glowing effects */}
                {isActive && (
                  <>
                    <path d={node.path} className="flow-path-glow" />
                    <path d={node.path} className="flow-path-active" />
                  </>
                )}
              </g>
            );
          })}

          {/* Bracket branches pointing downward to the text card details */}
          {/* Center branch */}
          <line x1="300" y1="132" x2="300" y2="162" stroke="rgba(0, 0, 0, 0.08)" strokeWidth="1.5" />
          {/* Curve bracket connector */}
          <path 
            d="M 240 174 C 240 162, 360 162, 360 174" 
            stroke="rgba(0, 0, 0, 0.08)" 
            strokeWidth="1.5" 
            fill="none" 
          />

          {/* Node 1: Figma (Left-outer) */}
          <foreignObject x={90 - 20} y={120 - 20} width="40" height="40">
            <button
              onClick={() => setActiveIndex(0)}
              onMouseEnter={() => setActiveIndex(0)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border bg-white/95 backdrop-blur-sm cursor-pointer
                ${activeIndex === 0 
                  ? "border-[#ff5400] shadow-[0_0_12px_rgba(255,84,0,0.25)] scale-110" 
                  : "border-black/5 hover:border-black/20 hover:scale-105"
                }`}
            >
              {TECH_NODES[0].icon}
            </button>
          </foreignObject>

          {/* Node 2: React (Left-inner) */}
          <foreignObject x={190 - 20} y={100 - 20} width="40" height="40">
            <button
              onClick={() => setActiveIndex(1)}
              onMouseEnter={() => setActiveIndex(1)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border bg-white/95 backdrop-blur-sm cursor-pointer
                ${activeIndex === 1 
                  ? "border-[#ff5400] shadow-[0_0_12px_rgba(255,84,0,0.25)] scale-110" 
                  : "border-black/5 hover:border-black/20 hover:scale-105"
                }`}
            >
              {TECH_NODES[1].icon}
            </button>
          </foreignObject>

          {/* Central Hub Node: Voquarn Core */}
          <foreignObject x={300 - 28} y={100 - 28} width="56" height="56">
            <div 
              className="w-14 h-14 rounded-full bg-white border border-black/10 flex items-center justify-center relative shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
            >
              {/* Outer pulsing ring in our brand orange color */}
              <div 
                className="absolute inset-0 rounded-full border border-[#ff5400] animate-ping opacity-25" 
                style={{ animationDuration: "2.5s" }}
              />
              {/* Inner subtle glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#ff5400]/5 to-transparent pointer-events-none" />
              
              {/* Brand Logo icon */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/image-removebg-preview-2.png" 
                className="w-9 h-9 object-contain relative z-10 filter drop-shadow(0 2px 4px rgba(0,0,0,0.05))" 
                alt="Voquarn Core Engine" 
              />
            </div>
          </foreignObject>

          {/* Node 3: Gemini (Right-inner) */}
          <foreignObject x={410 - 20} y={100 - 20} width="40" height="40">
            <button
              onClick={() => setActiveIndex(2)}
              onMouseEnter={() => setActiveIndex(2)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border bg-white/95 backdrop-blur-sm cursor-pointer
                ${activeIndex === 2 
                  ? "border-[#ff5400] shadow-[0_0_12px_rgba(255,84,0,0.25)] scale-110" 
                  : "border-black/5 hover:border-black/20 hover:scale-105"
                }`}
            >
              {TECH_NODES[2].icon}
            </button>
          </foreignObject>

          {/* Node 4: Database (Right-outer) */}
          <foreignObject x={510 - 20} y={120 - 20} width="40" height="40">
            <button
              onClick={() => setActiveIndex(3)}
              onMouseEnter={() => setActiveIndex(3)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border bg-white/95 backdrop-blur-sm cursor-pointer
                ${activeIndex === 3 
                  ? "border-[#ff5400] shadow-[0_0_12px_rgba(255,84,0,0.25)] scale-110" 
                  : "border-black/5 hover:border-black/20 hover:scale-105"
                }`}
            >
              {TECH_NODES[3].icon}
            </button>
          </foreignObject>

          {/* Bottom detail pill connected to brackets */}
          <foreignObject x={300 - 110} y={178} width="220" height="42">
            <div className="w-full flex justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeNode.id}
                  initial={{ opacity: 0, y: 4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="px-5 py-2 rounded-full bg-[#1b1b1b] border border-neutral-700/40 text-white shadow-lg flex items-center gap-2 max-w-full text-center relative overflow-hidden"
                >
                  {/* Subtle shining light beam sweep on the bottom label */}
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "180%" }}
                    transition={{
                      repeat: Infinity,
                      repeatType: "loop",
                      duration: 2.2,
                      ease: "easeInOut",
                      repeatDelay: 1.5,
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-[50%] -skew-x-12 pointer-events-none"
                  />
                  
                  <span className="text-[10px] font-black uppercase tracking-wider text-white">
                    {activeNode.name}
                  </span>
                  <span className="text-[8px] font-extrabold text-[#ff5400] tracking-widest bg-[#ff5400]/10 px-2 py-0.5 rounded-full shrink-0">
                    {activeNode.type}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </foreignObject>
        </svg>
      </div>

      {/* Floating Active Info text detail below SVG */}
      <div className="w-full text-center mt-0.5 relative z-10 min-h-[28px] flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.p
            key={activeNode.id}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 0.45, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.2 }}
            className="text-[10px] font-bold tracking-normal text-neutral-800 uppercase"
          >
            {activeNode.desc}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
