"use client";

import { motion } from "framer-motion";

export function TypoSection() {
  return (
    <section className="relative w-full overflow-hidden bg-white py-24 lg:py-40 text-black">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
        <div className="relative flex flex-col leading-[0.75] tracking-tighter">
          
          {/* Layer 1: FOR EVERY */}
          <div className="relative z-10">
            <h2 className="font-display text-[15vw] font-black uppercase lg:text-[18vw]">
              For Every
            </h2>
            <div className="absolute right-[10%] top-0 max-w-[250px] space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-black/40">
                Strategic insight leads to execution.
              </p>
              <p className="text-[10px] font-black uppercase tracking-widest text-black/40">
                We build systems that last.
              </p>
            </div>
          </div>

          {/* Layer 2: PROJECT (Overlapping) */}
          <div className="relative -mt-[4vw] z-20">
            <h2 className="font-display text-[15vw] font-black uppercase lg:text-[20vw] opacity-90">
              Project
            </h2>
            <div className="absolute left-[5%] top-[20%] rotate-[270deg] origin-left">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-black">
                - Scalable Systems -
              </p>
            </div>
          </div>

          {/* Layer 3: THERE'S A (Overlapping) */}
          <div className="relative -mt-[5vw] z-10 flex justify-end">
            <h2 className="font-display text-[15vw] font-black uppercase lg:text-[16vw] text-right">
              There's a
            </h2>
            <div className="absolute left-[20%] bottom-0 max-w-[300px]">
              <p className="text-[10px] font-black uppercase leading-relaxed text-black/60">
                Modern teams require modern tools. Our engineering first approach ensures that your vision becomes a high-performance reality.
              </p>
            </div>
          </div>

          {/* Layer 4: BETTER (Overlapping) */}
          <div className="relative -mt-[4vw] z-30">
            <h2 className="font-display text-[15vw] font-black uppercase lg:text-[22vw] mix-blend-multiply text-[#ff5400]">
              Better
            </h2>
            <div className="absolute right-[5%] bottom-[10%] rotate-90 origin-right">
              <p className="text-[9px] font-black uppercase tracking-[0.5em] text-black">
                Digital Excellence
              </p>
            </div>
          </div>

          {/* Layer 5: SOLUTION */}
          <div className="relative -mt-[6vw] z-20">
            <h2 className="font-display text-[15vw] font-black uppercase lg:text-[19vw] opacity-80">
              Solution
            </h2>
            <div className="mt-10 flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase">Build Fast</p>
                <p className="text-[10px] font-black uppercase">Launch Clean</p>
                <p className="text-[10px] font-black uppercase">Scale Always</p>
              </div>
              <div className="text-right">
                <p className="font-display text-4xl font-black uppercase tracking-tighter">
                  Voquarn<br />Code
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Decorative Overlays for texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none" />
    </section>
  );
}
