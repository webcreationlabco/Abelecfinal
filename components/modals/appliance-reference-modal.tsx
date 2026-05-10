"use client";

import Image from "next/image";
import { useState } from "react";
import { Search, Info } from "lucide-react";
import { useT } from "@/lib/i18n";
import ModalBase from "./modal-base";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ApplianceReferenceModal({ open, onClose }: Props) {
  const t = useT();
  const [query, setQuery] = useState("");

  return (
    <ModalBase open={open} onClose={onClose}>
      {/* Header — illustration */}
      <div className="relative h-44 bg-[#FBF8F3] border-b border-abelec-cream-line flex items-center justify-center overflow-hidden">
        <Image
          src="/illustrations/appareil-reference.png"
          alt={t("modals.appliance.titleAccent")}
          width={160}
          height={160}
          className="object-contain drop-shadow-md"
        />
      </div>

      {/* Body */}
      <div className="p-6">
        <p className="font-mono text-[10px] text-abelec-muted-2 uppercase tracking-[0.12em] mb-2">
          {t("modals.appliance.eyebrow")}
        </p>
        <h2 className="font-slab text-abelec-navy text-[22px] font-bold leading-snug mb-3">
          {t("modals.appliance.title")}<br />
          <span className="text-abelec-orange italic">{t("modals.appliance.titleAccent")}</span>
        </h2>

        {/* Info note */}
        <div className="flex items-start gap-3 bg-abelec-cream-light rounded-xl p-3.5 mb-5 border border-abelec-cream-line">
          <Info size={15} className="text-abelec-orange shrink-0 mt-0.5" strokeWidth={1.8} />
          <p className="text-[12.5px] text-abelec-muted leading-relaxed">
            {t("modals.appliance.info")}{" "}
            <span className="text-abelec-muted-2">{t("modals.appliance.infoWarn")}</span>
          </p>
        </div>

        {/* Search input */}
        <div
          className="flex items-center bg-white rounded-xl overflow-hidden mb-4"
          style={{ border: "1px solid rgba(26, 58, 92, 0.15)", boxShadow: "0 2px 10px rgba(26,58,92,0.06)" }}
        >
          <Search size={15} className="text-abelec-muted-2 ml-4 shrink-0" strokeWidth={2} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("modals.appliance.placeholder")}
            className="flex-1 px-3 py-3.5 text-[13px] font-mono bg-transparent outline-none text-abelec-navy placeholder:text-abelec-muted-2"
          />
        </div>

        {/* CTA */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-abelec-orange hover:bg-[#b8612a] text-white font-semibold text-[14px] transition-colors shadow-[inset_0_-2px_0_rgba(0,0,0,.12)]"
        >
          {t("modals.appliance.cta")}
        </button>
      </div>
    </ModalBase>
  );
}
