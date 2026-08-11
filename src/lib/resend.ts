type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
  attachments?: { filename: string; content: string }[];
};

type SendEmailResult =
  | { ok: true }
  | { ok: false; status: number; sandboxMode: boolean; raw: string };

/** Thin wrapper around Resend's REST API — no SDK dependency, matches the codebase's existing raw-fetch pattern. */
export async function sendResendEmail(apiKey: string, input: SendEmailInput): Promise<SendEmailResult> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: input.from || "Voquarn Code <hello@voquarn.com>",
      to: Array.isArray(input.to) ? input.to : [input.to],
      reply_to: input.replyTo,
      subject: input.subject,
      html: input.html,
      attachments: input.attachments && input.attachments.length > 0 ? input.attachments : undefined,
    }),
  });

  if (response.ok) {
    return { ok: true };
  }

  const raw = await response.text();
  let sandboxMode = false;
  try {
    const parsed = JSON.parse(raw);
    sandboxMode = parsed.statusCode === 403 || Boolean(parsed.message?.includes("testing emails"));
  } catch {
    // Non-JSON error body — fall through with sandboxMode left false.
  }

  return { ok: false, status: response.status, sandboxMode, raw };
}
