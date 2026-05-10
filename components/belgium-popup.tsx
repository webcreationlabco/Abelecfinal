"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useT } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

interface Props {
  open: boolean;
  onChoose: (locale: Locale) => void;
}

const BE_LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "fr", label: "Français",   flag: "🇧🇪" },
  { code: "nl", label: "Nederlands", flag: "🇧🇪" },
  { code: "de", label: "Deutsch",    flag: "🇩🇪" },
];

export default function BelgiumPopup({ open, onChoose }: Props) {
  const t = useT();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="be-backdrop"
            className="fixed inset-0 z-[100]"
            style={{ background: "rgba(16, 30, 48, 0.65)", backdropFilter: "blur(6px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />

          {/* Panel */}
          <motion.div
            key="be-panel"
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none"
          >
            <motion.div
              className="pointer-events-auto w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Header */}
              <div className="bg-[#1a3a5c] px-6 pt-7 pb-5 text-center">
                <div className="flex justify-center mb-3">
                  <Image
                    src="/ABELEC_LOGO.svg"
                    alt="Abelec"
                    width={88}
                    height={30}
                    className="brightness-0 invert h-7 w-auto"
                  />
                </div>
                <p className="text-white font-slab font-bold text-[18px] mb-1">
                  {t("belgiumPopup.title")}
                </p>
                <p className="text-[#b0c4d8] text-[13px] leading-relaxed">
                  {t("belgiumPopup.subtitle")}
                </p>
              </div>

              {/* Language options */}
              <div className="p-5 space-y-2.5">
                {BE_LOCALES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => onChoose(l.code)}
                    className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border border-abelec-cream-line hover:border-abelec-orange hover:bg-abelec-cream-light transition-all group"
                  >
                    <span className="text-[22px]">{l.flag}</span>
                    <span className="font-slab font-bold text-abelec-navy text-[16px] group-hover:text-abelec-orange transition-colors">
                      {l.label}
                    </span>
                    <span className="ml-auto font-mono text-[11px] text-abelec-muted-2 uppercase tracking-[0.08em]">
                      {l.code.toUpperCase()}
                    </span>
                  </button>
                ))}
              </div>

              <p className="text-center text-[11px] text-abelec-muted-2 font-mono pb-5">
                EN accessible via the language selector
              </p>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
