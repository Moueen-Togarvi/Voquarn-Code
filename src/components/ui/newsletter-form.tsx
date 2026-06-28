"use client";

import { FormEvent, useState } from "react";

type NewsletterFormProps = {
  compact?: boolean;
};

export function NewsletterForm({ compact = false }: NewsletterFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message || "Subscription failed.");
      }

      setStatus("success");
      setMessage(payload.message || "Subscribed.");
      event.currentTarget.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Subscription failed.");
    }
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div className={compact ? "flex flex-col gap-3 sm:flex-row" : "flex flex-col gap-3"}>
        <input
          required
          name="email"
          type="email"
          placeholder="you@company.com"
          className="w-full rounded-full border border-[var(--border)] bg-[var(--panel)] px-5 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[#ff5400]"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full bg-[#ff5400] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff6b21] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "loading" ? "Joining..." : "Join"}
        </button>
      </div>
      {message ? (
        <p className={`text-sm ${status === "error" ? "text-red-500" : "text-[#14b8a6]"}`}>{message}</p>
      ) : null}
    </form>
  );
}
