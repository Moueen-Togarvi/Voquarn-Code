"use client";

import { FormEvent, useState } from "react";
import {
  CalendarCheck,
  CalendarDays,
  Clock3,
  Globe2,
  LoaderCircle,
  Video,
} from "lucide-react";
import { trackLead } from "@/lib/pixels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const commonTimezones = [
  "Asia/Karachi",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Europe/London",
  "Europe/Berlin",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "UTC",
];

const initialState = {
  name: "",
  email: "",
  phone: "",
  topic: "",
  date: "",
  time: "",
  timezone: "Asia/Karachi",
  duration: "30 minutes",
  meetingType: "Google Meet",
  agenda: "",
  companyWebsite: "",
};

function localDateValue(date: Date) {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

export function MeetingBookingForm() {
  const [form, setForm] = useState(initialState);
  const [dateLimits] = useState(() => {
    const minimum = new Date();
    const maximum = new Date(minimum);
    maximum.setDate(maximum.getDate() + 180);
    return { minimum: localDateValue(minimum), maximum: localDateValue(maximum) };
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const phoneRequired = form.meetingType === "Phone call" || form.meetingType === "WhatsApp call";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.topic || !form.duration || !form.meetingType || !form.timezone) {
      setStatus("error");
      setFeedback("Please complete the meeting details.");
      return;
    }

    setStatus("loading");
    setFeedback("");

    try {
      const response = await fetch("/api/meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message || "Meeting request failed to send.");
      }

      setStatus("success");
      setFeedback(payload.message || "Meeting request sent.");
      trackLead();
      setForm(initialState);
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Meeting request failed to send.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex min-h-[560px] flex-col items-center justify-center rounded-[2.5rem] border border-[var(--border)] bg-[var(--panel)] p-8 text-center shadow-sm sm:p-10">
        <div className="flex size-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CalendarCheck className="size-10" aria-hidden="true" />
        </div>
        <h2 className="mt-6 font-display text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
          Meeting request received
        </h2>
        <p className="mt-3 max-w-md text-sm font-medium leading-6 text-[var(--muted)]">
          {feedback} The requested slot is held only after our team confirms it by email.
        </p>
        <Button
          type="button"
          size="lg"
          onClick={() => {
            setStatus("idle");
            setFeedback("");
          }}
          className="mt-8 min-h-12 rounded-full bg-neutral-950 px-8 text-xs font-black uppercase tracking-[0.16em] text-white hover:bg-[#ff5400]"
        >
          Request another time
        </Button>
      </div>
    );
  }

  const fieldClass =
    "h-14 rounded-2xl border-[var(--border)] bg-[var(--surface)] px-4 text-base font-medium text-[var(--foreground)] shadow-none focus-visible:border-[#ff5400] focus-visible:ring-[#ff5400]/15";
  const selectClass =
    "h-14 w-full rounded-2xl border-[var(--border)] bg-[var(--surface)] px-4 text-base font-medium text-[var(--foreground)] shadow-none focus-visible:border-[#ff5400] focus-visible:ring-[#ff5400]/15";
  const labelClass = "text-xs font-bold uppercase tracking-wider text-[var(--muted)]";

  return (
    <form
      className="rounded-[2.5rem] border border-[var(--border)] bg-[var(--panel)] p-8 shadow-sm sm:p-10"
      onSubmit={handleSubmit}
    >
      <div className="mb-7 flex items-start gap-4 rounded-2xl border border-[#ff5400]/15 bg-[#ff5400]/5 p-4">
        <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-[#ff5400] text-white">
          <CalendarDays className="size-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="font-display text-lg font-bold text-[var(--foreground)]">Choose a preferred meeting slot</h2>
          <p className="mt-1 text-sm leading-5 text-[var(--muted)]">
            We will review availability and confirm the final time by email.
          </p>
        </div>
      </div>

      <div className="sr-only" aria-hidden="true">
        <Label htmlFor="meeting-company-website">Company website</Label>
        <Input
          id="meeting-company-website"
          name="companyWebsite"
          tabIndex={-1}
          autoComplete="off"
          value={form.companyWebsite}
          onChange={(event) => setForm((current) => ({ ...current, companyWebsite: event.target.value }))}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="meeting-name" className={labelClass}>Name</Label>
          <Input
            id="meeting-name"
            name="name"
            required
            autoComplete="name"
            maxLength={120}
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            className={fieldClass}
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="meeting-email" className={labelClass}>Work email</Label>
          <Input
            id="meeting-email"
            name="email"
            required
            type="email"
            autoComplete="email"
            maxLength={254}
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            className={fieldClass}
            placeholder="john@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="meeting-phone" className={labelClass}>
            Phone / WhatsApp
            <span className="normal-case tracking-normal">({phoneRequired ? "required for call" : "optional"})</span>
          </Label>
          <Input
            id="meeting-phone"
            name="phone"
            type="tel"
            required={phoneRequired}
            autoComplete="tel"
            maxLength={40}
            value={form.phone}
            onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
            className={fieldClass}
            placeholder="+92 300 0000000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="meeting-topic" className={labelClass}>Meeting topic</Label>
          <Select value={form.topic} onValueChange={(topic) => setForm((current) => ({ ...current, topic }))}>
            <SelectTrigger id="meeting-topic" className={selectClass} aria-required="true">
              <SelectValue placeholder="Select a topic" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="Project consultation">Project consultation</SelectItem>
              <SelectItem value="Website or SEO audit">Website or SEO audit</SelectItem>
              <SelectItem value="AI and automation">AI and automation</SelectItem>
              <SelectItem value="Partnership">Partnership</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="meeting-date" className={labelClass}>
            <CalendarDays className="size-3.5" aria-hidden="true" /> Preferred date
          </Label>
          <Input
            id="meeting-date"
            name="date"
            required
            type="date"
            min={dateLimits.minimum}
            max={dateLimits.maximum}
            value={form.date}
            onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
            className={fieldClass}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="meeting-time" className={labelClass}>
            <Clock3 className="size-3.5" aria-hidden="true" /> Preferred time
          </Label>
          <Input
            id="meeting-time"
            name="time"
            required
            type="time"
            value={form.time}
            onChange={(event) => setForm((current) => ({ ...current, time: event.target.value }))}
            className={fieldClass}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="meeting-timezone" className={labelClass}>
            <Globe2 className="size-3.5" aria-hidden="true" /> Timezone
          </Label>
          <Select value={form.timezone} onValueChange={(timezone) => setForm((current) => ({ ...current, timezone }))}>
            <SelectTrigger id="meeting-timezone" className={selectClass} aria-required="true">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              {commonTimezones.map((timezone) => (
                <SelectItem key={timezone} value={timezone}>{timezone.replaceAll("_", " ")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="meeting-duration" className={labelClass}>Duration</Label>
          <Select value={form.duration} onValueChange={(duration) => setForm((current) => ({ ...current, duration }))}>
            <SelectTrigger id="meeting-duration" className={selectClass} aria-required="true">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="30 minutes">30 minutes</SelectItem>
              <SelectItem value="45 minutes">45 minutes</SelectItem>
              <SelectItem value="60 minutes">60 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="meeting-type" className={labelClass}>
            <Video className="size-3.5" aria-hidden="true" /> Meeting format
          </Label>
          <Select value={form.meetingType} onValueChange={(meetingType) => setForm((current) => ({ ...current, meetingType }))}>
            <SelectTrigger id="meeting-type" className={selectClass} aria-required="true">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="Google Meet">Google Meet</SelectItem>
              <SelectItem value="Phone call">Phone call</SelectItem>
              <SelectItem value="WhatsApp call">WhatsApp call</SelectItem>
              <SelectItem value="In-person at Bahawalnagar">In-person at Bahawalnagar</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <Label htmlFor="meeting-agenda" className={labelClass}>What would you like to discuss?</Label>
        <Textarea
          id="meeting-agenda"
          name="agenda"
          required
          rows={4}
          maxLength={3000}
          value={form.agenda}
          onChange={(event) => setForm((current) => ({ ...current, agenda: event.target.value }))}
          className="min-h-32 resize-y rounded-3xl border-[var(--border)] bg-[var(--surface)] px-5 py-4 text-base font-medium text-[var(--foreground)] shadow-none focus-visible:border-[#ff5400] focus-visible:ring-[#ff5400]/15"
          placeholder="Share a short agenda, goals, or links that will help us prepare."
        />
      </div>

      <div className="mt-8 flex flex-col gap-4 border-t border-[var(--border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="submit"
          size="lg"
          disabled={status === "loading"}
          className="min-h-12 rounded-full bg-gradient-to-b from-[#2c2c2e] to-[#151516] px-8 text-xs font-black uppercase tracking-[0.18em] text-white shadow-[0_8px_20px_rgba(0,0,0,0.15),inset_0_2px_1px_rgba(255,255,255,0.15)] hover:from-[#3a3a3c] hover:to-[#1c1c1e]"
        >
          {status === "loading" ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <CalendarCheck aria-hidden="true" />}
          {status === "loading" ? "Sending request..." : "Request meeting"}
        </Button>
        <p
          aria-live="polite"
          className={`text-sm font-semibold ${status === "error" ? "text-red-600" : "text-[var(--muted)]"}`}
        >
          {feedback || "No payment required. Confirmation arrives by email."}
        </p>
      </div>
    </form>
  );
}
