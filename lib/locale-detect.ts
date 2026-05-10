import type { Locale } from "@/lib/i18n";

const COOKIE = "abelec_locale";
const COOKIE_DAYS = 365;

export function getLocaleCookie(): Locale | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${COOKIE}=([^;]+)`));
  if (!m) return null;
  const v = decodeURIComponent(m[1]) as Locale;
  return (["fr", "nl", "en", "de", "it"] as Locale[]).includes(v) ? v : null;
}

export function setLocaleCookie(locale: Locale) {
  const expires = new Date(Date.now() + COOKIE_DAYS * 864e5).toUTCString();
  document.cookie = `${COOKIE}=${locale}; expires=${expires}; path=/; SameSite=Lax`;
}

/** Country code → locale (returns null for Belgium so caller can show popup) */
export function countryToLocale(countryCode: string): Locale | null | "BE" {
  switch (countryCode.toUpperCase()) {
    case "BE": return "BE"; // special: show popup
    case "FR": return "fr";
    case "NL": return "nl";
    case "DE": return "de";
    case "IT": return "it";
    case "LU": return "fr";
    default:   return "fr"; // fallback
  }
}

export async function detectCountry(): Promise<string> {
  try {
    const res = await fetch("https://ipwho.is/", { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return "FR";
    const data = await res.json();
    return data?.country_code ?? "FR";
  } catch {
    return "FR";
  }
}
