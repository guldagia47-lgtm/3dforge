import { type ReactNode } from "react";
import BrandMark from "@/components/BrandMark";
import { cn } from "@/utils/cn";
import { navItems, type AppPath } from "@/app/navigation";
import { useAuth } from "@/auth/AuthProvider";

type AppShellProps = {
  currentPath: AppPath;
  onNavigate: (path: AppPath) => void;
  children: ReactNode;
};

export default function AppShell({ currentPath, onNavigate, children }: AppShellProps) {
  const { session, profile, subscription, signOut } = useAuth();

  return (
    <div className="min-h-screen overflow-hidden text-slate-100">
      <header className="sticky top-0 z-40 border-b border-white/8 bg-slate-950/70 backdrop-blur-2xl supports-[backdrop-filter]:bg-slate-950/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-8">
          <button
            type="button"
            onClick={() => onNavigate("/")}
            className="text-left"
            aria-label="Go to landing page"
          >
            <BrandMark compact />
          </button>

          <nav className="hidden items-center gap-1 rounded-full border border-white/8 bg-white/4 p-1 md:flex">
            {navItems.map((item) => {
              const active = currentPath === item.href;

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
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate("/create-model")}
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-950 shadow-lg shadow-indigo-500/15 transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-100 hover:shadow-[0_12px_40px_rgba(99,102,241,0.28)]"
            >
              Create model
            </button>

            {session ? (
              <div className="hidden items-center gap-3 md:flex">
                <div className="text-right text-xs text-slate-400">
                  <p className="text-slate-200">{profile?.fullName ?? profile?.email ?? session.user.email}</p>
                  <p>{subscription?.plan ? `${subscription.plan.toUpperCase()} plan active` : "Session active"}</p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    await signOut();
                    onNavigate("/auth");
                  }}
                  className="rounded-full border border-white/10 bg-white/4 px-4 py-2 text-sm text-white transition hover:bg-white/8"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate("/auth")}
                className="rounded-full border border-white/10 bg-white/4 px-4 py-2 text-sm text-white transition hover:bg-white/8"
              >
                Sign in
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