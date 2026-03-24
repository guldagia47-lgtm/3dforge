import { useCallback, useEffect, useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import { normalizePath, routeTitles, type AppPath } from "@/app/navigation";
import LandingPage from "@/app/page";
import DashboardPage from "@/app/dashboard/page";
import CreateModelPage from "@/app/create-model/page";
import LibraryPage from "@/app/library/page";
import AuthPage from "@/app/auth/page";
import VerifyPage from "@/app/auth/verify/page";
import CallbackPage from "@/app/auth/callback/page";
import { useAuth } from "@/auth/AuthProvider";

function getInitialPath(): AppPath {
  return normalizePath(window.location.pathname);
}

export default function App() {
  const { session, loading, ready } = useAuth();
  const [currentPath, setCurrentPath] = useState<AppPath>(getInitialPath);

  const protectedRoutes = useMemo(() => new Set<AppPath>(["/dashboard", "/create-model", "/library"]), []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    document.title = routeTitles[currentPath];
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPath]);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (protectedRoutes.has(currentPath) && !session) {
      window.sessionStorage.setItem("postAuthRedirect", currentPath);
      if (currentPath !== "/auth") {
        window.history.pushState({}, "", "/auth");
        setCurrentPath("/auth");
      }
    }
  }, [currentPath, loading, protectedRoutes, session]);

  useEffect(() => {
    if (loading || !session) {
      return;
    }

    if (currentPath === "/auth" || currentPath === "/auth/verify" || currentPath === "/auth/callback") {
      const redirect = (window.sessionStorage.getItem("postAuthRedirect") as AppPath | null) ?? "/dashboard";
      window.history.pushState({}, "", redirect);
      setCurrentPath(redirect);
    }
  }, [currentPath, loading, session]);

  const navigate = useCallback((path: AppPath) => {
    if (path === currentPath) {
      return;
    }

    window.history.pushState({}, "", path);
    setCurrentPath(path);
  }, [currentPath]);

  const page = useMemo(() => {
    switch (currentPath) {
      case "/auth":
        return <AuthPage onNavigate={navigate} />;
      case "/auth/verify":
        return <VerifyPage onNavigate={navigate} />;
      case "/auth/callback":
        return <CallbackPage onNavigate={navigate} />;
      case "/dashboard":
        return <DashboardPage />;
      case "/create-model":
        return <CreateModelPage />;
      case "/library":
        return <LibraryPage />;
      default:
        return <LandingPage onNavigate={navigate} />;
    }
  }, [currentPath, navigate]);

  return (
    <AppShell currentPath={currentPath} onNavigate={navigate}>
      {!ready && loading ? (
        <div className="mx-auto max-w-7xl px-6 py-10 text-slate-300 lg:px-8">Loading session...</div>
      ) : (
        page
      )}
    </AppShell>
  );
}
