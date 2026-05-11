import Link from "next/link";
import type { Service } from "@/lib/site-data";

type ServiceCardProps = {
  service: Service;
};

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="panel rounded-[1.75rem] p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#14b8a6]/12 text-[#99f6e4]">
        <span className="font-display text-lg font-semibold">{service.title.slice(0, 1)}</span>
      </div>
      <h3 className="mt-5 font-display text-2xl text-white">{service.title}</h3>
      <p className="mt-3 text-[rgba(233,238,242,0.72)]">{service.description}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {service.deliverables.map((item) => (
          <span key={item} className="rounded-full border border-white/10 px-3 py-1 text-xs text-[rgba(233,238,242,0.68)]">
            {item}
          </span>
        ))}
      </div>
      <Link href="/services" className="mt-6 inline-flex text-sm font-semibold text-[#fcd34d] hover:text-[#fde68a]">
        See service details
      </Link>
    </article>
  );
}
