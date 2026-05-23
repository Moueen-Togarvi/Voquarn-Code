"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}

export function ScrollReveal({ 
  children, 
  className = "", 
  delay = 0,
  direction = "up"
}: ScrollRevealProps) {
  const directionOffset = {
    up: 40,
    down: -40,
    left: 40,
    right: -40,
    none: 0
  };

  const initialY = direction === "up" || direction === "down" ? directionOffset[direction] : 0;
  const initialX = direction === "left" || direction === "right" ? directionOffset[direction] : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: initialY, x: initialX }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: false, margin: "-10%" }}
      transition={{ 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1], // Custom premium easing curve
        delay: delay 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
