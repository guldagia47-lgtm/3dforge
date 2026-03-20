import { supabase, supabaseSetupMessage } from "@/lib/supabase";

export type PlanName = "free" | "pro" | "premium";

export type SubscriptionRecord = {
  id: string;
  userId: string;
  plan: PlanName;
  status: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

type SubscriptionRow = {
  id: string;
  user_id: string;
  plan: PlanName;
  status: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

const planRank: Record<PlanName, number> = {
  free: 0,
  pro: 1,
  premium: 2,
};

function mapSubscription(row: SubscriptionRow): SubscriptionRecord {
  return {
    id: row.id,
    userId: row.user_id,
    plan: row.plan,
    status: row.status,
    stripeCustomerId: row.stripe_customer_id,
    stripeSubscriptionId: row.stripe_subscription_id,
    stripePriceId: row.stripe_price_id,
    currentPeriodStart: row.current_period_start,
    currentPeriodEnd: row.current_period_end,
    cancelAtPeriodEnd: row.cancel_at_period_end,
    metadata: row.metadata ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function hasPlanAccess(plan: PlanName, required: PlanName) {
  return planRank[plan] >= planRank[required];
}

export async function fetchUserSubscription(userId: string) {
  if (!supabase) {
    return { ok: false as const, message: supabaseSetupMessage };
  }

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    return { ok: false as const, message: error.message };
  }

  if (!data) {
    return {
      ok: true as const,
      data: null,
    };
  }

  return { ok: true as const, data: mapSubscription(data as SubscriptionRow) };
}

export async function upsertUserSubscription(input: {
  userId: string;
  plan: PlanName;
  status: string;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  stripePriceId?: string | null;
  currentPeriodStart?: string | null;
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd?: boolean;
  metadata?: Record<string, unknown>;
}) {
  if (!supabase) {
    return { ok: false as const, message: supabaseSetupMessage };
  }

  const { data, error } = await supabase
    .from("subscriptions")
    .upsert(
      {
        user_id: input.userId,
        plan: input.plan,
        status: input.status,
        stripe_customer_id: input.stripeCustomerId ?? null,
        stripe_subscription_id: input.stripeSubscriptionId ?? null,
        stripe_price_id: input.stripePriceId ?? null,
        current_period_start: input.currentPeriodStart ?? null,
        current_period_end: input.currentPeriodEnd ?? null,
        cancel_at_period_end: input.cancelAtPeriodEnd ?? false,
        metadata: input.metadata ?? {},
      },
      { onConflict: "user_id" }
    )
    .select("*")
    .single();

  if (error) {
    return { ok: false as const, message: error.message };
  }

  return { ok: true as const, data: mapSubscription(data as SubscriptionRow) };
}
