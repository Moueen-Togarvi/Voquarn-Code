"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight, Asterisk, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

/* ─── tiny helpers ──────────────────────────────────────────────── */
const OrangeDot = () => (
  <span
    style={{
      display: "inline-block",
      width: 10,
      height: 10,
      borderRadius: "50%",
      background: "#ff5400",
      marginRight: 6,
      flexShrink: 0,
    }}
  />
);

/* ─── component ─────────────────────────────────────────────────── */
export function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section
      style={{
        width: "100%",
        background: "#e8e8e8",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      {/* ── outer wrapper ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "64px 1fr 1.75fr",
          gap: 16,
          width: "100%",
          maxWidth: 1480,
          height: "calc(100vh - 40px)",
          maxHeight: 860,
        }}
      >
        {/* ════════════════════════════════════════
            COL 1 — slim black sidebar pill
        ════════════════════════════════════════ */}
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          style={{
            background: "#111",
            borderRadius: 999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "22px 0",
            color: "#fff",
          }}
        >
          {/* X button */}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={16} color="#fff" />
          </div>

          {/* vertical label */}
          <p
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              fontSize: 8,
              fontWeight: 900,
              letterSpacing: "0.55em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
              margin: 0,
              whiteSpace: "nowrap",
            }}
          >
            VOQUARN CODE
          </p>

          {/* avatar */}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "2px solid #ff5400",
              overflow: "hidden",
            }}
          >
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Voquarn"
              alt="avatar"
              style={{ width: "100%", height: "100%", filter: "grayscale(1)" }}
            />
          </div>
        </motion.div>

        {/* ════════════════════════════════════════
            COL 2 — left content column
        ════════════════════════════════════════ */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 20,
          }}
        >
          {/* ── Info card (top) ── */}
          <div
            style={{
              background: "#fff",
              borderRadius: 24,
              padding: "18px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              {/* thumbnail */}
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 14,
                  overflow: "hidden",
                  flexShrink: 0,
                  background: "#111",
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&q=80"
                  alt="work preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(0.4)" }}
                />
              </div>
              {/* copy */}
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "rgba(0,0,0,0.55)",
                  lineHeight: 1.55,
                  margin: 0,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                This is the latest technology that allows you to make websites using artificial intelligence.
              </p>
            </div>

            {/* CTA */}
            <Link
              href="/services"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#000",
                color: "#fff",
                borderRadius: 999,
                padding: "9px 18px",
                fontSize: 9,
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                textDecoration: "none",
                alignSelf: "flex-start",
              }}
            >
              EXPLORE MORE
              <ChevronRight size={12} />
              <ChevronRight size={12} style={{ marginLeft: -8 }} />
            </Link>
          </div>

          {/* ── Numbered timeline ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0, paddingLeft: 8 }}>
            {[
              { num: "06", label: "LAUNCH", sub: "Release the project", active: false },
              { num: "05", label: "BETA TEST", sub: "Test and fix", active: true },
            ].map((step, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                  position: "relative",
                  paddingBottom: i === 0 ? 28 : 0,
                }}
              >
                {/* connecting line */}
                {i === 0 && (
                  <div
                    style={{
                      position: "absolute",
                      left: 5,
                      top: 20,
                      bottom: 0,
                      width: 1,
                      background: "rgba(0,0,0,0.15)",
                    }}
                  />
                )}
                {/* dot */}
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: step.active ? "#ff5400" : "rgba(0,0,0,0.2)",
                    flexShrink: 0,
                    marginTop: 4,
                    boxShadow: step.active ? "0 0 14px rgba(255,84,0,0.55)" : "none",
                  }}
                />
                <div>
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: 900,
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      color: step.active ? "#000" : "rgba(0,0,0,0.3)",
                      margin: 0,
                    }}
                  >
                    {step.num} — {step.label}
                  </p>
                  <p
                    style={{
                      fontSize: 9,
                      fontWeight: 600,
                      color: step.active ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.18)",
                      margin: "3px 0 0 0",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {step.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Tags ── */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["ARTIFICIAL INTELLIGENCE", "UI/UX", "SEO", "WEB DESIGN", "MOBILE APPS"].map((tag) => (
              <span
                key={tag}
                style={{
                  border: "2px solid rgba(0,0,0,0.75)",
                  borderRadius: 999,
                  padding: "6px 14px",
                  fontSize: 8,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#000",
                  background: "transparent",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* ── Big headline + tagline ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* small tagline above */}
            <p
              style={{
                fontSize: 9,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "rgba(0,0,0,0.4)",
                lineHeight: 1.6,
                margin: 0,
                maxWidth: 220,
              }}
            >
              TECHNOLOGIES THAT WILL ALLOW US TO BUILD THE IMPOSSIBLE FOR YOUR BUSINESS.
            </p>

            {/* headline */}
            <h1
              style={{
                fontSize: "clamp(36px, 4.5vw, 72px)",
                fontWeight: 900,
                lineHeight: 0.9,
                letterSpacing: "-0.04em",
                textTransform: "uppercase",
                color: "#000",
                margin: 0,
              }}
            >
              We Build
              <br />
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: "#000",
                }}
              >
                Websites
                {/* filled circle */}
                <span
                  style={{
                    display: "inline-block",
                    width: "0.55em",
                    height: "0.55em",
                    borderRadius: "50%",
                    background: "#000",
                    flexShrink: 0,
                  }}
                />
                {/* asterisk */}
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  style={{
                    display: "inline-block",
                    fontSize: "0.7em",
                    fontWeight: 900,
                    color: "#000",
                    lineHeight: 1,
                  }}
                >
                  ✳
                </motion.span>
              </span>
            </h1>
          </div>
        </motion.div>

        {/* ════════════════════════════════════════
            COL 3 — right large image card
        ════════════════════════════════════════ */}
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.65, ease: "easeOut", delay: 0.15 }}
          style={{
            borderRadius: "3rem",
            overflow: "hidden",
            position: "relative",
            background: "#111",
          }}
        >
          {/* background image */}
          <img
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=85"
            alt="hero visual"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              filter: "grayscale(0.25) brightness(0.55)",
            }}
          />

          {/* dark gradient overlay — stronger at top & bottom */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.75) 100%)",
            }}
          />

          {/* ── content layer ── */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "32px 36px",
            }}
          >
            {/* TOP ROW */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              {/* large brand mark */}
              <motion.p
                animate={{ opacity: [0.55, 0.85, 0.55] }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{
                  fontSize: "clamp(60px, 9vw, 140px)",
                  fontWeight: 900,
                  color: "#fff",
                  margin: 0,
                  lineHeight: 0.8,
                  letterSpacing: "-0.06em",
                  textTransform: "uppercase",
                  userSelect: "none",
                }}
              >
                VC
              </motion.p>

              {/* MENU button */}
              <motion.button
                whileHover={{ scale: 1.08, background: "#ff5400" }}
                onClick={() => setMenuOpen((v) => !v)}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  backdropFilter: "blur(8px)",
                  color: "#fff",
                  fontSize: 9,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  cursor: "pointer",
                  transition: "background 0.2s ease",
                  flexShrink: 0,
                }}
              >
                MENU
              </motion.button>
            </div>

            {/* BOTTOM: big headline overlay + controls */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Big bold headline like reference "Futuristic technologies" */}
              <h2
                style={{
                  fontSize: "clamp(42px, 5.5vw, 88px)",
                  fontWeight: 900,
                  lineHeight: 0.88,
                  letterSpacing: "-0.04em",
                  textTransform: "uppercase",
                  color: "#fff",
                  margin: 0,
                  textShadow: "0 4px 32px rgba(0,0,0,0.5)",
                }}
              >
                We Build
                <br />
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.2em" }}>
                  Websites
                  <span
                    style={{
                      display: "inline-block",
                      width: "0.35em",
                      height: "0.35em",
                      borderRadius: "50%",
                      background: "#fff",
                      flexShrink: 0,
                      marginLeft: "0.15em",
                    }}
                  />
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    style={{
                      display: "inline-block",
                      fontSize: "0.6em",
                      fontWeight: 900,
                      color: "#ff5400",
                      lineHeight: 1,
                      marginLeft: "0.1em",
                    }}
                  >
                    ✳
                  </motion.span>
                </span>
              </h2>

              {/* Bottom control bar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                {/* animated bars + rights */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
                    {[22, 35, 18, 40, 28, 15, 32].map((h, i) => (
                      <motion.div
                        key={i}
                        animate={{ scaleY: [1, 1.6, 1] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                        style={{
                          width: 4,
                          height: h * 0.6,
                          background: i === 0 || i === 3 ? "#ff5400" : "rgba(255,255,255,0.35)",
                          borderRadius: 2,
                          transformOrigin: "bottom",
                        }}
                      />
                    ))}
                  </div>
                  <p
                    style={{
                      fontSize: 8,
                      fontWeight: 900,
                      textTransform: "uppercase",
                      letterSpacing: "0.25em",
                      color: "rgba(255,255,255,0.4)",
                      margin: 0,
                    }}
                  >
                    ALL RIGHTS RESERVED
                  </p>
                </div>

                {/* expand arrow */}
                <motion.div
                  whileHover={{ scale: 1.1, background: "#ff5400" }}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.22)",
                    backdropFilter: "blur(8px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "background 0.2s ease",
                  }}
                >
                  <ArrowUpRight size={18} color="#fff" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
