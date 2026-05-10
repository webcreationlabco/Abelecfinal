"use client";

import Image from "next/image";
import { useState } from "react";
import { Search } from "lucide-react";
import { useT } from "@/lib/i18n";
import ModalBase from "./modal-base";

interface Props {
  open: boolean;
  onClose: () => void;
}

const EXAMPLES = [
  { ref: "C00094128",     label: "Joint hublot Whirlpool" },
  { ref: "481281729632",  label: "Pompe vidange Beko" },
  { ref: "1258C-EPJ",     label: "Courroie Miele / AEG" },
];

export default function PartReferenceModal({ open, onClose }: Props) {
  const t = useT();
  const [query, setQuery] = useState("");

  return (
    <ModalBase open={open} onClose={onClose}>
      {/* Header — illustration */}
      <div className="relative h-44 bg-[#FBF8F3] border-b border-abelec-cream-line flex items-center justify-center overflow-hidden">
        <Image
          src="/illustrations/piece-reference.png"
          alt={t("modals.part.titleAccent")}
          width={160}
          height={160}
          className="object-contain drop-shadow-md"
        />
      </div>

      {/* Body */}
      <div className="p-6">
        <p className="font-mono text-[10px] text-abelec-muted-2 uppercase tracking-[0.12em] mb-2">
          {t("modals.part.eyebrow")}
        </p>
        <h2 className="font-slab text-abelec-navy text-[22px] font-bold leading-snug mb-3">
          {t("modals.part.title")}{" "}
          <span className="text-abelec-orange italic">{t("modals.part.titleAccent")}</span>
        </h2>

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
            placeholder={t("modals.part.placeholder")}
            className="flex-1 px-3 py-3.5 text-[13px] font-mono bg-transparent outline-none text-abelec-navy placeholder:text-abelec-muted-2"
          />
        </div>

        {/* Example references */}
        <p className="font-mono text-[10px] text-abelec-muted-2 uppercase tracking-[0.1em] mb-2">
          {t("modals.part.examplesLabel")}
        </p>
        <div className="space-y-2 mb-5">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.ref}
              onClick={() => setQuery(ex.ref)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-abelec-cream-light hover:bg-abelec-cream-line border border-abelec-cream-line hover:border-abelec-orange transition-all text-left group"
            >
              <span className="font-mono text-[12px] text-abelec-navy font-semibold group-hover:text-abelec-orange transition-colors">
                {ex.ref}
              </span>
              <span className="text-[11.5px] text-abelec-muted">{ex.label}</span>
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-abelec-orange hover:bg-[#b8612a] text-white font-semibold text-[14px] transition-colors shadow-[inset_0_-2px_0_rgba(0,0,0,.12)]"
        >
          {t("modals.part.cta")}
        </button>
      </div>
    </ModalBase>
  );
}
