"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, ChevronDown, Plus, Wallet, ArrowRightLeft, TrendingUp, MoreHorizontal, ArrowRight } from "lucide-react";

export function CryptoDashboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Canvas animation for grid and light beams
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    let animationFrameId: number;
    let offset = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Light beams
      ctx.save();
      const gradientL = ctx.createRadialGradient(0, height * 0.35, 0, 0, height * 0.35, width * 0.5);
      gradientL.addColorStop(0, "rgba(255, 84, 0, 0.15)");
      gradientL.addColorStop(1, "rgba(255, 84, 0, 0)");
      ctx.fillStyle = gradientL;
      ctx.fillRect(0, 0, width, height);

      const gradientR = ctx.createRadialGradient(width, height * 0.35, 0, width, height * 0.35, width * 0.5);
      gradientR.addColorStop(0, "rgba(255, 84, 0, 0.15)");
      gradientR.addColorStop(1, "rgba(255, 84, 0, 0)");
      ctx.fillStyle = gradientR;
      ctx.fillRect(0, 0, width, height);

      // Swooping glowing curves
      ctx.beginPath();
      ctx.moveTo(0, height * 0.25);
      ctx.quadraticCurveTo(width * 0.5, height * 0.45, width, height * 0.2);
      ctx.strokeStyle = "rgba(255, 84, 0, 0.3)";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, height * 0.28);
      ctx.quadraticCurveTo(width * 0.5, height * 0.48, width, height * 0.22);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Perspective Grid
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 1;
      
      const horizonY = height * 0.5;
      const vpX = width / 2;
      const vpY = horizonY - 150;

      // Vertical lines
      for (let i = -30; i <= 30; i++) {
        const x = width / 2 + i * 60;
        ctx.moveTo(vpX, vpY);
        ctx.lineTo(x, height);
      }

      // Horizontal lines moving towards viewer
      offset = (offset + 0.3) % 20;
      for (let i = 0; i < 40; i++) {
        // fake perspective by making gap increase exponentially
        const perspectiveY = horizonY + Math.pow(i + offset/20, 1.6) * 3;
        if(perspectiveY < height) {
           ctx.moveTo(0, perspectiveY);
           ctx.lineTo(width, perspectiveY);
        }
      }
      ctx.stroke();
      ctx.restore();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section style={{ padding: "12px 24px", background: "#fff", display: "flex", justifyContent: "center" }}>
      {/* Main Container */}
      <div
        style={{
          background: "#080808",
          borderRadius: 48,
          overflow: "hidden",
          position: "relative",
          width: "100%",
          maxWidth: 1600,
          minHeight: 1000,
          color: "#fff",
          fontFamily: "system-ui, -apple-system, sans-serif",
          boxShadow: "0 40px 100px rgba(0,0,0,0.2)",
        }}
      >
        {/* Canvas Background */}
        <canvas
          ref={canvasRef}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}
        />

        {/* Content Layer */}
        <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", height: "100%" }}>
          
          {/* Header */}
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "32px 48px" }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, height: 28, background: "#ff5400", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 14, height: 14, border: "2px solid #fff", borderRadius: 4, borderTopColor: "transparent", transform: "rotate(45deg)" }} />
              </div>
              <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>Voquarn</span>
            </div>

            {/* Nav */}
            <nav style={{ display: "flex", gap: 32, fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>
              <a href="#" style={{ color: "#fff" }}>Solutions</a>
              <a href="#">How it works</a>
              <a href="#">About</a>
              <a href="#">Blog</a>
              <a href="#">Docs</a>
            </nav>

            {/* CTA */}
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <a href="#" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 500 }}>
                <span style={{ width: 16, height: 16, background: "rgba(255,255,255,0.2)", borderRadius: "50%", display: "inline-block" }} /> Join our Discord
              </a>
              <button style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "8px 20px", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer" }}>
                Get Started
              </button>
            </div>
          </header>

          {/* Hero Section */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 80, textAlign: "center" }}>
            {/* Pill */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 999, padding: "6px 16px", fontSize: 12, marginBottom: 32 }}>
              <span style={{ color: "#fff", fontWeight: 600 }}>What's new?</span>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>Explore Features →</span>
            </div>

            {/* Headline */}
            <h1 style={{ fontSize: "clamp(48px, 6vw, 76px)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.1, margin: 0, maxWidth: 800 }}>
              Discover the <br />
              transformative power of <br />
              <span style={{ color: "#ff5400" }}>cryptocurrencies</span>
            </h1>

            <p style={{ marginTop: 24, fontSize: 15, color: "rgba(255,255,255,0.5)", maxWidth: 500, lineHeight: 1.6 }}>
              From Bitcoin to emerging altcoins, learn about the benefits, security features, and the potential for high returns that digital currencies offer.
            </p>

            <div style={{ display: "flex", gap: 16, marginTop: 40 }}>
              <button style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "14px 32px", fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer" }}>
                Learn More
              </button>
              <button style={{ background: "#ff5400", border: "none", borderRadius: 999, padding: "14px 32px", fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer", boxShadow: "0 10px 30px rgba(255,84,0,0.3)" }}>
                Get Started
              </button>
            </div>
          </div>

          {/* Bento Grid */}
          <div style={{ padding: "0 64px 64px 64px", marginTop: 100 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.3fr 1.1fr 1.1fr", gap: 20 }}>
              
              {/* COLUMN 1 */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Search */}
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 24, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
                    <Search size={16} /> Search assets
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 6, padding: "4px 8px", fontSize: 10, color: "rgba(255,255,255,0.3)" }}>/</div>
                </div>

                {/* Trade with confidence */}
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 32, padding: 24, flex: 1, position: "relative", overflow: "hidden" }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 8px 0" }}>Trade with confidence</h3>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0, maxWidth: "80%" }}>Assured that you maintain full authority</p>
                  
                  {/* Decorative nodes */}
                  <div style={{ position: "absolute", bottom: -20, right: -20, width: 200, height: 180 }}>
                    <svg width="100%" height="100%" viewBox="0 0 200 180" style={{ opacity: 0.3 }}>
                      <path d="M100 180 L100 100 Q100 80 120 80 L180 80" stroke="rgba(255,255,255,0.5)" strokeWidth="1" fill="none" />
                      <path d="M60 180 L60 120 Q60 100 40 100 L0 100" stroke="rgba(255,255,255,0.5)" strokeWidth="1" fill="none" />
                    </svg>
                    <div style={{ position: "absolute", top: 60, left: 90, width: 36, height: 36, background: "#ff5400", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 14 }}>B</div>
                    <div style={{ position: "absolute", top: 86, left: 20, width: 24, height: 24, background: "#1a1a1a", border: "1px solid #333", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 8, height: 8, background: "#fff", transform: "rotate(45deg)" }} />
                    </div>
                    <div style={{ position: "absolute", top: 120, left: 140, width: 20, height: 20, background: "#1a1a1a", border: "1px solid #333", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 6, height: 6, background: "rgba(255,255,255,0.5)", borderRadius: "50%" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* COLUMN 2 */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Fear and Greed */}
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 32, padding: 24, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <h3 style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.6)", margin: "0 0 16px 0" }}>Fear and Greed index</h3>
                  <div style={{ background: "rgba(255, 84, 0, 0.15)", color: "#ff5400", padding: "6px 16px", borderRadius: 999, fontSize: 12, fontWeight: 600, marginBottom: 24 }}>
                    Greed: 67
                  </div>
                  {/* Gauge Chart (SVG) */}
                  <div style={{ width: 140, height: 70, position: "relative" }}>
                    <svg width="140" height="70" viewBox="0 0 140 70">
                      <path d="M 10 70 A 60 60 0 0 1 130 70" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" strokeLinecap="round" />
                      <path d="M 10 70 A 60 60 0 0 1 110 20" fill="none" stroke="#ff5400" strokeWidth="12" strokeLinecap="round" />
                      {/* Needle */}
                      <path d="M 70 65 L 105 25" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="70" cy="65" r="4" fill="#fff" />
                      {/* Tick marks */}
                      <path d="M 20 50 L 30 55 M 35 30 L 40 38 M 70 10 L 70 20 M 105 30 L 100 38 M 120 50 L 110 55" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                    </svg>
                  </div>
                </div>

                {/* Quick Swap */}
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 32, padding: 24, position: "relative" }}>
                  <h3 style={{ fontSize: 13, fontWeight: 500, margin: "0 0 20px 0" }}>Quick Swap</h3>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Send</span>
                    <span style={{ fontSize: 11, color: "#fff", display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#627EEA" }}/> ETH <ChevronDown size={10} /></span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
                    <span style={{ fontSize: 20, fontWeight: 600 }}>1,560</span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>$5,233.45</span>
                  </div>

                  {/* Swap Button */}
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 32, height: 32, background: "#ff5400", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "4px solid #111" }}>
                    <ArrowRightLeft size={12} color="#fff" style={{ transform: "rotate(90deg)" }} />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, marginTop: 12 }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Receive</span>
                    <span style={{ fontSize: 11, color: "#fff", display: "flex", alignItems: "center", gap: 4 }}><X /> XRP <ChevronDown size={10} /></span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: 20, fontWeight: 600 }}>10,844.52</span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>$5,161.88</span>
                  </div>
                </div>
              </div>

              {/* COLUMN 3 */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Large BTC Card */}
                <div style={{ background: "linear-gradient(145deg, #ff7a00, #ff4000)", borderRadius: 32, flex: 1, padding: 24, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                  <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=85" alt="Person" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "overlay", opacity: 0.8 }} />
                  <div style={{ position: "relative", zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div>
                      <h2 style={{ fontSize: 40, fontWeight: 800, margin: 0, lineHeight: 1 }}>BTC</h2>
                      <p style={{ fontSize: 13, margin: "8px 0 0 0", color: "rgba(255,255,255,0.8)" }}>Bitcoin</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ width: 24, height: 24, background: "#fff", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                        <ArrowRight size={14} color="#ff5400" transform="rotate(-45)" />
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>$17,130.70</p>
                    </div>
                  </div>
                </div>

                {/* Accounts */}
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 32, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>Accounts</span>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>(2)</span>
                      <div style={{ width: 20, height: 20, border: "1px dashed rgba(255,255,255,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}><Plus size={10} color="rgba(255,255,255,0.4)" /></div>
                    </div>
                    <div style={{ display: "flex", gap: 24 }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <img src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&q=80" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Trading</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,84,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#ff5400", fontSize: 14, fontWeight: 800 }}>B</span></div>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Demo</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* COLUMN 4 */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Current Balance */}
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 32, padding: 24, flex: 1, display: "flex", flexDirection: "column" }}>
                  <h3 style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.5)", margin: "0 0 8px 0" }}>Current Balance</h3>
                  <h2 style={{ fontSize: 32, fontWeight: 600, margin: "0 0 24px 0" }}>$44,578.12</h2>
                  
                  <div style={{ display: "flex", gap: 32, marginBottom: 24 }}>
                    <div>
                      <div style={{ width: 24, height: 24, background: "#111", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}><div style={{ width: 10, height: 10, background: "#00FFA3", borderRadius: "50%" }}/></div>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", margin: "0 0 4px 0" }}>Solana</p>
                      <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>$25,855.31</p>
                    </div>
                    <div>
                      <div style={{ width: 24, height: 24, background: "#111", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}><div style={{ width: 12, height: 12, background: "#8247E5", transform: "rotate(45deg)" }}/></div>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", margin: "0 0 4px 0" }}>Matic</p>
                      <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>$19,613.37</p>
                    </div>
                  </div>

                  {/* Bar Charts */}
                  <div style={{ display: "flex", gap: 4, height: 40, alignItems: "flex-end", marginBottom: 12 }}>
                     {Array.from({ length: 30 }).map((_, i) => (
                       <div key={i} style={{ flex: 1, background: i < 18 ? "#ff5400" : "rgba(255,255,255,0.1)", height: i < 18 ? `${40 + Math.random()*60}%` : `${20 + Math.random()*30}%`, borderRadius: 2 }} />
                     ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: "auto" }}>
                    <span>Solana 58%</span>
                    <span>Matic 42%</span>
                  </div>

                  <button style={{ width: "100%", background: "#ff5400", border: "none", borderRadius: 16, padding: "14px 0", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer", marginTop: 24 }}>
                    Deposit
                  </button>
                </div>

                {/* Wallet / Pools Toggle */}
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 999, padding: 8, display: "flex" }}>
                  <div style={{ flex: 1, textAlign: "center", background: "#1a1a1a", borderRadius: 999, padding: "12px 0", fontSize: 13, fontWeight: 500 }}>Wallet</div>
                  <div style={{ flex: 1, textAlign: "center", padding: "12px 0", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.4)" }}>Pools</div>
                </div>
              </div>

              {/* COLUMN 5 */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Ethereum surges */}
                <div style={{ background: "linear-gradient(to right, rgba(0,0,0,0.8), rgba(255,84,0,0.2))", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 32, padding: 24, position: "relative", overflow: "hidden" }}>
                  {/* Glowing streaks */}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent, #ff5400, transparent)", opacity: 0.1, transform: "skewX(-20deg)" }} />
                  <div style={{ position: "absolute", top: 0, right: 20, bottom: 0, width: 4, background: "#ff5400", boxShadow: "0 0 20px #ff5400" }} />
                  
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>July 15, 2024</span>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, lineHeight: 1.4 }}>
                    Ethereum surges <br/> to new all-time high <br/> amidst growing <br/> institutional interest
                  </h3>
                </div>

                {/* Ethereum 47k */}
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 32, padding: 24, flex: 1, position: "relative", overflow: "hidden" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <span style={{ fontSize: 13, color: "#ff5400", fontWeight: 500 }}>Ethereum</span>
                    <span style={{ fontSize: 11, background: "rgba(255,255,255,0.05)", padding: "4px 8px", borderRadius: 6, color: "rgba(255,255,255,0.5)" }}>7 days <ChevronDown size={10} style={{ display: "inline" }}/></span>
                  </div>
                  <h2 style={{ fontSize: 36, fontWeight: 600, margin: "0 0 4px 0" }}>47k</h2>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0, maxWidth: "60%" }}>Ethereum's active nodes</p>

                  {/* Line Chart */}
                  <div style={{ position: "absolute", bottom: -10, left: 0, right: 0, height: 80 }}>
                    <svg width="100%" height="100%" viewBox="0 0 200 80" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgba(255,84,0,0.3)" />
                          <stop offset="100%" stopColor="rgba(255,84,0,0)" />
                        </linearGradient>
                      </defs>
                      <path d="M 0 80 L 0 60 Q 20 40 40 50 T 80 40 T 120 60 T 160 30 T 200 10 L 200 80 Z" fill="url(#chartGrad)" />
                      <path d="M 0 60 Q 20 40 40 50 T 80 40 T 120 60 T 160 30 T 200 10" fill="none" stroke="#ff5400" strokeWidth="2" />
                      <circle cx="200" cy="10" r="4" fill="#fff" stroke="#ff5400" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// Quick helper for X icon in swap
function X() {
  return (
    <div style={{ width: 14, height: 14, background: "#111", borderRadius: "50%", border: "1px solid #333", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 6, height: 6, border: "1px solid #fff", borderRadius: 2, transform: "rotate(45deg)" }} />
    </div>
  )
}
