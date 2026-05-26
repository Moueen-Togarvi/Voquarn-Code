"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
const SERVICES = ["Websites", "Brands", "Apps", "Systems", "SaaS Apps", "AI Agents", "AI Apps"];


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
    className="hero-rocket-img"
    style={{
      height: "auto",
      objectFit: "contain",
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
  return (
    <section className="hero-section">
      {/* ── outer wrapper ── */}
      <div className="hero-container">
        {/* ════════════════════════════════════════
            COL 1 — slim black sidebar pill
        ════════════════════════════════════════ */}
        <motion.div
          initial={false}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="hero-col1"
        >
          {/* Logo icon (Replacing X button) with floating & light radiating animation */}
          <motion.div
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              position: "relative",
            }}
          >
            {/* Glowing background light radiating/emitting outward */}
            <motion.div
              animate={{
                scale: [1, 1.35, 1],
                opacity: [0.4, 0.85, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255, 84, 0, 0.9) 0%, rgba(255, 84, 0, 0) 70%)",
                filter: "blur(6px)",
                zIndex: 0,
                pointerEvents: "none",
              }}
            />

            {/* Pulsing glow outline */}
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 10px rgba(255, 84, 0, 0.25)",
                  "0 0 20px rgba(255, 84, 0, 0.65)",
                  "0 0 10px rgba(255, 84, 0, 0.25)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                position: "absolute",
                inset: -2,
                borderRadius: "50%",
                border: "2px solid #ff5400",
                pointerEvents: "none",
                zIndex: 1,
              }}
            />

            {/* Inner container to clip the image within the rounded circle */}
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#ffffff",
                position: "relative",
                zIndex: 2,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/image-removebg-preview-2.png"
                alt="Logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  padding: "6px",
                  filter: "drop-shadow(0 2px 8px rgba(255,84,0,0.4))",
                }}
              />
            </div>
          </motion.div>

          {/* vertical label */}
          <p className="hero-label">
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero-avatar.jpeg"
              alt="Profile avatar"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 38%" }}
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
          className="hero-col2"
        >
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
                <Typewriter />
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

            {/* ── Bold Promise ── */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="hero-promise"
            >
              <span className="hero-promise-mark" />
              <p className="hero-promise-text">
                From idea to launch, without the messy middle.
              </p>
            </motion.div>

            {/* ── CTA Buttons ── */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              style={{ display: 'flex', gap: '16px', marginTop: '34px', flexWrap: 'wrap' }}
            >
              <Link
                href="/contact"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#ff5400',
                  color: '#fff',
                  padding: '14px 28px',
                  borderRadius: '999px',
                  fontWeight: 900,
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  textDecoration: 'none',
                  boxShadow: '0 8px 24px rgba(255, 84, 0, 0.3)',
                  transition: 'all 0.3s ease',
                }}
                className="hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(255,84,0,0.4)]"
              >
                Start a Project <ArrowRight size={16} />
              </Link>
              <Link
                href="/services"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#fff',
                  color: '#000',
                  padding: '14px 28px',
                  borderRadius: '999px',
                  fontWeight: 900,
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  textDecoration: 'none',
                  border: '2px solid #e5e5e5',
                  transition: 'all 0.3s ease',
                }}
                className="hover:border-black hover:bg-neutral-50"
              >
                Our Services
              </Link>
            </motion.div>

          </div>
        </motion.div>

        {/* ════════════════════════════════════════
            COL 3 — right large responsive column
        ════════════════════════════════════════ */}
        <div className="hero-col3">
          {/* Inject dynamic shake CSS keyframes & responsive styling */}
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

            /* Responsive Hero Layout */
            .hero-section {
              width: 100%;
              background: #ffffff;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 100px 16px 40px 16px;
              box-sizing: border-box;
              position: relative;
              z-index: 20;
              border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            }
            @media (min-width: 1024px) {
              .hero-section {
                min-height: 105vh;
                padding: 140px 20px 40px 20px;
              }
            }

            .hero-container {
              display: grid;
              grid-template-columns: 1fr;
              gap: 40px;
              width: 100%;
              max-width: 1480px;
              box-sizing: border-box;
            }
            @media (min-width: 1024px) {
              .hero-container {
                grid-template-columns: 64px 1fr 1.2fr;
                gap: 16px;
                min-height: calc(105vh - 180px);
                max-height: 1100px;
              }
            }
            @media (min-width: 1280px) {
              .hero-container {
                grid-template-columns: 64px 1fr 1.75fr;
              }
            }

            /* Col 1 Responsive Styling */
            .hero-col1 {
              background: #111;
              border-radius: 24px;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
              padding: 12px 24px;
              color: #fff;
              width: 100%;
              align-self: center;
              box-sizing: border-box;
              order: 3;
            }
            @media (min-width: 1024px) {
              .hero-col1 {
                border-radius: 999px;
                flex-direction: column;
                padding: 22px 0;
                height: 93%;
                width: 100%;
                order: 0;
              }
            }

            /* Label styling inside Col 1 */
            .hero-label {
              writing-mode: horizontal-tb;
              transform: none;
              font-size: 10px;
              font-weight: 900;
              letter-spacing: 0.3em;
              text-transform: uppercase;
              color: rgba(255,255,255,0.7);
              margin: 0;
              white-space: nowrap;
            }
            @media (min-width: 1024px) {
              .hero-label {
                writing-mode: vertical-rl;
                transform: rotate(180deg);
                font-size: 8px;
                color: rgba(255,255,255,0.35);
                letter-spacing: 0.55em;
              }
            }

            .hero-promise {
              display: flex;
              flex-direction: column;
              gap: 16px;
              margin-top: 48px;
              max-width: 510px;
            }
            .hero-promise-mark {
              width: 64px;
              height: 4px;
              border-radius: 999px;
              background: #ff5400;
              box-shadow: 0 12px 28px rgba(255, 84, 0, 0.3);
            }
            .hero-promise-text {
              margin: 0;
              color: #050505;
              font-size: 30px;
              font-weight: 900;
              line-height: 1.08;
              letter-spacing: 0;
              max-width: 500px;
            }
            @media (max-width: 640px) {
              .hero-promise {
                margin-top: 36px;
              }
              .hero-promise-text {
                font-size: 24px;
              }
            }

            /* Col 2 Responsive Styling */
            .hero-col2 {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              gap: 32px;
              width: 100%;
              align-self: center;
              padding-left: 0;
              box-sizing: border-box;
              order: 1;
            }
            @media (min-width: 1024px) {
              .hero-col2 {
                height: 93%;
                padding-left: 40px;
                gap: 20px;
                order: 0;
              }
            }



            /* Info Card Responsive Styling */
            .hero-infocard {
              order: 1;
              background: #fff;
              border-radius: 24px;
              padding: 16px;
              display: flex;
              flex-direction: column;
              gap: 16px;
              box-shadow: 0 2px 12px rgba(0,0,0,0.08);
            }
            @media (min-width: 480px) {
              .hero-infocard {
                flex-direction: row;
                align-items: stretch;
              }
            }

            /* Col 3 Responsive Styling */
            .hero-col3 {
              position: relative;
              width: 100%;
              min-height: 280px;
              display: flex;
              align-items: center;
              justify-content: center;
              box-sizing: border-box;
              order: 2;
            }
            @media (min-width: 1024px) {
              .hero-col3 {
                height: 100%;
                min-height: auto;
                order: 0;
              }
            }

            .hero-rocket-img {
              width: 100%;
              max-width: 260px;
              filter: drop-shadow(0 20px 40px rgba(255,84,0,0.35)) drop-shadow(0 4px 20px rgba(0,0,0,0.15));
            }
            @media (min-width: 480px) {
              .hero-rocket-img {
                max-width: 320px;
              }
            }
            @media (min-width: 1024px) {
              .hero-rocket-img {
                max-width: 380px;
              }
            }
          `}} />

          {/* Absolute Agency Logo in center stage */}
          <RocketLauncher />
        </div>
      </div>
    </section>
  );
}
