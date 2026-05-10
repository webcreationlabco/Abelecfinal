"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, ShoppingBag, ChevronDown, X } from "lucide-react";
import { useI18n, useT, LOCALES, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

// ── Mega-menu column keys ─────────────────────────────────────────────────
const MEGA_COL_KEYS = [
  {
    key: "washingMachine",
    partsKey: "mega.washingMachineParts",
    catSlug: "lave-linge",
    counts: [412, 286, 318, 204, 142, 198, 86, 164, 94, 58, 112],
    // Courroie · Pompe de vidange · Joint de hublot · Palier · Amortisseur · Électrovanne · Moteur · Porte · Verrou · Aube · Accessoires
    hrefs: [
      "/produit/courroie-miele-1258c-epj",
      "/produit/pompe-vidange-beko-481281729632",
      "/produit/joint-hublot-whirlpool-c00094128",
      null, null,
      "/produit/electrovanne-bosch-ev-2v-bsh",
      "/produit/moteur-indesit-mu-ih-550w",
      null, null, null, null,
    ],
  },
  {
    key: "dishwasher",
    partsKey: "mega.dishwasherParts",
    catSlug: "lave-vaisselle",
    counts: [134, 96, 128, 112, 142, 88, 74, 52, 86],
    hrefs: [null, null, null, null, null, null, null, null, null],
  },
  {
    key: "fridge",
    partsKey: "mega.fridgeParts",
    catSlug: "refrigerateur",
    counts: [168, 194, 224, 148, 98, 86, 102],
    // Balconnet · Clayette · Joint de porte · Thermostat · Filtre · Poignée · Accessoires
    hrefs: [null, null, null, "/produit/thermostat-liebherr-ts-r59l1102", null, null, null],
  },
  {
    key: "oven",
    partsKey: "mega.ovenParts",
    catSlug: "four",
    counts: [186, 122, 94, 82, 78, 216, 94],
    // Résistance · Thermostat · Joint de porte · Vitre · Charnière · Manette · Accessoires
    hrefs: ["/produit/resistance-four-brandt-rf-78954", null, null, null, null, null, null],
  },
  {
    key: "dryer",
    partsKey: "mega.dryerParts",
    catSlug: "seche-linge",
    counts: [58, 86, 92, 88, 64],
    hrefs: [null, null, null, null, null],
  },
  {
    key: "vacuum",
    partsKey: "mega.vacuumParts",
    catSlug: "aspirateur",
    counts: [142, 186, 94, 78, 102],
    // Brosse · Filtre · Sac · Tuyau · Accessoires
    hrefs: [null, "/produit/filtre-hepa-dyson-hepa-dy-r", null, null, null],
  },
];

// ── Language switcher ─────────────────────────────────────────────────────
function LangSwitcher({ scrolled }: { scrolled: boolean }) {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const current = LOCALES.find((l) => l.code === locale)!;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-1 px-2.5 py-2 rounded-lg text-[13px] font-semibold font-mono transition-colors",
          scrolled
            ? "text-abelec-navy-ink hover:bg-abelec-navy/[0.06]"
            : "text-abelec-navy-ink hover:bg-abelec-navy/[0.06]"
        )}
        aria-label="Changer de langue"
      >
        <span>{current.code.toUpperCase()}</span>
        <ChevronDown size={11} className={cn("opacity-70 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-44 bg-white border border-abelec-cream-line rounded-xl shadow-card-lg py-1 z-50"
          >
            {LOCALES.map((l) => (
              <li key={l.code}>
                <button
                  onClick={() => { setLocale(l.code as Locale); setOpen(false); }}
                  className={cn(
                    "w-full text-left px-4 py-2.5 flex items-center gap-3 text-sm transition-colors",
                    l.code === locale
                      ? "bg-abelec-cream-light text-abelec-navy font-semibold"
                      : "text-abelec-muted hover:text-abelec-navy-ink hover:bg-abelec-cream-light"
                  )}
                >
                  <span>{l.label}</span>
                  {l.code === locale && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-abelec-orange" />
                  )}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Mega menu ─────────────────────────────────────────────────────────────
function MegaMenu({ open, t, raw }: { open: boolean; t: (k: string) => string; raw: Record<string, unknown> }) {
  // Read parts arrays from raw translation object
  const getParts = (path: string): string[] => {
    const parts = path.split(".");
    let val: unknown = raw;
    for (const p of parts) {
      if (val == null || typeof val !== "object") return [];
      val = (val as Record<string, unknown>)[p];
    }
    return Array.isArray(val) ? (val as string[]) : [];
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8, x: "-50%" }}
          animate={{ opacity: 1, y: 0,  x: "-50%" }}
          exit={{ opacity: 0, y: -8,    x: "-50%" }}
          transition={{ duration: 0.18 }}
          className="absolute top-[calc(100%+14px)] left-1/2 bg-white border border-abelec-cream-line rounded-2xl shadow-card-lg w-[min(1160px,calc(100vw-64px))] p-7 z-[200]"
        >
          <div className="grid grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-x-10 gap-y-5">
            {MEGA_COL_KEYS.map((col) => {
              const parts = getParts(col.partsKey);
              const catUrl = `/catalogue?categorie=${col.catSlug}`;
              return (
                <div key={col.key}>
                  <h4 className="font-slab text-[14.5px] text-abelec-navy font-bold pb-2 mb-2.5 border-b border-abelec-cream-line">
                    <Link href={catUrl} className="hover:text-abelec-orange transition-colors">
                      {t(`mega.${col.key}`)}
                    </Link>
                  </h4>
                  <ul className="grid grid-cols-2 gap-px gap-x-4">
                    {parts.map((label, i) => (
                      <li key={label}>
                        <Link
                          href={col.hrefs[i] ?? catUrl}
                          className="flex items-center py-1 text-[13px] text-abelec-muted hover:text-abelec-orange transition-colors"
                        >
                          {label}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        href={catUrl}
                        className="flex items-center py-2 mt-1.5 pt-2 border-t border-dashed border-abelec-cream-line text-[13px] text-abelec-navy-ink font-medium"
                      >
                        {t("mega.allParts")}
                      </Link>
                    </li>
                  </ul>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-3.5 border-t border-dashed border-abelec-cream-line flex justify-between items-center font-mono text-[11px] text-abelec-muted flex-wrap gap-2">
            <span><strong className="text-abelec-navy-ink">100 000</strong> {t("mega.stockLine")}</span>
            <span className="text-abelec-orange font-semibold">{t("mega.notFound")}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Main Header ───────────────────────────────────────────────────────────
export default function Header() {
  const t = useT();
  const { t: raw } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const megaTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const handler = () => {
      const s = window.scrollY > 60;
      setScrolled(s);
      if (!s) { setSearchOpen(false); setMegaOpen(false); }
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const openMega  = () => { clearTimeout(megaTimer.current); setMegaOpen(true); };
  const closeMega = () => { megaTimer.current = setTimeout(() => setMegaOpen(false), 140); };

  return (
    <>
      {/* ── Announcement marquee bar ─────────────────────────────────────── */}
      <div
        className="w-full overflow-hidden border-b border-abelec-navy/[0.06]"
        style={{ height: "36px", background: "#F0EBE3", display: "flex", alignItems: "center" }}
      >
        <div className="announcement-track flex whitespace-nowrap">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="font-mono shrink-0"
              style={{ fontSize: "11px", color: "rgba(26,58,92,0.65)", letterSpacing: "0.04em", paddingRight: "4rem" }}
            >
              {t("topStrip.announce")} &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/*
       * ── Sticky cream header ─────────────────────────────────────────────
       * Always in the DOM so content below never shifts.
       * Fades out when scrolled (the pill takes over visually).
       */}
      <header
        className="sticky top-0 z-40"
        style={{
          background: "#F8F5F0",
          borderBottom: "1px solid rgba(26, 58, 92, 0.08)",
          opacity: scrolled ? 0 : 1,
          pointerEvents: scrolled ? "none" : "auto",
          transition: "opacity 0.2s ease",
        }}
      >
        <div className="relative max-w-[1240px] mx-auto grid grid-cols-[1fr_auto_1fr] max-sm:grid-cols-[1fr_1fr] items-center px-4 sm:px-8 py-[14px] sm:py-[18px]">
          {/* Logo — left */}
          <Link href="/" aria-label="Abelec">
            <Image src="/ABELEC_LOGO.svg" alt="Abelec" width={120} height={40} priority className="h-9 w-auto object-contain" />
          </Link>

          {/* Nav — center (hidden on mobile) */}
          <div onMouseLeave={closeMega} className="max-sm:hidden">
            <button
              className="flex items-center gap-1.5 font-medium text-[15px] text-abelec-navy-ink px-4 py-2.5 rounded-lg hover:bg-abelec-navy/[0.06] transition-colors"
              onMouseEnter={openMega}
              onClick={() => setMegaOpen((o) => !o)}
              aria-expanded={megaOpen}
            >
              {t("nav.appliances")}
              <ChevronDown size={14} className={cn("transition-transform", megaOpen && "rotate-180")} />
            </button>
            <div onMouseEnter={openMega}>
              <MegaMenu open={megaOpen} t={t} raw={raw} />
            </div>
          </div>

          {/* Right controls — right-aligned */}
          <div className="flex items-center gap-1 justify-end">
            <LangSwitcher scrolled={false} />
            <Link href="/contact" className="hidden sm:flex items-center px-3 py-2 rounded-lg text-[14px] font-medium text-abelec-navy-ink hover:bg-abelec-navy/[0.06] transition-colors" aria-label="Contact">
              Contact
            </Link>
            <Link href="/compte/dashboard" className="w-9 h-9 rounded-lg grid place-items-center text-abelec-navy-ink hover:bg-abelec-navy/[0.06] transition-colors" aria-label={t("nav.myAccount")}>
              <User size={18} strokeWidth={1.8} />
            </Link>
            <Link href="/panier" className="w-9 h-9 rounded-lg grid place-items-center text-abelec-navy-ink hover:bg-abelec-navy/[0.06] transition-colors relative" aria-label={t("nav.cart")}>
              <ShoppingBag size={18} strokeWidth={1.8} />
              <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-abelec-orange text-white text-[10px] font-bold font-mono grid place-items-center leading-none">2</span>
            </Link>
          </div>
        </div>
      </header>

      {/*
       * ── Fixed navy pill ─────────────────────────────────────────────────
       * position: fixed, centered via inset-x-0 + mx-auto (no transform conflict
       * with framer-motion's y animation).
       */}
      <AnimatePresence>
        {scrolled && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 mx-auto z-50 flex items-center gap-3"
            style={{
              top: "12px",
              maxWidth: "900px",
              width: "calc(100% - 48px)",
              background: "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              borderRadius: "9999px",
              border: "1px solid rgba(26, 58, 92, 0.10)",
              boxShadow: "0 4px 20px rgba(26, 58, 92, 0.08)",
              padding: "10px 20px",
              willChange: "transform",
            }}
          >
            {/* Logo */}
            <Link href="/" aria-label="Abelec" className="shrink-0">
              <Image
                src="/ABELEC_LOGO.svg"
                alt="Abelec"
                width={90}
                height={30}
                className="h-7 w-auto object-contain"
              />
            </Link>

            {/* Center — nav or search input */}
            <div className="flex-1 flex items-center justify-center min-w-0">
              <AnimatePresence mode="wait">
                {searchOpen ? (
                  <motion.input
                    key="pill-search"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    placeholder={t("nav.searchPlaceholder")}
                    className="w-full bg-transparent text-abelec-navy-ink text-[13px] font-mono placeholder:text-abelec-muted-2 outline-none"
                    autoFocus
                  />
                ) : (
                  <motion.div
                    key="pill-nav"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="relative hidden md:block"
                    onMouseLeave={closeMega}
                  >
                    <button
                      className="flex items-center gap-1.5 text-[14px] font-medium text-abelec-navy-ink px-3 py-1.5 rounded-full hover:bg-abelec-navy/[0.06] transition-colors"
                      onMouseEnter={openMega}
                      onClick={() => setMegaOpen((o) => !o)}
                      aria-expanded={megaOpen}
                    >
                      {t("nav.appliances")}
                      <ChevronDown size={13} className={cn("opacity-70 transition-transform", megaOpen && "rotate-180")} />
                    </button>
                    <div onMouseEnter={openMega}>
                      <MegaMenu open={megaOpen} t={t} raw={raw} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                onClick={() => setSearchOpen((o) => !o)}
                className="w-8 h-8 rounded-full grid place-items-center text-abelec-navy-ink hover:bg-abelec-navy/[0.06] transition-colors"
                aria-label="Rechercher"
              >
                {searchOpen ? <X size={15} strokeWidth={2} /> : <Search size={15} strokeWidth={1.8} />}
              </button>
              <LangSwitcher scrolled={true} />
              <Link href="/contact" className="hidden sm:flex items-center px-2.5 py-1.5 rounded-full text-[13px] font-medium text-abelec-navy-ink hover:bg-abelec-navy/[0.06] transition-colors">
                Contact
              </Link>
              <Link href="/compte/dashboard" className="w-8 h-8 rounded-full grid place-items-center text-abelec-navy-ink hover:bg-abelec-navy/[0.06] transition-colors" aria-label={t("nav.myAccount")}>
                <User size={15} strokeWidth={1.8} />
              </Link>
              <Link href="/panier" className="w-8 h-8 rounded-full grid place-items-center text-abelec-navy-ink hover:bg-abelec-navy/[0.06] transition-colors relative" aria-label={t("nav.cart")}>
                <ShoppingBag size={15} strokeWidth={1.8} />
                <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-abelec-orange text-white text-[9px] font-bold font-mono grid place-items-center leading-none">2</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
