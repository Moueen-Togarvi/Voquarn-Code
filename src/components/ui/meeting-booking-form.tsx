"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarCheck,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
} from "lucide-react";
import { trackLead } from "@/lib/pixels";
import { Button } from "@/components/ui/button";
import { ConfettiBurst } from "@/components/ui/confetti-burst";
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

// These four lists must stay in sync with the allow-lists in src/app/api/meeting/route.ts.
const topics = [
  "Project consultation",
  "Website or SEO audit",
  "AI and automation",
  "Partnership",
  "Other",
];
const durations = ["30 minutes", "45 minutes", "60 minutes"];
const meetingTypes = ["Google Meet", "Phone call", "WhatsApp call", "In-person at Bahawalnagar"];

const weekdayLabels = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const BOOKING_WINDOW_DAYS = 180;
// Working hours, as half-hour starts from 09:00 up to the last 17:30 slot.
const SLOT_START_MINUTES = 9 * 60;
const SLOT_END_MINUTES = 18 * 60;
const SLOT_STEP_MINUTES = 30;
// Same-day slots need enough runway for us to see the request and confirm it.
const SAME_DAY_LEAD_MINUTES = 60;

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

const pad = (value: number) => String(value).padStart(2, "0");
const dateKey = (year: number, month: number, day: number) => `${year}-${pad(month + 1)}-${pad(day)}`;

/** Today in the visitor's chosen timezone, as YYYY-MM-DD (en-CA formats that way). */
function todayInTimezone(timezone: string) {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  } catch {
    return new Intl.DateTimeFormat("en-CA").format(new Date());
  }
}

function minutesNowInTimezone(timezone: string) {
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: timezone,
      hourCycle: "h23",
      hour: "2-digit",
      minute: "2-digit",
    }).formatToParts(new Date());
    const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
    const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0);
    return hour * 60 + minute;
  } catch {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  }
}

function addDays(key: string, days: number) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

function formatSlot(minutes: number, hourFormat: "12h" | "24h") {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  if (hourFormat === "24h") return `${pad(hour)}:${pad(minute)}`;
  const suffix = hour >= 12 ? "pm" : "am";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${pad(minute)}${suffix}`;
}

/** "2026-08-22" -> "2026-08-01", so month bounds compare as plain strings. */
function monthStartKey(key: string) {
  return `${key.slice(0, 7)}-01`;
}

function timeToMinutes(value: string) {
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
}

function ordinal(day: number) {
  if (day > 3 && day < 21) return `${day}th`;
  switch (day % 10) {
    case 1: return `${day}st`;
    case 2: return `${day}nd`;
    case 3: return `${day}rd`;
    default: return `${day}th`;
  }
}

/** Renders a YYYY-MM-DD key without letting the browser timezone shift the day. */
function keyToUtcDate(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function MeetingBookingForm() {
  const [form, setForm] = useState(initialState);
  const [step, setStep] = useState<"slot" | "details">("slot");
  const [hourFormat, setHourFormat] = useState<"12h" | "24h">("12h");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const today = todayInTimezone(form.timezone);
  const lastBookableDay = addDays(today, BOOKING_WINDOW_DAYS);

  const [viewMonth, setViewMonth] = useState(() => {
    const [year, month] = todayInTimezone(initialState.timezone).split("-").map(Number);
    return { year, month: month - 1 };
  });

  const phoneRequired = form.meetingType === "Phone call" || form.meetingType === "WhatsApp call";

  const monthCells = useMemo(() => {
    const firstWeekday = new Date(Date.UTC(viewMonth.year, viewMonth.month, 1)).getUTCDay();
    const daysInMonth = new Date(Date.UTC(viewMonth.year, viewMonth.month + 1, 0)).getUTCDate();
    const cells: Array<{ key: string; day: number; selectable: boolean } | null> = [];
    for (let index = 0; index < firstWeekday; index += 1) cells.push(null);
    for (let day = 1; day <= daysInMonth; day += 1) {
      const key = dateKey(viewMonth.year, viewMonth.month, day);
      const weekday = new Date(Date.UTC(viewMonth.year, viewMonth.month, day)).getUTCDay();
      cells.push({
        key,
        day,
        // Sundays are closed; everything else inside the booking window is open.
        selectable: key >= today && key <= lastBookableDay && weekday !== 0,
      });
    }
    return cells;
  }, [viewMonth, today, lastBookableDay]);

  const slots = useMemo(() => {
    if (!form.date) return [];
    const earliest =
      form.date === today ? minutesNowInTimezone(form.timezone) + SAME_DAY_LEAD_MINUTES : 0;
    const values: number[] = [];
    for (let minutes = SLOT_START_MINUTES; minutes < SLOT_END_MINUTES; minutes += SLOT_STEP_MINUTES) {
      if (minutes >= earliest) values.push(minutes);
    }
    return values;
  }, [form.date, form.timezone, today]);

  const monthLabel = new Intl.DateTimeFormat("en-US", { month: "long", timeZone: "UTC" }).format(
    new Date(Date.UTC(viewMonth.year, viewMonth.month, 1)),
  );
  const viewMonthStart = dateKey(viewMonth.year, viewMonth.month, 1);
  const canGoBack = viewMonthStart > monthStartKey(today);
  const canGoForward = viewMonthStart < monthStartKey(lastBookableDay);

  function shiftMonth(offset: number) {
    setViewMonth((current) => {
      const next = new Date(Date.UTC(current.year, current.month + offset, 1));
      return { year: next.getUTCFullYear(), month: next.getUTCMonth() };
    });
  }

  function selectSlot(minutes: number) {
    setForm((current) => ({ ...current, time: `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}` }));
    setStep("details");
    setStatus("idle");
    setFeedback("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.topic) {
      setStatus("error");
      setFeedback("Please choose a meeting topic.");
      return;
    }
    if (phoneRequired && !form.phone.trim()) {
      setStatus("error");
      setFeedback("A phone number is required for call meetings.");
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
      if (!response.ok) throw new Error(payload.message || "Meeting request failed to send.");

      setStatus("success");
      setFeedback(payload.message || "Meeting request sent.");
      trackLead();
      setForm(initialState);
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Meeting request failed to send.");
    }
  }

  const fieldClass =
    "h-11 rounded-xl border-[var(--border)] bg-[var(--surface)] px-3.5 text-sm font-medium text-[var(--foreground)] shadow-none placeholder:text-[var(--muted)] focus-visible:border-[#ff5400] focus-visible:ring-[2px] focus-visible:ring-[#ff5400]/20";
  const metaSelectClass =
    "h-10 w-full rounded-xl border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-semibold text-[var(--foreground)] shadow-none focus-visible:border-[#ff5400] focus-visible:ring-[2px] focus-visible:ring-[#ff5400]/20";

  const selectedDate = form.date ? keyToUtcDate(form.date) : null;
  const selectedDayLabel = selectedDate
    ? `${new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "UTC" }).format(selectedDate)} ${ordinal(selectedDate.getUTCDate())}`
    : "";
  const selectedFullLabel = selectedDate
    ? new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" }).format(selectedDate)
    : "";

  if (status === "success") {
    return (
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-sm">
        <div className="flex flex-col items-center px-5 py-12 text-center">
          {/* Mounted only by this branch, so it fires once per booked slot. */}
          <ConfettiBurst />
          <span className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
            <CalendarCheck className="size-5" aria-hidden="true" />
          </span>
          <h3 className="mt-4 font-display text-lg font-bold text-[var(--foreground)]">Meeting requested</h3>
          <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-[var(--muted)]">
            {feedback} The slot is held only once our team confirms it by email.
          </p>
          <Button
            type="button"
            onClick={() => {
              setStatus("idle");
              setFeedback("");
              setStep("slot");
            }}
            className="mt-5 h-10 rounded-xl bg-[#ff5400] px-5 text-xs font-bold text-white hover:bg-[#e64c00]"
          >
            Book another time
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-sm">
      <header className="flex items-center gap-3 border-b border-[var(--border)] px-5 py-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
          <CalendarDays className="size-4.5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-display text-[15px] font-bold leading-tight text-[var(--foreground)]">
            Schedule a meeting
          </h2>
          <p className="text-xs leading-tight text-[var(--muted)]">Pick a slot — we confirm it by email</p>
        </div>
      </header>

      <div className="grid gap-2.5 border-b border-[var(--border)] px-5 py-3.5 sm:grid-cols-2">
        <div>
          <Label htmlFor="meeting-topic" className="sr-only">Meeting topic</Label>
          <Select value={form.topic} onValueChange={(topic) => setForm((current) => ({ ...current, topic }))}>
            <SelectTrigger id="meeting-topic" className={metaSelectClass} aria-required="true">
              <SelectValue placeholder="Select topic" />
            </SelectTrigger>
            <SelectContent position="popper">
              {topics.map((topic) => <SelectItem key={topic} value={topic}>{topic}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="meeting-duration" className="sr-only">Duration</Label>
          <Select value={form.duration} onValueChange={(duration) => setForm((current) => ({ ...current, duration }))}>
            <SelectTrigger id="meeting-duration" className={metaSelectClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              {durations.map((duration) => <SelectItem key={duration} value={duration}>{duration}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="meeting-type" className="sr-only">Meeting format</Label>
          <Select value={form.meetingType} onValueChange={(meetingType) => setForm((current) => ({ ...current, meetingType }))}>
            <SelectTrigger id="meeting-type" className={metaSelectClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              {meetingTypes.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="meeting-timezone" className="sr-only">Timezone</Label>
          <Select
            value={form.timezone}
            onValueChange={(timezone) => setForm((current) => ({ ...current, timezone, date: "", time: "" }))}
          >
            <SelectTrigger id="meeting-timezone" className={metaSelectClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              {commonTimezones.map((timezone) => (
                <SelectItem key={timezone} value={timezone}>{timezone.replaceAll("_", " ")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {step === "slot" ? (
        <div className="grid gap-4 p-5 sm:grid-cols-[1fr_10rem]">
          <div>
            <div className="mb-2.5 flex items-center justify-between">
              <p className="text-sm font-bold text-[var(--foreground)]">
                {monthLabel} <span className="font-medium text-[var(--muted)]">{viewMonth.year}</span>
              </p>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => shiftMonth(-1)}
                  disabled={!canGoBack}
                  aria-label="Previous month"
                  className="flex size-7 items-center justify-center rounded-lg text-[var(--muted)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--foreground)] disabled:pointer-events-none disabled:opacity-30"
                >
                  <ChevronLeft className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => shiftMonth(1)}
                  disabled={!canGoForward}
                  aria-label="Next month"
                  className="flex size-7 items-center justify-center rounded-lg text-[var(--muted)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--foreground)] disabled:pointer-events-none disabled:opacity-30"
                >
                  <ChevronRight className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {weekdayLabels.map((weekday) => (
                <div key={weekday} className="pb-1 text-center text-[10px] font-bold tracking-wide text-[var(--muted)]">
                  {weekday}
                </div>
              ))}
              {monthCells.map((cell, index) =>
                cell === null ? (
                  <div key={`blank-${index}`} />
                ) : (
                  <button
                    key={cell.key}
                    type="button"
                    disabled={!cell.selectable}
                    aria-pressed={form.date === cell.key}
                    onClick={() => setForm((current) => ({ ...current, date: cell.key, time: "" }))}
                    className={`flex aspect-square items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                      form.date === cell.key
                        ? "bg-[#ff5400] text-white shadow-[0_4px_12px_rgba(255,84,0,0.3)]"
                        : cell.selectable
                          ? "bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
                          : "text-[var(--muted)] opacity-40"
                    }`}
                  >
                    {cell.day}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="min-w-0">
            <div className="mb-2.5 flex items-center justify-between gap-2">
              <p className="truncate text-sm font-bold text-[var(--foreground)]">
                {selectedDayLabel || "Pick a day"}
              </p>
              <div className="flex shrink-0 rounded-lg bg-[var(--surface)] p-0.5">
                {(["12h", "24h"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setHourFormat(option)}
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold transition-colors ${
                      hourFormat === option
                        ? "bg-[var(--panel)] text-[var(--foreground)] shadow-sm"
                        : "text-[var(--muted)]"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {form.date ? (
              slots.length > 0 ? (
                <div className="max-h-[266px] space-y-1.5 overflow-y-auto pr-1">
                  {slots.map((minutes) => (
                    <button
                      key={minutes}
                      type="button"
                      onClick={() => selectSlot(minutes)}
                      className="w-full rounded-lg border border-[var(--border)] py-2 text-xs font-semibold text-[var(--foreground)] transition-colors hover:border-[#ff5400] hover:bg-[#ff5400]/10 hover:text-[#ff5400]"
                    >
                      {formatSlot(minutes, hourFormat)}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="rounded-lg bg-[var(--surface)] px-3 py-6 text-center text-[11px] font-medium text-[var(--muted)]">
                  No slots left today. Try another day.
                </p>
              )
            ) : (
              <p className="rounded-lg bg-[var(--surface)] px-3 py-6 text-center text-[11px] font-medium text-[var(--muted)]">
                Select a date to see open times.
              </p>
            )}
          </div>
        </div>
      ) : (
        <form className="space-y-3 p-5" onSubmit={handleSubmit} noValidate>
          <button
            type="button"
            onClick={() => {
              setStep("slot");
              setForm((current) => ({ ...current, time: "" }));
            }}
            className="flex items-center gap-2 rounded-xl bg-[#ff5400]/10 px-3 py-2 text-xs font-bold text-[#ff5400] transition-colors hover:bg-[#ff5400]/15"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            {selectedFullLabel} · {formatSlot(timeToMinutes(form.time), hourFormat)} · {form.timezone}
          </button>

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

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="meeting-name" className="sr-only">Name</Label>
              <Input
                id="meeting-name"
                name="name"
                required
                autoComplete="name"
                maxLength={120}
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                className={fieldClass}
                placeholder="Your name"
              />
            </div>
            <div>
              <Label htmlFor="meeting-email" className="sr-only">Email</Label>
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
                placeholder="Email address"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="meeting-phone" className="sr-only">Phone or WhatsApp</Label>
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
              placeholder={phoneRequired ? "Phone / WhatsApp (required for calls)" : "Phone / WhatsApp (optional)"}
            />
          </div>

          <div>
            <Label htmlFor="meeting-agenda" className="sr-only">Agenda</Label>
            <Textarea
              id="meeting-agenda"
              name="agenda"
              required
              rows={4}
              maxLength={3000}
              value={form.agenda}
              onChange={(event) => setForm((current) => ({ ...current, agenda: event.target.value }))}
              className="min-h-[110px] resize-y rounded-xl border-[var(--border)] bg-[var(--surface)] px-3.5 py-3 text-sm font-medium text-[var(--foreground)] shadow-none placeholder:text-[var(--muted)] focus-visible:border-[#ff5400] focus-visible:ring-[2px] focus-visible:ring-[#ff5400]/20"
              placeholder="What would you like to cover?"
            />
          </div>

          <Button
            type="submit"
            disabled={status === "loading"}
            className="h-11 w-full rounded-xl bg-emerald-600 text-sm font-bold text-white shadow-[0_6px_16px_rgba(5,150,105,0.25)] transition-colors hover:bg-emerald-700"
          >
            {status === "loading" ? (
              <LoaderCircle className="animate-spin" aria-hidden="true" />
            ) : (
              <CalendarCheck className="size-4" aria-hidden="true" />
            )}
            {status === "loading" ? "Sending request..." : "Schedule appointment"}
          </Button>

          <p
            aria-live="polite"
            className={`text-center text-[11px] font-semibold ${status === "error" ? "text-red-500" : "text-[var(--muted)]"}`}
          >
            {feedback || "No payment required. Confirmation arrives by email."}
          </p>
        </form>
      )}
    </div>
  );
}
