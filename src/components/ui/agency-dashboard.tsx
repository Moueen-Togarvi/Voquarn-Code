"use client";

import React, { useEffect, useRef } from "react";
import { Search, ChevronDown, Plus, ArrowRightLeft, ArrowRight, Check, Activity, Sparkles, Shield, Terminal } from "lucide-react";

export function AgencyDashboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Premium continuous wave & particle network animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrameId: number;

    const particles: { x: number; y: number; vx: number; vy: number; radius: number }[] = [];
    const numParticles = 40;

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * 1200,
        y: Math.random() * 800,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
      });
    }

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        width = rect.width;
        height = rect.height;

        particles.forEach(p => {
          if (p.x > width) p.x = Math.random() * width;
          if (p.y > height) p.y = Math.random() * height;
        });
      }

      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      const time = Date.now() * 0.0008;

      ctx.lineWidth = 1.8;
      
      const waveColors = [
        "rgba(255, 84, 0, 0.12)",   
        "rgba(20, 184, 166, 0.08)", 
        "rgba(245, 158, 11, 0.08)"  
      ];
      
      const waveGlows = [
        "rgba(255, 84, 0, 0.15)",
        "rgba(20, 184, 166, 0.1)",
        "rgba(245, 158, 11, 0.1)"
      ];

      for (let j = 0; j < 3; j++) {
        ctx.beginPath();
        ctx.strokeStyle = waveColors[j];
        
        ctx.shadowBlur = 20;
        ctx.shadowColor = waveGlows[j];

        for (let x = 0; x <= width; x += 15) {
          const y = height * 0.45 + 
                    Math.sin(x * 0.0025 + time + j * 2.2) * 110 + 
                    Math.cos(x * 0.0012 - time * 0.6 + j) * 50;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      ctx.shadowBlur = 0;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 0, 0, ${0.08 - dist / 1625})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="page-section relative overflow-hidden pt-12 pb-24 text-black bg-white">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}} />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full pointer-events-none z-0"
      />

      <div className="relative z-10 flex flex-col h-full">
        
        {/* Header/Headline */}
        <div className="flex flex-col items-center pt-8 pb-16 text-center px-4">
          <div className="inline-flex items-center gap-3 bg-black/[0.04] border border-black/10 rounded-full px-4 py-1.5 text-xs mb-8 hover:bg-black/[0.08] transition-colors cursor-pointer">
            <span className="font-bold text-[#ff5400] flex items-center gap-1">
              <Sparkles size={12} className="animate-pulse" /> Core Infrastructure
            </span>
            <span className="text-black/50 font-medium">System Performance →</span>
          </div>

          <h1 className="font-display text-[clamp(40px,5vw,72px)] font-black uppercase leading-[1.05] tracking-[-0.03em] m-0 max-w-4xl text-black">
            Discover the <br />
            transformative power of <br />
            <span className="text-[#ff5400]">digital products</span>
          </h1>
        </div>

        {/* Bento Grid */}
        <div className="w-full">
          <div 
            style={{ 
              display: "grid",
              gap: "20px",
              gridTemplateColumns: "1.05fr 0.95fr 1.25fr 0.955fr 1.05fr"
            }}
            className="hidden lg:grid w-full items-stretch"
          >
            
            {/* COLUMN 1 */}
            <div className="flex flex-col gap-5">
              {/* Search */}
              <div className="bg-white/60 border border-black/10 rounded-3xl p-4 flex justify-between items-center backdrop-blur-md shadow-sm">
                <div className="flex items-center gap-3 text-black/40 text-sm font-medium">
                  <Search size={16} /> Search projects
                </div>
                <div className="bg-black/5 rounded-md px-2 py-1 text-xs text-black/40 font-mono">/</div>
              </div>

              {/* Build with confidence */}
              <div className="bg-white/70 hover:bg-white border border-black/10 hover:border-[#ff5400]/40 rounded-[2rem] p-6 flex-1 flex flex-col justify-between backdrop-blur-md shadow-sm hover:shadow-[0_20px_45px_-12px_rgba(255,84,0,0.08)] hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#ff5400] mb-4">
                    <Shield size={18} />
                  </div>
                  <h3 className="text-base font-bold m-0 mb-2 tracking-tight text-black">Build with confidence</h3>
                  <p className="text-xs text-black/50 m-0 leading-relaxed font-medium">Assured that your codebase is fully scalable.</p>
                </div>
                
                <div className="relative w-full h-28 mt-4 overflow-hidden rounded-2xl bg-black/[0.02] border border-black/5 flex items-center justify-center">
                  <svg width="100%" height="100%" viewBox="0 0 200 120" className="opacity-70">
                    <path d="M40 90 L100 60 L160 90 M100 60 L100 10" stroke="rgba(255, 84, 0, 0.25)" strokeWidth="2" fill="none" />
                    <circle cx="100" cy="60" r="6" fill="#ff5400" className="animate-ping" />
                    <circle cx="100" cy="60" r="5" fill="#ff5400" />
                    <circle cx="40" cy="90" r="4" fill="#000" />
                    <circle cx="160" cy="90" r="4" fill="#000" />
                  </svg>
                </div>
              </div>
            </div>

            {/* COLUMN 2 */}
            <div className="flex flex-col gap-5">
              {/* Performance */}
              <div className="bg-white/70 hover:bg-white border border-black/10 hover:border-[#ff5400]/40 rounded-[2rem] p-6 flex flex-col items-center backdrop-blur-md shadow-sm hover:shadow-[0_20px_45px_-12px_rgba(255,84,0,0.08)] hover:-translate-y-1 transition-all duration-300 ease-out">
                <h3 className="text-sm font-semibold text-black/60 m-0 mb-4 tracking-tight">Performance Score</h3>
                <div className="relative flex items-center justify-center">
                  <div className="bg-[#ff5400]/10 text-[#ff5400] px-4 py-1.5 rounded-full text-xs font-bold mb-1 z-10 border border-[#ff5400]/20">
                    Speed: 99
                  </div>
                  <div className="absolute w-24 h-24 rounded-full bg-[#ff5400]/5 animate-ping pointer-events-none" />
                </div>
                <div className="w-[140px] h-[70px] relative mt-4">
                  <svg width="140" height="70" viewBox="0 0 140 70">
                    <path d="M 10 70 A 60 60 0 0 1 130 70" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="12" strokeLinecap="round" />
                    <path d="M 10 70 A 60 60 0 0 1 125 35" fill="none" stroke="#ff5400" strokeWidth="12" strokeLinecap="round" />
                    <path d="M 70 65 L 115 45" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="70" cy="65" r="4" fill="#000" />
                  </svg>
                </div>
              </div>

              {/* Resource Allocation */}
              <div className="bg-white/70 hover:bg-white border border-black/10 hover:border-[#ff5400]/40 rounded-[2rem] p-6 flex-1 flex flex-col justify-between backdrop-blur-md shadow-sm hover:shadow-[0_20px_45px_-12px_rgba(255,84,0,0.08)] hover:-translate-y-1 transition-all duration-300 ease-out">
                <div>
                  <h3 className="text-sm font-semibold m-0 mb-5 tracking-tight text-black">Project Phase</h3>
                  
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-medium text-black/40">Current</span>
                    <span className="text-xs font-bold text-black flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"/> Design</span>
                  </div>
                  <div className="flex justify-between items-baseline mb-6">
                    <span className="text-xl font-bold text-black tracking-tight">100%</span>
                    <span className="text-xs font-medium text-[#10b981] flex items-center gap-1"><Check size={12}/> Complete</span>
                  </div>
                </div>

                <div className="flex justify-between mb-2">
                  <span className="text-xs font-medium text-black/40">Next</span>
                  <span className="text-xs font-bold text-black flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-purple-500"/> Dev</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xl font-bold text-black tracking-tight">In Progress</span>
                  <span className="text-xs font-medium text-blue-500 flex items-center gap-1"><Activity size={12}/> Active</span>
                </div>
              </div>
            </div>

            {/* COLUMN 3 */}
            <div className="flex flex-col gap-5">
              {/* Large Tech Card */}
              <div className="bg-black text-white rounded-[2.5rem] flex-1 p-6 relative overflow-hidden flex flex-col justify-between shadow-xl min-h-[180px] group border border-white/5 hover:border-[#ff5400]/40 transition-all duration-300">
                <div 
                  className="absolute inset-0 pointer-events-none opacity-20" 
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                    animation: "shimmer 3s infinite linear"
                  }}
                />
                <div className="flex justify-between items-start relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/15">
                    <Terminal size={18} className="text-[#ff5400]" />
                  </div>
                  <span className="text-[10px] font-black uppercase text-white/40 tracking-widest border border-white/10 rounded-full px-3 py-1 bg-white/5">
                    Production Build
                  </span>
                </div>

                <div className="mt-8 relative z-10">
                  <h2 className="text-4xl font-black m-0 leading-none text-white tracking-tighter font-display uppercase">NXT</h2>
                  <p className="text-sm font-medium m-0 mt-2 text-white/70">Next.js 15 App Router</p>
                </div>

                <div className="mt-6 flex justify-between items-center relative z-10 pt-4 border-t border-white/10">
                  <span className="text-xs font-semibold text-white/50">Core tech</span>
                  <div className="w-8 h-8 bg-[#ff5400] rounded-full flex items-center justify-center shadow-lg shadow-[#ff5400]/40">
                    <ArrowRight size={14} color="#fff" className="-rotate-45" />
                  </div>
                </div>
              </div>

              {/* Team */}
              <div className="bg-white/70 hover:bg-white border border-black/10 hover:border-[#ff5400]/40 rounded-[2rem] p-5 flex justify-between items-center backdrop-blur-md shadow-sm hover:shadow-[0_20px_45px_-12px_rgba(255,84,0,0.08)] hover:-translate-y-1 transition-all duration-300 ease-out">
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-bold text-black tracking-tight">Core Team</span>
                    <span className="text-xs font-medium text-black/40">(4)</span>
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm z-30">D</div>
                      <div className="w-8 h-8 rounded-full bg-[#ff5400] flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm z-20">E</div>
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm z-10">M</div>
                    </div>
                    <span className="text-xs font-medium text-black/50 ml-1">Assigned</span>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 4 */}
            <div className="flex flex-col gap-5">
              {/* Uptime Guarantee */}
              <div className="bg-white/70 hover:bg-white border border-black/10 hover:border-[#ff5400]/40 rounded-[2.5rem] p-6 flex-1 flex flex-col justify-between backdrop-blur-md shadow-sm hover:shadow-[0_20px_45px_-12px_rgba(255,84,0,0.08)] hover:-translate-y-1 transition-all duration-300 ease-out">
                <div>
                  <h3 className="text-sm font-semibold text-black/50 m-0 mb-2 tracking-tight">Uptime Guarantee</h3>
                  <h2 className="text-4xl font-black m-0 text-black tracking-tighter">99.99%</h2>
                </div>
                
                <div className="flex gap-6 my-4">
                  <div>
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center mb-2"><div className="w-2.5 h-2.5 bg-[#00FFA3] rounded-full"/></div>
                    <p className="text-xs font-medium text-black/50 m-0 mb-1">Servers</p>
                    <p className="text-sm font-bold m-0 text-black">Online</p>
                  </div>
                  <div>
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center mb-2"><div className="w-3 h-3 bg-[#8247E5] transform rotate-45"/></div>
                    <p className="text-xs font-medium text-black/50 m-0 mb-1">Database</p>
                    <p className="text-sm font-bold m-0 text-black">Healthy</p>
                  </div>
                </div>

                <div className="flex gap-1.5 h-10 items-end">
                   {Array.from({ length: 18 }).map((_, i) => (
                     <div 
                       key={i} 
                       className="flex-1 rounded-sm" 
                       style={{ 
                         background: i > 15 ? "rgba(0,0,0,0.1)" : "#ff5400", 
                         height: i > 15 ? `${20 + ((i * 13) % 30)}%` : `${60 + ((i * 17) % 40)}%` 
                       }} 
                     />
                   ))}
                </div>
              </div>

              {/* Status Toggle */}
              <div className="bg-black/5 border border-black/10 rounded-full p-1.5 flex backdrop-blur-md">
                <div className="flex-1 text-center bg-white rounded-full py-2 text-xs font-bold text-black shadow-sm">Production</div>
                <div className="flex-1 text-center py-2 text-xs font-bold text-black/50 cursor-pointer hover:text-black transition-colors">Staging</div>
              </div>
            </div>

            {/* COLUMN 5 */}
            <div className="flex flex-col gap-5">
              {/* News Card */}
              <div className="bg-black border border-white/5 rounded-[2rem] p-6 relative overflow-hidden shadow-2xl text-white min-h-[160px] group hover:border-[#ff5400]/40 transition-all duration-300">
                <div 
                  className="absolute inset-0 opacity-15 pointer-events-none" 
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                    animation: "shimmer 3s infinite linear"
                  }}
                />
                <div className="absolute top-0 right-0 bottom-0 w-[3px] bg-[#ff5400] shadow-[0_0_15px_3px_#ff5400]" />
                
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Latest Update</span>
                <h3 className="text-base font-bold mt-6 leading-relaxed">
                  Our team launches new framework boosting client site speeds by 40%
                </h3>
              </div>

              {/* Vercel Stats */}
              <div className="bg-white/70 hover:bg-white border border-black/10 hover:border-[#ff5400]/40 rounded-[2rem] p-6 flex-1 flex flex-col justify-between backdrop-blur-md shadow-sm hover:shadow-[0_20px_45px_-12px_rgba(255,84,0,0.08)] hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-black tracking-tight">Deployments</span>
                    <span className="text-xs font-medium bg-black/5 px-2 py-1 rounded-md text-black/50 flex items-center gap-1">7 days <ChevronDown size={10} /></span>
                  </div>
                  <h2 className="text-4xl font-bold m-0 mb-1 text-black tracking-tighter">142</h2>
                  <p className="text-xs font-medium text-black/50 m-0 max-w-[60%] leading-relaxed">Successful builds this week</p>
                </div>

                <div className="absolute -bottom-2 left-0 right-0 h-16">
                  <svg width="100%" height="100%" viewBox="0 0 200 80" preserveAspectRatio="none">
                    <path d="M 0 80 L 0 50 Q 30 30 60 55 T 120 40 T 170 25 T 200 15 L 200 80 Z" fill="rgba(255,84,0,0.1)" />
                    <path d="M 0 50 Q 30 30 60 55 T 120 40 T 170 25 T 200 15" fill="none" stroke="#ff5400" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>

          </div>

          {/* Responsive Mobile Layout */}
          <div className="flex flex-col gap-6 lg:hidden w-full px-4">
            <div className="bg-white/60 border border-black/10 rounded-3xl p-4 flex justify-between items-center">
              <div className="flex items-center gap-3 text-black/40 text-sm font-medium">
                <Search size={16} /> Search projects
              </div>
            </div>
            <div className="bg-black text-white rounded-[2rem] p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl min-h-[200px] border border-white/5">
              <h2 className="text-4xl font-black m-0 leading-none text-white tracking-tighter font-display uppercase">NXT</h2>
              <p className="text-sm font-semibold m-0 mt-2 text-white/70">Next.js 15 App Router</p>
            </div>
            <div className="bg-white/78 rounded-[2rem] p-6 flex flex-col justify-between border border-black/9">
              <h3 className="text-lg font-bold tracking-tight text-black">Build with confidence</h3>
              <p className="text-xs text-black/50 mt-2 leading-relaxed font-medium">Assured that your codebase is fully scalable.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
