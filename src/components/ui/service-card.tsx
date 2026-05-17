import Link from "next/link";
import type { Service } from "@/lib/site-data";
import { ArrowUpRight } from "lucide-react";

type ServiceCardProps = {
  service: Service;
  index?: number;
};

export function ServiceCard({ service, index }: ServiceCardProps) {
  return (
    <article className="group relative flex flex-col justify-between rounded-[2.5rem] border-4 border-black bg-white p-8 transition-all hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(255,84,0,1)]">
      <div>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white group-hover:bg-[#ff5400] transition-colors">
          <span className="font-display text-xl font-black">{service.title.slice(0, 1)}</span>
        </div>
        <h3 className="mt-8 font-display text-2xl font-black uppercase tracking-tighter text-black">{service.title}</h3>
        <p className="mt-4 text-[13px] font-bold leading-relaxed text-black/60">{service.description}</p>
        
        <div className="mt-8 flex flex-wrap gap-2">
          {service.deliverables.map((item) => (
            <span key={item} className="rounded-full border-2 border-black/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-black/40">
              {item}
            </span>
          ))}
        </div>
      </div>

      <Link 
        href="/services" 
        className="mt-10 inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[#ff5400] hover:underline"
      >
        Learn More <ArrowUpRight className="h-4 w-4" />
      </Link>
    </article>
  );
}
