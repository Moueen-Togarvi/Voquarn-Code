"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight, Asterisk, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

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

const bgImages = [
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&q=85",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&q=85",
  "https://images.unsplash.com/photo-1542744094-24638ea0b56c?w=1600&q=85",
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1600&q=85",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=85",
];

const BackgroundSlideshow = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % bgImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <AnimatePresence>
        <motion.img
          key={index}
          src={bgImages[index]}
          initial={{ opacity: 0, x: 60, scale: 1.05 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -60, scale: 0.95 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            filter: "grayscale(0.15) brightness(0.65)",
          }}
        />
      </AnimatePresence>
    </div>
  );
};

const SERVICES = ["Websites", "Brands", "Apps", "Systems", "SaaS Apps"];

const TIMELINE_DATA = [
  [{ num: "01", label: "UI UX DESIGN", sub: "User Interfaces", active: false }, { num: "02", label: "GRAPHIC DESIGNS", sub: "Visual Assets", active: true }],
  [{ num: "01", label: "CRM", sub: "Customer Relations", active: false }, { num: "02", label: "PMS", sub: "Property Management", active: true }],
  [{ num: "01", label: "AI APPS", sub: "Smart Automation", active: false }, { num: "02", label: "MOBILE APPS", sub: "iOS & Android", active: true }],
  [{ num: "01", label: "HOSPITAL MANAGEMENTS", sub: "Healthcare Systems", active: false }, { num: "02", label: "COMPANY MANAGEMENTS", sub: "Enterprise Systems", active: true }],
  [{ num: "01", label: "CLOUD SOLUTIONS", sub: "Scalable Platforms", active: false }, { num: "02", label: "WEB PORTALS", sub: "Interactive Dashboards", active: true }],
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

/* ─── component ─────────────────────────────────────────────────── */
export function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      style={{
        width: "100%",
        background: "#e8e8e8",
        minHeight: "92vh",
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
          height: "calc(92vh - 40px)",
          maxHeight: 800,
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
        <div
          style={{
            position: "relative",
            width: "95%",
            height: "93%",
            justifySelf: "center",
            alignSelf: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 18,
            borderRadius: "3.5rem",
            background: "linear-gradient(145deg, rgba(255,255,255,0.88), rgba(255,255,255,0.42))",
            border: "1px solid rgba(255,255,255,0.55)",
            boxShadow: "0 30px 70px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.7)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(17,17,17,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(17,17,17,0.08) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
              opacity: 0.55,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 14,
              borderRadius: "3rem",
              border: "1px solid rgba(255,255,255,0.45)",
              pointerEvents: "none",
            }}
          />
          <motion.div
            initial={false}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.15 }}
            style={{
              borderRadius: "3rem",
              overflow: "hidden",
              position: "relative",
              background: "#111",
              width: "100%",
              height: "100%",
              boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
            }}
          >
            {/* background image slideshow */}
            <BackgroundSlideshow />

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
                    fontSize: "clamp(21px, 2.75vw, 44px)",
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
                    <Typewriter />
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
      </div>
    </section>
  );
}
