"use client";

import type { AnchorHTMLAttributes } from "react";
import { trackContact } from "@/lib/pixels";

type WhatsAppLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

/** Drop-in replacement for a plain wa.me `<a>` that also fires the Contact pixel event. */
export function WhatsAppLink({ href, onClick, ...props }: WhatsAppLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={(event) => {
        trackContact();
        onClick?.(event);
      }}
      {...props}
    />
  );
}
