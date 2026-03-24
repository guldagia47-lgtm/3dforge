import { getAllBlogSlugs } from "@/data/blogPosts";

export type AppPath = string;

export type NavItem = {
  label: string;
  href: AppPath;
  description: string;
};

/** Hrefs only — labels come from i18n in AppShell */
export const navItemHrefs: { href: AppPath; description: string }[] = [
  { href: "/", description: "Overview and positioning" },
  { href: "/dashboard", description: "Usage and activity" },
  { href: "/create-model", description: "Prompt and upload flow" },
  { href: "/library", description: "Saved assets and exports" },
  { href: "/blog", description: "3D models: prompts, formats, preview, library, delivery" },
];

const staticPaths = new Set([
  "/",
  "/auth",
  "/auth/verify",
  "/auth/callback",
  "/dashboard",
  "/create-model",
  "/library",
  "/blog",
]);

const validBlogSlugs = new Set(getAllBlogSlugs());

export function isBlogPostPath(path: string): boolean {
  if (!path.startsWith("/blog/")) {
    return false;
  }

  const slug = path.slice(6).replace(/\/+$/, "");

  return slug.length > 0 && validBlogSlugs.has(slug);
}

export function normalizePath(pathname: string): AppPath {
  const cleaned = pathname.replace(/\/+$/, "") || "/";

  if (staticPaths.has(cleaned)) {
    return cleaned;
  }

  if (isBlogPostPath(cleaned)) {
    return cleaned;
  }

  return "/";
}

export function getBlogSlugFromPath(path: AppPath): string | null {
  if (!path.startsWith("/blog/")) {
    return null;
  }

  const slug = path.slice(6).replace(/\/+$/, "");

  return validBlogSlugs.has(slug) ? slug : null;
}
