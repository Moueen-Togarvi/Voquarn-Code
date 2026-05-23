"use client";

import { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface GSAPRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "fade";
  duration?: number;
  stagger?: boolean;
}

export function GSAPReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 0.9,
  stagger = false,
}: GSAPRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = stagger ? el.children : [el];

    const fromVars: gsap.TweenVars = {
      opacity: 0,
      y: direction === "up" ? 60 : direction === "down" ? -60 : 0,
      x: direction === "left" ? 60 : direction === "right" ? -60 : 0,
      scale: direction === "fade" ? 0.96 : 1,
    };

    const toVars: gsap.TweenVars = {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      duration,
      delay,
      ease: "power4.out",
      stagger: stagger ? 0.12 : 0,
    };

    // Set initial hidden state
    gsap.set(targets, fromVars);

    // Come IN — when entering viewport
    const enterTween = gsap.to(targets, {
      ...toVars,
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
        // come in when entering, come out when leaving
      },
    });

    return () => {
      enterTween.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [delay, direction, duration, stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// Stagger children variant — wraps each direct child with reveal
export function GSAPStagger({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 0.8,
}: Omit<GSAPRevealProps, "stagger">) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = Array.from(el.children);
    if (!targets.length) return;

    gsap.set(targets, {
      opacity: 0,
      y: direction === "up" ? 50 : direction === "down" ? -50 : 0,
      x: direction === "left" ? 50 : direction === "right" ? -50 : 0,
    });

    const tween = gsap.to(targets, {
      opacity: 1,
      y: 0,
      x: 0,
      duration,
      delay,
      ease: "power4.out",
      stagger: 0.1,
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    });

    return () => {
      tween.kill();
    };
  }, [delay, direction, duration]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
