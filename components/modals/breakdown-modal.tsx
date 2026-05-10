"use client";

import Image from "next/image";
import { Phone } from "lucide-react";
import { useT } from "@/lib/i18n";
import ModalBase from "./modal-base";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function BreakdownModal({ open, onClose }: Props) {
  const t = useT();

  const steps = [
    { num: "01", titleKey: "modals.breakdown.step1Title", descKey: "modals.breakdown.step1Desc" },
    { num: "02", titleKey: "modals.breakdown.step2Title", descKey: "modals.breakdown.step2Desc" },
    { num: "03", titleKey: "modals.breakdown.step3Title", descKey: "modals.breakdown.step3Desc" },
  ];

  return (
    <ModalBase open={open} onClose={onClose}>
      {/* Header — illustration */}
      <div className="relative h-44 bg-[#FBF8F3] border-b border-abelec-cream-line flex items-center justify-center overflow-hidden">
        <Image
          src="/illustrations/frigo-panne.png"
          alt={t("modals.breakdown.titleAccent")}
          width={160}
          height={160}
          className="object-contain drop-shadow-md"
        />
      </div>

      {/* Body */}
      <div className="p-6">
        <p className="font-mono text-[10px] text-abelec-muted-2 uppercase tracking-[0.12em] mb-2">
          {t("modals.breakdown.eyebrow")}
        </p>
        <h2 className="font-slab text-abelec-navy text-[22px] font-bold leading-snug mb-5">
          {t("modals.breakdown.title")}{" "}
          <span className="text-abelec-orange italic">{t("modals.breakdown.titleAccent")}</span>
        </h2>

        {/* 3 steps */}
        <div className="space-y-4 mb-6">
          {steps.map((step) => (
            <div key={step.num} className="flex gap-4">
              <div className="shrink-0 w-8 h-8 rounded-full bg-abelec-orange/10 border border-abelec-orange/20 flex items-center justify-center">
                <span className="font-mono text-[11px] font-bold text-abelec-orange">{step.num}</span>
              </div>
              <div className="pt-0.5">
                <p className="font-slab font-bold text-abelec-navy text-[14.5px] mb-0.5">{t(step.titleKey)}</p>
                <p className="text-[12.5px] text-abelec-muted leading-relaxed">{t(step.descKey)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Belgian repair CTA */}
        <div
          className="rounded-xl p-4 flex items-start gap-3"
          style={{ background: "rgba(26, 58, 92, 0.04)", border: "1px solid rgba(26, 58, 92, 0.10)" }}
        >
          <Phone size={18} className="text-abelec-orange shrink-0 mt-0.5" strokeWidth={1.8} />
          <div>
            <p className="font-slab font-bold text-abelec-navy text-[14px] mb-0.5">
              {t("modals.breakdown.repairTitle")}
            </p>
            <p className="text-[12px] text-abelec-muted leading-relaxed">
              {t("modals.breakdown.repairDesc")}
            </p>
            <button
              onClick={onClose}
              className="mt-2.5 px-4 py-2 rounded-xl bg-abelec-navy hover:bg-abelec-navy/90 text-white font-semibold text-[12.5px] transition-colors"
            >
              {t("modals.breakdown.repairCta")}
            </button>
          </div>
        </div>
      </div>
    </ModalBase>
  );
}
