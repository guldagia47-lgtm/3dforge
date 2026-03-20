import { dashboardFocus, dashboardStats, recentJobs, planCards } from "@/data/mockData";
import { useAuth } from "@/auth/AuthProvider";
import { DAILY_MODEL_LIMIT, fetchDailyModelQuota, type DailyModelQuota } from "@/lib/modelQuota";
import { hasPlanAccess } from "@/lib/subscriptions";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { subscription, session } = useAuth();
  const activePlan = subscription?.plan ?? "free";
  const [quota, setQuota] = useState<DailyModelQuota | null>(null);
  const [quotaError, setQuotaError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadQuota() {
      if (!session?.user.id) {
        setQuota(null);
        return;
      }

      const result = await fetchDailyModelQuota(session.user.id);

      if (!active) {
        return;
      }

      if (result.ok) {
        setQuota(result.data);
        setQuotaError(null);
      } else {
        setQuotaError(result.message);
      }
    }

    void loadQuota();

    return () => {
      active = false;
    };
  }, [session?.user.id]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
      <div className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-indigo-100/80">Dashboard</p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">One place to see billing, generation, and what to do next.</h1>
            <p className="text-base leading-7 text-slate-300">
              The dashboard stays simple: a strong summary, live job status, and the next meaningful action.
            </p>
          </div>

          <button type="button" className="rounded-full border border-cyan-300/20 bg-cyan-300/6 px-5 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-300/12">
            Continue generating
          </button>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((stat, index) => (
            <div key={stat.label} className="glass-panel rounded-[1.75rem] p-5" style={{ animationDelay: `${index * 80}ms` }}>
              <p className="text-sm text-slate-400">{stat.label}</p>
              <p className="mt-3 text-3xl font-semibold text-white">{stat.value}</p>
              <p className="mt-2 text-sm text-slate-400">{stat.detail}</p>
            </div>
          ))}
          <div className="glass-panel rounded-[1.75rem] p-5 md:col-span-2 xl:col-span-1">
            <p className="text-sm text-slate-400">Daily model cap</p>
            <p className="mt-3 text-3xl font-semibold text-white">{quota ? `${quota.used}/${DAILY_MODEL_LIMIT}` : "5/day"}</p>
            <p className="mt-2 text-sm text-slate-400">
              {quota?.reached
                ? "Limit reached. Resume tomorrow at midnight UTC."
                : quota?.warning ?? "Successful saves count toward your daily generation quota."}
            </p>
            {quotaError ? <p className="mt-3 text-xs text-rose-200">{quotaError}</p> : null}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-panel overflow-hidden rounded-[2rem]">
            <div className="border-b border-white/8 px-6 py-5">
              <h2 className="text-lg font-medium text-white">Recent jobs</h2>
              <p className="mt-1 text-sm text-slate-400">A compact view of the generation pipeline.</p>
            </div>

            <div className="space-y-3 p-6">
              {recentJobs.map((job, index) => (
                <div key={`${job.name}-${job.time}`} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/4 px-4 py-4" style={{ animationDelay: `${index * 90}ms` }}>
                  <div>
                    <p className="font-medium text-white">{job.name}</p>
                    <p className="mt-1 text-sm text-slate-400">{job.provider} · {job.time}</p>
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-slate-200">
                    {job.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-panel rounded-[2rem] p-6">
              <h2 className="text-lg font-medium text-white">Plan status</h2>
              <div className="mt-4 space-y-4 text-sm text-slate-300">
                <div className="flex items-center justify-between border-b border-white/8 pb-3">
                  <span>Subscription</span>
                  <span className="text-emerald-300">{activePlan === "free" ? "Free plan" : `${activePlan} active`}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/8 pb-3">
                  <span>Verification</span>
                  <span className="text-sky-300">Email confirmed</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Next renewal</span>
                  <span>12 days</span>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-[2rem] p-6">
              <h2 className="text-lg font-medium text-white">Plans</h2>
              <div className="mt-4 space-y-3">
                {planCards.map((plan) => (
                  <div key={plan.name} className="rounded-2xl border border-white/8 bg-white/4 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium text-white">{plan.name}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.28em] text-slate-500">{plan.badge}</p>
                      </div>
                      <span className="text-lg font-semibold text-white">{plan.price}</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{plan.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {plan.features.map((feature) => (
                        <span key={feature} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                          {feature}
                        </span>
                      ))}
                    </div>
                    <p className="mt-3 text-xs text-slate-500">
                      {plan.name === "Free"
                        ? "Access basic generation and save models locally in the library."
                        : plan.name === "Pro"
                          ? hasPlanAccess(activePlan, "pro")
                            ? "Your current plan includes this tier."
                            : "Upgrade to Pro to unlock this tier."
                          : hasPlanAccess(activePlan, "premium")
                            ? "Your current plan includes this tier."
                            : "Upgrade to Premium to unlock this tier."}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-[2rem] p-6">
              <h2 className="text-lg font-medium text-white">Keep users engaged</h2>
              <div className="mt-4 space-y-4">
                {dashboardFocus.map((item) => (
                  <div key={item.title} className="border-b border-white/8 pb-4 last:border-none last:pb-0">
                    <p className="font-medium text-white">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}