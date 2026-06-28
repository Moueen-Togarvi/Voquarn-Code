"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const INTRO_DURATION = 2300;
const REDUCED_MOTION_DURATION = 1400;
const SESSION_KEY = "voquarn_intro_shown";

export function IntroLoader() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem(SESSION_KEY);
    if (alreadyShown) return;

    setVisible(true);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(
      () => {
        setVisible(false);
        document.body.style.overflow = previousOverflow;
        sessionStorage.setItem(SESSION_KEY, "true");
      },
      reduceMotion ? REDUCED_MOTION_DURATION : INTRO_DURATION,
    );

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, [reduceMotion]);

  if (!visible) return null;

  const doorTransition = reduceMotion
    ? { duration: 0 }
    : { delay: 1.08, duration: 0.9, ease: [0.83, 0, 0.17, 1] as const };

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-0 z-[9999] overflow-hidden bg-[var(--background)]"
      initial={{ opacity: 1 }}
      animate={{ opacity: reduceMotion ? [1, 1, 0] : [1, 1, 1, 0] }}
      transition={{
        duration: reduceMotion ? REDUCED_MOTION_DURATION / 1000 : INTRO_DURATION / 1000,
        times: reduceMotion ? [0, 0.78, 1] : [0, 0.72, 0.9, 1],
        ease: "easeInOut",
      }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2 border-r border-[var(--border)] bg-[var(--background)]"
        animate={{ x: reduceMotion ? "-100%" : "-101%" }}
        transition={doorTransition}
      />
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2 border-l border-[var(--border)] bg-[var(--background)]"
        animate={{ x: reduceMotion ? "100%" : "101%" }}
        transition={doorTransition}
      />

      <div className="absolute inset-y-0 left-1/2 z-10 w-px -translate-x-1/2 bg-[#ff5400]/10">
        <motion.div
          className="h-full w-full bg-[#ff5400]"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: reduceMotion ? 0 : [0, 1, 1, 0] }}
          transition={{ duration: 1.6, times: [0, 0.35, 0.72, 1], ease: "easeInOut" }}
          style={{ transformOrigin: "center" }}
        />
      </div>

      <motion.div
        className="absolute inset-0 z-20 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.82, y: 12 }}
        animate={
          reduceMotion
            ? { opacity: [0, 1, 1, 0], scale: [0.96, 1, 1, 1], y: 0 }
            : { opacity: [0, 1, 1, 0], scale: [0.82, 1.06, 1, 0.9], y: [12, 0, 0, -8] }
        }
        transition={{
          duration: reduceMotion ? REDUCED_MOTION_DURATION / 1000 : 2.05,
          times: reduceMotion ? [0, 0.22, 0.8, 1] : [0, 0.18, 0.88, 1],
          ease: "easeOut",
        }}
      >
        <img
          src="/intro-logo.png"
          alt=""
          className="h-56 w-56 object-contain sm:h-72 sm:w-72"
        />
      </motion.div>
    </motion.div>
  );
}
