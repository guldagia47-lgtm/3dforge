import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, supabaseReady, supabaseSetupMessage, getVerificationRedirectUrl } from "@/lib/supabase";
import { fetchUserSubscription, type SubscriptionRecord } from "@/lib/subscriptions";

type AuthProfile = {
  id: string;
  email: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  lastSeenAt: string;
};

type SignUpPayload = {
  email: string;
  password: string;
  fullName: string;
};

type AuthFailure = { ok: false; message: string; needsVerification?: boolean };
type AuthSuccess = { ok: true; needsVerification?: boolean };

type SignInPayload = {
  email: string;
  password: string;
};

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: AuthProfile | null;
  subscription: SubscriptionRecord | null;
  loading: boolean;
  ready: boolean;
  error: string | null;
  signIn: (payload: SignInPayload) => Promise<AuthSuccess | AuthFailure>;
  signUp: (payload: SignUpPayload) => Promise<AuthSuccess | AuthFailure>;
  signOut: () => Promise<void>;
  resendVerification: (email: string) => Promise<{ ok: true } | { ok: false; message: string }>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function mapProfile(user: User): AuthProfile {
  return {
    id: user.id,
    email: user.email ?? null,
    fullName: typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : null,
    avatarUrl: typeof user.user_metadata?.avatar_url === "string" ? user.user_metadata.avatar_url : null,
    lastSeenAt: new Date().toISOString(),
  };
}

function isEmailVerified(user: User) {
  const confirmedAt = (user as User & { email_confirmed_at?: string | null }).email_confirmed_at;
  return Boolean(confirmedAt);
}

function verificationRequiredMessage() {
  return "Please verify your email before signing in. We sent a verification email through Resend-enabled Supabase mail delivery.";
}

async function syncProfile(user: User) {
  if (!supabase) {
    return mapProfile(user);
  }

  const profile = mapProfile(user);

  const { error: upsertError } = await supabase.from("profiles").upsert(
    {
      id: profile.id,
      email: profile.email,
      full_name: profile.fullName,
      avatar_url: profile.avatarUrl,
      last_seen_at: profile.lastSeenAt,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (upsertError) {
    throw upsertError;
  }

  return profile;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = useCallback(async () => {
    if (!supabase?.auth.getSession) {
      return;
    }

    const { data } = await supabase.auth.getSession();
    const nextSession = data.session;

    setSession(nextSession);
    if (!nextSession?.user) {
      setProfile(null);
      setSubscription(null);
      return;
    }

    setProfile(mapProfile(nextSession.user));

    const subscriptionResult = await fetchUserSubscription(nextSession.user.id);

    if (subscriptionResult.ok) {
      setSubscription(subscriptionResult.data);
    } else {
      setError(subscriptionResult.message);
      setSubscription(null);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const client = supabase;

    async function bootstrap() {
      if (!client) {
        if (mounted) {
          setError(supabaseSetupMessage);
          setLoading(false);
        }
        return;
      }

      const { data, error: sessionError } = await client.auth.getSession();

      if (!mounted) {
        return;
      }

      if (sessionError) {
        setError(sessionError.message);
      }

      if (data.session?.user && !isEmailVerified(data.session.user)) {
        await client.auth.signOut();
        setSession(null);
        setProfile(null);
        setError(verificationRequiredMessage());
        setLoading(false);
        return;
      }

      setSession(data.session);
      setProfile(data.session?.user ? mapProfile(data.session.user) : null);

      if (data.session?.user) {
        const subscriptionResult = await fetchUserSubscription(data.session.user.id);

        if (subscriptionResult.ok) {
          setSubscription(subscriptionResult.data);
        } else {
          setError(subscriptionResult.message);
          setSubscription(null);
        }
      } else {
        setSubscription(null);
      }
      setLoading(false);
    }

    bootstrap();

    if (!client) {
      return () => {
        mounted = false;
      };
    }

    const { data: authListener } = client.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!mounted) {
        return;
      }

      if (nextSession?.user && !isEmailVerified(nextSession.user)) {
        await client.auth.signOut();
        setSession(null);
        setProfile(null);
        setError(verificationRequiredMessage());
        setLoading(false);
        return;
      }

      setSession(nextSession);

      if (nextSession?.user) {
        try {
          setProfile(await syncProfile(nextSession.user));
          const subscriptionResult = await fetchUserSubscription(nextSession.user.id);

          if (subscriptionResult.ok) {
            setSubscription(subscriptionResult.data);
          } else {
            setSubscription(null);
          }
          setError(null);
        } catch (syncError) {
          setError(syncError instanceof Error ? syncError.message : "Unable to sync user profile.");
          setProfile(mapProfile(nextSession.user));
          setSubscription(null);
        }
      } else {
        setProfile(null);
        setSubscription(null);
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
    }, []);

  const signIn = useCallback(async ({ email, password }: SignInPayload) => {
    if (!supabase) {
      return { ok: false as const, message: supabaseSetupMessage };
    }

    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      const needsVerification = /not confirmed|confirm your email|verify your email/i.test(signInError.message);

      return {
        ok: false as const,
        message: needsVerification ? verificationRequiredMessage() : signInError.message,
        ...(needsVerification ? { needsVerification: true as const } : {}),
      };
    }

    if (data.session?.user) {
      if (!isEmailVerified(data.session.user)) {
        await supabase.auth.signOut();
        return { ok: false as const, message: verificationRequiredMessage(), needsVerification: true as const };
      }

      try {
        setProfile(await syncProfile(data.session.user));
      } catch (profileError) {
        setError(profileError instanceof Error ? profileError.message : "Unable to store profile data.");
      }
    }

    setSession(data.session);
    return { ok: true as const };
  }, []);

  const signUp = useCallback(async ({ email, password, fullName }: SignUpPayload) => {
    if (!supabase) {
      return { ok: false as const, message: supabaseSetupMessage };
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getVerificationRedirectUrl(),
        data: { full_name: fullName },
      },
    });

    if (signUpError) {
      return { ok: false as const, message: signUpError.message };
    }

    if (data.session?.user && isEmailVerified(data.session.user)) {
      try {
        setProfile(await syncProfile(data.session.user));
      } catch (profileError) {
        setError(profileError instanceof Error ? profileError.message : "Unable to store profile data.");
      }
      setSession(data.session);
      return { ok: true as const, needsVerification: false };
    }

    if (data.session?.user && !isEmailVerified(data.session.user)) {
      await supabase.auth.signOut();
    }

    return { ok: true as const, needsVerification: true };
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setSubscription(null);
  }, []);

  const resendVerification = useCallback(async (email: string) => {
    if (!supabase) {
      return { ok: false as const, message: supabaseSetupMessage };
    }

    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: getVerificationRedirectUrl(),
      },
    });

    if (resendError) {
      return { ok: false as const, message: resendError.message };
    }

    return { ok: true as const };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      subscription,
      loading,
      ready: supabaseReady,
      error,
      signIn,
      signUp,
      signOut,
      resendVerification,
      refreshProfile,
    }),
    [error, loading, profile, refreshProfile, resendVerification, session, signIn, signOut, signUp, subscription]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
