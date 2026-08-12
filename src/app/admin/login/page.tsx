"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  MailCheck,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";

type LoginStep = "password" | "code";

type RequestCodeResponse = {
  challengeId?: string;
  maskedEmail?: string;
  expiresInSeconds?: number;
  resendAfterSeconds?: number;
  message?: string;
};

type VerifyCodeResponse = {
  challengeId?: string;
  loginToken?: string;
  message?: string;
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<LoginStep>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("your admin email");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [expiresIn, setExpiresIn] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (step !== "code" || (resendIn <= 0 && expiresIn <= 0)) return;

    const timer = window.setInterval(() => {
      setResendIn((seconds) => Math.max(0, seconds - 1));
      setExpiresIn((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [step, resendIn, expiresIn]);

  const requestCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/admin/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = (await response.json()) as RequestCodeResponse;

      if (!response.ok || !result.challengeId) {
        setError(result.message || "Unable to send a verification code.");
        return;
      }

      setChallengeId(result.challengeId);
      setMaskedEmail(result.maskedEmail || "your admin email");
      setExpiresIn(result.expiresInSeconds || 300);
      setResendIn(result.resendAfterSeconds || 60);
      setPassword("");
      setStep("code");
      toast.success("Verification code sent");
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!/^\d{6}$/.test(code)) {
      setError("Enter the 6-digit code from your email.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/admin/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId, code }),
      });
      const result = (await response.json()) as VerifyCodeResponse;

      if (!response.ok || !result.loginToken || !result.challengeId) {
        setError(result.message || "The verification code could not be verified.");
        return;
      }

      const signInResult = await signIn("credentials", {
        challengeId: result.challengeId,
        loginToken: result.loginToken,
        redirect: false,
      });

      if (signInResult?.error) {
        setError("The verified login expired. Please start again.");
        return;
      }

      toast.success("Welcome back!");
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Unable to complete sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    if (!challengeId || resendIn > 0 || resending) return;

    setError("");
    setResending(true);
    try {
      const response = await fetch("/api/auth/admin/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId }),
      });
      const result = (await response.json()) as RequestCodeResponse;

      if (!response.ok) {
        setError(result.message || "Unable to resend the code.");
        return;
      }

      setCode("");
      setExpiresIn(300);
      setResendIn(result.resendAfterSeconds || 60);
      toast.success("A new code was sent");
    } catch {
      setError("Unable to resend the code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const restartLogin = () => {
    setStep("password");
    setCode("");
    setChallengeId("");
    setError("");
    setResendIn(0);
    setExpiresIn(0);
  };

  const expiryLabel = `${Math.floor(expiresIn / 60)}:${(expiresIn % 60)
    .toString()
    .padStart(2, "0")}`;

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[var(--background)] px-6 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Image
            src="/finalvoquarn-logo.png"
            alt="Voquarn Code"
            width={180}
            height={60}
            priority
            className="h-14 w-auto object-contain"
          />
        </div>

        <section
          className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-7 shadow-lg sm:p-8"
          aria-labelledby="admin-login-title"
        >
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ff5400]/10 text-[#ff5400]">
              {step === "password" ? (
                <ShieldCheck aria-hidden="true" size={24} />
              ) : (
                <MailCheck aria-hidden="true" size={24} />
              )}
            </div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#ff5400]">
              Step {step === "password" ? "1" : "2"} of 2
            </p>
            <h1 id="admin-login-title" className="text-2xl font-bold text-[var(--foreground)]">
              {step === "password" ? "Admin Login" : "Check your email"}
            </h1>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              {step === "password"
                ? "Enter your admin credentials to receive a secure verification code."
                : `We sent a 6-digit code to ${maskedEmail}.`}
            </p>
          </div>

          {error ? (
            <p
              role="alert"
              className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-5 text-red-600"
            >
              {error}
            </p>
          ) : null}

          {step === "password" ? (
            <form onSubmit={requestCode} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)]">
                  Admin email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="username"
                  inputMode="email"
                  required
                  aria-invalid={Boolean(error)}
                  className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-base text-[var(--foreground)] outline-none transition focus:border-[#ff5400] focus:ring-2 focus:ring-[#ff5400]/20"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-[var(--foreground)]">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                    aria-invalid={Boolean(error)}
                    className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 pr-12 text-base text-[var(--foreground)] outline-none transition focus:border-[#ff5400] focus:ring-2 focus:ring-[#ff5400]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-[var(--muted)] transition hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5400]/30"
                  >
                    {showPassword ? <EyeOff aria-hidden="true" size={18} /> : <Eye aria-hidden="true" size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#ff5400] px-4 text-sm font-bold text-white transition hover:bg-[#e04800] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5400]/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <Loader2 className="animate-spin" aria-hidden="true" size={17} /> : <MailCheck aria-hidden="true" size={17} />}
                {loading ? "Sending code..." : "Continue with email code"}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyCode} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="verification-code" className="block text-sm font-medium text-[var(--foreground)]">
                  Verification code
                </label>
                <input
                  id="verification-code"
                  type="text"
                  value={code}
                  onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  autoComplete="one-time-code"
                  autoFocus
                  required
                  aria-describedby="code-help"
                  aria-invalid={Boolean(error)}
                  className="h-14 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-center text-2xl font-bold tabular-nums tracking-[0.35em] text-[var(--foreground)] outline-none transition focus:border-[#ff5400] focus:ring-2 focus:ring-[#ff5400]/20"
                />
                <p id="code-help" className="text-center text-xs tabular-nums text-[var(--muted)]">
                  {expiresIn > 0 ? `Code expires in ${expiryLabel}` : "Code expired — start a new login attempt."}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || expiresIn <= 0 || code.length !== 6}
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#ff5400] px-4 text-sm font-bold text-white transition hover:bg-[#e04800] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5400]/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <Loader2 className="animate-spin" aria-hidden="true" size={17} /> : <ShieldCheck aria-hidden="true" size={17} />}
                {loading ? "Verifying..." : "Verify and sign in"}
              </button>

              <div className="flex flex-col items-center justify-between gap-2 border-t border-[var(--border)] pt-4 text-sm sm:flex-row">
                <button
                  type="button"
                  onClick={restartLogin}
                  className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-2 font-medium text-[var(--muted)] transition hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5400]/30"
                >
                  <ArrowLeft aria-hidden="true" size={16} />
                  Start again
                </button>
                <button
                  type="button"
                  onClick={resendCode}
                  disabled={resendIn > 0 || expiresIn <= 0 || resending}
                  className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-2 font-medium text-[#ff5400] transition hover:text-[#e04800] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5400]/30 disabled:cursor-not-allowed disabled:text-[var(--muted)]"
                >
                  {resending ? <Loader2 className="animate-spin" aria-hidden="true" size={16} /> : <RefreshCw aria-hidden="true" size={16} />}
                  {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
                </button>
              </div>
            </form>
          )}

          <p className="mt-6 text-center text-xs leading-5 text-[var(--muted)]">
            Protected by password verification and a single-use email code.
          </p>
        </section>
      </div>
    </main>
  );
}
