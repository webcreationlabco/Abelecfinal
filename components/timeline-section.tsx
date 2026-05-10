"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useT } from "@/lib/i18n";
import dynamic from "next/dynamic";

const HorizontalTimeline = dynamic(
  () => import("@/components/timeline-horizontal"),
  { ssr: false }
);

const ConstellationWidget = dynamic(
  () => import("@/components/timeline-ambient").then((m) => m.ConstellationWidget),
  { ssr: false }
);
const SonarWidget = dynamic(
  () => import("@/components/timeline-ambient").then((m) => m.SonarWidget),
  { ssr: false }
);
const KineticWord = dynamic(
  () => import("@/components/timeline-ambient").then((m) => m.KineticWord),
  { ssr: false }
);

/* ── Editorial timeline data ──────────────────────────────────────────────── */
const EVENTS = [
  {
    year: "1983",
    label: "Fondation",
    headline: "Nicola Fiordaliso ouvre Abelec à Binche",
    body: [
      "En 1983, Nicola Fiordaliso fonde Abelec dans un petit atelier du Hainaut avec une conviction simple : proposer aux réparateurs belges les pièces qu'ils ne trouvaient nulle part ailleurs.",
      "L'activité démarre avec une centaine de références pour lave-linge et réfrigérateurs, vendues aux techniciens locaux et aux ménages du bassin de Charleroi. La réputation se construit pièce après pièce, client après client.",
    ],
    highlight: {
      quote: true,
      text: "« Je voulais qu'un électroménagiste de Binche puisse trouver ce qu'un grand magasin bruxellois n'avait pas en stock. »",
    },
    image: "https://picsum.photos/seed/warehouse1983a/800/400",
    // Type A
    ambient: { type: "A" as const },
  },
  {
    year: "1997",
    label: "Catalogue",
    headline: "Premier catalogue papier — 5 000 références",
    body: [
      "Après quatorze ans de croissance organique, Abelec publie son premier catalogue papier : 5 000 références répertoriées, classées par marque et par type d'appareil.",
      "Distribué à plusieurs centaines de réparateurs belges et français, il devient la bible du technicien indépendant dans la région. Les commandes arrivent par fax et téléphone, de plus en plus nombreuses chaque saison.",
    ],
    highlight: {
      quote: false,
      text: "5 000 références · 600+ réparateurs abonnés au catalogue",
    },
    image: "https://picsum.photos/seed/papercatalog1997/800/400",
    // Type B
    ambient: { type: "B" as const },
  },
  {
    year: "2008",
    label: "E-commerce",
    headline: "Lancement d'abelec.be — 25 ans après la création",
    body: [
      "En 2008, Abelec franchit le cap du numérique avec son premier site e-commerce. Pour la première fois, les particuliers peuvent commander directement, sans passer par un technicien agréé.",
      "L'offre s'étoffe rapidement : fiches techniques détaillées, guides d'installation illustrés, compatibilité croisée par modèle. Le chiffre d'affaires double en trois ans grâce à la portée nationale du web.",
    ],
    highlight: {
      quote: false,
      text: "×2 de chiffre d'affaires · 18 000 références en ligne dès 2010",
    },
    image: "https://picsum.photos/seed/computerscreen2008/800/400",
    // Type C
    ambient: { type: "C" as const, word: "RÉPARER" },
  },
  {
    year: "2018",
    label: "Europe",
    headline: "Ouverture à 6 pays : France, Pays-Bas, Allemagne, Italie, Luxembourg",
    body: [
      "Forte d'un catalogue élargi à 60 000 références et d'une logistique rodée, Abelec ouvre ses frontières à cinq nouveaux marchés. Interfaces traduites, transporteurs locaux, délais adaptés à chaque pays.",
      "Un stock centralisé en Belgique garantit l'expédition sous 48h vers toute l'Europe de l'Ouest. L'entreprise familiale devient une référence continentale dans la pièce détachée électroménager.",
    ],
    highlight: {
      quote: false,
      text: "6 pays · 60 000 références · Expédition 48h toute l'UE",
    },
    image: "https://picsum.photos/seed/europemap2018b/800/400",
    // Type A
    ambient: { type: "A" as const },
  },
  {
    year: "2026",
    label: "Aujourd'hui",
    headline: "Identification 3D & 100 000 références",
    body: [
      "Abelec lance sa plateforme de seconde génération : identification des pièces par vue 3D interactive, helpdesk humain en temps réel, catalogue de 100 000 références couvrant toutes les grandes marques européennes.",
      "L'intelligence artificielle assiste désormais les particuliers dans l'identification de la panne et la sélection de la bonne pièce — sans connaître le numéro de modèle exact. Quarante-trois ans après l'atelier de Binche, l'histoire continue.",
    ],
    highlight: {
      quote: true,
      text: "« 43 ans plus tard, la même promesse : que personne ne reste en panne faute de trouver la bonne pièce. »",
    },
    image: "https://picsum.photos/seed/modernwarehouse2026/800/400",
    // Type B
    ambient: { type: "B" as const },
  },
];

/* ── Ambient widget renderer ──────────────────────────────────────────────── */
function AmbientWidget({ ambient }: { ambient: (typeof EVENTS)[0]["ambient"] }) {
  if (ambient.type === "A") {
    return <ConstellationWidget />;
  }

  if (ambient.type === "B") {
    return <SonarWidget />;
  }

  if (ambient.type === "C") {
    return <KineticWord word={ambient.word!} />;
  }

  return null;
}

/* ── Card ─────────────────────────────────────────────────────────────────── */
function TimelineCard({ event, index }: { event: (typeof EVENTS)[0]; index: number }) {
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, x: isLeft ? -20 : 20 }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
      className="bg-white rounded-[14px] overflow-hidden"
      style={{
        border: "1px solid rgba(26,58,92,0.09)",
        boxShadow: "0 2px 8px rgba(26,58,92,0.06), 0 12px 32px rgba(26,58,92,0.06)",
      }}
    >
      {/* Image */}
      <div className="relative w-full h-[200px] overflow-hidden">
        <Image
          src={event.image}
          alt={event.headline}
          fill
          className="object-cover"
          sizes="420px"
          unoptimized
        />
        <div className="absolute bottom-3 left-3">
          <span
            className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] px-2 py-1 rounded"
            style={{ background: "rgba(26,58,92,0.72)", color: "rgba(255,255,255,0.85)", backdropFilter: "blur(4px)" }}
          >
            ABELEC · {event.year}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Year + badge row */}
        <div className="flex items-baseline gap-3 mb-3">
          <span
            className="font-slab font-bold text-abelec-navy leading-none"
            style={{ fontSize: "38px", letterSpacing: "-0.04em" }}
          >
            {event.year}
          </span>
          <span
            className="font-mono text-[10px] font-semibold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full shrink-0"
            style={{
              background: "#F4EFE6",
              border: "1px solid rgba(26,58,92,0.15)",
              color: "rgba(26,58,92,0.7)",
            }}
          >
            {event.label}
          </span>
        </div>

        {/* Headline */}
        <h3
          className="font-slab text-abelec-navy-ink font-bold mb-3 leading-snug"
          style={{ fontSize: "17px" }}
        >
          {event.headline}
        </h3>

        {/* Body paragraphs */}
        <div className="space-y-2.5 mb-4">
          {event.body.map((p, i) => (
            <p key={i} className="text-[13.5px] text-abelec-muted leading-[1.72] font-sans">
              {p}
            </p>
          ))}
        </div>

        {/* Stat / quote highlight */}
        {event.highlight.quote ? (
          <blockquote
            className="mt-1 pl-4 italic text-[13px] text-abelec-navy/80 leading-relaxed"
            style={{ borderLeft: "2px solid #d97e3a" }}
          >
            {event.highlight.text}
          </blockquote>
        ) : (
          <div
            className="mt-1 px-4 py-3 rounded-xl text-[12.5px] font-mono font-semibold text-abelec-orange"
            style={{ background: "rgba(217,126,58,0.07)", border: "1px solid rgba(217,126,58,0.18)" }}
          >
            {event.highlight.text}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ── Section ──────────────────────────────────────────────────────────────── */
export default function TimelineSection() {
  const t = useT();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 90%", "end 15%"],
  });

  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div id="timeline">
      {/* ── Desktop: horizontal scroll timeline ── */}
      <div className="hidden md:block">
        <HorizontalTimeline />
      </div>

      {/* ── Mobile: vertical timeline ── */}
      <section className="md:hidden bg-white border-t border-abelec-cream-line py-16 px-6 overflow-hidden">
      <div className="max-w-[1240px] mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="eyebrow mb-4">&mdash; {t("timeline.since")} &mdash;</p>
          <h2 className="font-slab text-abelec-navy">
            {t("timeline.title")}{" "}
            <span className="text-abelec-orange italic">{t("timeline.titleAccent")}</span>
          </h2>
          <p className="mt-4 text-[17px] text-abelec-muted max-w-[480px] mx-auto leading-relaxed">
            {t("timeline.sub")}
          </p>
        </div>

        {/* Timeline */}
        <div ref={containerRef} className="relative max-w-[1100px] mx-auto">

          {/* Background line */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px max-md:hidden"
            style={{ background: "rgba(26,58,92,0.08)" }}
          />

          {/* Animated draw-in line */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 top-0 w-[2px] origin-top max-md:hidden"
            style={{
              scaleY: lineScaleY,
              height: "100%",
              background: "linear-gradient(to bottom, #d97e3a 0%, rgba(26,58,92,0.3) 100%)",
            }}
          />

          {/* Mobile line */}
          <div
            className="hidden max-md:block absolute left-[18px] top-0 bottom-0 w-px"
            style={{ background: "rgba(26,58,92,0.12)" }}
          />

          {/* Cards */}
          <div className="flex flex-col" style={{ gap: "36px" }}>
            {EVENTS.map((event, i) => {
              const isLeft = i % 2 === 0;

              return (
                <div
                  key={event.year}
                  className="relative flex items-center max-md:flex-row"
                >
                  {/* ── Desktop left column ── */}
                  <div className="flex-1 min-w-0 max-md:hidden pr-10">
                    {isLeft ? (
                      /* Card on left */
                      <div className="flex justify-end">
                        <div className="w-full max-w-[430px]">
                          <TimelineCard event={event} index={i} />
                        </div>
                      </div>
                    ) : (
                      /* Ambient widget on left */
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex justify-end"
                      >
                        <div className="w-full max-w-[430px]">
                          <AmbientWidget ambient={event.ambient} />
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* ── Dot ── */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.3 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
                    className="shrink-0 z-10 max-md:mr-4"
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      background: "#d97e3a",
                      boxShadow: "0 0 0 3px #ffffff, 0 0 0 5px rgba(217,126,58,0.25)",
                    }}
                  />

                  {/* ── Desktop right column ── */}
                  <div className="flex-1 min-w-0 max-md:hidden pl-10">
                    {!isLeft ? (
                      /* Card on right */
                      <div className="flex justify-start">
                        <div className="w-full max-w-[430px]">
                          <TimelineCard event={event} index={i} />
                        </div>
                      </div>
                    ) : (
                      /* Ambient widget on right */
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex justify-start"
                      >
                        <div className="w-full max-w-[430px]">
                          <AmbientWidget ambient={event.ambient} />
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* ── Mobile: card always right of dot ── */}
                  <div className="hidden max-md:block flex-1 min-w-0">
                    <TimelineCard event={event} index={i} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      </section>
    </div>
  );
}
