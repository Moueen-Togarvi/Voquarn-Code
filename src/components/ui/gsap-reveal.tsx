import type { CSSProperties, ReactNode } from "react";

type RevealDirection = "up" | "down" | "left" | "right" | "fade" | "none";

type GSAPRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: RevealDirection;
  duration?: number;
  stagger?: boolean;
};

type RevealStyle = CSSProperties & {
  "--reveal-delay"?: string;
  "--reveal-duration"?: string;
};

// Kept under the existing component name to avoid changing every page. The
// reveal now uses CSS view timelines instead of shipping GSAP + ScrollTrigger
// to the browser. Browsers without view-timeline support simply show content.
export function GSAPReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 0.7,
}: GSAPRevealProps) {
  const style: RevealStyle = {
    "--reveal-delay": `${delay}s`,
    "--reveal-duration": `${duration}s`,
  };

  return (
    <div className={`scroll-reveal scroll-reveal-${direction} ${className}`} style={style}>
      {children}
    </div>
  );
}

export function GSAPStagger({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 0.7,
}: Omit<GSAPRevealProps, "stagger">) {
  const style: RevealStyle = {
    "--reveal-delay": `${delay}s`,
    "--reveal-duration": `${duration}s`,
  };

  return (
    <div
      className={`scroll-reveal scroll-reveal-${direction} scroll-reveal-stagger ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
