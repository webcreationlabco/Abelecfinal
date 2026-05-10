"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";
import { useT, useI18n } from "@/lib/i18n";

// ── KPI data ──────────────────────────────────────────────────────────────
const KPI_BARS = [
  { labelKey: "trust.onTime",        value: 98.4, display: "98,4%", color: "#d97e3a" },
  { labelKey: "trust.satisfaction",  value: 96,   display: "4,8/5", color: "#d97e3a" },
  { labelKey: "trust.noReturn",      value: 98.1, display: "98,1%", color: "#22c55e" },
  { labelKey: "trust.deliveryOnTime",value: 97.2, display: "97,2%", color: "#d97e3a" },
];

// ── Stars ─────────────────────────────────────────────────────────────────
function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-[2px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={i < Math.round(rating) ? "#d97e3a" : "#e8e0d4"}
          />
        </svg>
      ))}
    </div>
  );
}

// ── Google badge ──────────────────────────────────────────────────────────
function GoogleBadge({ reviews }: { reviews: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-abelec-cream-light rounded-xl border border-abelec-cream-line">
      <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <Stars rating={4.8} />
          <span className="font-slab font-bold text-abelec-navy text-[14px]">4,8</span>
        </div>
        <p className="font-mono text-[10px] text-abelec-muted-2 truncate">{reviews}</p>
      </div>
    </div>
  );
}

// ── Trustpilot badge ──────────────────────────────────────────────────────
function TrustpilotBadge({ reviews }: { reviews: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-abelec-cream-light rounded-xl border border-abelec-cream-line">
      <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
        <rect width="24" height="24" rx="3" fill="#00B67A"/>
        <path d="M12 15.6l3.6 1.1-1.4-4L17 9.6h-4L12 5.6l-1 4H7l2.8 3.1-1.4 4L12 15.6z" fill="white"/>
      </svg>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <Stars rating={4.7} />
          <span className="font-slab font-bold text-abelec-navy text-[14px]">4,7</span>
        </div>
        <p className="font-mono text-[10px] text-abelec-muted-2 truncate">{reviews}</p>
      </div>
    </div>
  );
}

// ── Rotating testimonials ─────────────────────────────────────────────────
function RotatingTestimonials({ items }: { items: { q: string; m: string }[] }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % items.length), 4500);
    return () => clearInterval(id);
  }, [items.length]);

  if (!items.length) return null;

  return (
    <div className="flex flex-col flex-1">
      <div className="relative flex-1" style={{ minHeight: 96 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <span className="block font-slab text-[clamp(28px,5vw,38px)] leading-none text-abelec-orange/20 mb-0.5 select-none" aria-hidden>
              &ldquo;
            </span>
            <p className="text-[13px] text-abelec-navy/80 leading-relaxed italic pl-1">
              {items[idx].q}
            </p>
            <p className="font-mono text-[11px] text-abelec-muted mt-2 pl-1">
              {items[idx].m}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
      {items.length > 1 && (
        <div className="flex items-center gap-1.5 pt-4">
          {items.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} aria-label={`Avis ${i + 1}`}>
              <span className={`block rounded-full transition-all duration-300 ${
                i === idx ? "w-4 h-1.5 bg-abelec-orange" : "w-1.5 h-1.5 bg-abelec-cream-line"
              }`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function TrustSection() {
  const t = useT();
  const { t: raw } = useI18n();

  const testimonials: { q: string; m: string }[] = (() => {
    const trust = (raw as Record<string, unknown>)?.trust;
    if (!trust || typeof trust !== "object") return [];
    const list = (trust as Record<string, unknown>).testimonials;
    return Array.isArray(list) ? (list as { q: string; m: string }[]) : [];
  })();

  return (
    <section className="bg-abelec-cream-light py-16 px-6">
      <div className="max-w-[1240px] mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="font-slab text-abelec-navy">
            {t("trust.title")}{" "}
            <span className="text-abelec-orange italic">{t("trust.titleAccent")}</span>
          </h2>
        </div>

        {/* 2 × 2 grid */}
        <div className="grid grid-cols-2 gap-5 max-lg:grid-cols-1 max-sm:gap-4">

          {/* ── BLOC 1 — Avis clients ────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0, duration: 0.4 }}
            className="bg-white rounded-[16px] border border-abelec-cream-line p-6 flex flex-col gap-4"
          >
            <p className="font-mono text-[10px] text-abelec-muted-2 uppercase tracking-[0.12em]">
              01 · {t("trust.reviewsTitle")}
            </p>

            <div className="space-y-2.5">
              <GoogleBadge reviews="1 214 avis Google" />
              <TrustpilotBadge reviews="98 avis Trustpilot" />
            </div>

            <div className="h-px bg-abelec-cream-line" />

            <RotatingTestimonials items={testimonials} />
          </motion.div>

          {/* ── BLOC 2 — Marketplaces ────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08, duration: 0.4 }}
            className="bg-white rounded-[16px] border border-abelec-cream-line p-6"
          >
            <p className="font-mono text-[10px] text-abelec-muted-2 uppercase tracking-[0.12em] mb-5">
              02 · {t("trust.marketTitle")}
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-abelec-cream-light/70 rounded-xl border border-abelec-cream-line hover:border-abelec-orange transition-colors cursor-pointer">
                <Image src="/images/carriers/amazon.png" alt="Amazon" width={90} height={28} className="h-7 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-200" />
                <span className="font-mono text-[10.5px] text-abelec-muted">{t("trust.officialStore")}</span>
              </div>
              <div className="flex items-center justify-between p-3.5 bg-abelec-cream-light/70 rounded-xl border border-abelec-cream-line hover:border-abelec-orange transition-colors cursor-pointer">
                <Image src="/images/carriers/cdiscount.svg" alt="Cdiscount" width={90} height={28} className="h-7 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-200" />
                <span className="font-mono text-[10.5px] text-abelec-muted">{t("trust.proSeller")}</span>
              </div>
              <div className="flex items-center justify-between p-3.5 bg-abelec-cream-light/70 rounded-xl border border-abelec-cream-line hover:border-abelec-orange transition-colors cursor-pointer">
                <span className="font-slab font-black text-[17px] tracking-[-0.02em] italic text-abelec-navy">Spareka</span>
                <span className="font-mono text-[10.5px] text-abelec-muted">{t("trust.partner")}</span>
              </div>
            </div>

          </motion.div>

          {/* ── BLOC 3 — KPI logistiques ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.14, duration: 0.4 }}
            className="bg-white rounded-[16px] border border-abelec-cream-line p-6"
          >
            <p className="font-mono text-[10px] text-abelec-muted-2 uppercase tracking-[0.12em] mb-6">
              03 · {t("trust.kpiTitle")}
            </p>

            <div className="space-y-5">
              {KPI_BARS.map((kpi, i) => (
                <div key={kpi.labelKey} className="flex items-center gap-4">
                  {/* Big number */}
                  <span className="font-slab font-bold text-[clamp(17px,2.5vw,22px)] tracking-tight w-14 sm:w-16 shrink-0 tabular-nums" style={{ color: "#E8732A" }}>
                    {kpi.display}
                  </span>
                  {/* Bar + label */}
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-[10px] text-abelec-muted uppercase tracking-[0.05em] block mb-1.5 truncate">
                      {t(kpi.labelKey)}
                    </span>
                    <div className="h-[7px] bg-abelec-cream-light rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${kpi.value}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: kpi.color }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── BLOC 4 — Sécurité paiement ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="bg-white rounded-[16px] border border-abelec-cream-line p-6"
          >
            <p className="font-mono text-[10px] text-abelec-muted-2 uppercase tracking-[0.12em] mb-5">
              04 · {t("trust.payTitle")}
            </p>

            {/* Real payment logos */}
            <div className="grid grid-cols-2 max-[380px]:grid-cols-1 gap-3 mb-6">
              {[
                { src: "/images/payment/visa.png",       alt: "Visa",       h: 28 },
                { src: "/images/payment/mastercard.png", alt: "Mastercard", h: 36 },
                { src: "/images/payment/bancontact.png", alt: "Bancontact", h: 42 },
                { src: "/images/payment/paypal.png",     alt: "PayPal",     h: 28 },
              ].map(({ src, alt, h }) => (
                <div key={alt} className="flex items-center justify-center p-3 bg-abelec-cream-light rounded-xl border border-abelec-cream-line h-[56px]">
                  <Image
                    src={src}
                    alt={alt}
                    width={120}
                    height={h}
                    style={{ height: `${h}px`, width: "auto", maxWidth: "100%" }}
                    className="object-contain"
                  />
                </div>
              ))}
            </div>

            {/* Secure badge */}
            <div className="p-4 bg-abelec-navy/[0.04] rounded-xl border border-abelec-navy/10 flex items-start gap-3">
              <Lock size={20} className="text-abelec-orange shrink-0 mt-0.5" strokeWidth={1.8} />
              <div>
                <p className="font-slab text-[14.5px] mb-0.5" style={{ fontWeight: 700, color: "#E8732A" }}>
                  {t("trust.securePayment").split("·")[0].trim()}
                </p>
                <p className="font-mono text-[10px] text-abelec-muted-2">
                  {t("trust.sslNote")}
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
