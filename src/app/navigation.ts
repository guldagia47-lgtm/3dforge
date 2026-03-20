export type AppPath = "/" | "/auth" | "/auth/verify" | "/auth/callback" | "/dashboard" | "/create-model" | "/library";

export type NavItem = {
  label: string;
  href: AppPath;
  description: string;
};

export const navItems: NavItem[] = [
  { label: "Landing", href: "/", description: "Overview and positioning" },
  { label: "Dashboard", href: "/dashboard", description: "Usage and activity" },
  { label: "Create Model", href: "/create-model", description: "Prompt and upload flow" },
  { label: "Library", href: "/library", description: "Saved assets and exports" },
];

export const routeTitles: Record<AppPath, string> = {
  "/": "ModelForge | Generate 3D models from visuals and prompts",
  "/auth": "ModelForge | Sign in",
  "/auth/verify": "ModelForge | Verify email",
  "/auth/callback": "ModelForge | Completing sign in",
  "/dashboard": "ModelForge | Dashboard",
  "/create-model": "ModelForge | Create Model",
  "/library": "ModelForge | Library",
};

export function normalizePath(pathname: string): AppPath {
  const cleaned = pathname.replace(/\/+$/, "") || "/";

  if (
    cleaned === "/" ||
    cleaned === "/auth" ||
    cleaned === "/auth/verify" ||
    cleaned === "/auth/callback" ||
    cleaned === "/dashboard" ||
    cleaned === "/create-model" ||
    cleaned === "/library"
  ) {
    return cleaned;
  }

  return "/";
}