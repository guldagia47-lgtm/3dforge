import { supabase, supabaseSetupMessage } from "@/lib/supabase";

export const DAILY_MODEL_LIMIT = 5;

export type DailyModelQuota = {
  used: number;
  limit: number;
  remaining: number;
  resetAt: string;
  reached: boolean;
  warning: string | null;
};

type DailyQuotaRow = {
  id: string;
};

export function getDailyModelQuotaMessage(used: number) {
  return buildWarningMessage(used);
}

function getUtcDayBounds(reference = new Date()) {
  const start = new Date(Date.UTC(reference.getUTCFullYear(), reference.getUTCMonth(), reference.getUTCDate()));
  const end = new Date(start);

  end.setUTCDate(end.getUTCDate() + 1);

  return { start, end };
}

function buildWarningMessage(used: number) {
  if (used >= DAILY_MODEL_LIMIT) {
    return `You reached the daily limit of ${DAILY_MODEL_LIMIT} models. The counter resets at midnight UTC.`;
  }

  if (used === DAILY_MODEL_LIMIT - 1) {
    return "One model left today. The next successful save will close the quota until tomorrow.";
  }

  return null;
}

export async function fetchDailyModelQuota(userId: string) {
  if (!supabase) {
    return { ok: false as const, message: supabaseSetupMessage };
  }

  const { start, end } = getUtcDayBounds();

  const { data, count, error } = await supabase
    .from("models")
    .select("id", { count: "exact" })
    .eq("user_id", userId)
    .gte("created_at", start.toISOString())
    .lt("created_at", end.toISOString());

  if (error) {
    return { ok: false as const, message: error.message };
  }

  const used = count ?? (data as DailyQuotaRow[] | null)?.length ?? 0;

  return {
    ok: true as const,
    data: {
      used,
      limit: DAILY_MODEL_LIMIT,
      remaining: Math.max(0, DAILY_MODEL_LIMIT - used),
      resetAt: end.toISOString(),
      reached: used >= DAILY_MODEL_LIMIT,
      warning: buildWarningMessage(used),
    } satisfies DailyModelQuota,
  };
}
