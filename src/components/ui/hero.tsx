import Link from "next/link";

export function Hero() {
  return (
    <section className="page-section relative overflow-hidden pt-16 sm:pt-20">
      <div className="hero-grid absolute inset-x-5 top-0 -z-10 h-[34rem] rounded-[2rem] lg:inset-x-8" />
      <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="max-w-3xl">
          <span className="eyebrow">Strategy-led digital execution</span>
          <h1 className="mt-6 font-display text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Websites, apps, and growth systems built to move your business forward.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[rgba(233,238,242,0.76)]">
            Voquarn Code helps brands launch sharper digital experiences with web development, app delivery, SEO systems,
            AI workflows, and premium design support.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-[#f59e0b] px-6 py-3.5 text-sm font-semibold text-[#07111a] hover:bg-[#fbbf24]"
            >
              Book a Discovery Call
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Explore Recent Work
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="panel floating relative rounded-[2rem] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.26)]">
            <div className="absolute -left-8 top-10 h-20 w-20 rounded-full bg-[#14b8a6]/20 blur-2xl" />
            <div className="absolute -right-8 bottom-12 h-24 w-24 rounded-full bg-[#f59e0b]/20 blur-2xl" />

            <div className="rounded-[1.5rem] border border-white/10 bg-[#08131d] p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[rgba(233,238,242,0.6)]">Mission Control</span>
                <span className="rounded-full bg-[#14b8a6]/15 px-3 py-1 text-xs font-semibold text-[#99f6e4]">
                  Launch Ready
                </span>
              </div>

              <div className="mt-8 grid gap-6 sm:grid-cols-[0.9fr_1.1fr]">
                <div className="flex items-center justify-center rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,#0d2330_0%,#08131d_100%)] p-4">
                  <svg viewBox="0 0 220 240" className="h-64 w-full max-w-[220px]" aria-hidden="true">
                    <circle cx="110" cy="120" r="90" fill="rgba(20,184,166,0.12)" />
                    <ellipse cx="110" cy="84" rx="46" ry="50" fill="#dbeafe" />
                    <ellipse cx="110" cy="84" rx="30" ry="33" fill="#07111a" />
                    <rect x="79" y="132" width="62" height="44" rx="16" fill="#f8fafc" />
                    <rect x="66" y="160" width="88" height="48" rx="18" fill="#dbeafe" />
                    <rect x="88" y="176" width="44" height="14" rx="7" fill="#14b8a6" />
                    <rect x="45" y="160" width="28" height="14" rx="7" fill="#f8fafc" />
                    <rect x="147" y="160" width="28" height="14" rx="7" fill="#f8fafc" />
                    <rect x="52" y="172" width="18" height="46" rx="9" fill="#f8fafc" />
                    <rect x="150" y="172" width="18" height="46" rx="9" fill="#f8fafc" />
                  </svg>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[rgba(233,238,242,0.5)]">Build map</p>
                    <p className="mt-3 font-display text-xl text-white">From brand story to pipeline-ready delivery</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                      <p className="text-2xl font-semibold text-white">4-8</p>
                      <p className="mt-2 text-sm text-[rgba(233,238,242,0.65)]">Weeks for most launch projects</p>
                    </div>
                    <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                      <p className="text-2xl font-semibold text-white">5</p>
                      <p className="mt-2 text-sm text-[rgba(233,238,242,0.65)]">Core disciplines under one roof</p>
                    </div>
                  </div>
                  <div className="rounded-[1.25rem] border border-white/10 bg-[#14b8a6]/10 p-4">
                    <p className="text-sm text-[#99f6e4]">Design, engineering, SEO, AI, and growth thinking working together from the start.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
