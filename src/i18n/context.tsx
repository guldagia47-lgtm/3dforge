import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { translations, type Locale, type TranslationTree } from "@/i18n/strings";

const STORAGE_KEY = "modelforge-locale";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  copy: TranslationTree;
  t: (path: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function readStoredLocale(): Locale {
  if (typeof window === "undefined") {
    return "en";
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (raw === "tr" || raw === "en") {
    return raw;
  }

  const nav = window.navigator.language?.toLowerCase() ?? "";

  if (nav.startsWith("tr")) {
    return "tr";
  }

  return "en";
}

function resolvePath(tree: unknown, path: string): string | undefined {
  const keys = path.split(".");
  let cur: unknown = tree;

  for (const key of keys) {
    if (cur === null || typeof cur !== "object") {
      return undefined;
    }

    cur = (cur as Record<string, unknown>)[key];
  }

  return typeof cur === "string" ? cur : undefined;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => readStoredLocale());

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next);
      document.documentElement.lang = next === "tr" ? "tr" : "en";
    }
  }, []);

  const copy = translations[locale];

  const t = useCallback(
    (path: string) => {
      return resolvePath(copy, path) ?? path;
    },
    [copy]
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      copy,
      t,
    }),
    [copy, locale, setLocale, t]
  );

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale === "tr" ? "tr" : "en";
    }
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);

  if (!ctx) {
    throw new Error("useI18n must be used inside I18nProvider");
  }

  return ctx;
}
