"use client";

import { motion } from "framer-motion";
import Header from "@/components/header";
import Footer from "@/components/footer";
import HelpdeskFloat from "@/components/helpdesk-float";
import BrandStrip from "@/components/brand-strip";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
});

/* ── Icons ──────────────────────────────────────────────────── */
const IconTruck     = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
const IconClock     = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IconZap       = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const IconReturn    = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.91"/></svg>;
const IconShield    = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IconPackage   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const IconMail      = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const IconCheck     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>;

/* ── Info card ──────────────────────────────────────────────── */
function InfoCard({ icon, title, value, accent = false }: {
  icon: React.ReactNode; title: string; value: React.ReactNode; accent?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-6 flex gap-4 items-start ${
      accent
        ? "bg-abelec-orange text-white border-abelec-orange"
        : "bg-white border-abelec-cream-line shadow-card-sm"
    }`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
        accent ? "bg-white/20" : "bg-abelec-orange/10 text-abelec-orange"
      }`}>
        {icon}
      </div>
      <div>
        <p className={`font-mono text-[10.5px] uppercase tracking-[0.15em] mb-1 ${accent ? "text-white/70" : "text-abelec-muted-2"}`}>
          {title}
        </p>
        <div className={`font-slab text-[17px] font-semibold leading-tight ${accent ? "text-white" : "text-abelec-navy-ink"}`}>
          {value}
        </div>
      </div>
    </div>
  );
}

/* ── Country flag ───────────────────────────────────────────── */
const FLAGS: Record<string, string> = {
  "Belgique":     "🇧🇪",
  "France":       "🇫🇷",
  "Pays-Bas":     "🇳🇱",
  "Luxembourg":   "🇱🇺",
  "Allemagne":    "🇩🇪",
  "Italie":       "🇮🇹",
};

const SHIPPING_DATA = [
  { country: "Belgique",   standard: "4,95 €",  express: "9,95 €",  free: "50 €",   delay: "1–3 j" },
  { country: "Luxembourg", standard: "4,95 €",  express: "9,95 €",  free: "50 €",   delay: "2–4 j" },
  { country: "France",     standard: "7,95 €",  express: "14,95 €", free: "80 €",   delay: "3–5 j" },
  { country: "Pays-Bas",   standard: "7,95 €",  express: "14,95 €", free: "80 €",   delay: "3–5 j" },
  { country: "Allemagne",  standard: "8,95 €",  express: "16,95 €", free: "100 €",  delay: "4–6 j" },
  { country: "Italie",     standard: "12,95 €", express: "22,95 €", free: "120 €",  delay: "5–7 j" },
];

const RETURN_STEPS = [
  {
    n: "01",
    title: "Contactez le service client",
    desc: "Envoyez un email à retours@abelec.be avec votre numéro de commande et la raison du retour. Réponse sous 24h ouvrables.",
  },
  {
    n: "02",
    title: "Préparez votre colis",
    desc: "Remettez la pièce dans son emballage d'origine, en parfait état avec tous ses accessoires. Joignez le formulaire de retour reçu par email.",
  },
  {
    n: "03",
    title: "Déposez le colis",
    desc: "Utilisez l'étiquette de retour fournie (préaffranchie si erreur de notre part) et déposez le colis dans un point relais ou bureau de poste.",
  },
  {
    n: "04",
    title: "Remboursement sous 14 jours",
    desc: "Dès réception et vérification du retour, nous procédons au remboursement intégral via le moyen de paiement utilisé lors de l'achat.",
  },
];

const RETURN_REASONS_OK = [
  "Pièce non conforme à la description",
  "Erreur d'expédition (mauvaise référence)",
  "Produit défectueux à réception",
  "Rétractation dans les 30 jours (sans justification)",
];

const RETURN_REASONS_KO = [
  "Pièce endommagée lors de l'installation",
  "Numéro de série gratté ou illisible",
  "Emballage original manquant ou abîmé",
  "Pièce commandée par erreur (vérifiez la compatibilité avant achat)",
];

export default function LivraisonRetoursPage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <div className="bg-abelec-navy">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 pt-28 pb-14">
          <motion.div {...fadeUp()}>
            <p className="eyebrow text-abelec-orange mb-3">Services</p>
            <h1 className="font-slab text-white mb-2 leading-tight"
              style={{ fontSize: "clamp(28px, 4vw, 42px)" }}>
              Livraison & Retours
            </h1>
            <p className="text-white/60 font-sans text-[15px] mt-2 max-w-xl">
              Livraison rapide en Europe, retours faciles sous 30 jours. Tout ce que vous devez savoir.
            </p>
          </motion.div>
        </div>
      </div>
      <div className="h-1 bg-abelec-orange" />

      <main className="bg-abelec-cream-light">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 py-14 space-y-16">

          {/* ── Key stats ── */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            {...fadeUp(0.08)}
          >
            <InfoCard icon={<IconClock />}   title="Livraison standard" value="3–5 jours" />
            <InfoCard icon={<IconZap />}     title="Livraison express" value="24–48 h" accent />
            <InfoCard icon={<IconReturn />}  title="Politique retour" value="30 jours" />
            <InfoCard icon={<IconShield />}  title="Garantie légale" value="2 ans" />
          </motion.div>

          {/* ── Section 1: Délais et tarifs ── */}
          <motion.section id="tarifs" {...fadeUp(0.12)}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-abelec-orange/10 flex items-center justify-center text-abelec-orange">
                <IconTruck />
              </div>
              <div>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-abelec-muted-2">Section 1</p>
                <h2 className="font-slab text-abelec-navy-ink" style={{ fontSize: "22px" }}>Délais et tarifs de livraison</h2>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-card-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-[13.5px]">
                  <thead>
                    <tr className="bg-abelec-navy text-white">
                      <th className="text-left px-6 py-4 font-mono font-normal text-[11px] uppercase tracking-wide">Pays</th>
                      <th className="text-left px-6 py-4 font-mono font-normal text-[11px] uppercase tracking-wide">Délai</th>
                      <th className="text-left px-6 py-4 font-mono font-normal text-[11px] uppercase tracking-wide">Standard</th>
                      <th className="text-left px-6 py-4 font-mono font-normal text-[11px] uppercase tracking-wide">Express 24–48h</th>
                      <th className="text-left px-6 py-4 font-mono font-normal text-[11px] uppercase tracking-wide">Gratuit dès</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-abelec-cream-line">
                    {SHIPPING_DATA.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-abelec-cream-light/40"}>
                        <td className="px-6 py-4 font-semibold text-abelec-navy-ink">
                          <span className="mr-2 text-[16px]">{FLAGS[row.country]}</span>
                          {row.country}
                        </td>
                        <td className="px-6 py-4 text-abelec-muted">{row.delay} ouvrables</td>
                        <td className="px-6 py-4 font-semibold text-abelec-navy">{row.standard}</td>
                        <td className="px-6 py-4 font-semibold text-abelec-orange">{row.express}</td>
                        <td className="px-6 py-4">
                          <span className="bg-abelec-navy/6 text-abelec-navy font-semibold text-[12px] px-2.5 py-1 rounded-full">
                            {row.free}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t border-abelec-cream-line bg-abelec-cream-light/60 flex items-center gap-2">
                <svg className="text-abelec-muted-2 shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p className="text-[12px] text-abelec-muted-2">
                  Les délais sont indicatifs et comptent à partir de l&apos;expédition (J+1 après validation du paiement). Les jours fériés belges peuvent allonger les délais.
                </p>
              </div>
            </div>
          </motion.section>

          {/* ── Section 2: Zones ── */}
          <motion.section id="zones" {...fadeUp(0.14)}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-abelec-orange/10 flex items-center justify-center text-abelec-orange">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </div>
              <div>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-abelec-muted-2">Section 2</p>
                <h2 className="font-slab text-abelec-navy-ink" style={{ fontSize: "22px" }}>Zones de livraison</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {SHIPPING_DATA.map(({ country }) => (
                <div key={country}
                  className="bg-white border border-abelec-cream-line rounded-2xl p-5 flex flex-col items-center gap-3 shadow-card-sm hover:shadow-card-md hover:-translate-y-1 transition-all duration-200">
                  <span className="text-4xl">{FLAGS[country]}</span>
                  <p className="font-slab text-abelec-navy text-[13px] font-semibold text-center">{country}</p>
                  <span className="text-[11px] font-mono uppercase tracking-wide text-abelec-muted-2 bg-abelec-cream-light px-2 py-0.5 rounded-full">
                    Livré
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-start gap-3 p-4 bg-abelec-orange/6 border border-abelec-orange/20 rounded-xl">
              <svg className="text-abelec-orange shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p className="text-[13px] text-abelec-navy/80">
                Vous êtes hors de ces zones ? Contactez-nous à{" "}
                <a href="mailto:contact@abelec.be" className="text-abelec-orange hover:underline font-medium">contact@abelec.be</a>
                {" "}pour une solution de livraison personnalisée.
              </p>
            </div>
          </motion.section>

          {/* ── Section 3: Politique retour ── */}
          <motion.section id="retour" {...fadeUp(0.16)}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-abelec-orange/10 flex items-center justify-center text-abelec-orange">
                <IconReturn />
              </div>
              <div>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-abelec-muted-2">Section 3</p>
                <h2 className="font-slab text-abelec-navy-ink" style={{ fontSize: "22px" }}>Politique de retour — 30 jours</h2>
              </div>
            </div>

            {/* 30-day badge */}
            <div className="bg-abelec-navy rounded-2xl p-8 flex flex-col sm:flex-row gap-8 items-center mb-8">
              <div className="text-center shrink-0">
                <p className="font-slab text-white leading-none" style={{ fontSize: "64px" }}>30</p>
                <p className="font-mono text-abelec-orange text-[12px] uppercase tracking-[0.16em]">jours</p>
              </div>
              <div>
                <p className="font-slab text-white text-[18px] mb-2">Satisfait ou remboursé, sans conditions</p>
                <p className="text-white/60 font-sans text-[14px] leading-relaxed">
                  Vous disposez de 30 jours calendaires à compter de la réception pour retourner toute pièce, sans avoir à justifier votre décision. Le remboursement intégral est effectué sous 14 jours après réception du retour.
                </p>
              </div>
            </div>

            {/* OK / NOK */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-abelec-cream-line rounded-2xl p-6 shadow-card-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <IconCheck />
                  </div>
                  <p className="font-slab text-abelec-navy-ink text-[15px] font-semibold">Retours acceptés</p>
                </div>
                <ul className="space-y-2.5">
                  {RETURN_REASONS_OK.map((r, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[13.5px] text-abelec-muted">
                      <svg className="text-green-500 shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white border border-abelec-cream-line rounded-2xl p-6 shadow-card-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </div>
                  <p className="font-slab text-abelec-navy-ink text-[15px] font-semibold">Retours non acceptés</p>
                </div>
                <ul className="space-y-2.5">
                  {RETURN_REASONS_KO.map((r, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[13.5px] text-abelec-muted">
                      <svg className="text-red-400 shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.section>

          {/* ── Section 4: How to return ── */}
          <motion.section id="comment" {...fadeUp(0.18)}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-abelec-orange/10 flex items-center justify-center text-abelec-orange">
                <IconPackage />
              </div>
              <div>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-abelec-muted-2">Section 4</p>
                <h2 className="font-slab text-abelec-navy-ink" style={{ fontSize: "22px" }}>Comment retourner une pièce</h2>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {RETURN_STEPS.map((step, i) => (
                <motion.div
                  key={i}
                  className="relative bg-white border border-abelec-cream-line rounded-2xl p-6 shadow-card-sm"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Step number */}
                  <div className="w-10 h-10 rounded-xl bg-abelec-navy flex items-center justify-center mb-5">
                    <span className="font-mono text-white text-[13px] font-bold">{step.n}</span>
                  </div>

                  {/* Connector line (not on last) */}
                  {i < RETURN_STEPS.length - 1 && (
                    <div className="hidden lg:block absolute top-11 left-[calc(100%-0px)] w-6 h-px bg-abelec-cream-line z-10" />
                  )}

                  <p className="font-slab text-abelec-navy-ink text-[15px] font-semibold mb-2">{step.title}</p>
                  <p className="font-sans text-[13px] text-abelec-muted leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* CTA block */}
            <motion.div
              className="mt-10 bg-abelec-orange rounded-2xl p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white">
                  <IconMail />
                </div>
                <div>
                  <p className="font-slab text-white text-[17px] font-semibold">Besoin d&apos;aide pour un retour ?</p>
                  <p className="text-white/70 text-[13px] mt-0.5">Notre équipe répond sous 24h ouvrables.</p>
                </div>
              </div>
              <a
                href="mailto:retours@abelec.be"
                className="shrink-0 bg-white text-abelec-orange font-semibold font-sans text-[13.5px] px-6 py-3 rounded-xl hover:bg-abelec-cream-light transition-colors duration-200"
              >
                retours@abelec.be
              </a>
            </motion.div>
          </motion.section>
        </div>
      </main>

      <BrandStrip />
      <Footer />
      <HelpdeskFloat />
    </>
  );
}
