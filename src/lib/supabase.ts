import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
const appUrl = import.meta.env.VITE_APP_URL?.trim();

export const supabaseReady = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = supabaseReady
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
      },
    })
  : null;

export const supabaseSetupMessage =
  "Configure VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, and VITE_APP_URL to enable auth, sessions, profile storage, and email redirects.";

export function getAppBaseUrl() {
  if (appUrl) {
    return appUrl.replace(/\/+$/, "");
  }

  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin.replace(/\/+$/, "");
  }

  return "http://localhost:5173";
}

export function getVerificationRedirectUrl() {
  return `${getAppBaseUrl()}/auth/callback`;
}
