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
    <form className="panel rounded-[2rem] p-6 sm:p-8" onSubmit={handleSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-[rgba(233,238,242,0.72)]">
          <span>Name</span>
          <input
            required
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#14b8a6]"
          />
        </label>
        <label className="space-y-2 text-sm text-[rgba(233,238,242,0.72)]">
          <span>Email</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#14b8a6]"
          />
        </label>
        <label className="space-y-2 text-sm text-[rgba(233,238,242,0.72)]">
          <span>Service</span>
          <select
            required
            value={form.service}
            onChange={(event) => setForm((current) => ({ ...current, service: event.target.value }))}
            className="w-full rounded-2xl border border-white/10 bg-[#07111a] px-4 py-3 text-white outline-none focus:border-[#14b8a6]"
          >
            <option value="">Select one</option>
            <option value="Web Development">Web Development</option>
            <option value="App Development">App Development</option>
            <option value="SEO">SEO</option>
            <option value="AI Solutions">AI Solutions</option>
            <option value="Graphic Design">Graphic Design</option>
          </select>
        </label>
        <label className="space-y-2 text-sm text-[rgba(233,238,242,0.72)]">
          <span>Budget</span>
          <input
            required
            value={form.budget}
            onChange={(event) => setForm((current) => ({ ...current, budget: event.target.value }))}
            placeholder="PKR 250,000"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#14b8a6]"
          />
        </label>
      </div>

      <label className="mt-5 block space-y-2 text-sm text-[rgba(233,238,242,0.72)]">
        <span>Project details</span>
        <textarea
          required
          rows={6}
          value={form.message}
          onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
          className="w-full rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#14b8a6]"
          placeholder="Share your goals, timeline, and what you want the project to improve."
        />
      </label>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full bg-[#f59e0b] px-6 py-3 text-sm font-semibold text-[#07111a] hover:bg-[#fbbf24] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "loading" ? "Sending..." : "Send Inquiry"}
        </button>
        {feedback ? (
          <p className={`text-sm ${status === "error" ? "text-[#fca5a5]" : "text-[#99f6e4]"}`}>{feedback}</p>
        ) : null}
      </div>
    </form>
  );
}
