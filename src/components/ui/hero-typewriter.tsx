"use client";

import { useEffect, useState } from "react";

const SERVICES = ["Websites", "Brands", "Apps", "Systems", "SaaS Apps", "AI Agents", "AI Apps"];

export function HeroTypewriter() {
  const [text, setText] = useState(SERVICES[0]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const fullText = SERVICES[loopNum % SERVICES.length];
    let typingSpeed = isDeleting ? 50 : 120;

    if (!isDeleting && text === fullText) typingSpeed = 2000;
    if (isDeleting && text === "") typingSpeed = 500;

    const timer = window.setTimeout(() => {
      if (!isDeleting && text === fullText) {
        setIsDeleting(true);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum((value) => value + 1);
      } else {
        setText(
          isDeleting
            ? fullText.substring(0, text.length - 1)
            : fullText.substring(0, text.length + 1),
        );
      }
    }, typingSpeed);

    return () => window.clearTimeout(timer);
  }, [text, isDeleting, loopNum]);

  return (
    <span
      className="hero-typewriter"
      style={{
        color: "var(--primary)",
        display: "inline-flex",
        alignItems: "center",
        width: "6.2em",
        justifyContent: "flex-start",
        whiteSpace: "nowrap",
      }}
    >
      {text}
      <span className="hero-typewriter-caret" aria-hidden="true" />
    </span>
  );
}
