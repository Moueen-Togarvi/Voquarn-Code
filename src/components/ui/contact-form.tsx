"use client";

import { FormEvent, useState } from "react";

const initialState = {
  name: "",
  email: "",
  service: "",
  budget: "",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message || "Message failed to send.");
      }

      setStatus("success");
      setFeedback(payload.message || "Message sent.");
      setForm(initialState);
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Message failed to send.");
    }
  }

  return (
    <form className="bg-white border border-neutral-200/80 shadow-sm rounded-[2.5rem] p-8 sm:p-10" onSubmit={handleSubmit}>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="space-y-2 text-xs font-bold uppercase tracking-wider text-neutral-600">
          <span>Name</span>
          <input
            required
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 text-base normal-case font-medium text-neutral-900 outline-none transition-all focus:border-black focus:ring-1 focus:ring-black placeholder:text-neutral-400"
            placeholder="John Doe"
          />
        </label>
        <label className="space-y-2 text-xs font-bold uppercase tracking-wider text-neutral-600">
          <span>Email</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 text-base normal-case font-medium text-neutral-900 outline-none transition-all focus:border-black focus:ring-1 focus:ring-black placeholder:text-neutral-400"
            placeholder="john@example.com"
          />
        </label>
        <label className="space-y-2 text-xs font-bold uppercase tracking-wider text-neutral-600">
          <span>Service</span>
          <select
            required
            value={form.service}
            onChange={(event) => setForm((current) => ({ ...current, service: event.target.value }))}
            className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 text-base normal-case font-medium text-neutral-900 outline-none transition-all focus:border-black focus:ring-1 focus:ring-black appearance-none"
          >
            <option value="">Select one</option>
            <option value="Web Development">Web Development</option>
            <option value="App Development">App Development</option>
            <option value="AI & Automation">AI & Automation</option>
          </select>
        </label>
        <label className="space-y-2 text-xs font-bold uppercase tracking-wider text-neutral-600">
          <span>Budget</span>
          <input
            required
            value={form.budget}
            onChange={(event) => setForm((current) => ({ ...current, budget: event.target.value }))}
            placeholder="PKR 250,000"
            className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 text-base normal-case font-medium text-neutral-900 outline-none transition-all focus:border-black focus:ring-1 focus:ring-black placeholder:text-neutral-400"
          />
        </label>
      </div>

      <label className="mt-6 block space-y-2 text-xs font-bold uppercase tracking-wider text-neutral-600">
        <span>Project details</span>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
          className="w-full rounded-3xl border border-neutral-200 bg-neutral-50 px-5 py-4 text-base normal-case font-medium text-neutral-900 outline-none transition-all focus:border-black focus:ring-1 focus:ring-black placeholder:text-neutral-400 resize-none"
          placeholder="Share your goals, timeline, and what you want the project to achieve."
        />
      </label>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-neutral-100 pt-6">
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
