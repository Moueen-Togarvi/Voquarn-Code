"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Zap, Cpu, Code2, Star } from "lucide-react";

export function AiGrowthSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTab, setActiveTab] = useState<"stats" | "agents">("stats");

  // Premium continuous orange light beams & organic sweep wave animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrameId: number;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        width = rect.width;
        height = rect.height;
      }

      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      // Draw rich sleek dark black-orange background gradient matching brand colors
      const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, Math.max(width, height) * 0.95);
      bgGrad.addColorStop(0, "#080301");  // Ultra-deep orange-black core
      bgGrad.addColorStop(0.5, "#000000");
      bgGrad.addColorStop(1, "#000000");  // Pure black edges
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const time = Date.now() * 0.0006;

      // Draw glowing vertical columns of orange light
      for (let i = 0; i < 5; i++) {
        // Rhythmic organic sway
        const beamX = width * (0.2 + i * 0.15) + Math.sin(time * 0.5 + i) * 30;
        const beamWidth = 35 + Math.cos(time * 0.35 + i) * 15;
        const opacity = 0.08 + Math.sin(time * 0.7 + i) * 0.04;

        // Brand Orange linear gradient fading vertically
        const beamGrad = ctx.createLinearGradient(beamX, height, beamX, 0);
        beamGrad.addColorStop(0, "rgba(255, 84, 0, 0)");
        beamGrad.addColorStop(0.25, `rgba(255, 84, 0, ${opacity * 1.5})`);
        beamGrad.addColorStop(0.55, `rgba(255, 120, 50, ${opacity * 2.2})`);
        beamGrad.addColorStop(1, "rgba(255, 84, 0, 0)");

        ctx.fillStyle = beamGrad;
        ctx.fillRect(beamX - beamWidth / 2, 0, beamWidth, height);

        // Core bright light ray for high-end digital stream look
        ctx.beginPath();
        ctx.moveTo(beamX, height);
        ctx.lineTo(beamX, 0);
        ctx.strokeStyle = `rgba(255, 200, 150, ${opacity * 0.7})`;
        ctx.lineWidth = 1.0;
        ctx.stroke();
      }

      // Curved sweeping light waves
      for (let j = 0; j < 2; j++) {
        ctx.beginPath();
        ctx.strokeStyle = j === 0 ? "rgba(255, 84, 0, 0.18)" : "rgba(255, 120, 50, 0.08)";
        ctx.lineWidth = 2.0;
        ctx.shadowBlur = 25;
        ctx.shadowColor = "rgba(255, 84, 0, 0.4)";

        for (let x = 0; x <= width; x += 15) {
          const y = height * 0.85 - 
                    Math.sin(x * 0.002 + time * 0.4 + j * 1.5) * 55;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="relative overflow-hidden pt-28 pb-32 bg-black text-white border-t border-white/5">
      {/* Brand Orange animations & shimmers */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmerOrange {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .luxury-card {
          background: linear-gradient(180deg, rgba(15, 15, 15, 0.9) 0%, rgba(5, 5, 5, 0.98) 100%);
          border: 1.5px solid rgba(255, 84, 0, 0.15);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(20px);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .luxury-card:hover {
          transform: translateY(-8px);
          border-color: rgba(255, 84, 0, 0.55);
          box-shadow: 0 35px 80px rgba(255, 84, 0, 0.15);
        }
      `}} />

      {/* Absolute Canvas Background for live, continuous lighting theme */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full pointer-events-none z-0"
      />

      {/* Content Layer */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-8 flex flex-col h-full items-center">
        
        {/* Toggle between Tab 1 (Stats cards) and Tab 2 (Custom Software Architectures) */}
        <div className="inline-flex bg-white/5 border border-white/10 rounded-2xl p-1 mb-16 shadow-2xl relative z-20">
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === "stats"
                ? "bg-[#ff5400] text-white shadow-lg shadow-[#ff5400]/25"
                : "text-white/60 hover:text-white"
            }`}
          >
            Agency Metrics
          </button>
          <button
            onClick={() => setActiveTab("agents")}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === "agents"
                ? "bg-[#ff5400] text-white shadow-lg shadow-[#ff5400]/25"
                : "text-white/60 hover:text-white"
            }`}
          >
            Custom Integration
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "stats" ? (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full flex flex-col items-center"
            >
              {/* Three glowing glassmorphic cards in a beautiful row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 w-full items-stretch max-w-5xl mx-auto mb-16">
                
                {/* Left Card: 10x Speed */}
                <div className="luxury-card rounded-[2.5rem] p-8 flex flex-col justify-between relative overflow-hidden group">
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(255,84,0,0.06), transparent)",
                      animation: "shimmerOrange 3s infinite linear"
                    }}
                  />
                  <div className="flex justify-between items-center mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#ff5400]/10 border border-[#ff5400]/20 flex items-center justify-center text-[#ff5400]">
                      <Zap size={18} />
                    </div>
                    <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Velocity</span>
                  </div>
                  <div>
                    <h2 className="text-6xl font-black m-0 leading-none text-transparent bg-clip-text bg-gradient-to-r from-white via-[#ffaa66] to-[#ff5400] font-display">
                      10x
                    </h2>
                    <h3 className="text-sm font-black text-[#ff5400] uppercase tracking-wider mt-4 leading-relaxed font-display">
                      Faster Deployments
                    </h3>
                  </div>
                  <div className="mt-8 pt-4 border-t border-white/5 text-[10px] font-bold text-white/40">
                    Voquarn Code Velocity
                  </div>
                </div>

                {/* Middle Card: 40% Reduction (Elevated visually) */}
                <div className="luxury-card rounded-[2.5rem] p-8 flex flex-col justify-between relative overflow-hidden group md:-translate-y-4 hover:md:-translate-y-6 border-[#ff5400]/35 shadow-[0_30px_70px_rgba(255,84,0,0.15)]">
                  {/* Glowing orange ambient aura at top */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full bg-[#ff5400]/20 blur-2xl pointer-events-none" />
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-20" 
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(255,120,50,0.12), transparent)",
                      animation: "shimmerOrange 2.5s infinite linear"
                    }}
                  />
                  <div className="flex justify-between items-center mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#ff5400]/20 border border-[#ff5400]/40 flex items-center justify-center text-[#ff5400] shadow-[0_0_15px_rgba(255,84,0,0.3)]">
                      <Cpu size={18} />
                    </div>
                    <span className="text-[10px] font-black uppercase text-[#ff5400] tracking-widest border border-[#ff5400]/30 rounded-full px-2.5 py-0.5 bg-[#ff5400]/10">
                      Top Growth
                    </span>
                  </div>
                  <div>
                    <h2 className="text-6xl font-black m-0 leading-none text-transparent bg-clip-text bg-gradient-to-r from-white via-[#ffaa66] to-[#ff5400] font-display drop-shadow-[0_0_15px_rgba(255,84,0,0.2)]">
                      40%
                    </h2>
                    <h3 className="text-sm font-black text-[#ff5400] uppercase tracking-wider mt-4 leading-relaxed font-display">
                      Reduced Cloud Costs
                    </h3>
                  </div>
                  <div className="mt-8 pt-4 border-t border-[#ff5400]/20 text-[10px] font-bold text-[#ff5400]/80 flex justify-between items-center">
                    <span>Performance Matrix</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                </div>

                {/* Right Card: 99.9% Uptime */}
                <div className="luxury-card rounded-[2.5rem] p-8 flex flex-col justify-between relative overflow-hidden group">
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(255,84,0,0.06), transparent)",
                      animation: "shimmerOrange 3s infinite linear"
                    }}
                  />
                  <div className="flex justify-between items-center mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#ff5400]/10 border border-[#ff5400]/20 flex items-center justify-center text-[#ff5400]">
                      <Code2 size={18} />
                    </div>
                    <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Operational</span>
                  </div>
                  <div>
                    <h2 className="text-6xl font-black m-0 leading-none text-transparent bg-clip-text bg-gradient-to-r from-white via-[#ffaa66] to-[#ff5400] font-display">
                      99.9%
                    </h2>
                    <h3 className="text-sm font-black text-[#ff5400] uppercase tracking-wider mt-4 leading-relaxed font-display">
                      Service Uptime
                    </h3>
                  </div>
                  <div className="mt-8 pt-4 border-t border-white/5 text-[10px] font-bold text-white/40">
                    Infrastructure Security
                  </div>
                </div>

              </div>

              {/* Headline Text below */}
              <h2 className="font-display text-[clamp(28px,4vw,48px)] font-black text-center uppercase tracking-tight max-w-3xl leading-tight">
                Transform your ideas into <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#ffaa66] to-[#ff5400] drop-shadow-[0_0_15px_rgba(255,84,0,0.15)]">high-performance</span> digital systems
              </h2>

              {/* Orange Pill CTA button */}
              <div className="mt-10">
                <a
                  href="/contact"
                  className="inline-flex items-center gap-4 bg-[#ff5400] hover:bg-[#ff6717] px-9 py-4 rounded-full text-xs font-black uppercase tracking-widest text-white hover:scale-105 transition-all shadow-[0_15px_30px_rgba(255,84,0,0.25)] relative z-10"
                >
                  Talk with Our Engineering Experts
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                    <ArrowRight size={10} className="text-white" />
                  </div>
                </a>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="agents"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full flex flex-col items-center"
            >
              {/* Central row of 3 floating rounded glass square badges */}
              <div className="flex justify-center items-center gap-6 mb-16 relative">
                {/* Horizontal glowing lens flare line running behind the cards */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[2px] bg-gradient-to-r from-transparent via-[#ff5400] to-transparent shadow-[0_0_15px_rgba(255,84,0,0.7)] pointer-events-none" />

                {/* Left Badge: Sparkle */}
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-b from-[#151515] to-[#050505] border border-[#ff5400]/30 flex items-center justify-center text-[#ff5400] shadow-2xl relative z-10"
                >
                  <Sparkles size={24} className="animate-pulse" />
                </motion.div>

                {/* Middle Badge: AI (Larger and glowing) */}
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="w-24 h-24 rounded-3xl bg-gradient-to-b from-[#202020] to-[#050505] border-2 border-[#ff5400]/50 flex items-center justify-center text-[#ff5400] shadow-[0_0_30px_rgba(255,84,0,0.25)] relative z-20"
                >
                  <span className="font-display text-4xl font-black tracking-tighter uppercase drop-shadow-[0_0_10px_rgba(255,84,0,0.5)]">
                    DEV
                  </span>
                </motion.div>

                {/* Right Badge: Star */}
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-b from-[#151515] to-[#050505] border border-[#ff5400]/30 flex items-center justify-center text-[#ff5400] shadow-2xl relative z-10"
                >
                  <Star size={24} className="animate-spin-slow" style={{ animation: "rotateSlow 12s infinite linear" }} />
                </motion.div>
              </div>

              {/* Bold Header */}
              <div className="text-center max-w-2xl px-4 flex flex-col items-center">
                <h2 className="font-display text-[clamp(28px,4.5vw,52px)] font-black uppercase leading-[1.05] tracking-tight">
                  Bespoke digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#ffaa66] to-[#ff5400]">architectures</span> tailored for your scale
                </h2>
                
                {/* Secondary subtext */}
                <p className="text-white/70 mt-6 text-sm leading-relaxed font-semibold max-w-lg">
                  We collaborate closely to engineer specialized systems, next-gen architectures, and cloud integrations that drive high-velocity business growth.
                </p>
              </div>

              {/* Orange Pill Button */}
              <div className="mt-12">
                <a
                  href="/contact"
                  className="inline-flex items-center gap-3 bg-[#ff5400] hover:bg-[#ff6717] pl-8 pr-2.5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest text-white hover:scale-105 transition-all shadow-[0_15px_30px_rgba(255,84,0,0.2)] z-10"
                >
                  Explore Solutions
                  <div className="w-9 h-9 bg-white/20 hover:bg-white/35 rounded-full flex items-center justify-center transition-colors">
                    <ArrowRight size={14} className="text-white" />
                  </div>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
