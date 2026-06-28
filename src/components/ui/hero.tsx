"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Play } from "lucide-react";

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
    <span className="hero-typewriter" style={{ color: "var(--primary)", display: "inline-flex", alignItems: "center", width: "6.2em", justifyContent: "flex-start", whiteSpace: "nowrap" }}>
      {text}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        style={{
          width: "0.06em",
          height: "1.05em",
          marginLeft: "0.08em",
          borderRadius: 999,
          background: "#ff9a66",
          transform: "translateY(0.02em)",
          flexShrink: 0,
        }}
      />
    </span>
  );
};

const RocketImg = () => (
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

const RocketLauncher = () => {
  const [phase, setPhase] = useState<"entry" | "hover">("entry");

  useEffect(() => {
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

export function Hero() {
  return (
    <section className="hero-section" style={{ background: "var(--background)", color: "var(--hero-text)" }}>
      <div className="hero-container">
        <motion.div
          initial={false}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="hero-col1"
          style={{ background: "var(--foreground)" }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "var(--background)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              position: "relative",
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0.85, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
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
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 10px rgba(255, 84, 0, 0.25)",
                  "0 0 20px rgba(255, 84, 0, 0.65)",
                  "0 0 10px rgba(255, 84, 0, 0.25)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "absolute",
                inset: -2,
                borderRadius: "50%",
                border: "2px solid #ff5400",
                pointerEvents: "none",
                zIndex: 1,
              }}
            />
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--background)",
                position: "relative",
                zIndex: 2,
              }}
            >
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

          <p className="hero-label" style={{ color: "var(--muted)" }}>
            VOQUARN CODE
          </p>

          <div className="hero-avatar-group">
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
                src="/hero-avatar.jpeg"
                alt="Gul Khan — CEO"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 38%" }}
              />
            </div>
            <span className="hero-avatar-label">Gul Khan — CEO</span>
          </div>
        </motion.div>

        <motion.div
          initial={false}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="hero-col2"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16, order: -1 }}>
            <p
              className="hero-eyebrow"
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "var(--muted)",
                lineHeight: 1.6,
                margin: 0,
                maxWidth: 280,
              }}
            >
              TECHNOLOGIES THAT WILL ALLOW US TO BUILD THE IMPOSSIBLE FOR YOUR BUSINESS.
            </p>

            <h1
              className="hero-headline"
              style={{
                fontSize: "clamp(36px, 4.5vw, 72px)",
                fontWeight: 900,
                lineHeight: 0.9,
                letterSpacing: "-0.04em",
                textTransform: "uppercase",
                color: "var(--hero-text)",
                margin: 0,
              }}
            >
              We Build
              <br />
              <span
                className="hero-headline-row"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: "var(--hero-text)",
                }}
              >
                <Typewriter />
                <span
                  className="hero-headline-dot"
                  style={{
                    display: "inline-block",
                    width: "0.55em",
                    height: "0.55em",
                    borderRadius: "50%",
                    background: "var(--hero-text)",
                    flexShrink: 0,
                  }}
                />
                <motion.span
                  className="hero-headline-star"
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

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="hero-promise"
            >
              <span className="hero-promise-mark" />
              <p className="hero-promise-text" style={{ color: "var(--foreground)" }}>
                From <span>idea</span> to <span>launch</span>, without the messy middle.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="hero-actions"
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
                className="hero-action-link hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(255,84,0,0.4)]"
              >
                Start a Project <ArrowRight size={16} />
              </Link>
              <Link
                href="/services"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  padding: '14px 28px',
                  borderRadius: '999px',
                  fontWeight: 900,
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  textDecoration: 'none',
                  border: '2px solid var(--border)',
                  transition: 'all 0.3s ease',
                }}
                className="hero-action-link hover:border-[var(--foreground)] hover:bg-[var(--surface)]"
              >
                <Play size={14} /> Watch Showreel
              </Link>
            </motion.div>

          </div>
        </motion.div>

        <div className="hero-col3">
          <style dangerouslySetInnerHTML={{
            __html: `
            .hero-section {
              width: 100%;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 100px 16px 40px 16px;
              box-sizing: border-box;
              position: relative;
              z-index: 20;
              border-bottom: 1px solid var(--section-border);
              background-image: radial-gradient(circle at 1px 1px, var(--section-border) 1px, transparent 0);
              background-size: 48px 48px;
            }
            @media (max-width: 640px) {
              .hero-section {
                padding-top: 128px;
                background-size: 32px 32px;
              }
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

            .hero-col1 {
              border-radius: 24px;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
              padding: 12px 24px;
              color: var(--background);
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

            .hero-label {
              writing-mode: horizontal-tb;
              transform: none;
              font-size: 10px;
              font-weight: 900;
              letter-spacing: 0.3em;
              text-transform: uppercase;
              margin: 0;
              white-space: nowrap;
            }
            @media (min-width: 1024px) {
              .hero-label {
                writing-mode: vertical-rl;
                transform: rotate(180deg);
                font-size: 8px;
                letter-spacing: 0.55em;
              }
            }

            .hero-avatar-group {
              display: flex;
              align-items: center;
              gap: 8px;
            }
            @media (max-width: 1023px) {
              .hero-avatar-group {
                flex-direction: row;
              }
            }
            @media (min-width: 1024px) {
              .hero-avatar-group {
                flex-direction: column;
                align-items: center;
              }
            }
            .hero-avatar-label {
              font-size: 8px;
              font-weight: 700;
              letter-spacing: 0.08em;
              text-transform: uppercase;
              color: var(--muted);
              white-space: nowrap;
            }
            @media (min-width: 1024px) {
              .hero-avatar-label {
                writing-mode: vertical-rl;
                transform: rotate(180deg);
              }
            }

            .hero-promise {
              display: flex;
              flex-direction: column;
              gap: 16px;
              margin-top: 48px;
              max-width: 510px;
              position: relative;
              padding: 22px 0 0;
              overflow: hidden;
            }
            .hero-promise-mark {
              width: 64px;
              height: 4px;
              border-radius: 999px;
              background: linear-gradient(90deg, #ff5400, var(--foreground), #ff5400);
              box-shadow: 0 12px 28px rgba(255, 84, 0, 0.34);
              transform-origin: left center;
              animation: promise-pulse 2.8s ease-in-out infinite;
            }
            .hero-promise-text {
              margin: 0;
              font-size: 32px;
              font-weight: 900;
              line-height: 1.08;
              letter-spacing: 0;
              max-width: 500px;
              position: relative;
              text-wrap: balance;
            }
            .hero-promise-text span {
              color: #ff5400;
              text-shadow: 0 10px 26px rgba(255, 84, 0, 0.22);
            }
            @media (max-width: 640px) {
              .hero-headline {
                font-size: 32px !important;
                text-align: center;
                margin-inline: auto !important;
              }
              .hero-headline-row {
                justify-content: center;
                align-items: center !important;
                gap: 8px !important;
                line-height: 1;
              }
              .hero-eyebrow {
                margin: 12px auto 0 !important;
                max-width: 280px !important;
                text-align: center;
              }
              .hero-typewriter {
                width: 5.25em !important;
                align-items: center !important;
                justify-content: center !important;
              }
              .hero-headline-dot {
                width: 0.42em !important;
                height: 0.42em !important;
                transform: translateY(0.02em);
              }
              .hero-headline-star {
                font-size: 0.52em !important;
                line-height: 1 !important;
                transform-origin: center center;
              }
              .hero-promise {
                margin-top: 36px;
                align-items: center;
                max-width: 100%;
              }
              .hero-promise-text {
                font-size: 24px;
                text-align: center;
              }
              .hero-actions {
                width: 100%;
                justify-content: center;
                align-items: stretch;
                gap: 12px !important;
              }
              .hero-action-link {
                width: min(100%, 260px);
                justify-content: center;
                white-space: nowrap;
                font-size: 11px !important;
                letter-spacing: 0.1em !important;
                padding-inline: 20px !important;
              }
            }

            .hero-stats-row {
              display: flex;
              align-items: center;
              gap: 24px;
              margin-top: 32px;
              flex-wrap: wrap;
            }
            @media (max-width: 640px) {
              .hero-stats-row {
                justify-content: center;
                gap: 16px;
                margin-top: 24px;
              }
            }
            .hero-stat-item {
              display: flex;
              align-items: center;
              gap: 6px;
            }
            .hero-stat-value {
              font-size: 18px;
              font-weight: 900;
              letter-spacing: -0.02em;
            }
            .hero-stat-label {
              font-size: 11px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.06em;
            }
            .hero-stat-divider {
              width: 1px;
              height: 24px;
              margin: 0 8px;
            }
            @media (max-width: 640px) {
              .hero-stat-divider {
                display: none;
              }
              .hero-stats-row {
                gap: 8px 16px;
              }
              .hero-stat-value {
                font-size: 15px;
              }
              .hero-stat-label {
                font-size: 9px;
              }
            }

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

            .hero-tech-badge {
              position: absolute;
              padding: 6px 14px;
              border-radius: 999px;
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 0.06em;
              text-transform: uppercase;
              background: var(--surface);
              border: 1px solid var(--border);
              color: var(--muted);
              backdrop-filter: blur(8px);
              pointer-events: none;
              animation: tech-float 5s ease-in-out infinite;
              z-index: 5;
            }
            .hero-tech-badge:nth-child(2) { animation-delay: -1s; }
            .hero-tech-badge:nth-child(3) { animation-delay: -2s; }
            .hero-tech-badge:nth-child(4) { animation-delay: -3s; }
            .hero-tech-badge:nth-child(5) { animation-delay: -4s; }

            .hero-scroll-indicator {
              position: absolute;
              bottom: 28px;
              left: 50%;
              transform: translateX(-50%);
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 6px;
              opacity: 0.4;
              transition: opacity 0.3s;
            }
            .hero-scroll-indicator:hover {
              opacity: 0.8;
            }
            .hero-scroll-indicator span {
              font-size: 10px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.2em;
              color: var(--muted);
            }
            @media (max-width: 640px) {
              .hero-scroll-indicator {
                bottom: 16px;
              }
            }
          `}} />


          <RocketLauncher />

          <a href="#trusted" className="hero-scroll-indicator">
            <span>Scroll</span>
            <ChevronDown size={18} className="animate-scroll-bounce" style={{ color: "var(--muted)" }} />
          </a>
        </div>
      </div>
    </section>
  );
}
