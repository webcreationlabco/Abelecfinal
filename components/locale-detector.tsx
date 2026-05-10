"use client";

import { useEffect, useState } from "react";
import { useI18n, type Locale } from "@/lib/i18n";
import { getLocaleCookie, setLocaleCookie, detectCountry, countryToLocale } from "@/lib/locale-detect";
import BelgiumPopup from "@/components/belgium-popup";

export default function LocaleDetector() {
  const { setLocale } = useI18n();
  const [showBEPopup, setShowBEPopup] = useState(false);

  useEffect(() => {
    async function run() {
      // 1. Cookie takes precedence — already chose before
      const cookie = getLocaleCookie();
      if (cookie) {
        setLocale(cookie);
        return;
      }

      // 2. Detect country via IP
      const country = await detectCountry();
      const result = countryToLocale(country);

      if (result === "BE") {
        // Belgium → show language picker popup
        setShowBEPopup(true);
      } else if (result) {
        setLocale(result);
        setLocaleCookie(result);
      }
    }
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBEChoice = (locale: Locale) => {
    setLocale(locale);
    setLocaleCookie(locale);
    setShowBEPopup(false);
  };

  return <BelgiumPopup open={showBEPopup} onChoose={handleBEChoice} />;
}
