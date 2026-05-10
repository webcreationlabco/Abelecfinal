"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, ChevronDown, Star, ShieldCheck, Truck, Package } from "lucide-react";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import ApplianceReferenceModal from "@/components/modals/appliance-reference-modal";
import BreakdownModal          from "@/components/modals/breakdown-modal";
import PartReferenceModal      from "@/components/modals/part-reference-modal";

/* ─── Appliance / brand lists ────────────────────────────────────────────── */
const APPLIANCES = [
  { value: "lave-linge",     label: "Lave-linge" },
  { value: "lave-vaisselle", label: "Lave-vaisselle" },
  { value: "refrigerateur",  label: "Réfrigérateur" },
  { value: "four",           label: "Four & Cuisinière" },
  { value: "seche-linge",    label: "Sèche-linge" },
  { value: "aspirateur",     label: "Aspirateur" },
  { value: "micro-ondes",    label: "Micro-ondes" },
];

const BRANDS = [
  "Bosch","Siemens","Whirlpool","AEG","Indesit",
  "Hotpoint","Miele","Electrolux","Samsung","LG",
  "Beko","Candy","Zanussi","Brandt",
];

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

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.62, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
});

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
  const [appliance, setAppliance]     = useState("");
  const [brand, setBrand]             = useState("");
  const [query, setQuery]             = useState("");
  const [activeModal, setActiveModal] = useState<ModalId | null>(null);

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════
          PART 1 — image card (55-60vh) + search zone below
      ══════════════════════════════════════════════════════════════ */}
      <section
        className="w-full"
        style={{
          background: "linear-gradient(180deg,#F8F5F0 0%,#F4EFE6 100%)",
          padding: "clamp(28px,4.5vw,60px) clamp(12px,4vw,80px) 0",
        }}
      >
        {/* ── Hero image card ───────────────────────────────────────── */}
        <div
          className="relative mx-auto overflow-hidden"
          style={{ borderRadius: "16px", height: "clamp(260px,58vh,540px)" }}
        >
          {/* Blurred warehouse photo */}
          <Image
            src="/warehouse-hero.jpg"
            alt=""
            fill
            priority
            className="object-cover object-center"
            style={{ filter: "blur(4px)", transform: "scale(1.04)" }}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(8,18,36,0.42)" }} />

          {/* Centered headline content only */}
          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center"
            style={{ padding: "clamp(28px,5vw,64px) clamp(16px,4vw,56px)" }}
          >
            <motion.p
              {...fadeUp(0)}
              className="eyebrow mb-5 sm:mb-7"
              style={{ color: "rgba(255,255,255,0.58)" }}
            >
              EST. · ENTREPRISE FAMILIALE BELGE · FONDÉE EN 1983
            </motion.p>

            <motion.h1
              {...fadeUp(0.08)}
              className="text-white mx-auto mb-4 sm:mb-6"
              style={{ maxWidth: "720px" }}
            >
              <span className="block">{t("hero.title1")}</span>
              <span className="block text-abelec-orange italic font-medium">{t("hero.title2")}</span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.16)}
              className="text-white/70 text-[15px] sm:text-[18px] leading-relaxed mx-auto max-sm:hidden"
              style={{ maxWidth: "500px" }}
            >
              {t("hero.sub1")}{" "}
              <strong className="text-white">{t("hero.sub2")}</strong>
            </motion.p>
          </div>
        </div>

        {/* ── Search zone — cream bg, directly below card ─────────────── */}
        <div
          className="mx-auto"
          style={{
            paddingTop:    "clamp(32px,4vw,52px)",
            paddingBottom: "clamp(36px,5vw,64px)",
          }}
        >
          {/* Label */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="text-center font-mono text-[10.5px] uppercase tracking-[0.18em] text-abelec-navy mb-4"
          >
            {t("hero.searchLabel")}
          </motion.p>

          {/* Search form */}
          <motion.form
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Desktop single-row */}
            <div
              className="hidden md:flex bg-white rounded-2xl overflow-hidden"
              style={{
                height: "64px",
                border: "1.5px solid #E8DFD0",
                boxShadow: "0 4px 24px rgba(26,58,92,0.09)",
              }}
            >
              <div className="relative flex items-center border-r border-abelec-cream-line" style={{ minWidth: "178px" }}>
                <select
                  value={appliance}
                  onChange={(e) => setAppliance(e.target.value)}
                  className="appearance-none pl-5 pr-9 h-full w-full text-[14px] bg-transparent outline-none cursor-pointer font-medium"
                  style={{ color: appliance ? "#0f2340" : "#8a8a8a" }}
                >
                  <option value="">Type d&apos;appareil</option>
                  {APPLIANCES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-abelec-muted-2 pointer-events-none" />
              </div>

              <div className="relative flex items-center border-r border-abelec-cream-line" style={{ minWidth: "148px" }}>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="appearance-none pl-5 pr-9 h-full w-full text-[14px] bg-transparent outline-none cursor-pointer font-medium"
                  style={{ color: brand ? "#0f2340" : "#8a8a8a" }}
                >
                  <option value="">Marque</option>
                  {BRANDS.map(b => <option key={b} value={b.toLowerCase()}>{b}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-abelec-muted-2 pointer-events-none" />
              </div>

              <div className="flex-1 flex items-center gap-3 px-5">
                <Search size={16} className="text-abelec-muted-2 shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Référence ou modèle..."
                  className="flex-1 bg-transparent outline-none text-[15px] text-abelec-navy-ink placeholder:text-abelec-muted-2"
                />
              </div>

              <button
                type="submit"
                className="bg-abelec-orange hover:bg-abelec-orange-dark text-white font-bold text-[15px] px-7 h-full flex items-center gap-2 transition-colors shrink-0 rounded-r-[14px]"
                style={{ boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.12)" }}
              >
                <Search size={15} strokeWidth={2.3} />
                {t("hero.searchBtn")}
              </button>
            </div>

            {/* Mobile stacked */}
            <div className="flex md:hidden flex-col gap-2">
              <div className="relative bg-white rounded-xl border border-abelec-cream-line" style={{ height: "52px" }}>
                <select value={appliance} onChange={e => setAppliance(e.target.value)}
                  className="appearance-none w-full h-full pl-4 pr-9 text-[14px] bg-transparent outline-none cursor-pointer font-medium text-abelec-navy">
                  <option value="">Type d&apos;appareil</option>
                  {APPLIANCES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-abelec-muted-2 pointer-events-none" />
              </div>
              <div className="relative bg-white rounded-xl border border-abelec-cream-line" style={{ height: "52px" }}>
                <select value={brand} onChange={e => setBrand(e.target.value)}
                  className="appearance-none w-full h-full pl-4 pr-9 text-[14px] bg-transparent outline-none cursor-pointer font-medium text-abelec-navy">
                  <option value="">Marque</option>
                  {BRANDS.map(b => <option key={b} value={b.toLowerCase()}>{b}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-abelec-muted-2 pointer-events-none" />
              </div>
              <div className="flex items-center gap-3 bg-white rounded-xl border border-abelec-cream-line px-4" style={{ height: "52px" }}>
                <Search size={15} className="text-abelec-muted-2 shrink-0" />
                <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                  placeholder="Référence ou modèle..."
                  className="flex-1 bg-transparent outline-none text-[14px] text-abelec-navy placeholder:text-abelec-muted-2" />
              </div>
              <button type="submit"
                className="bg-abelec-orange text-white font-bold text-[15px] rounded-xl flex items-center justify-center gap-2"
                style={{ height: "52px" }}>
                <Search size={15} strokeWidth={2.3} /> {t("hero.searchBtn")}
              </button>
            </div>
          </motion.form>

          {/* Trust dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.42, duration: 0.5 }}
            className="flex items-center justify-center gap-5 sm:gap-8 flex-wrap mt-5"
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
          PART 2 — trust bar (4.8/5 · garantie · expédition · stock)
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

      {/* ── Modals ──────────────────────────────────────────────────────────── */}
      <ApplianceReferenceModal open={activeModal === "appliance"} onClose={() => setActiveModal(null)} />
      <BreakdownModal          open={activeModal === "breakdown"} onClose={() => setActiveModal(null)} />
      <PartReferenceModal      open={activeModal === "part"}      onClose={() => setActiveModal(null)} />
    </>
  );
}
