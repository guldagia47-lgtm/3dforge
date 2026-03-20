import { useMemo, useState } from "react";
import type { AppPath } from "@/app/navigation";
import { useAuth } from "@/auth/AuthProvider";

type VerifyPageProps = {
  onNavigate: (path: AppPath) => void;
};

export default function VerifyPage({ onNavigate }: VerifyPageProps) {
  const { resendVerification, error } = useAuth();
  const [email, setEmail] = useState(window.sessionStorage.getItem("verificationEmail") ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const copy = useMemo(
    () =>
      email
        ? `We sent a verification email to ${email}. Open the link to activate your session.`
        : "Check your inbox and follow the verification link to activate your session.",
    [email]
  );

  return (
    <div className="mx-auto flex min-h-[calc(100vh-5.5rem)] max-w-4xl items-center px-6 py-10 lg:px-8">
      <div className="w-full glass-panel rounded-[2rem] p-8 shadow-2xl shadow-slate-950/30">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-indigo-100/80">Email verification</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">Confirm your inbox</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">{copy}</p>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <label className="block space-y-2 text-sm">
            <span className="text-slate-200">Email address</span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400"
              placeholder="you@company.com"
              type="email"
            />
          </label>

          <button
            type="button"
            disabled={busy || !email}
            onClick={async () => {
              setBusy(true);
              setMessage(null);

              const result = await resendVerification(email);

              if (!result.ok) {
                setMessage(result.message);
              } else {
                setMessage("Verification email sent again. Check spam if it does not arrive.");
                window.sessionStorage.setItem("verificationEmail", email);
              }

              setBusy(false);
            }}
            className="rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Sending..." : "Resend email"}
          </button>
        </div>

        {message ? <p className="mt-4 text-sm text-emerald-300">{message}</p> : null}
        {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}

        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <button
            type="button"
            onClick={() => onNavigate("/auth")}
            className="rounded-full border border-white/10 bg-white/4 px-4 py-2 text-white transition hover:bg-white/8"
          >
            Back to sign in
          </button>
          <button
            type="button"
            onClick={() => onNavigate("/dashboard")}
            className="rounded-full border border-white/10 bg-white/4 px-4 py-2 text-white transition hover:bg-white/8"
          >
            I already verified
          </button>
        </div>

        <p className="mt-8 text-sm leading-7 text-slate-400">
          The final verification link should point to <span className="text-white">/auth/callback</span>. That route exchanges the code for a live session and then sends the user to the protected area.
        </p>
      </div>
    </div>
  );
}
