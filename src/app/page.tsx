import { type AppPath } from "@/app/navigation";
import { useAuth } from "@/auth/AuthProvider";
import { useI18n } from "@/i18n/context";

type LandingPageProps = {
  onNavigate: (path: AppPath) => void;
};

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const { subscription } = useAuth();
  const { copy } = useI18n();
  const L = copy.landing;

  return (
    <div className="mx-auto max-w-7xl px-6 pb-16 pt-8 lg:px-8 lg:pb-24 lg:pt-12">
      <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[linear-gradient(145deg,rgba(15,23,42,0.88),rgba(2,6,23,0.88))] px-6 pb-10 pt-10 shadow-[0_28px_120px_rgba(2,6,23,0.55)] lg:px-10 lg:pb-16 lg:pt-14">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-indigo-500/25 blur-3xl animate-pulse-glow" />
          <div className="absolute right-0 top-16 h-80 w-80 rounded-full bg-cyan-400/18 blur-3xl animate-float-slow" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
        </div>

        <div className="relative grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-8 animate-reveal-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-200">
              <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.9)]" />
              {L.badge}
            </div>

            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-indigo-100/75">{L.brand}</p>
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
                {L.headlineLead}
                <span className="text-gradient-neon"> {L.headlineNeon}</span>
                {L.headlineTrail}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">{L.subhead}</p>
              <p className="text-sm text-slate-400">
                {subscription
                  ? L.planCurrent(subscription.plan.toUpperCase(), subscription.status)
                  : L.planFree}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigate("/create-model")}
                className="rounded-full bg-white px-6 py-3.5 text-sm font-medium text-slate-950 transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-100 hover:shadow-[0_18px_40px_rgba(255,255,255,0.12)]"
              >
                {L.ctaGenerate}
              </button>
              <button
                type="button"
                onClick={() => onNavigate("/dashboard")}
                className="rounded-full border border-cyan-300/20 bg-cyan-300/6 px-6 py-3.5 text-sm font-medium text-cyan-100 transition duration-200 hover:-translate-y-0.5 hover:bg-cyan-300/12"
              >
                {L.ctaDashboard}
              </button>
              <button
                type="button"
                onClick={() => onNavigate("/blog")}
                className="rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:bg-white/10"
              >
                {copy.nav.blog}
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {L.pillars.map((pillar, index) => (
                <div key={pillar.title} className="glass-panel rounded-3xl p-5" style={{ animationDelay: `${index * 90}ms` }}>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">0{index + 1}</p>
                  <h2 className="mt-3 text-sm font-medium text-white">{pillar.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{pillar.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-reveal-up" style={{ animationDelay: "120ms" }}>
            <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.32),_transparent_64%)] blur-3xl" />
            <div className="glass-panel overflow-hidden rounded-[2.5rem]">
              <div className="flex items-center justify-between border-b border-white/8 px-5 py-4 text-xs text-slate-400">
                <span>{L.studioLabel}</span>
                <span>{L.studioTier}</span>
              </div>

              <div className="p-5 sm:p-6 lg:p-7">
                <div className="relative min-h-[28rem] overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.95),rgba(2,6,23,0.92))] hero-grid">
                  <div className="absolute inset-0 animate-pan bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.24),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.18),transparent_26%)]" />
                  <div className="absolute inset-x-10 top-8 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
                  <div className="absolute inset-y-8 left-8 w-px bg-gradient-to-b from-transparent via-indigo-300/70 to-transparent" />

                  <div className="relative flex h-full flex-col justify-between p-5 sm:p-8">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{L.preview}</p>
                        <h3 className="mt-3 text-2xl font-medium text-white">{L.previewTitle}</h3>
                        <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">{L.previewBody}</p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right text-xs text-slate-300">
                        <p className="text-slate-400">{L.status}</p>
                        <p className="mt-1 text-white">{L.refining}</p>
                      </div>
                    </div>

                    <div className="relative mx-auto flex aspect-square w-[min(100%,20rem)] items-center justify-center rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),rgba(255,255,255,0.03)_38%,rgba(15,23,42,0.12)_72%)] shadow-[0_22px_80px_rgba(2,6,23,0.55)] animate-drift">
                      <div className="absolute inset-5 rounded-[1.5rem] border border-cyan-200/20" />
                      <div className="absolute inset-10 rounded-[1.25rem] border border-indigo-200/20" />
                      <div className="absolute h-32 w-32 rounded-[1.75rem] border border-white/20 bg-[linear-gradient(145deg,rgba(255,255,255,0.16),rgba(99,102,241,0.22))] neon-ring" />
                      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs text-slate-300/80">
                        <span>{L.formats}</span>
                        <span>{L.previewReady}</span>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      {L.steps.map((step, index) => (
                        <div key={step.title} className="rounded-2xl border border-white/8 bg-white/4 p-4" style={{ animationDelay: `${index * 120}ms` }}>
                          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">0{index + 1}</p>
                          <h2 className="mt-2 text-sm font-medium text-white">{step.title}</h2>
                          <p className="mt-2 text-sm leading-6 text-slate-400">{step.body}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
