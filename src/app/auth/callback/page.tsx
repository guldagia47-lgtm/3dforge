import { useEffect, useState } from "react";
import type { AppPath } from "@/app/navigation";
import { useAuth } from "@/auth/AuthProvider";
import { supabase, supabaseSetupMessage } from "@/lib/supabase";

type CallbackPageProps = {
  onNavigate: (path: AppPath) => void;
};

function getFallbackRedirect(): AppPath {
  const stored = window.sessionStorage.getItem("postAuthRedirect");

  if (stored === "/dashboard" || stored === "/create-model" || stored === "/library") {
    return stored;
  }

  return "/dashboard";
}

export default function CallbackPage({ onNavigate }: CallbackPageProps) {
  const { refreshProfile } = useAuth();
  const [message, setMessage] = useState("Finalizing your session...");

  useEffect(() => {
    let active = true;

    async function completeAuth() {
      if (!supabase) {
        if (active) {
          setMessage(supabaseSetupMessage);
        }
        return;
      }

      const code = new URL(window.location.href).searchParams.get("code");

      if (!code) {
        setMessage("No verification code was found in the callback URL.");
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!active) {
        return;
      }

      if (error) {
        setMessage(error.message);
        return;
      }

      await refreshProfile();
      window.sessionStorage.removeItem("verificationEmail");
      window.sessionStorage.removeItem("postAuthRedirect");
      onNavigate(getFallbackRedirect());
    }

    completeAuth();

    return () => {
      active = false;
    };
  }, [onNavigate, refreshProfile]);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-5.5rem)] max-w-3xl items-center px-6 py-10 lg:px-8">
      <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 text-white shadow-2xl shadow-slate-950/30">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-indigo-200/80">Auth callback</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Completing sign in</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">{message}</p>
      </div>
    </div>
  );
}
