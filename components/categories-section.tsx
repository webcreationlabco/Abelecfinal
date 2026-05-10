"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight } from "lucide-react";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { key: "washingMachine", img: "/categories/washing-machine.png",  parts: "Pompe · Courroie · Joint · Moteur" },
  { key: "dishwasher",     img: "/categories/dishwasher.png",        parts: "Bras · Pompe · Joint · Panier" },
  { key: "fridge",         img: "/categories/refrigator.png",        parts: "Clayette · Joint · Thermostat" },
  { key: "oven",           img: "/categories/oven-and-stove.png",    parts: "Résistance · Vitre · Charnière" },
  { key: "dryer",          img: "/categories/tumble-dryer.png",      parts: "Condensateur · Courroie · Filtre" },
  { key: "vacuum",         img: "/categories/vacuum.png",            parts: "Brosse · Filtre · Sac" },
] as const;

const SUBCATEGORIES: Record<string, { name: string; count: number }[]> = {
  washingMachine: [
    { name: "Courroie",             count: 412 },
    { name: "Pompe de vidange",     count: 286 },
    { name: "Joint de hublot",      count: 318 },
    { name: "Palier & roulement",   count: 204 },
    { name: "Amortisseur",          count: 142 },
    { name: "Électrovanne",         count: 198 },
    { name: "Moteur",               count: 86  },
    { name: "Porte & hublot",       count: 164 },
    { name: "Sécurité verrou",      count: 94  },
    { name: "Aube de tambour",      count: 58  },
    { name: "Accessoires",          count: 112 },
  ],
  dishwasher: [
    { name: "Bras de lavage",       count: 134 },
    { name: "Pompe de cyclage",     count: 96  },
    { name: "Pompe de vidange",     count: 128 },
    { name: "Joint de porte",       count: 112 },
    { name: "Panier",               count: 142 },
    { name: "Résistance",           count: 88  },
    { name: "Électrovanne",         count: 74  },
    { name: "Tuyau d'eau",          count: 52  },
    { name: "Porte habillage",      count: 68  },
    { name: "Détartrant",           count: 34  },
    { name: "Accessoires",          count: 86  },
  ],
  fridge: [
    { name: "Balconnet",            count: 168 },
    { name: "Clayette",             count: 194 },
    { name: "Joint de porte",       count: 224 },
    { name: "Thermostat",           count: 148 },
    { name: "Filtre",               count: 98  },
    { name: "Poignée",              count: 86  },
    { name: "Porte",                count: 120 },
    { name: "Tiroir congélation",   count: 88  },
    { name: "Façade",               count: 64  },
    { name: "Portillon freezer",    count: 72  },
    { name: "Accessoires",          count: 102 },
  ],
  oven: [
    { name: "Résistance",           count: 186 },
    { name: "Thermostat",           count: 122 },
    { name: "Joint de porte",       count: 94  },
    { name: "Vitre",                count: 82  },
    { name: "Charnière",            count: 78  },
    { name: "Grille & plaque",      count: 156 },
    { name: "Manette & bouton",     count: 216 },
    { name: "Ampoule",              count: 48  },
    { name: "Injecteur",            count: 62  },
    { name: "Commutateur",          count: 54  },
    { name: "Accessoires",          count: 94  },
  ],
  dryer: [
    { name: "Condensateur",         count: 58  },
    { name: "Courroie",             count: 86  },
    { name: "Filtre",               count: 92  },
    { name: "Palier & roulement",   count: 76  },
    { name: "Pompe de vidange",     count: 68  },
    { name: "Résistance",           count: 88  },
    { name: "Porte",                count: 54  },
    { name: "Poulie & galet",       count: 82  },
    { name: "Réservoir collecteur", count: 44  },
    { name: "Patin & clapet",       count: 36  },
    { name: "Accessoires",          count: 64  },
  ],
  vacuum: [
    { name: "Brosse",               count: 142 },
    { name: "Filtre",               count: 186 },
    { name: "Sac",                  count: 94  },
    { name: "Tuyau & flexible",     count: 78  },
    { name: "Accessoires",          count: 102 },
  ],
};

// ── Modal ─────────────────────────────────────────────────────────────────
function CategoryModal({
  catKey,
  onClose,
}: {
  catKey: string;
  onClose: () => void;
}) {
  const t = useT();
  const cat = CATEGORIES.find((c) => c.key === catKey)!;
  const name = t(`categories.${catKey}.name`);
  const subcats = SUBCATEGORIES[catKey] ?? [];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: "rgba(15, 35, 64, 0.55)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        exit={{ opacity: 0,    scale: 0.95, y: 10 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="bg-white rounded-2xl shadow-[0_24px_80px_rgba(15,35,64,0.20)] w-full max-w-[860px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-7 pt-6 pb-4 border-b border-abelec-cream-line">
          <div>
            <h3 className="font-slab text-abelec-navy-ink text-[22px] font-bold leading-tight">{name}</h3>
            <p className="text-abelec-muted text-[13.5px] mt-1">
              {t("categories.selectZone")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg grid place-items-center text-abelec-muted hover:text-abelec-navy-ink hover:bg-abelec-cream-light transition-colors ml-4 shrink-0 mt-0.5"
            aria-label="Fermer"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="flex max-sm:flex-col">
          {/* Left — illustration */}
          <div className="w-[260px] shrink-0 bg-abelec-paper border-r border-abelec-cream-line flex flex-col items-center justify-center gap-5 p-8 max-sm:w-full max-sm:border-r-0 max-sm:border-b max-sm:py-6">
            <div className="relative w-44 h-44">
              <Image
                src={cat.img}
                alt={name}
                fill
                className="object-contain"
                sizes="176px"
              />
            </div>
            <p className="font-mono text-[10.5px] text-abelec-muted-2 text-center leading-relaxed tracking-[0.03em]">
              {t("categories.hoverZone")}
            </p>
          </div>

          {/* Right — subcategory list */}
          <div className="flex-1 overflow-y-auto" style={{ maxHeight: "min(420px, 60vh)" }}>
            {subcats.map((sub) => (
              <button
                key={sub.name}
                className="w-full flex items-center justify-between px-6 py-3.5 border-b border-abelec-cream-line/60 hover:bg-abelec-cream-light transition-colors text-left group"
              >
                <span className="font-medium text-[14px] text-abelec-navy-ink group-hover:text-abelec-orange transition-colors">
                  {sub.name}
                </span>
                <span className="font-mono text-[11px] font-bold bg-abelec-navy text-white px-2.5 py-0.5 rounded-full shrink-0 ml-3">
                  {sub.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main section ──────────────────────────────────────────────────────────
export default function CategoriesSection() {
  const t = useT();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  return (
    <section className="bg-abelec-cream-light py-16 px-6">
      <div className="max-w-[1240px] mx-auto">
        {/* Header — left-aligned */}
        <div className="mb-12">
          <p className="eyebrow mb-3">Nos appareils</p>
          <h2 className="font-slab text-abelec-navy">
            {t("categories.title")}{" "}
            <span className="text-abelec-orange italic">{t("categories.titleAccent")}</span>
          </h2>
        </div>

        {/* Grid — 3 cols × 2 rows */}
        <div className="grid grid-cols-3 gap-5 max-md:grid-cols-2 max-sm:grid-cols-1">
          {CATEGORIES.map((cat, i) => {
            const name = t(`categories.${cat.key}.name`);
            return (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.42, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                onClick={() => setSelectedKey(cat.key)}
                className={cn(
                  "group cursor-pointer",
                  "bg-[#FDFAF6] border border-abelec-cream-line rounded-[16px] overflow-hidden",
                  "transition-[border-color,box-shadow] duration-200 hover:border-abelec-orange hover:shadow-card-lg"
                )}
              >
                {/* Image zone — 65% of card height via aspect ratio */}
                <div className="relative w-full" style={{ paddingBottom: "65%" }}>
                  <Image
                    src={cat.img}
                    alt={name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  />
                </div>

                {/* Bottom zone */}
                <div className="p-4 border-t border-abelec-cream-line">
                  <h3 className="font-slab text-abelec-navy text-[17px] font-bold mb-1 group-hover:text-abelec-orange transition-colors">
                    {name}
                  </h3>
                  <p className="font-mono text-abelec-muted-2 text-[11px] truncate mb-2">
                    {cat.parts}
                  </p>
                  <div className="flex items-center justify-end">
                    <ChevronRight
                      size={15}
                      className="text-abelec-muted-2 group-hover:text-abelec-orange transition-colors"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedKey && (
          <CategoryModal
            key={selectedKey}
            catKey={selectedKey}
            onClose={() => setSelectedKey(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
