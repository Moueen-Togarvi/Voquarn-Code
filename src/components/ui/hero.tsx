"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight, Asterisk, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { RocketCanvas } from "./rocket-canvas";

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





const SERVICES = ["Websites", "Brands", "Apps", "Systems", "SaaS Apps", "AI Agents", "AI Apps"];

const TIMELINE_DATA = [
  [{ num: "01", label: "UI UX DESIGN", sub: "User Interfaces", active: false }, { num: "02", label: "GRAPHIC DESIGNS", sub: "Visual Assets", active: true }],
  [{ num: "01", label: "CRM", sub: "Customer Relations", active: false }, { num: "02", label: "PMS", sub: "Property Management", active: true }],
  [{ num: "01", label: "AI APPS", sub: "Smart Automation", active: false }, { num: "02", label: "MOBILE APPS", sub: "iOS & Android", active: true }],
  [{ num: "01", label: "HOSPITAL MANAGEMENTS", sub: "Healthcare Systems", active: false }, { num: "02", label: "COMPANY MANAGEMENTS", sub: "Enterprise Systems", active: true }],
  [{ num: "01", label: "CLOUD SOLUTIONS", sub: "Scalable Platforms", active: false }, { num: "02", label: "WEB PORTALS", sub: "Interactive Dashboards", active: true }],
  [{ num: "01", label: "MACHINE LEARNING", sub: "Data Models", active: false }, { num: "02", label: "AI AGENTS", sub: "Autonomous Systems", active: true }],
  [{ num: "01", label: "AI INTEGRATION", sub: "Smart Features", active: false }, { num: "02", label: "AI APPS", sub: "Intelligent Apps", active: true }],
];

const Typewriter = ({ onIndexChange }: { onIndexChange?: (idx: number) => void }) => {
  const [text, setText] = useState("Websites");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);

  useEffect(() => {
    const i = loopNum % SERVICES.length;
    const fullText = SERVICES[i];

    onIndexChange?.(i);

    let typingSpeed = isDeleting ? 50 : 120;

    if (!isDeleting && text === fullText) {
      typingSpeed = 2000;
    } else if (isDeleting && text === "") {
      typingSpeed = 500;
    }

    const timer = setTimeout(() => {
      if (!isDeleting && text === fullText) {
        setIsDeleting(true);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      } else {
        setText(
          isDeleting
            ? fullText.substring(0, text.length - 1)
            : fullText.substring(0, text.length + 1)
        );
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, onIndexChange]);

  return (
    <span style={{ color: "#ff5400", display: "inline-flex", alignItems: "center", width: "6.2em", justifyContent: "flex-start", whiteSpace: "nowrap" }}>
      {text}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        style={{ fontWeight: 300, marginLeft: 2, transform: "translateY(-0.05em)" }}
      >
        |
      </motion.span>
    </span>
  );
};

/* ─── Agency Logo Image (Replacing Rocket) ──────────────────────── */
const RocketImg = () => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src="/final-logo.png"
    alt="Voquarn Agency Logo"
    style={{
      width: "380px",
      height: "auto",
      objectFit: "contain",
      filter: "drop-shadow(0 20px 40px rgba(255,84,0,0.35)) drop-shadow(0 4px 20px rgba(0,0,0,0.15))",
    }}
  />
);

/* ─── Rocket Launcher — entry from bottom, then hover in place ───── */
const RocketLauncher = () => {
  const [phase, setPhase] = useState<"entry" | "hover">("entry");

  useEffect(() => {
    // After entry animation completes (1.6s), switch to hover phase
    const t = setTimeout(() => setPhase("hover"), 1650);
    return () => clearTimeout(t);
  }, []);

  if (phase === "entry") {
    return (
      <div
        className="rocket-entry"
        style={{
          position: "absolute",
          top: "110%",
          left: "calc(50% + 5px)",
          transform: "translateX(-50%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        <RocketImg />
      </div>
    );
  }

  // hover phase — rocket stays at top: 0px and gently floats + shakes
  return (
    <div
      className="rocket-hover"
      style={{
        position: "absolute",
        top: 0,
        left: "calc(50% + 5px)",
        transform: "translateX(-50%)",
        zIndex: 1,
        pointerEvents: "none",
      }}
    >
      <RocketImg />
    </div>
  );
};

/* ─── component ─────────────────────────────────────────────────── */
export function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      style={{
        width: "100%",
        background: "#ffffff",
        minHeight: "105vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "140px 20px 40px 20px",
        boxSizing: "border-box",
        position: "relative",
        zIndex: 20,
        borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
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
          minHeight: "calc(105vh - 180px)",
          maxHeight: 1100,
        }}
      >
        {/* ════════════════════════════════════════
            COL 1 — slim black sidebar pill
        ════════════════════════════════════════ */}
        <motion.div
          initial={false}
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
            height: "93%",
            alignSelf: "center",
          }}
        >
          {/* Logo icon (Replacing X button) */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              overflow: "hidden",
              boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/final-logo.png"
              alt="Logo"
              style={{ width: "100%", height: "100%", objectFit: "contain", padding: "6px" }}
            />
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
          initial={false}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 20,
            height: "93%",
            alignSelf: "center",
            paddingLeft: 40,
          }}
        >
          {/* ── Info card ── */}
          <div
            style={{
              order: 1,
              background: "#fff",
              borderRadius: 24,
              padding: "16px",
              display: "flex",
              alignItems: "stretch",
              gap: 16,
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            }}
          >
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

            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, position: "relative" }}>
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

              {/* CTA */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Link
                  href="/services"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "#000",
                    color: "#fff",
                    borderRadius: 999,
                    padding: "7px 14px",
                    fontSize: 8,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    textDecoration: "none",
                    transform: "translateY(-4px)",
                  }}
                >
                  EXPLORE MORE
                  <ChevronRight size={10} />
                  <ChevronRight size={10} style={{ marginLeft: -6 }} />
                </Link>
              </div>
            </div>
          </div>

          {/* ── Numbered timeline ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0, paddingLeft: 8, position: "relative", minHeight: "85px" }}>
            {TIMELINE_DATA[activeIndex].map((step, i) => (
              <motion.div
                key={`${activeIndex}-${i}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.15, ease: "easeOut" }}
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
                    background: step.active ? "#ff5400" : "rgba(0,0,0,0.8)",
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
                      color: step.active ? "#000" : "rgba(0,0,0,0.8)",
                      margin: 0,
                    }}
                  >
                    {step.num} — {step.label}
                  </p>
                  <p
                    style={{
                      fontSize: 9,
                      fontWeight: 600,
                      color: step.active ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.6)",
                      margin: "3px 0 0 0",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {step.sub}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── Tags ── */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["ARTIFICIAL INTELLIGENCE", "UI/UX", "SEO", "WEB DESIGN", "MOBILE APPS"].map((tag) => (
              <span
                key={tag}
                style={{
                  border: "2px solid #ff5400",
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
          <div style={{ display: "flex", flexDirection: "column", gap: 16, order: -1 }}>
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
                <Typewriter onIndexChange={setActiveIndex} />
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
                    color: "#ff5400",
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
            COL 3 — right large transparent column
        ════════════════════════════════════════ */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Inject dynamic shake CSS keyframes */}
          <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes rocket-shake {
              0%   { transform: translate(calc(-50% + 0px), 0px) rotate(0deg); }
              20%  { transform: translate(calc(-50% - 0.5px), 0.5px) rotate(-0.15deg); }
              40%  { transform: translate(calc(-50% - 0.5px), -0.5px) rotate(0.15deg); }
              60%  { transform: translate(calc(-50% + 0.5px), 0.5px) rotate(0deg); }
              80%  { transform: translate(calc(-50% + 0.5px), -0.5px) rotate(0.15deg); }
              100% { transform: translate(calc(-50% + 0px), 0px) rotate(0deg); }
            }
            @keyframes rocket-entry {
              0%   { top: 110%; opacity: 0; }
              15%  { opacity: 1; }
              100% { top: 0px; opacity: 1; }
            }
            @keyframes rocket-float {
              0%   { margin-top: 0px; }
              50%  { margin-top: -10px; }
              100% { margin-top: 0px; }
            }
            .rocket-entry {
              animation: rocket-entry 1.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
            }
            .rocket-hover {
              /* No animation in hover phase, rocket stays perfectly still */
            }
          `}} />

          {/* Absolute Agency Logo in center stage */}
          <RocketLauncher />
        </div>
      </div>
    </section>
  );
}
