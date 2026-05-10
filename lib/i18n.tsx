"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

// ── Supported locales ─────────────────────────────────────────────────────
export type Locale = "fr" | "nl" | "en" | "de" | "it";

export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "fr", label: "Français",  flag: "🇧🇪" },
  { code: "nl", label: "Nederlands", flag: "🇧🇪" },
  { code: "en", label: "English",   flag: "🇬🇧" },
  { code: "de", label: "Deutsch",   flag: "🇩🇪" },
  { code: "it", label: "Italiano",  flag: "🇮🇹" },
];

// ── Lazy-load translations ────────────────────────────────────────────────
const cache: Partial<Record<Locale, Record<string, unknown>>> = {};

async function loadLocale(locale: Locale): Promise<Record<string, unknown>> {
  if (cache[locale]) return cache[locale]!;
  const mod = await import(`@/locales/${locale}.json`);
  cache[locale] = mod.default as Record<string, unknown>;
  return cache[locale]!;
}

// ── Context ───────────────────────────────────────────────────────────────
interface I18nCtx {
  locale: Locale;
  t: Record<string, unknown>;
  setLocale: (l: Locale) => void;
}

const I18nContext = createContext<I18nCtx | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────
export function I18nProvider({
  children,
  initialLocale = "fr",
  initialTranslations,
}: {
  children: ReactNode;
  initialLocale?: Locale;
  initialTranslations: Record<string, unknown>;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [t, setT] = useState<Record<string, unknown>>(initialTranslations);

  const setLocale = useCallback(async (l: Locale) => {
    const translations = await loadLocale(l);
    setLocaleState(l);
    setT(translations);
  }, []);

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────
export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

/** Typed accessor — returns string or falls back to key */
export function useT() {
  const { t } = useI18n();
  return function get(path: string): string {
    const parts = path.split(".");
    let val: unknown = t;
    for (const p of parts) {
      if (val == null || typeof val !== "object") return path;
      val = (val as Record<string, unknown>)[p];
    }
    return typeof val === "string" ? val : path;
  };
}
