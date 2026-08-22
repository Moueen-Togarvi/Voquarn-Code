"use client";

import * as React from "react";
import type { Options as ConfettiOptions } from "canvas-confetti";

import { Confetti, type ConfettiRef } from "@/components/ui/confetti";

/**
 * Brand palette: the site orange plus the amber/teal accents the theme toggle
 * already uses, so a burst never introduces a colour the page does not have.
 */
const BRAND_COLORS = ["#ff5400", "#ff8a3d", "#ffb066", "#f59e0b", "#14b8a6"];

export type ConfettiPreset = "celebrate" | "pop";

type Origin = { x: number; y: number };

/** One `confetti()` call, plus how long to wait before firing it. */
type BurstStep = ConfettiOptions & { delay: number };

/** Steps + how long the canvas stays mounted so particles land before cleanup. */
type PresetSpec = { steps: BurstStep[]; lifetime: number };

/** A full-page celebration: centre pop, then two side cannons, then a drift. */
function celebrate(): PresetSpec {
  return {
    lifetime: 3400,
    steps: [
      { delay: 0, particleCount: 80, spread: 95, startVelocity: 42, origin: { x: 0.5, y: 0.62 } },
      { delay: 160, particleCount: 45, angle: 62, spread: 70, startVelocity: 52, origin: { x: 0.02, y: 0.78 } },
      { delay: 160, particleCount: 45, angle: 118, spread: 70, startVelocity: 52, origin: { x: 0.98, y: 0.78 } },
      { delay: 420, particleCount: 40, spread: 120, startVelocity: 28, scalar: 0.85, decay: 0.92, origin: { x: 0.5, y: 0.45 } },
    ],
  };
}

/** A single small burst at `origin` — for incidental controls, not milestones. */
function pop(origin: Origin): PresetSpec {
  return {
    lifetime: 1600,
    steps: [
      {
        delay: 0,
        particleCount: 32,
        spread: 70,
        startVelocity: 26,
        scalar: 0.7,
        ticks: 90,
        gravity: 0.9,
        origin,
      },
    ],
  };
}

function buildPreset(preset: ConfettiPreset, origin?: Origin): PresetSpec {
  return preset === "pop" ? pop(origin ?? { x: 0.5, y: 0.5 }) : celebrate();
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export type ConfettiBurstProps = {
  preset?: ConfettiPreset;
  /**
   * Omit to fire once when this mounts — the natural fit for a success view
   * that replaces a form. Pass a counter that increments to re-fire on a
   * control that can be used repeatedly.
   */
  trigger?: number;
  /** Viewport-relative launch point (0–1 on each axis). Used by `pop`. */
  origin?: Origin;
  className?: string;
};

/**
 * Mounts the magicui <Confetti> canvas only while particles are in flight, so
 * pages that never celebrate never carry a canvas. Honours reduced motion by
 * rendering nothing at all.
 */
export function ConfettiBurst({ preset = "celebrate", trigger, origin, className }: ConfettiBurstProps) {
  const confettiRef = React.useRef<ConfettiRef>(null);
  const [run, setRun] = React.useState<{ id: number; spec: PresetSpec } | null>(null);

  // Read through refs so a new inline `origin` object cannot re-fire the burst.
  // Synced in an effect rather than during render, and declared before the
  // trigger effect so that one always reads values from the same commit.
  const presetRef = React.useRef(preset);
  const originRef = React.useRef(origin);

  React.useEffect(() => {
    presetRef.current = preset;
    originRef.current = origin;
  }, [preset, origin]);

  React.useEffect(() => {
    if (prefersReducedMotion()) return;
    // `trigger === 0` is the "not yet" value for counters, matching useState(0).
    if (trigger === 0) return;
    setRun({ id: trigger ?? 1, spec: buildPreset(presetRef.current, originRef.current) });
  }, [trigger]);

  const runId = run?.id;
  const spec = run?.spec;

  React.useEffect(() => {
    if (!spec) return;

    const timers = spec.steps.map(({ delay, ...options }) =>
      window.setTimeout(() => {
        void confettiRef.current?.fire({ colors: BRAND_COLORS, ...options });
      }, delay),
    );
    timers.push(window.setTimeout(() => setRun(null), spec.lifetime));

    return () => timers.forEach(window.clearTimeout);
  }, [runId, spec]);

  if (!run) return null;

  return (
    <Confetti
      // A fresh canvas per burst; the previous one is torn down with its particles.
      key={run.id}
      ref={confettiRef}
      manualstart
      aria-hidden="true"
      className={className ?? "pointer-events-none fixed inset-0 z-[120] size-full"}
    />
  );
}
