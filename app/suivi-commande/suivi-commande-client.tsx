"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Package, Wrench, Truck, CheckCircle2,
  MapPin, Calendar, CreditCard, ExternalLink,
  Download, MessageCircle, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════════════════════
   Mock data
   ═══════════════════════════════════════════════════════════════════════════ */
type StepStatus = "done" | "current" | "upcoming";

interface TrackingStep {
  label: string;
  sublabel: string;
  date: string | null;
  time: string | null;
  status: StepStatus;
  Icon: React.ElementType;
}

interface OrderItem {
  id: number;
  img: string;
  name: string;
  ref: string;
  qty: number;
  unitPrice: number;
}

const MOCK_STEPS: TrackingStep[] = [
  {
    label:    "Commande reçue",
    sublabel: "Paiement confirmé",
    date:     "06 mai 2025",
    time:     "14:32",
    status:   "done",
    Icon:     Package,
  },
  {
    label:    "Préparation",
    sublabel: "En cours d'emballage",
    date:     "07 mai 2025",
    time:     "09:15",
    status:   "done",
    Icon:     Wrench,
  },
  {
    label:    "Expédiée",
    sublabel: "Prise en charge DPD",
    date:     "08 mai 2025",
    time:     "11:48",
    status:   "current",
    Icon:     Truck,
  },
  {
    label:    "Livrée",
    sublabel: "Livraison estimée",
    date:     "09 mai 2025",
    time:     null,
    status:   "upcoming",
    Icon:     CheckCircle2,
  },
];

const MOCK_ORDER = {
  id:      "ABL-2024-0892",
  date:    "06 mai 2025",
  address: "Rue de la Loi 42, 1000 Bruxelles, Belgique",
  total:   84.70,
  shipping: 5.90,
  carrier:  "DPD Belgique",
  tracking: "DPD-BE-05920384710",
  trackUrl: "#",
  items: [
    {
      id: 1,
      img: "/images/products/1-joint-hublot.jpg",
      name: "Joint de hublot",
      ref: "C00094128",
      qty: 1,
      unitPrice: 22.90,
    },
    {
      id: 2,
      img: "/images/products/2-pompe-vidange.jpg",
      name: "Pompe de vidange",
      ref: "481281729632",
      qty: 2,
      unitPrice: 29.90,
    },
  ] as OrderItem[],
};

/* ═══════════════════════════════════════════════════════════════════════════
   Step circle
   ═══════════════════════════════════════════════════════════════════════════ */
function StepCircle({ status, Icon }: { status: StepStatus; Icon: React.ElementType }) {
  if (status === "done") {
    return (
      <div className="relative z-10 w-11 h-11 rounded-full bg-abelec-orange flex items-center justify-center shadow-[0_0_0_4px_rgba(217,126,58,0.15)]">
        <Icon size={18} strokeWidth={2} className="text-white" />
      </div>
    );
  }
  if (status === "current") {
    return (
      <div className="relative z-10 flex items-center justify-center">
        {/* Pulsing ring */}
        <motion.div
          className="absolute w-11 h-11 rounded-full bg-abelec-orange/20"
          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative w-11 h-11 rounded-full bg-abelec-orange flex items-center justify-center shadow-[0_0_0_4px_rgba(217,126,58,0.20)]">
          <Icon size={18} strokeWidth={2} className="text-white" />
        </div>
      </div>
    );
  }
  return (
    <div className="relative z-10 w-11 h-11 rounded-full bg-white border-2 border-[rgba(26,58,92,0.15)] flex items-center justify-center">
      <Icon size={18} strokeWidth={1.8} className="text-[rgba(26,58,92,0.25)]" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Tracking stepper
   ═══════════════════════════════════════════════════════════════════════════ */
function TrackingStepper({ carrierName, trackingNum, trackUrl }: {
  carrierName: string;
  trackingNum: string;
  trackUrl: string;
}) {
  const currentIdx = MOCK_STEPS.findIndex((s) => s.status === "current");

  return (
    <div>
      {/* Steps row */}
      <div className="relative flex items-start justify-between">
        {/* Connecting lines (behind circles) */}
        <div className="absolute top-[21px] left-[22px] right-[22px] flex pointer-events-none">
          {MOCK_STEPS.slice(0, -1).map((_, i) => {
            const filled = i < currentIdx;
            const isCurrentConnector = i === currentIdx - 1;
            return (
              <motion.div
                key={i}
                className={cn(
                  "flex-1 h-[3px] rounded-full transition-colors",
                  filled || isCurrentConnector ? "bg-abelec-orange" : "bg-[rgba(26,58,92,0.10)]"
                )}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.15, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              />
            );
          })}
        </div>

        {/* Step nodes */}
        {MOCK_STEPS.map((step, i) => (
          <motion.div
            key={step.label}
            className="flex flex-col items-center gap-2 flex-1 min-w-0"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          >
            <StepCircle status={step.status} Icon={step.Icon} />

            {/* Labels */}
            <div className="text-center px-1">
              <p className={cn("text-[12.5px] font-semibold leading-tight",
                step.status === "upcoming" ? "text-[rgba(26,58,92,0.35)]" : "text-abelec-navy-ink")}>
                {step.label}
              </p>
              <p className={cn("text-[11px] mt-0.5 leading-tight",
                step.status === "upcoming" ? "text-[rgba(26,58,92,0.25)]" : "text-abelec-muted")}>
                {step.sublabel}
              </p>
              {step.date && (
                <p className={cn("font-mono text-[10.5px] mt-1",
                  step.status === "done" ? "text-abelec-orange" :
                  step.status === "current" ? "text-abelec-orange" : "text-[rgba(26,58,92,0.25)]")}>
                  {step.date}
                  {step.time && ` · ${step.time}`}
                </p>
              )}
              {!step.date && step.status === "upcoming" && (
                <p className="font-mono text-[10.5px] mt-1 text-[rgba(26,58,92,0.25)]">
                  {step.date || "—"}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Carrier row */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.7 }}
        className="mt-6 pt-5 border-t border-[rgba(26,58,92,0.07)] flex flex-wrap items-center justify-between gap-3"
      >
        <div>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-abelec-muted mb-0.5">Transporteur</p>
          <p className="text-[13.5px] font-semibold text-abelec-navy-ink">{carrierName}</p>
          <p className="font-mono text-[11.5px] text-abelec-muted mt-0.5">{trackingNum}</p>
        </div>
        <a
          href={trackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-abelec-navy hover:bg-abelec-navy-ink text-white text-[13px] font-semibold transition-colors"
        >
          Suivre sur DPD <ExternalLink size={13} strokeWidth={2} />
        </a>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Order results
   ═══════════════════════════════════════════════════════════════════════════ */
function OrderResults() {
  const subtotal = MOCK_ORDER.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="flex flex-col gap-5"
    >
      {/* ── Order header card ─────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[rgba(26,58,92,0.07)] overflow-hidden">
        {/* Orange top bar */}
        <div className="h-1.5 bg-abelec-orange" />
        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-abelec-muted mb-1">Numéro de commande</p>
              <h2 className="font-slab text-[22px] font-bold text-abelec-navy-ink">#{MOCK_ORDER.id}</h2>
            </div>
            {/* Status badge large */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-abelec-orange/10 border border-abelec-orange/20">
              <Truck size={15} strokeWidth={2} className="text-abelec-orange" />
              <span className="text-[13.5px] font-semibold text-abelec-orange">En cours de livraison</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            <div className="flex items-start gap-2.5">
              <Calendar size={14} className="text-abelec-muted mt-0.5 flex-shrink-0" strokeWidth={1.8} />
              <div>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-abelec-muted mb-0.5">Date</p>
                <p className="text-[13.5px] font-medium text-abelec-navy-ink">{MOCK_ORDER.date}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin size={14} className="text-abelec-muted mt-0.5 flex-shrink-0" strokeWidth={1.8} />
              <div>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-abelec-muted mb-0.5">Adresse de livraison</p>
                <p className="text-[13.5px] font-medium text-abelec-navy-ink leading-snug">{MOCK_ORDER.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <CreditCard size={14} className="text-abelec-muted mt-0.5 flex-shrink-0" strokeWidth={1.8} />
              <div>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-abelec-muted mb-0.5">Montant total</p>
                <p className="text-[13.5px] font-bold text-abelec-navy-ink">{MOCK_ORDER.total.toFixed(2)} €</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stepper card ──────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[rgba(26,58,92,0.07)] p-6">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-abelec-muted mb-6">Suivi de livraison</p>
        <TrackingStepper
          carrierName={MOCK_ORDER.carrier}
          trackingNum={MOCK_ORDER.tracking}
          trackUrl={MOCK_ORDER.trackUrl}
        />
      </div>

      {/* ── Order items card ──────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[rgba(26,58,92,0.07)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[rgba(26,58,92,0.06)]">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-abelec-muted">Articles commandés</p>
        </div>

        <div className="divide-y divide-[rgba(26,58,92,0.05)]">
          {MOCK_ORDER.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 px-6 py-4">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#F8F5F0] flex-shrink-0">
                <Image src={item.img} alt={item.name} fill className="object-cover" unoptimized sizes="64px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[10.5px] text-abelec-muted mb-0.5">{item.ref}</p>
                <p className="text-[13.5px] font-semibold text-abelec-navy-ink leading-snug">{item.name}</p>
                <p className="text-[12px] text-abelec-muted mt-0.5">Qté : {item.qty}</p>
              </div>
              <p className="text-[14px] font-bold text-abelec-navy-ink flex-shrink-0">
                {(item.qty * item.unitPrice).toFixed(2)} €
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="px-6 py-4 border-t border-[rgba(26,58,92,0.07)] bg-[rgba(26,58,92,0.02)]">
          <div className="flex flex-col gap-1.5 max-w-[280px] ml-auto">
            <div className="flex justify-between text-[13px] text-abelec-muted">
              <span>Sous-total</span>
              <span>{subtotal.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-[13px] text-abelec-muted">
              <span>Livraison</span>
              <span>{MOCK_ORDER.shipping.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-[15px] font-bold text-abelec-navy-ink mt-1.5 pt-2 border-t border-[rgba(26,58,92,0.08)]">
              <span>Total TTC</span>
              <span>{MOCK_ORDER.total.toFixed(2)} €</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── CTAs ──────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 h-11 px-5 rounded-2xl border border-[rgba(26,58,92,0.14)] text-[13.5px] font-semibold text-abelec-navy hover:border-abelec-orange hover:text-abelec-orange transition-colors"
        >
          <MessageCircle size={15} strokeWidth={1.8} />
          Un problème avec ma commande ?
          <ChevronRight size={13} strokeWidth={2.5} className="ml-0.5" />
        </Link>
        <button className="inline-flex items-center gap-2 h-11 px-5 rounded-2xl bg-abelec-navy hover:bg-abelec-navy-ink text-white text-[13.5px] font-semibold transition-colors">
          <Download size={15} strokeWidth={2} />
          Télécharger la facture
        </button>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Main page
   ═══════════════════════════════════════════════════════════════════════════ */
export default function SuiviCommandeClient() {
  const [query, setQuery]     = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(true); // show mock by default

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) { return; }
    setSubmitted(true);
    setShowResults(true);
  }

  return (
    <main className="min-h-screen py-14 px-4" style={{ background: "#F8F5F0" }}>
      <div className="max-w-[800px] mx-auto flex flex-col gap-10">

        {/* ── Search section ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="text-center"
        >
          {/* Eyebrow */}
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-abelec-muted mb-3">Abelec — Livraison</p>
          <h1 className="font-slab text-[32px] sm:text-[40px] font-bold text-abelec-navy-ink leading-tight mb-2">
            Suivre ma commande
          </h1>
          <p className="text-[14px] text-abelec-muted mb-8">
            Saisissez votre numéro de commande pour suivre votre livraison en temps réel.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-[560px] mx-auto">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-abelec-muted pointer-events-none" strokeWidth={1.8} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex : ABL-2024-0892"
                className="w-full h-[52px] pl-11 pr-4 rounded-2xl bg-white border border-[rgba(26,58,92,0.12)] text-[14.5px] text-abelec-navy-ink placeholder:text-abelec-muted/60 outline-none focus:border-abelec-orange transition-colors shadow-sm font-mono"
              />
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03, boxShadow: "0 8px 28px rgba(217,126,58,0.28)" }}
              whileTap={{ scale: 0.98 }}
              className="h-[52px] px-6 rounded-2xl bg-abelec-orange hover:bg-abelec-orange-dark text-white font-bold text-[14.5px] shadow-[inset_0_-3px_0_rgba(0,0,0,.12)] transition-colors flex-shrink-0"
            >
              Suivre
            </motion.button>
          </form>

          <p className="text-[12px] text-abelec-muted/70 mt-3">
            Vous trouverez votre numéro de commande dans votre email de confirmation.
          </p>
        </motion.div>

        {/* ── Results ─────────────────────────────────────── */}
        <AnimatePresence>
          {showResults && <OrderResults />}
        </AnimatePresence>

      </div>
    </main>
  );
}
