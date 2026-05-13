"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, Star, ShieldCheck, Truck, Package } from "lucide-react";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import ApplianceReferenceModal from "@/components/modals/appliance-reference-modal";
import BreakdownModal          from "@/components/modals/breakdown-modal";
import PartReferenceModal      from "@/components/modals/part-reference-modal";

/* ─── Orientation cards ──────────────────────────────────────────────────── */
type ModalId = "appliance" | "breakdown" | "part";

const CARDS: { img: string; titleKey: string; descKey: string; modalId: ModalId }[] = [
  { img: "/illustrations/appareil-reference.png", titleKey: "hero.card1Title", descKey: "hero.card1Desc", modalId: "appliance" },
  { img: "/illustrations/frigo-panne.png",         titleKey: "hero.card2Title", descKey: "hero.card2Desc", modalId: "breakdown" },
  { img: "/illustrations/piece-reference.png",     titleKey: "hero.card3Title", descKey: "hero.card3Desc", modalId: "part"      },
];

function OrientationCard({ card, idx, onOpen }: { card: (typeof CARDS)[number]; idx: number; onOpen: () => void }) {
  const t = useT();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      onClick={onOpen}
      className={cn(
        "group rounded-[14px] cursor-pointer bg-[#FDFAF6] flex flex-col",
        "border border-transparent hover:border-abelec-orange",
        "shadow-card-sm transition-[border-color,box-shadow] duration-250 hover:shadow-card-md"
      )}
    >
      <div className="relative h-44 rounded-t-[13px] overflow-hidden border-b border-abelec-cream-line flex items-center justify-center p-3" style={{ background: "#FBF8F3" }}>
        <div className="group-hover:scale-105 transition-transform duration-300 will-change-transform">
          <Image src={card.img} alt={t(card.titleKey)} width={180} height={180} className="object-contain drop-shadow-sm" priority={idx === 0} />
        </div>
      </div>
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <h3 className="font-slab text-abelec-navy-ink text-[16px] font-semibold leading-snug">{t(card.titleKey)}</h3>
        <p className="text-abelec-muted text-[12px] leading-relaxed">{t(card.descKey)}</p>
      </div>
    </motion.div>
  );
}

function TrustChip({ icon: Icon, label, sub }: { icon: React.ElementType; label: string; sub?: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={15} className="text-abelec-orange shrink-0" />
      <span className="text-[13px] font-semibold text-abelec-navy-ink">{label}</span>
      {sub && <span className="text-[12px] text-abelec-muted-2">{sub}</span>}
    </div>
  );
}

/* ─── Hero section ───────────────────────────────────────────────────────── */
export default function HeroSection() {
  const t = useT();
  const [query, setQuery]             = useState("");
  const [activeModal, setActiveModal] = useState<ModalId | null>(null);

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════
          PART 1 — editorial image card + search zone
      ══════════════════════════════════════════════════════════════ */}
      <section
        className="w-full"
        style={{
          background: "linear-gradient(180deg,#F8F5F0 0%,#F4EFE6 100%)",
          padding: "clamp(32px,5vw,64px) clamp(24px,6vw,96px) 0",
        }}
      >
        {/* ── Editorial card ───────────────────────────────────────── */}
        <div
          className="relative mx-auto overflow-hidden"
          style={{
            borderRadius: "14px",
            height: "clamp(200px,38vh,340px)",
            maxWidth: "1080px",
          }}
        >
          {/* Full-bleed warehouse photo */}
          <Image
            src="/warehouse-hero.jpg"
            alt=""
            fill
            priority
            className="object-cover object-center"
          />

          {/* Left half — gradient overlay fading to transparent on the right */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(to right, rgba(8,18,36,0.72) 0%, rgba(8,18,36,0.72) 42%, rgba(8,18,36,0.18) 68%, rgba(8,18,36,0) 100%)",
            }}
          />

          {/* Headline — left aligned, left half */}
          <div
            className="absolute inset-0 z-10 flex flex-col justify-center"
            style={{ padding: "clamp(24px,4vw,52px) clamp(24px,4.5vw,56px)" }}
          >
            <motion.h1
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="text-white font-slab leading-[1.1] max-w-[480px]"
              style={{
                fontSize: "clamp(22px, 3.2vw, 44px)",
                letterSpacing: "-0.02em",
                textShadow: "0 2px 12px rgba(0,0,0,0.25)",
              }}
            >
              La pièce détachée électroménager depuis 1983.
            </motion.h1>
          </div>
        </div>

        {/* ── Search zone ──────────────────────────────────────────── */}
        <div
          className="mx-auto"
          style={{
            maxWidth: "1080px",
            paddingTop:    "clamp(28px,3.5vw,48px)",
            paddingBottom: "clamp(32px,4.5vw,60px)",
          }}
        >
          {/* Label */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="text-center font-mono text-[10.5px] uppercase tracking-[0.18em] text-abelec-navy mb-4"
          >
            {t("hero.searchLabel")}
          </motion.p>

          {/* Search bar — input + button only */}
          <motion.form
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26, duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center bg-white rounded-2xl overflow-hidden"
            style={{
              height: "60px",
              border: "1.5px solid #E8DFD0",
              boxShadow: "0 4px 24px rgba(26,58,92,0.08)",
            }}
          >
            <div className="flex-1 flex items-center gap-3 px-5">
              <Search size={16} className="text-abelec-muted-2 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Référence, marque ou modèle..."
                className="flex-1 bg-transparent outline-none text-[15px] text-abelec-navy-ink placeholder:text-abelec-muted-2"
              />
            </div>
            <button
              type="submit"
              className="bg-abelec-orange hover:bg-abelec-orange-dark text-white font-bold text-[15px] px-7 h-full flex items-center gap-2 transition-colors shrink-0 rounded-r-[14px]"
              style={{ boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.12)" }}
            >
              <Search size={15} strokeWidth={2.3} className="hidden sm:block" />
              {t("hero.searchBtn")}
            </button>
          </motion.form>

          {/* Trust dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex items-center justify-center gap-5 sm:gap-8 flex-wrap mt-4"
          >
            {([t("hero.searchMeta1"), t("hero.searchMeta2"), t("hero.searchMeta3")] as string[]).map((label, i) => (
              <span key={i} className="flex items-center gap-2 text-[11.5px] text-abelec-muted font-mono">
                <span className="w-[5px] h-[5px] rounded-full shrink-0 bg-abelec-orange" />
                {label}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          PART 2 — trust bar
      ══════════════════════════════════════════════════════════════ */}
      <div className="border-y border-abelec-cream-line bg-white">
        <div className="max-w-[1240px] mx-auto px-4 lg:px-12 py-3 sm:py-3.5 flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
          <TrustChip icon={Star}        label={`${t("hero.trustRating")} / 5`} sub={t("hero.trustReviews")} />
          <TrustChip icon={ShieldCheck} label={t("hero.trustWarranty")} />
          <TrustChip icon={Truck}       label={t("hero.trustShipping")} />
          <TrustChip icon={Package}     label="100 000 références" sub="en stock" />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          PART 3 — 3 orientation cards
      ══════════════════════════════════════════════════════════════ */}
      <div style={{ background: "linear-gradient(180deg, #F8F5F0 0%, #F4EFE6 100%)" }} className="px-6 pb-16 pt-10">
        <div className="max-w-[1240px] mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center font-mono text-[11px] uppercase tracking-[0.16em] mb-6"
            style={{ color: "rgba(26,58,92,0.4)" }}
          >
            Comment trouver votre pièce ?
          </motion.p>
          <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-2 max-sm:grid-cols-1 items-stretch">
            {CARDS.map((card, i) => (
              <OrientationCard key={card.modalId} card={card} idx={i} onOpen={() => setActiveModal(card.modalId)} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Modals ────────────────────────────────────────────────────────── */}
      <ApplianceReferenceModal open={activeModal === "appliance"} onClose={() => setActiveModal(null)} />
      <BreakdownModal          open={activeModal === "breakdown"} onClose={() => setActiveModal(null)} />
      <PartReferenceModal      open={activeModal === "part"}      onClose={() => setActiveModal(null)} />
    </>
  );
}
