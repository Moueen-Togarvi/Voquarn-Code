"use client";

import { useMemo, useState } from "react";
import type { PricingPlan } from "@/lib/site-data";
import { site } from "@/lib/site-data";

type PricingToggleProps = {
  plans: PricingPlan[];
};

export function PricingToggle({ plans }: PricingToggleProps) {
  const [currency, setCurrency] = useState<"PKR" | "USD">("PKR");

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(currency === "PKR" ? "en-PK" : "en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }),
    [currency],
  );

  return (
    <div className="space-y-8">
      <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1">
        {(["PKR", "USD"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setCurrency(option)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              currency === option ? "bg-[#14b8a6] text-[#07111a]" : "text-[rgba(233,238,242,0.72)]"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {plans.map((plan) => {
          const price = currency === "PKR" ? plan.pricePkr : plan.priceUsd;

          return (
            <article
              key={plan.name}
              className={`rounded-[1.75rem] p-6 ${plan.featured ? "border border-[#14b8a6]/30 bg-[#14b8a6]/8" : "panel"}`}
            >
              <p className="text-sm uppercase tracking-[0.18em] text-[#99f6e4]">{plan.name}</p>
              <h3 className="mt-4 font-display text-4xl font-semibold text-white">{formatter.format(price)}</h3>
              <p className="mt-3 text-[rgba(233,238,242,0.72)]">{plan.description}</p>
              <div className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <p key={feature} className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-[rgba(233,238,242,0.78)]">
                    {feature}
                  </p>
                ))}
              </div>
              <a
                href={`https://wa.me/${site.whatsapp}?text=Hi%20Voquarn%20Code,%20I%20want%20to%20discuss%20the%20${encodeURIComponent(plan.name)}%20package.`}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex rounded-full bg-[#f59e0b] px-5 py-3 text-sm font-semibold text-[#07111a] hover:bg-[#fbbf24]"
              >
                Discuss on WhatsApp
              </a>
            </article>
          );
        })}
      </div>
    </div>
  );
}
