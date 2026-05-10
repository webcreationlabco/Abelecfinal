"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Wrench, ShieldCheck, Leaf, ArrowRight } from "lucide-react";

// ── Animation helpers ────────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as number[] } },
};

const stagger = (delayChildren = 0.08) => ({
  hidden:  {},
  visible: { transition: { staggerChildren: delayChildren } },
});

function ScrollReveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as number[] } } }}
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
    const duration = 1400;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), target);
      setCount(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString("fr-BE")}
      {suffix}
    </span>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────
const VALEURS = [
  {
    icon: Wrench,
    title: "Expertise humaine",
    desc: "Chaque demande est traitée par un technicien formé. Nos équipes connaissent les pièces et les machines qu'elles alimentent.",
  },
  {
    icon: ShieldCheck,
    title: "Engagement qualité",
    desc: "Toutes nos pièces sont contrôlées avant expédition. Nous ne proposons que des références d'origine ou de qualité équivalente.",
  },
  {
    icon: Leaf,
    title: "Réparation durable",
    desc: "Réparer plutôt que remplacer, c'est notre conviction depuis 1983. Chaque pièce vendue évite un appareil de plus en décharge.",
  },
];

const TEAM = [
  {
    name: "Robert Delcourt",
    role: "Fondateur",
    bio: "A fondé Abelec en 1983 avec la conviction que réparer vaut toujours mieux que jeter.",
    initials: "RD",
    color: "#1A3A5C",
  },
  {
    name: "Marc Delcourt",
    role: "Responsable technique",
    bio: "40 ans d'expérience dans le diagnostic et la réparation d'électroménager toutes marques.",
    initials: "MD",
    color: "#D97E3A",
  },
  {
    name: "Sophie Maes",
    role: "Service client",
    bio: "Première de contact, elle accompagne chaque client de la recherche de pièce à la livraison.",
    initials: "SM",
    color: "#2563EB",
  },
  {
    name: "Julien Pirard",
    role: "Logistique",
    bio: "Garant que chaque commande quitte l'entrepôt correctement emballée et dans les délais.",
    initials: "JP",
    color: "#059669",
  },
];

const STATS = [
  { value: 43,     suffix: " ans",  label: "d'expertise" },
  { value: 100000, suffix: "",       label: "références en stock" },
  { value: 6,      suffix: " pays",  label: "livrés en Europe" },
  { value: 1214,   suffix: "",       label: "avis vérifiés" },
];

// ── Page ─────────────────────────────────────────────────────────────────────
export default function AProposClient() {
  return (
    <main>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="w-full border-b border-abelec-cream-line py-16 sm:py-20 px-6 text-center"
        style={{ background: "linear-gradient(180deg,#F8F5F0 0%,#F4EFE6 100%)" }}
      >
        <div className="max-w-[680px] mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-abelec-orange mb-4"
          >
            Depuis 1983 · Péronnes-lez-Binche, Belgique
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.07 }}
            className="font-slab text-abelec-navy-ink leading-[1.05]"
            style={{ fontSize: "clamp(34px, 5vw, 60px)", letterSpacing: "-0.025em" }}
          >
            À propos d&rsquo;Abelec
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.14 }}
            className="mt-4 text-[17px] text-abelec-muted leading-relaxed font-slab italic"
          >
            Une entreprise familiale belge, une passion pour la réparation
          </motion.p>
        </div>
      </section>

      {/* ── Section 1 : L'entreprise ─────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[1240px] mx-auto grid grid-cols-2 gap-16 items-center max-lg:grid-cols-1">

          {/* Left — text */}
          <ScrollReveal>
            <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-abelec-orange mb-4">
              01 · L&rsquo;entreprise
            </p>
            <h2
              className="font-slab text-abelec-navy leading-tight mb-8"
              style={{ fontSize: "clamp(24px, 3.2vw, 38px)", letterSpacing: "-0.02em" }}
            >
              Depuis 1983, nous aidons les Belges à réparer leur électroménager
            </h2>
            <div className="flex flex-col gap-5 text-[15.5px] text-abelec-muted leading-relaxed">
              <p>
                Abelec est née d&rsquo;une conviction simple : un appareil en panne mérite une seconde chance. Fondée en 1983 à Péronnes-lez-Binche par Robert Delcourt, notre entreprise familiale a construit au fil des décennies l&rsquo;un des stocks de pièces détachées les plus complets de Belgique — plus de 100 000 références disponibles pour tous les grands appareils électroménagers.
              </p>
              <p>
                Là où d&rsquo;autres proposent le remplacement immédiat, nous choisissons la réparation. Cette philosophie guide chacune de nos décisions, de la sélection des fournisseurs à la formation de nos techniciens. Nos clients nous font confiance depuis quarante ans parce qu&rsquo;ils savent qu&rsquo;ils trouveront chez nous la bonne pièce, au bon prix, livrée rapidement.
              </p>
              <p>
                Aujourd&rsquo;hui, Abelec expédie dans six pays européens et continue de grandir — sans jamais perdre l&rsquo;ADN familial et artisanal qui fait notre force depuis le premier jour.
              </p>
            </div>
          </ScrollReveal>

          {/* Right — photo */}
          <ScrollReveal delay={0.12}>
            <div className="relative rounded-2xl overflow-hidden border border-abelec-cream-line shadow-card-sm" style={{ height: "clamp(280px,40vh,440px)" }}>
              <Image
                src="/images/team/travail.jpg"
                alt="Équipe Abelec en entrepôt"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* EST. badge */}
              <div
                className="absolute top-5 left-5 flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{ background: "rgba(26,58,92,0.85)", backdropFilter: "blur(8px)" }}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/70">Est.</span>
                <span className="font-slab font-bold text-white text-[15px]">1983</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Section 2 : Nos valeurs ──────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: "linear-gradient(180deg,#F8F5F0 0%,#F4EFE6 100%)" }}>
        <div className="max-w-[1240px] mx-auto">
          <ScrollReveal className="text-center mb-14">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-abelec-orange mb-3">
              02 · Nos valeurs
            </p>
            <h2
              className="font-slab text-abelec-navy"
              style={{ fontSize: "clamp(24px, 3vw, 36px)", letterSpacing: "-0.02em" }}
            >
              Ce qui nous anime chaque jour
            </h2>
          </ScrollReveal>

          <motion.div
            className="grid grid-cols-3 gap-6 max-lg:grid-cols-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px 0px" }}
            variants={stagger(0.1)}
          >
            {VALEURS.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="bg-white rounded-2xl border border-abelec-cream-line p-7 flex flex-col gap-5"
                style={{ boxShadow: "0 2px 12px rgba(26,58,92,0.05)" }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(217,126,58,0.10)", border: "1px solid rgba(217,126,58,0.20)" }}
                >
                  <Icon size={22} strokeWidth={1.8} className="text-abelec-orange" />
                </div>
                <div>
                  <h3 className="font-slab text-abelec-navy font-bold text-[18px] mb-2">{title}</h3>
                  <p className="text-[14.5px] text-abelec-muted leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Section 3 : L'équipe ────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[1240px] mx-auto">
          <ScrollReveal className="text-center mb-14">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-abelec-orange mb-3">
              03 · L&rsquo;équipe
            </p>
            <h2
              className="font-slab text-abelec-navy"
              style={{ fontSize: "clamp(24px, 3vw, 36px)", letterSpacing: "-0.02em" }}
            >
              Une équipe à votre service
            </h2>
          </ScrollReveal>

          <motion.div
            className="grid grid-cols-4 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px 0px" }}
            variants={stagger(0.1)}
          >
            {TEAM.map(({ name, role, bio, initials, color }) => (
              <motion.div
                key={name}
                variants={fadeUp}
                className="flex flex-col items-center text-center gap-4 p-6 rounded-2xl border border-abelec-cream-line bg-abelec-cream-light"
              >
                {/* Avatar */}
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white font-slab font-bold text-[22px] shrink-0"
                  style={{ background: color, boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}
                >
                  {initials}
                </div>
                <div>
                  <p className="font-slab text-abelec-navy font-bold text-[16px] leading-tight">{name}</p>
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-abelec-orange mt-1">{role}</p>
                </div>
                <p className="text-[13.5px] text-abelec-muted leading-relaxed">{bio}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Section 4 : Chiffres clés ────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: "linear-gradient(180deg,#F8F5F0 0%,#F4EFE6 100%)" }}>
        <div className="max-w-[1240px] mx-auto">
          <ScrollReveal className="text-center mb-14">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-abelec-orange mb-3">
              04 · Chiffres clés
            </p>
            <h2
              className="font-slab text-abelec-navy"
              style={{ fontSize: "clamp(24px, 3vw, 36px)", letterSpacing: "-0.02em" }}
            >
              Abelec en quelques chiffres
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-4 gap-px max-lg:grid-cols-2 overflow-hidden rounded-2xl border border-abelec-cream-line"
            style={{ boxShadow: "0 2px 12px rgba(26,58,92,0.05)" }}
          >
            {STATS.map(({ value, suffix, label }, i) => (
              <ScrollReveal
                key={label}
                delay={i * 0.08}
                className="bg-white px-8 py-10 flex flex-col items-center text-center gap-2"
              >
                <p
                  className="font-slab text-abelec-navy font-bold leading-none"
                  style={{ fontSize: "clamp(36px, 4.5vw, 56px)", letterSpacing: "-0.03em" }}
                >
                  <Counter target={value} suffix={suffix} />
                </p>
                <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-abelec-muted">{label}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA band ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-abelec-navy">
        <ScrollReveal className="max-w-[720px] mx-auto text-center flex flex-col items-center gap-8">
          <div>
            <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-abelec-orange mb-4">
              Contactez-nous
            </p>
            <h2
              className="font-slab text-white leading-tight"
              style={{ fontSize: "clamp(26px, 3.5vw, 42px)", letterSpacing: "-0.02em" }}
            >
              Une question ?{" "}
              <span className="text-abelec-orange italic">Notre équipe vous répond.</span>
            </h2>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2.5 bg-abelec-orange hover:bg-[#b8612a] text-white px-8 py-4 rounded-xl font-bold text-[15px] transition-colors"
            style={{ boxShadow: "inset 0 -3px 0 rgba(0,0,0,0.14), 0 8px 28px rgba(217,126,58,0.35)" }}
          >
            Nous contacter
            <ArrowRight size={17} strokeWidth={2.2} />
          </Link>
        </ScrollReveal>
      </section>

    </main>
  );
}
