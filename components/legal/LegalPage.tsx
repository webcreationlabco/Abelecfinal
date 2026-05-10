"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Header from "@/components/header";
import Footer from "@/components/footer";
import HelpdeskFloat from "@/components/helpdesk-float";
import BrandStrip from "@/components/brand-strip";

export interface LegalSection {
  id: string;
  title: string;
}

interface LegalPageProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  lastUpdated?: string;
  sections: LegalSection[];
  children: React.ReactNode;
  noToc?: boolean;
}

export default function LegalPage({
  eyebrow,
  title,
  subtitle,
  lastUpdated,
  sections,
  children,
  noToc = false,
}: LegalPageProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: "-10% 0px -75% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [sections]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  return (
    <>
      <Header />

      {/* Hero strip */}
      <div className="bg-abelec-navy">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 pt-28 pb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="eyebrow text-abelec-orange mb-3">{eyebrow}</p>
            <h1 className="font-slab text-white mb-2 leading-tight"
              style={{ fontSize: "clamp(28px, 4vw, 42px)" }}>
              {title}
            </h1>
            {subtitle && (
              <p className="text-white/60 font-sans text-[15px] mt-2 max-w-xl">
                {subtitle}
              </p>
            )}
            {lastUpdated && (
              <p className="text-white/35 font-mono text-[11px] uppercase tracking-[0.14em] mt-5">
                Dernière mise à jour&nbsp;: {lastUpdated}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Orange accent line */}
      <div className="h-1 bg-abelec-orange" />

      {/* Body */}
      <main className="bg-abelec-cream-light">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 py-12 lg:py-16">
          <div className={`flex gap-8 ${noToc ? "" : "lg:flex-row flex-col"}`}>

            {/* Sticky TOC — desktop only */}
            {!noToc && (
              <aside className="hidden lg:block w-[220px] shrink-0">
                <div className="sticky top-28">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-abelec-muted-2 mb-3 px-2">
                    Sommaire
                  </p>
                  <nav className="flex flex-col gap-0.5">
                    {sections.map(({ id, title: sTitle }) => (
                      <button
                        key={id}
                        onClick={() => scrollTo(id)}
                        className={`text-left text-[13px] font-sans px-3 py-2 rounded-lg transition-all duration-200 border-l-2 ${
                          activeSection === id
                            ? "border-abelec-orange bg-abelec-orange/8 text-abelec-orange font-semibold"
                            : "border-transparent text-abelec-muted hover:text-abelec-navy hover:bg-abelec-cream-deep"
                        }`}
                      >
                        {sTitle}
                      </button>
                    ))}
                  </nav>
                </div>
              </aside>
            )}

            {/* Mobile TOC pill row */}
            {!noToc && (
              <div className="lg:hidden flex gap-2 flex-wrap mb-2">
                {sections.map(({ id, title: sTitle }) => (
                  <button
                    key={id}
                    onClick={() => scrollTo(id)}
                    className={`text-[11px] font-mono uppercase tracking-wide px-3 py-1.5 rounded-full border transition-all duration-200 ${
                      activeSection === id
                        ? "bg-abelec-orange text-white border-abelec-orange"
                        : "border-abelec-cream-line text-abelec-muted bg-white"
                    }`}
                  >
                    {sTitle}
                  </button>
                ))}
              </div>
            )}

            {/* Content card */}
            <motion.div
              className="flex-1 bg-white rounded-2xl shadow-card-md overflow-hidden"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="p-8 lg:p-12">
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <BrandStrip />
      <Footer />
      <HelpdeskFloat />
    </>
  );
}

/* ── Shared section wrapper ─────────────────────────────────── */
export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-12 last:mb-0 scroll-mt-28">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-5 rounded-full bg-abelec-orange shrink-0" />
        <h2 className="font-slab text-abelec-navy-ink" style={{ fontSize: "20px" }}>
          {title}
        </h2>
      </div>
      <div className="text-[14.5px] text-abelec-muted leading-[1.75] space-y-3.5 font-sans">
        {children}
      </div>
      <div className="mt-10 border-t border-abelec-cream-line last:border-none" />
    </section>
  );
}
