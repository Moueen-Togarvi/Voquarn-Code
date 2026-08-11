"use client";

import dynamic from "next/dynamic";

// MobileDock pulls in framer-motion (motion/react) purely for a mobile-only
// bottom nav bar — mounting it eagerly from the (site) layout put that bundle
// in every page's initial JS, desktop included, since a Server Component
// can't use ssr:false directly. This client-only wrapper moves it to a
// separate async chunk so framer-motion no longer blocks first paint/
// hydration on any route. No idle delay here (unlike DeferredSiteEffects) —
// this is real navigation UI, not decoration, so it should appear as soon as
// its chunk loads rather than waiting on an idle callback.
const MobileDock = dynamic(
  () => import("@/components/layout/mobile-dock").then((mod) => mod.MobileDock),
  { ssr: false },
);

export function DeferredMobileDock() {
  return <MobileDock />;
}
