import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <span className="text-[120px] md:text-[180px] font-black leading-none text-[#ff5400]/15 select-none">
        404
      </span>

      <h1 className="mt-[-24px] text-3xl md:text-4xl font-black uppercase tracking-tighter text-[var(--foreground)]">
        Page Not Found
      </h1>

      <p className="mt-4 max-w-md text-[15px] font-medium leading-7 text-[var(--muted)]">
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-[#ff5400] px-8 py-4 text-sm font-black uppercase tracking-widest text-white hover:scale-105 transition-all shadow-xl"
        >
          <Home size={16} /> Go Home
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--foreground)] bg-[var(--panel)] px-8 py-4 text-sm font-black uppercase tracking-widest text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all"
        >
          Contact Us <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
