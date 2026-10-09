"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const HangingAstronaut = dynamic(
  () => import("@/components/ui/hanging-astronaut").then((mod) => mod.HangingAstronaut),
  { ssr: false },
);

export function DeferredSiteEffects() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // The decorative astronaut is hidden on small/touch screens anyway;
    // avoid downloading its module and attaching listeners there.
    if (!window.matchMedia("(min-width: 640px) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;

    const win = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (win.requestIdleCallback) {
      const idleId = win.requestIdleCallback(() => setReady(true), { timeout: 1800 });
      return () => win.cancelIdleCallback?.(idleId);
    }

    const timerId = window.setTimeout(() => setReady(true), 900);
    return () => window.clearTimeout(timerId);
  }, []);

  if (!ready) return null;

  return <HangingAstronaut />;
}
