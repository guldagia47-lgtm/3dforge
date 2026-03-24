import { type ReactNode } from "react";
import BrandMark from "@/components/BrandMark";
import { cn } from "@/utils/cn";
import { navItemHrefs, type AppPath } from "@/app/navigation";
import { useAuth } from "@/auth/AuthProvider";
import { useI18n } from "@/i18n/context";
import type { TranslationTree } from "@/i18n/strings";

type NavKey = keyof TranslationTree["nav"];

const hrefToNavKey: Record<string, NavKey> = {
  "/": "landing",
  "/dashboard": "dashboard",
  "/create-model": "createModel",
  "/library": "library",
  "/blog": "blog",
};

type AppShellProps = {
  currentPath: AppPath;
  onNavigate: (path: AppPath) => void;
  children: ReactNode;
};

export default function AppShell({ currentPath, onNavigate, children }: AppShellProps) {
  const { session, profile, subscription, signOut } = useAuth();
  const { locale, setLocale, copy } = useI18n();

  return (
    <div className="min-h-screen overflow-hidden text-slate-100">
      <header className="sticky top-0 z-40 border-b border-white/8 bg-slate-950/70 backdrop-blur-2xl supports-[backdrop-filter]:bg-slate-950/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:gap-6 lg:px-8">
          <button
            type="button"
            onClick={() => onNavigate("/")}
            className="text-left"
            aria-label={copy.shell.ariaLanding}
          >
            <BrandMark compact />
          </button>

          <nav className="hidden items-center gap-1 rounded-full border border-white/8 bg-white/4 p-1 md:flex" aria-label="Main">
            {navItemHrefs.map((item) => {
              const key = hrefToNavKey[item.href];
              const label = copy.nav[key];
              const active =
                currentPath === item.href || (item.href === "/blog" && currentPath.startsWith("/blog/"));

              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => onNavigate(item.href)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm transition",
                    active ? "bg-white text-slate-950 shadow-lg shadow-white/10" : "text-slate-300 hover:bg-white/6 hover:text-white"
                  )}
                >
                  {label}
                </button>
              );
            })}
          </nav>

          <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/4 p-1 sm:flex" role="group" aria-label={copy.lang.switch}>
              <button
                type="button"
                onClick={() => setLocale("en")}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition",
                  locale === "en" ? "bg-white text-slate-950" : "text-slate-400 hover:text-white"
                )}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLocale("tr")}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition",
                  locale === "tr" ? "bg-white text-slate-950" : "text-slate-400 hover:text-white"
                )}
              >
                TR
              </button>
            </div>

            <button
              type="button"
              onClick={() => onNavigate("/create-model")}
              className="rounded-full bg-white px-3 py-2 text-xs font-medium text-slate-950 shadow-lg shadow-indigo-500/15 transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-100 hover:shadow-[0_12px_40px_rgba(99,102,241,0.28)] sm:px-4 sm:text-sm"
            >
              {copy.shell.createModel}
            </button>

            {session ? (
              <div className="hidden items-center gap-3 md:flex">
                <div className="text-right text-xs text-slate-400">
                  <p className="text-slate-200">{profile?.fullName ?? profile?.email ?? session.user.email}</p>
                  <p>
                    {subscription?.plan
                      ? `${subscription.plan.toUpperCase()} ${copy.shell.planActive}`
                      : copy.shell.sessionActive}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    await signOut();
                    onNavigate("/auth");
                  }}
                  className="rounded-full border border-white/10 bg-white/4 px-4 py-2 text-sm text-white transition hover:bg-white/8"
                >
                  {copy.shell.signOut}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate("/auth")}
                className="rounded-full border border-white/10 bg-white/4 px-3 py-2 text-xs text-white transition hover:bg-white/8 sm:px-4 sm:text-sm"
              >
                {copy.shell.signIn}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="relative">
        <div className="pointer-events-none absolute inset-0 hero-grid opacity-[0.18]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(2,6,23,0.14)_55%,_rgba(2,6,23,0.58)_100%)]" />
        <div className="relative">{children}</div>
      </main>
    </div>
  );
}
