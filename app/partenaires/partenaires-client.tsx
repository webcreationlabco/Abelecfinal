"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Wrench, Building2, Briefcase, ArrowRight, Check, Send, CheckCircle, ChevronDown } from "lucide-react";

// ── Animation helpers ────────────────────────────────────────────────────────
function ScrollReveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-70px 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as number[] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Animated counter ─────────────────────────────────────────────────────────
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const steps = 60;
    const increment = target / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setCount(Math.min(Math.round(increment * step), target));
      if (step >= steps) clearInterval(timer);
    }, 1400 / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count.toLocaleString("fr-BE")}{suffix}</span>;
}

// ── Data ─────────────────────────────────────────────────────────────────────
const PARTNER_TYPES = [
  {
    icon: Wrench,
    title: "Repair Cafés & Associations",
    desc: "Vous réparez gratuitement pour votre communauté. Nous vous aidons à trouver les pièces au meilleur prix. Abelec soutient les initiatives de réparation citoyenne en Belgique et en Europe.",
    benefits: ["Tarifs préférentiels", "Catalogue de 100 000 références", "Livraison 48h", "Support technique dédié"],
    badge: "Engagement solidaire",
    badgeColor: "#2563EB",
    badgeBg: "#EFF6FF",
    reverse: false,
  },
  {
    icon: Building2,
    title: "Foyers & Institutions",
    desc: "Résidences, maisons de repos, foyers sociaux — gérez l'entretien de vos appareils en toute autonomie. Compte pro avec facturation mensuelle et suivi de commandes centralisé.",
    benefits: ["Compte pro dédié", "Facturation mensuelle", "Interlocuteur unique", "Commandes en volume"],
    badge: "Compte institutionnel",
    badgeColor: "#059669",
    badgeBg: "#ECFDF5",
    reverse: true,
  },
  {
    icon: Briefcase,
    title: "Professionnels & Grandes Enseignes",
    desc: "Techniciens indépendants, chaînes de distribution, revendeurs — approvisionnez-vous directement auprès d'Abelec. Stock permanent, catalogue complet, conditions commerciales négociables.",
    benefits: ["Conditions tarifaires négociables", "Stock de 100 000 pièces", "API catalogue disponible", "Livraison B2B Europe"],
    badge: "Partenaire commercial",
    badgeColor: "#D97E3A",
    badgeBg: "#FFF7ED",
    reverse: false,
  },
];

const STATS = [
  { value: 43,     suffix: " ans",  label: "d'expertise" },
  { value: 100000, suffix: "",       label: "références en stock" },
  { value: 6,      suffix: " pays",  label: "livrés en Europe" },
  { value: 80,     suffix: "+",      label: "marques référencées" },
];

const LOGO_PLACEHOLDERS = [
  "Repair Café BXL", "Résidence Les Pins", "TechFix Pro", "Foyer St-Joseph", "ElectroShop", "Repair Café Gand",
];

const VOLUMES = ["Moins de 10 commandes/mois", "10 à 50 commandes/mois", "50 à 200 commandes/mois", "Plus de 200 commandes/mois"];
const TYPES   = ["Repair Café / ASBL", "Foyer / Institution", "Professionnel / Enseigne", "Autre"];

// ── Page ─────────────────────────────────────────────────────────────────────
export default function PartenairesClient() {
  const formRef = useRef<HTMLElement>(null);
  const [form, setForm]     = useState({ nom: "", prenom: "", orga: "", type: "", email: "", tel: "", message: "", volume: "" });
  const [sent, setSent]     = useState(false);
  const [sending, setSending] = useState(false);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1200);
  };

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const inputCls = "w-full h-11 px-4 rounded-xl bg-white border border-[#E8E0D5] text-[14px] text-abelec-navy-ink placeholder:text-abelec-muted-2 outline-none focus:border-abelec-orange transition-colors";
  const selectCls = `${inputCls} appearance-none cursor-pointer`;

  return (
    <main>

      {/* ── Hero — navy ───────────────────────────────────────────────────── */}
      <section className="bg-abelec-navy py-20 sm:py-28 px-6 text-center">
        <div className="max-w-[720px] mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-abelec-orange mb-5"
          >
            Programme partenaires · Abelec
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.07 }}
            className="font-slab text-white leading-[1.05] mb-6"
            style={{ fontSize: "clamp(32px, 5vw, 60px)", letterSpacing: "-0.025em" }}
          >
            Devenez partenaire{" "}
            <span className="text-abelec-orange italic">Abelec</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.14 }}
            className="text-[17px] text-white/70 leading-relaxed mb-10"
          >
            Nous accompagnons les repair cafés, les foyers et les professionnels dans leur approvisionnement en pièces détachées
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <button
              onClick={scrollToForm}
              className="inline-flex items-center gap-2.5 bg-abelec-orange hover:bg-[#b8612a] text-white px-7 py-3.5 rounded-xl font-bold text-[15px] transition-colors"
              style={{ boxShadow: "inset 0 -3px 0 rgba(0,0,0,0.14), 0 8px 28px rgba(217,126,58,0.35)" }}
            >
              Devenir partenaire
              <ArrowRight size={16} strokeWidth={2.2} />
            </button>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 border border-white/30 hover:border-white/60 text-white px-7 py-3.5 rounded-xl font-semibold text-[15px] transition-colors"
            >
              Nous contacter
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Section 1 — Partner type cards ───────────────────────────────── */}
      {PARTNER_TYPES.map(({ icon: Icon, title, desc, benefits, badge, badgeColor, badgeBg, reverse }, i) => (
        <section
          key={title}
          className="py-20 px-6"
          style={{ background: i % 2 === 0 ? "#FFFFFF" : "linear-gradient(180deg,#F8F5F0 0%,#F4EFE6 100%)" }}
        >
          <div className={`max-w-[1240px] mx-auto grid grid-cols-2 gap-16 items-center max-lg:grid-cols-1 ${reverse ? "direction-rtl" : ""}`}>

            {/* Text side */}
            <ScrollReveal delay={0} className={reverse ? "max-lg:order-first lg:order-last" : ""}>
              {/* Badge */}
              <span
                className="inline-flex items-center px-3 py-1.5 rounded-full font-mono text-[10.5px] font-semibold uppercase tracking-[0.1em] mb-5"
                style={{ color: badgeColor, background: badgeBg, border: `1px solid ${badgeColor}30` }}
              >
                {badge}
              </span>

              <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-abelec-orange mb-3">
                {String(i + 1).padStart(2, "0")} · Type de partenaire
              </p>
              <h2
                className="font-slab text-abelec-navy leading-tight mb-5"
                style={{ fontSize: "clamp(22px, 2.8vw, 34px)", letterSpacing: "-0.02em" }}
              >
                {title}
              </h2>
              <p className="text-[15.5px] text-abelec-muted leading-relaxed mb-7">{desc}</p>

              <ul className="flex flex-col gap-2.5">
                {benefits.map((b) => (
                  <li key={b} className="flex items-center gap-3 text-[14.5px] text-abelec-navy-ink">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "rgba(217,126,58,0.12)", border: "1px solid rgba(217,126,58,0.25)" }}
                    >
                      <Check size={11} strokeWidth={2.5} className="text-abelec-orange" />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>

              <button
                onClick={scrollToForm}
                className="mt-8 inline-flex items-center gap-2 text-[14px] font-semibold text-abelec-orange hover:text-[#b8612a] transition-colors"
              >
                Faire une demande <ArrowRight size={15} strokeWidth={2.2} />
              </button>
            </ScrollReveal>

            {/* Visual side */}
            <ScrollReveal delay={0.12} className={reverse ? "max-lg:order-last lg:order-first" : ""}>
              <div
                className="rounded-2xl border border-abelec-cream-line flex items-center justify-center"
                style={{
                  height: "clamp(220px,32vh,340px)",
                  background: `linear-gradient(135deg, ${badgeBg} 0%, #F8F5F0 100%)`,
                }}
              >
                <div
                  className="w-24 h-24 rounded-2xl flex items-center justify-center"
                  style={{ background: "white", border: `2px solid ${badgeColor}25`, boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}
                >
                  <Icon size={40} strokeWidth={1.4} style={{ color: badgeColor }} />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      ))}

      {/* ── Section 2 — Stats — navy ─────────────────────────────────────── */}
      <section className="bg-abelec-navy py-20 px-6">
        <div className="max-w-[1240px] mx-auto">
          <ScrollReveal className="text-center mb-14">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-abelec-orange mb-3">
              Pourquoi Abelec
            </p>
            <h2
              className="font-slab text-white"
              style={{ fontSize: "clamp(22px, 3vw, 36px)", letterSpacing: "-0.02em" }}
            >
              Un partenaire de confiance depuis 1983
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-4 gap-px max-lg:grid-cols-2 overflow-hidden rounded-2xl border border-white/10">
            {STATS.map(({ value, suffix, label }, i) => (
              <ScrollReveal
                key={label}
                delay={i * 0.08}
                className="bg-white/[0.05] px-8 py-10 flex flex-col items-center text-center gap-2"
              >
                <p
                  className="font-slab text-white font-bold leading-none"
                  style={{ fontSize: "clamp(36px, 4.5vw, 54px)", letterSpacing: "-0.03em" }}
                >
                  <Counter target={value} suffix={suffix} />
                </p>
                <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-white/50">{label}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3 — Ils nous font confiance ─────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[1240px] mx-auto">
          <ScrollReveal className="text-center mb-12">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-abelec-orange mb-3">
              Ils nous font confiance
            </p>
            <h2
              className="font-slab text-abelec-navy"
              style={{ fontSize: "clamp(22px, 3vw, 36px)", letterSpacing: "-0.02em" }}
            >
              Nos partenaires actuels
            </h2>
          </ScrollReveal>

          <motion.div
            className="grid grid-cols-6 gap-4 max-lg:grid-cols-3 max-sm:grid-cols-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px 0px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
          >
            {LOGO_PLACEHOLDERS.map((name) => (
              <motion.div
                key={name}
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as number[] } } }}
                className="flex flex-col items-center gap-3 p-5 rounded-xl border border-abelec-cream-line bg-abelec-cream-light"
              >
                <div className="w-12 h-12 rounded-xl bg-[#E8E4DE] flex items-center justify-center">
                  <span className="font-slab font-bold text-[11px] text-abelec-muted text-center leading-tight px-1">{name.slice(0, 2).toUpperCase()}</span>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-abelec-muted text-center leading-tight">{name}</p>
              </motion.div>
            ))}
          </motion.div>

          <ScrollReveal className="text-center mt-8">
            <p className="text-[14px] text-abelec-muted italic">
              Et de nombreux repair cafés en Belgique et aux Pays-Bas
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Section 4 — Formulaire ───────────────────────────────────────── */}
      <section
        ref={formRef}
        className="py-20 px-6"
        style={{ background: "linear-gradient(180deg,#F8F5F0 0%,#F4EFE6 100%)" }}
      >
        <div className="max-w-[680px] mx-auto">
          <ScrollReveal className="text-center mb-10">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-abelec-orange mb-3">
              Formulaire de partenariat
            </p>
            <h2
              className="font-slab text-abelec-navy"
              style={{ fontSize: "clamp(22px, 3vw, 36px)", letterSpacing: "-0.02em" }}
            >
              Faites votre demande
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-5 py-20 text-center bg-white rounded-2xl border border-abelec-cream-line"
              >
                <div className="w-16 h-16 rounded-full bg-[#f0faf5] border border-[rgba(45,106,79,0.25)] flex items-center justify-center">
                  <CheckCircle size={28} strokeWidth={1.8} className="text-[#2d6a4f]" />
                </div>
                <div>
                  <h3 className="font-slab text-abelec-navy text-[22px] mb-1">Demande envoyée !</h3>
                  <p className="text-abelec-muted text-[15px]">Nous vous répondrons sous 48h à l&rsquo;adresse indiquée.</p>
                </div>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl border border-abelec-cream-line p-7 sm:p-9 flex flex-col gap-5"
                style={{ boxShadow: "0 4px 24px rgba(26,58,92,0.07)" }}
              >
                {/* Nom / Prénom */}
                <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-abelec-muted-2">Nom</label>
                    <input type="text" required value={form.nom} onChange={set("nom")} placeholder="Dupont" className={inputCls} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-abelec-muted-2">Prénom</label>
                    <input type="text" required value={form.prenom} onChange={set("prenom")} placeholder="Jean" className={inputCls} />
                  </div>
                </div>

                {/* Organisation */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-abelec-muted-2">Organisation</label>
                  <input type="text" required value={form.orga} onChange={set("orga")} placeholder="Nom de votre organisation" className={inputCls} />
                </div>

                {/* Type de partenariat */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-abelec-muted-2">Type de partenariat</label>
                  <div className="relative">
                    <select required value={form.type} onChange={set("type")} className={selectCls} style={{ color: form.type ? "#0f2340" : "#8a8a8a" }}>
                      <option value="">Sélectionner...</option>
                      {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-abelec-muted-2 pointer-events-none" />
                  </div>
                </div>

                {/* Email / Téléphone */}
                <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-abelec-muted-2">Email</label>
                    <input type="email" required value={form.email} onChange={set("email")} placeholder="jean@exemple.be" className={inputCls} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-abelec-muted-2">Téléphone</label>
                    <input type="tel" value={form.tel} onChange={set("tel")} placeholder="+32 ..." className={inputCls} />
                  </div>
                </div>

                {/* Volume */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-abelec-muted-2">Volume estimé de commandes par mois</label>
                  <div className="relative">
                    <select value={form.volume} onChange={set("volume")} className={selectCls} style={{ color: form.volume ? "#0f2340" : "#8a8a8a" }}>
                      <option value="">Sélectionner...</option>
                      {VOLUMES.map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-abelec-muted-2 pointer-events-none" />
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-abelec-muted-2">Message</label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={set("message")}
                    placeholder="Décrivez votre projet ou vos besoins..."
                    className="px-4 py-3 rounded-xl bg-white border border-[#E8E0D5] text-[14px] text-abelec-navy-ink placeholder:text-abelec-muted-2 outline-none focus:border-abelec-orange transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="h-[52px] rounded-xl bg-abelec-orange hover:bg-[#b8612a] disabled:opacity-70 text-white font-bold text-[15px] flex items-center justify-center gap-2.5 transition-colors"
                  style={{ boxShadow: "inset 0 -3px 0 rgba(0,0,0,0.14)" }}
                >
                  <Send size={15} strokeWidth={2} />
                  {sending ? "Envoi en cours..." : "Envoyer ma demande"}
                </button>

                <div className="text-center flex flex-col gap-1">
                  <p className="text-[12.5px] text-abelec-muted font-mono">Nous vous répondons sous 48h</p>
                  <a href="mailto:helpdesk@abelec.be" className="text-[12.5px] text-abelec-orange hover:underline font-mono">
                    helpdesk@abelec.be
                  </a>
                </div>
              </form>
            )}
          </ScrollReveal>
        </div>
      </section>

    </main>
  );
}
