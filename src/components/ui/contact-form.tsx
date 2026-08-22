"use client";

import { FormEvent, useState } from "react";
import { Clock3, LifeBuoy, LoaderCircle, MessageSquare, Send } from "lucide-react";
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

// Mirrors the service titles in `services` (src/lib/site-data.ts). Kept as a
// local list so the contact page does not pull the whole site-data module
// (portfolio, team, testimonials, FAQs) into its client bundle for a few labels.
const categoryOptions = [
  "Web Development",
  "App Development",
  "SaaS Applications",
  "CRM & Management Systems",
  "SEO & Growth",
  "Graphic Design",
  "Something else",
];

// Must stay in sync with the `priorities` allow-list in src/app/api/contact/route.ts.
const priorityOptions = ["Normal", "High", "Urgent"];

// Illustrative only — inquiries are emailed, not stored, so there is no real
// queue to read from. Swap for live rows once inquiries are persisted.
const reservedTickets = [
  { id: "vq-1", label: "Ecommerce replatform — Shopify to Next.js", age: "2 hours ago" },
  { id: "vq-2", label: "AI support agent for a logistics dashboard", age: "1 day ago" },
];

const MESSAGE_LIMIT = 5000;

const initialState = {
  name: "",
  email: "",
  service: "",
  priority: "",
  subject: "",
  message: "",
  companyWebsite: "",
};

type FieldErrors = Partial<Record<"name" | "email" | "service" | "subject" | "message", string>>;

function validate(form: typeof initialState): FieldErrors {
  const errors: FieldErrors = {};
  if (form.name.trim().length < 2) errors.name = "Enter your full name.";
  // Same shape check the API applies, so users see the problem before the round trip.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) errors.email = "Enter a valid email address.";
  if (!form.service) errors.service = "Pick a category.";
  if (form.subject.trim().length < 3) errors.subject = "Add a short subject.";
  if (form.message.trim().length < 10) errors.message = "Describe the project in a little more detail.";
  return errors;
}

const fieldClass =
  "h-11 rounded-xl border-[var(--border)] bg-[var(--surface)] px-3.5 text-sm font-medium text-[var(--foreground)] shadow-none placeholder:text-[var(--muted)] focus-visible:border-[#ff5400] focus-visible:ring-[2px] focus-visible:ring-[#ff5400]/20";
const invalidClass = "border-red-500/70 focus-visible:border-red-500 focus-visible:ring-red-500/20";
const errorClass = "mt-1 text-[11px] font-semibold text-red-500";
const srLabel = "sr-only";

export function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  function update<K extends keyof typeof initialState>(key: K, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    // Clear the field's error as soon as the user starts fixing it.
    setErrors((current) => (current[key as keyof FieldErrors] ? { ...current, [key]: undefined } : current));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus("error");
      setFeedback("Please fix the highlighted fields.");
      return;
    }

    setErrors({});
    setStatus("loading");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(payload.message || "Message failed to send.");

      setStatus("success");
      setFeedback(payload.message || "Inquiry sent.");
      trackLead();
      setForm(initialState);
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Message failed to send.");
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-sm">
      <header className="flex items-center gap-3 border-b border-[var(--border)] px-5 py-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#ff5400]/10 text-[#ff5400]">
          <LifeBuoy className="size-4.5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-display text-[15px] font-bold leading-tight text-[var(--foreground)]">
            Contact Voquarn Code
          </h2>
          <p className="text-xs leading-tight text-[var(--muted)]">We typically respond within 24 hours</p>
        </div>
      </header>

      {status === "success" ? (
        <div className="flex flex-col items-center px-5 py-12 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-[#ff5400]/10 text-[#ff5400]">
            <Send className="size-5" aria-hidden="true" />
          </span>
          <h3 className="mt-4 font-display text-lg font-bold text-[var(--foreground)]">Inquiry received</h3>
          <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-[var(--muted)]">
            {feedback} We will review the details and reply within 24 hours.
          </p>
          <Button
            type="button"
            onClick={() => {
              setStatus("idle");
              setFeedback("");
            }}
            className="mt-5 h-10 rounded-xl bg-[#ff5400] px-5 text-xs font-bold text-white hover:bg-[#e64c00]"
          >
            Send another inquiry
          </Button>
        </div>
      ) : (
        <form className="space-y-3 p-5" onSubmit={handleSubmit} noValidate>
          <div className="sr-only" aria-hidden="true">
            <Label htmlFor="contact-company-website">Company website</Label>
            <Input
              id="contact-company-website"
              name="companyWebsite"
              tabIndex={-1}
              autoComplete="off"
              value={form.companyWebsite}
              onChange={(event) => update("companyWebsite", event.target.value)}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="contact-name" className={srLabel}>Name</Label>
              <Input
                id="contact-name"
                name="name"
                autoComplete="name"
                maxLength={120}
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "contact-name-error" : undefined}
                className={`${fieldClass} ${errors.name ? invalidClass : ""}`}
                placeholder="Your name"
              />
              {errors.name ? <p id="contact-name-error" className={errorClass}>{errors.name}</p> : null}
            </div>
            <div>
              <Label htmlFor="contact-email" className={srLabel}>Email</Label>
              <Input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "contact-email-error" : undefined}
                className={`${fieldClass} ${errors.email ? invalidClass : ""}`}
                placeholder="Email address"
              />
              {errors.email ? <p id="contact-email-error" className={errorClass}>{errors.email}</p> : null}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_9rem]">
            <div>
              <Label htmlFor="contact-service" className={srLabel}>Category</Label>
              <Select value={form.service} onValueChange={(service) => update("service", service)}>
                <SelectTrigger
                  id="contact-service"
                  aria-required="true"
                  aria-invalid={Boolean(errors.service)}
                  aria-describedby={errors.service ? "contact-service-error" : undefined}
                  className={`w-full ${fieldClass} ${errors.service ? invalidClass : ""}`}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {categoryOptions.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.service ? <p id="contact-service-error" className={errorClass}>{errors.service}</p> : null}
            </div>
            <div>
              <Label htmlFor="contact-priority" className={srLabel}>Priority</Label>
              <Select value={form.priority} onValueChange={(priority) => update("priority", priority)}>
                <SelectTrigger id="contact-priority" className={`w-full ${fieldClass}`}>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {priorityOptions.map((priority) => (
                    <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="contact-subject" className={srLabel}>Subject</Label>
            <Input
              id="contact-subject"
              name="subject"
              maxLength={150}
              value={form.subject}
              onChange={(event) => update("subject", event.target.value)}
              aria-invalid={Boolean(errors.subject)}
              aria-describedby={errors.subject ? "contact-subject-error" : undefined}
              className={`${fieldClass} ${errors.subject ? invalidClass : ""}`}
              placeholder="Subject"
            />
            {errors.subject ? <p id="contact-subject-error" className={errorClass}>{errors.subject}</p> : null}
          </div>

          <div>
            <Label htmlFor="contact-message" className={srLabel}>Project details</Label>
            <Textarea
              id="contact-message"
              name="message"
              rows={6}
              maxLength={MESSAGE_LIMIT}
              value={form.message}
              onChange={(event) => update("message", event.target.value)}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "contact-message-error" : undefined}
              className={`min-h-[150px] resize-y rounded-xl border-[var(--border)] bg-[var(--surface)] px-3.5 py-3 text-sm font-medium text-[var(--foreground)] shadow-none placeholder:text-[var(--muted)] focus-visible:border-[#ff5400] focus-visible:ring-[2px] focus-visible:ring-[#ff5400]/20 ${errors.message ? invalidClass : ""}`}
              placeholder="Describe your project — goals, timeline, and budget range."
            />
            {errors.message ? <p id="contact-message-error" className={errorClass}>{errors.message}</p> : null}
          </div>

          <Button
            type="submit"
            disabled={status === "loading"}
            className="h-11 w-full rounded-xl bg-[#ff5400] text-sm font-bold text-white shadow-[0_6px_16px_rgba(255,84,0,0.25)] transition-colors hover:bg-[#e64c00]"
          >
            {status === "loading" ? (
              <LoaderCircle className="animate-spin" aria-hidden="true" />
            ) : (
              <Send className="size-4" aria-hidden="true" />
            )}
            {status === "loading" ? "Sending..." : "Send Message"}
          </Button>

          <p
            aria-live="polite"
            className={`text-center text-[11px] font-semibold ${status === "error" ? "text-red-500" : "text-[var(--muted)]"}`}
          >
            {feedback || "No spam — your details are only used to reply to this inquiry."}
          </p>
        </form>
      )}

      <section className="border-t border-[var(--border)] px-5 py-4">
        <h3 className="flex items-center gap-2 text-xs font-semibold text-[var(--muted)]">
          <Clock3 className="size-3.5" aria-hidden="true" />
          Reserved tickets
        </h3>
        <ul className="mt-3 space-y-2">
          {reservedTickets.map((ticket) => (
            <li
              key={ticket.id}
              className="flex items-center gap-3 rounded-xl bg-[var(--surface)] px-3.5 py-2.5"
            >
              <MessageSquare className="size-3.5 shrink-0 text-[var(--muted)]" aria-hidden="true" />
              {/* Subjects belong to other clients, so only the age is legible. */}
              <span className="min-w-0 flex-1 select-none truncate text-sm font-semibold text-[var(--foreground)] blur-[5px]" aria-hidden="true">
                {ticket.label}
              </span>
              <span className="shrink-0 text-[11px] font-medium text-[var(--muted)]">{ticket.age}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2.5 text-[11px] text-[var(--muted)]">
          Details are hidden — we never show one client&rsquo;s brief to another.
        </p>
      </section>
    </div>
  );
}
