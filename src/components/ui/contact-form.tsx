"use client";

import { FormEvent, useState } from "react";
import { trackLead } from "@/lib/pixels";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const initialState = {
  name: "",
  email: "",
  service: "",
  message: "",
  companyWebsite: "",
};

export function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.service) {
      setStatus("error");
      setFeedback("Please select a service.");
      return;
    }

    setStatus("loading");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message || "Message failed to send.");
      }

      setStatus("success");
      setFeedback(payload.message || "Message sent.");
      trackLead();
      setForm(initialState);
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Message failed to send.");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-[var(--panel)] border border-[var(--border)] shadow-sm rounded-[2.5rem] p-8 sm:p-10 flex flex-col items-center justify-center text-center py-12 sm:py-16 animate-in fade-in zoom-in-95 duration-500">
        <div className="relative w-48 h-48 flex items-center justify-center mb-8">
          <div className="absolute inset-4 bg-[#eff6ff] rounded-full blur-xl opacity-70 animate-pulse duration-[3000ms]" />

          <div className="absolute top-2 left-6 animate-bounce" style={{ animationDuration: '4s' }}>
            <svg className="w-5 h-5 text-blue-500 fill-current" viewBox="0 0 24 24">
              <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z"/>
            </svg>
          </div>
          <div className="absolute bottom-4 right-6 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
            <svg className="w-4 h-4 text-blue-500 fill-current" viewBox="0 0 24 24">
              <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z"/>
            </svg>
          </div>

          <div className="relative z-10 w-28 h-28 flex items-center justify-center">
            <div className="absolute bottom-2 w-24 h-16 bg-blue-100 rounded-lg border-2 border-blue-200 flex items-end justify-center shadow-inner overflow-hidden">
              <div className="w-full h-full bg-gradient-to-t from-blue-50 to-transparent absolute inset-0" />
              <div className="w-24 h-24 bg-blue-200/50 rotate-45 transform translate-y-8 absolute" />
            </div>

            <div className="absolute bottom-5 w-16 h-20 bg-[var(--panel)] rounded-md border border-blue-300 shadow-md flex items-center justify-center p-2.5 animate-[bounce_3s_infinite]">
              <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center shadow-md shadow-blue-500/30">
                <svg className="w-5 h-5 text-white stroke-[3.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <div className="absolute bottom-2 w-24 h-10 bg-gradient-to-t from-blue-200 to-blue-100/90 rounded-b-lg border-x-2 border-b-2 border-blue-200 shadow-sm flex items-center justify-center overflow-hidden">
              <div className="w-24 h-24 bg-blue-100 rotate-45 transform translate-y-6 absolute border border-blue-200" />
            </div>
          </div>
        </div>

        <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)] leading-tight mb-3">
          Thank you for reaching out!
        </h3>
        <p className="text-sm text-[var(--muted)] font-semibold leading-relaxed px-4 mb-8 max-w-sm">
          We have received your project inquiry. Our team will review your details and get back to you within 24 hours.
        </p>

        <button
          onClick={() => { setStatus("idle"); setFeedback(""); }}
          className="px-8 py-3.5 rounded-xl bg-neutral-950 hover:bg-[#ff5400] text-white text-xs font-black uppercase tracking-widest transition-all duration-300 shadow-lg hover:scale-[1.02]"
        >
          Send Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <form className="bg-[var(--panel)] border border-[var(--border)] shadow-sm rounded-[2.5rem] p-8 sm:p-10" onSubmit={handleSubmit}>
      <label className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
        Company website
        <input
          name="companyWebsite"
          tabIndex={-1}
          autoComplete="off"
          value={form.companyWebsite}
          onChange={(event) => setForm((current) => ({ ...current, companyWebsite: event.target.value }))}
        />
      </label>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="space-y-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
          <span>Name</span>
          <input
            required
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3.5 text-base normal-case font-medium text-[var(--foreground)] outline-none transition-all focus:border-[#ff5400] focus:bg-[var(--panel)] placeholder:text-[var(--muted)]"
            placeholder="John Doe"
          />
        </label>
        <label className="space-y-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
          <span>Email</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3.5 text-base normal-case font-medium text-[var(--foreground)] outline-none transition-all focus:border-[#ff5400] focus:bg-[var(--panel)] placeholder:text-[var(--muted)]"
            placeholder="john@example.com"
          />
        </label>
        <div className="space-y-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)] sm:col-span-2">
          <label id="contact-service-label" htmlFor="contact-service">Service</label>
          <Select
            value={form.service}
            onValueChange={(service) => setForm((current) => ({ ...current, service }))}
          >
            <SelectTrigger
              id="contact-service"
              aria-labelledby="contact-service-label"
              aria-required="true"
              className="h-14 w-full rounded-2xl border-[var(--border)] bg-[var(--surface)] px-4 text-base font-medium normal-case text-[var(--foreground)] shadow-none focus-visible:border-[#ff5400] focus-visible:ring-[#ff5400]/15"
            >
              <SelectValue placeholder="Select one" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="Web Development">Web Development</SelectItem>
              <SelectItem value="App Development">App Development</SelectItem>
              <SelectItem value="AI & Automation">AI & Automation</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <label className="mt-6 block space-y-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
        <span>Project details</span>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
          className="w-full rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 text-base normal-case font-medium text-[var(--foreground)] outline-none transition-all focus:border-[#ff5400] focus:bg-[var(--panel)] placeholder:text-[var(--muted)] resize-none"
          placeholder="Share your goals, timeline, and what you want the project to achieve."
        />
      </label>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-[var(--border)] pt-6">
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full bg-gradient-to-b from-[#2c2c2e] to-[#151516] hover:from-[#3a3a3c] hover:to-[#1c1c1e] shadow-[0_8px_20px_rgba(0,0,0,0.15),inset_0_2px_1px_rgba(255,255,255,0.15)] px-8 py-3.5 text-xs font-black uppercase tracking-[0.2em] text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-70 active:scale-95"
        >
          {status === "loading" ? "Sending..." : "Send Inquiry"}
        </button>
        {feedback ? (
          <p className={`text-sm font-semibold px-4 py-2 rounded-full ${status === "error" ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>{feedback}</p>
        ) : null}
      </div>
    </form>
  );
}
