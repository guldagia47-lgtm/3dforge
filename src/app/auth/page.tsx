import { useEffect, useMemo, useState } from "react";
import type { AppPath } from "@/app/navigation";
import { useAuth } from "@/auth/AuthProvider";
import { validateSignupEmail } from "@/lib/emailPolicy";

type AuthPageProps = {
  onNavigate: (path: AppPath) => void;
};

const defaultRedirect: AppPath = "/dashboard";

function getPostAuthRedirect(): AppPath {
  const stored = window.sessionStorage.getItem("postAuthRedirect");

  if (stored === "/dashboard" || stored === "/create-model" || stored === "/library") {
    return stored;
  }

  return defaultRedirect;
}

export default function AuthPage({ onNavigate }: AuthPageProps) {
  const { session, loading, ready, error, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session) {
      onNavigate(getPostAuthRedirect());
    }
  }, [loading, onNavigate, session]);

  const headerCopy = useMemo(
    () => (mode === "sign-in" ? "Sign in to continue" : "Create your account"),
    [mode]
  );

  return (
    <div className="mx-auto flex min-h-[calc(100vh-5.5rem)] max-w-7xl items-center px-6 py-10 lg:px-8">
      <div className="grid w-full gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-indigo-100/80">Authentication</p>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white">{headerCopy}</h1>
            <p className="max-w-xl text-base leading-7 text-slate-300">
              Supabase manages sessions and protected access. Resend delivers the verification email, and the profile row is stored in the database after the user authenticates.
            </p>
          </div>

          <div className="space-y-3 text-sm leading-7 text-slate-400">
            <p>Fake email blocking strategy:</p>
            <p>
              Block disposable domains, reject obvious test aliases, rate-limit repeated attempts, and verify the inbox before granting access. The client-side filter here is a first pass only.
            </p>
          </div>

          <div className="glass-panel rounded-[2rem] p-6 text-sm leading-7 text-slate-300">
            <p className="font-medium text-white">What happens after sign up</p>
            <p className="mt-2">
              The app sends the user to a verification screen, then waits for the email link to land on <span className="text-white">/auth/callback</span> so Supabase can exchange the code for a live session.
            </p>
          </div>
        </section>

        <section className="glass-panel rounded-[2rem] p-6 shadow-2xl shadow-slate-950/30 backdrop-blur">
          <div className="flex gap-2 rounded-full border border-white/10 bg-white/4 p-1 text-sm">
            <button
              type="button"
              onClick={() => setMode("sign-in")}
              className={`flex-1 rounded-full px-4 py-2 transition ${mode === "sign-in" ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/6"}`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode("sign-up")}
              className={`flex-1 rounded-full px-4 py-2 transition ${mode === "sign-up" ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/6"}`}
            >
              Sign up
            </button>
          </div>

          <form
            className="mt-6 space-y-5"
            onSubmit={async (event) => {
              event.preventDefault();
              setBusy(true);
              setFormError(null);
              setStatus(null);

              try {
                const emailCheck = validateSignupEmail(email);

                if (mode === "sign-up" && !emailCheck.allowed) {
                  setFormError(emailCheck.reason);
                  return;
                }

                if (mode === "sign-up") {
                  if (fullName.trim().length < 2) {
                    setFormError("Enter a display name with at least two characters.");
                    return;
                  }

                  const result = await signUp({ email, password, fullName });

                  if (!result.ok) {
                    setFormError(result.message);
                    return;
                  }

                  if (result.needsVerification) {
                    window.sessionStorage.setItem("verificationEmail", email);
                    onNavigate("/auth/verify");
                    return;
                  }

                  onNavigate(getPostAuthRedirect());
                  return;
                }

                const result = await signIn({ email, password });

                if (!result.ok) {
                  if (result.needsVerification) {
                    window.sessionStorage.setItem("verificationEmail", email);
                    onNavigate("/auth/verify");
                  }

                  setFormError(result.message);
                  return;
                }

                onNavigate(getPostAuthRedirect());
              } finally {
                setBusy(false);
              }
            }}
          >
            {mode === "sign-up" ? (
              <label className="block space-y-2 text-sm">
                <span className="text-slate-200">Full name</span>
                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400"
                  placeholder="Avery Reed"
                />
              </label>
            ) : null}

            <label className="block space-y-2 text-sm">
              <span className="text-slate-200">Email</span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400"
                placeholder="you@company.com"
                autoComplete="email"
                type="email"
              />
            </label>

            <label className="block space-y-2 text-sm">
              <span className="text-slate-200">Password</span>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400"
                placeholder="At least 8 characters"
                autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
                type="password"
              />
            </label>

            {!ready ? (
              <p className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
                {error}
              </p>
            ) : null}

            {formError ? <p className="text-sm text-rose-300">{formError}</p> : null}
            {status ? <p className="text-sm text-emerald-300">{status}</p> : null}

            <button
              type="submit"
              disabled={busy || !ready}
              className="w-full rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition duration-200 hover:bg-indigo-100 hover:shadow-[0_18px_40px_rgba(255,255,255,0.12)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? "Working..." : mode === "sign-in" ? "Sign in" : "Create account"}
            </button>

            <div className="space-y-2 text-sm text-slate-400">
              <button
                type="button"
                onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}
                className="text-left text-white underline decoration-white/30 underline-offset-4"
              >
                {mode === "sign-in" ? "Need an account? Switch to sign up." : "Already have an account? Switch to sign in."}
              </button>
              <p>
                After verification, your profile row is upserted into the <span className="text-white">profiles</span> table so the dashboard can read user data immediately.
              </p>
              <p>
                The verification email is delivered by Supabase Auth. Configure Supabase SMTP to use Resend so the link arrives from your own verified sender domain.
              </p>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
