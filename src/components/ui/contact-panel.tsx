"use client";

import { useEffect, useState } from "react";
import { CalendarDays, MessageSquareText } from "lucide-react";
import { ContactForm } from "@/components/ui/contact-form";
import { MeetingBookingForm } from "@/components/ui/meeting-booking-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Colours, hover, and the active pill live on .contact-mode-* in globals.css so
// the three theme scopes stay in one place; only layout is expressed here.
// The track needs !h-auto: tabsListVariants pins h-9 on horizontal tabs, which
// is shorter than the pills and lets the active one overflow the track.
const tabClass =
  "contact-mode-tab min-h-9 basis-1/2 gap-1.5 rounded-lg px-3 text-[11px] font-bold transition-[background-color,color,box-shadow,transform] duration-300 active:scale-[0.98] focus-visible:border-[#ff5400] focus-visible:ring-[#ff5400]/30";

const tabValues = new Set(["inquiry", "meeting"]);

export function ContactPanel() {
  const [tab, setTab] = useState("inquiry");

  // The navbar links to /contact#meeting and /contact#inquiry, so the hash picks
  // the opening tab. hashchange covers hopping between the two while already here.
  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.slice(1);
      if (tabValues.has(hash)) setTab(hash);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  return (
    <Tabs value={tab} onValueChange={setTab} className="gap-3">
      <TabsList
        aria-label="Choose how to contact Voquarn Code"
        className="contact-mode-toggle mx-auto !h-auto w-full max-w-xs rounded-xl border p-1"
      >
        <TabsTrigger value="inquiry" aria-label="Project inquiry" className={tabClass}>
          <MessageSquareText className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="sm:hidden">Inquiry</span>
          <span className="hidden sm:inline">Project inquiry</span>
        </TabsTrigger>
        <TabsTrigger value="meeting" aria-label="Book a meeting" className={tabClass}>
          <CalendarDays className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="sm:hidden">Meeting</span>
          <span className="hidden sm:inline">Book a meeting</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="inquiry" forceMount className="data-[state=inactive]:hidden">
        <ContactForm />
      </TabsContent>
      <TabsContent value="meeting" forceMount className="data-[state=inactive]:hidden">
        <MeetingBookingForm />
      </TabsContent>
    </Tabs>
  );
}
