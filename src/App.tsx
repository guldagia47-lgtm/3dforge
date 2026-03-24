import { useCallback, useEffect, useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import { getBlogSlugFromPath, normalizePath, type AppPath } from "@/app/navigation";
import LandingPage from "@/app/page";
import DashboardPage from "@/app/dashboard/page";
import CreateModelPage from "@/app/create-model/page";
import LibraryPage from "@/app/library/page";
import AuthPage from "@/app/auth/page";
import VerifyPage from "@/app/auth/verify/page";
import CallbackPage from "@/app/auth/callback/page";
import BlogIndexPage from "@/app/blog/page";
import BlogPostPage from "@/app/blog/PostPage";
import { useAuth } from "@/auth/AuthProvider";
import { useI18n } from "@/i18n/context";
import { getBlogPostBySlug } from "@/data/blogPosts";
import { setPageSeo } from "@/lib/seo";

function getInitialPath(): AppPath {
  return normalizePath(window.location.pathname);
}

function pathToMetaKey(path: AppPath): string | null {
  const map: Record<string, string> = {
    "/": "home",
    "/auth": "auth",
    "/auth/verify": "verify",
    "/auth/callback": "callback",
    "/dashboard": "dashboard",
    "/create-model": "createModel",
    "/library": "library",
    "/blog": "blog",
  };

  return map[path] ?? null;
}

export default function App() {
  const { session, loading, ready } = useAuth();
  const { locale, t } = useI18n();
  const [currentPath, setCurrentPath] = useState<AppPath>(getInitialPath);

  const protectedRoutes = useMemo(
    () => new Set<AppPath>(["/dashboard", "/create-model", "/library"]),
    []
  );

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPath]);

  useEffect(() => {
    const slug = getBlogSlugFromPath(currentPath);

    if (slug) {
      const post = getBlogPostBySlug(slug);

      if (post) {
        setPageSeo({
          title: `${post.title[locale]} | ${t("meta.title.blogPost")}`,
          description: post.excerpt[locale],
          keywords: post.keywords[locale],
          path: currentPath,
        });
        return;
      }

      setPageSeo({
        title: `${t("meta.title.blogPost")} | ModelForge`,
        description:
          locale === "tr"
            ? "Aradığınız blog yazısı bulunamadı."
            : "The article you opened was not found.",
        path: currentPath,
      });
      return;
    }

    const metaKey = pathToMetaKey(currentPath);

    if (metaKey) {
      setPageSeo({
        title: t(`meta.title.${metaKey}`),
        description: t(`meta.description.${metaKey}`),
        path: currentPath,
        keywords:
          metaKey === "blog"
            ? locale === "tr"
              ? "3D modeller, GLB, Tripo AI, Meshy AI, 3D kütüphane, prompt"
              : "3D models, GLB, Tripo AI, Meshy AI, 3D library, prompts"
            : undefined,
      });
      return;
    }

    setPageSeo({
      title: t("meta.title.home"),
      description: t("meta.description.home"),
      path: "/",
    });
  }, [currentPath, locale, t]);

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
    setCurrentPath(normalizePath(path));
  }, [currentPath]);

  const blogSlug = getBlogSlugFromPath(currentPath);

  const page = useMemo(() => {
    if (currentPath === "/blog") {
      return <BlogIndexPage onNavigate={navigate} />;
    }

    if (blogSlug) {
      return <BlogPostPage slug={blogSlug} onNavigate={navigate} />;
    }

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
  }, [blogSlug, currentPath, navigate]);

  return (
    <AppShell currentPath={currentPath} onNavigate={navigate}>
      {!ready && loading ? (
        <div className="mx-auto max-w-7xl px-6 py-10 text-slate-300 lg:px-8">{t("common.loadingSession")}</div>
      ) : (
        page
      )}
    </AppShell>
  );
}
