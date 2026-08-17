"use client";

import { CalendarDays, MessageSquareText } from "lucide-react";
import { ContactForm } from "@/components/ui/contact-form";
import { MeetingBookingForm } from "@/components/ui/meeting-booking-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Colours, hover, and the active pill live on .contact-mode-* in globals.css so
// the three theme scopes stay in one place; only layout is expressed here.
// The track needs !h-auto: tabsListVariants pins h-9 on horizontal tabs, which
// is shorter than the pills and lets the active one overflow the track.
const tabClass =
  "contact-mode-tab min-h-12 basis-1/2 gap-2 rounded-full px-3 text-[10px] font-bold uppercase tracking-[0.12em] transition-[background-color,color,box-shadow,transform] duration-300 active:scale-[0.98] focus-visible:border-[#ff5400] focus-visible:ring-[#ff5400]/30 sm:min-h-13 sm:px-4 sm:text-[11px]";

export function ContactPanel() {
  return (
    <Tabs defaultValue="inquiry" className="gap-4">
      <TabsList
        aria-label="Choose how to contact Voquarn Code"
        className="contact-mode-toggle mx-auto !h-auto w-full max-w-md rounded-full border p-1"
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
