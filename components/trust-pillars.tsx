"use client";

import { motion, useInView } from "framer-motion";
import { Wrench, Truck, ShieldCheck, Hammer } from "lucide-react";
import { useRef, useEffect, useState } from "react";

const PILLARS = [
  {
    icon: Wrench,
    title: "43 ans d'expertise",
    description:
      "Fondée en 1983 à Péronnes-lez-Binche, notre équipe connaît chaque référence par cœur. Conseil humain, pas de chatbot.",
  },
  {
    icon: Truck,
    title: "Livraison en 48h",
    description:
      "100 000 pièces en stock permanent. Commandez avant 14h, recevez demain dans 6 pays d'Europe.",
  },
  {
    icon: ShieldCheck,
    title: "Garantie 1 an",
    description:
      "Toutes nos pièces sont garanties 12 mois. Pièce défectueuse ? On remplace, sans discussion.",
  },
];

const STAT_END = 287598;
const STAT_DURATION = 1800; // ms

function useCountUp(end: number, active: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let startTime: number | null = null;
    let rafId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / STAT_DURATION, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * end));
      if (progress < 1) rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [active, end]);

  return value;
}

function formatNumber(n: number) {
  return n.toLocaleString("fr-FR").replace(/\s/g, "\u202f");
}

function StatPillar({ delay }: { delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const count = useCountUp(STAT_END, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay, duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="pl-8 max-lg:pl-0 max-lg:border-l-0"
      style={{ borderLeft: "1px solid var(--color-abelec-cream-line, #E8DFD0)" }}
    >
      <Hammer size={28} className="text-abelec-orange" />
      <h3 className="font-slab text-abelec-navy-ink text-[22px] font-bold mt-4 mb-2 tabular-nums">
        {formatNumber(count)}
      </h3>
      <p className="text-abelec-muted text-[14.5px] leading-relaxed">
        Appareils réparés grâce à nos pièces depuis 1983.
      </p>
    </motion.div>
  );
}

export default function TrustPillars() {
  return (
    <section className="bg-white py-16 px-6 border-t border-abelec-cream-line">
      <div className="max-w-[1240px] mx-auto">
        {/* Header */}
        <p className="eyebrow mb-4">Pourquoi choisir Abelec</p>
        <hr className="border-abelec-cream-line mb-10" />

        {/* Grid — 4 cols desktop, 1 col mobile */}
        <div className="grid grid-cols-4 gap-8 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {PILLARS.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  delay: index * 0.12,
                  duration: 0.55,
                  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                }}
              >
                <Icon size={28} className="text-abelec-orange" />
                <h3 className="font-slab text-abelec-navy-ink text-[22px] font-bold mt-4 mb-2">
                  {pillar.title}
                </h3>
                <p className="text-abelec-muted text-[14.5px] leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            );
          })}

          {/* 4th pillar — stat with count-up, vertical divider on desktop */}
          <StatPillar delay={3 * 0.12} />
        </div>
      </div>
    </section>
  );
}
