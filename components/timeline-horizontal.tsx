"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ── Constants ───────────────────────────────────────────────────────────── */
const ERAS  = ["Fondation", "Catalogue", "E-commerce", "Europe", "Aujourd'hui"];
const YEARS = ["1983", "1997", "2008", "2018", "2026"];

const COUNTRIES = [
  { id: "BE", cx: 148, cy: 108 },
  { id: "NL", cx: 145, cy:  88 },
  { id: "LU", cx: 155, cy: 120 },
  { id: "FR", cx: 118, cy: 142 },
  { id: "DE", cx: 175, cy: 108 },
  { id: "IT", cx: 170, cy: 182 },
];

/* ── Timeline bar (always rendered on dark gradient, in-flow) ────────────── */
function TimelineBar({ active, onDotClick }: { active: number; onDotClick: (i: number) => void }) {
  const trailPct = active === 0 ? "0%" : `${(active / 4) * 100}%`;

  return (
    <div style={{ padding: "0 72px" }}>
      {/* ── Dots + rail row ── */}
      <div style={{ position: "relative", height: 14 }}>
        {/* Rail */}
        <div style={{
          position:  "absolute",
          top:       "50%",
          left:      0,
          right:     0,
          height:    1,
          transform: "translateY(-50%)",
          background: "rgba(255,255,255,0.20)",
        }} />
        {/* Orange trail */}
        <div style={{
          position:   "absolute",
          top:        "50%",
          left:       0,
          height:     1.5,
          width:      trailPct,
          transform:  "translateY(-50%)",
          background: "#d97e3a",
          transition: "width 0.45s ease",
        }} />
        {/* Dots */}
        <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {YEARS.map((year, i) => {
            const isPast   = i < active;
            const isActive = i === active;
            return (
              <button
                key={year}
                onClick={() => onDotClick(i)}
                aria-label={year}
                style={{
                  width:        isActive ? 12 : 8,
                  height:       isActive ? 12 : 8,
                  borderRadius: "50%",
                  background:   isActive ? "#d97e3a" : "transparent",
                  border:       `1.5px solid ${isActive ? "#d97e3a" : isPast ? "#d97e3a" : "rgba(255,255,255,0.32)"}`,
                  transition:   "all 0.35s ease",
                  flexShrink:   0,
                  cursor:       "pointer",
                  padding:      0,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* ── Year labels ── */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, marginBottom: 10 }}>
        {YEARS.map((year, i) => {
          const isPast   = i < active;
          const isActive = i === active;
          return (
            <span
              key={year}
              style={{
                fontFamily:    "monospace",
                fontSize:      10,
                letterSpacing: "0.08em",
                color:         isActive ? "#d97e3a" : isPast ? "rgba(217,126,58,0.70)" : "rgba(255,255,255,0.36)",
                fontWeight:    isActive ? 700 : 400,
                transition:    "all 0.35s ease",
                whiteSpace:    "nowrap",
              }}
            >
              {year}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ── Stat pill ───────────────────────────────────────────────────────────── */
function Pill({ text, light }: { text: string; light: boolean }) {
  return (
    <div style={{
      display:       "inline-flex",
      alignItems:    "center",
      padding:       "7px 16px",
      borderRadius:  100,
      border:        `1px solid ${light ? "rgba(255,255,255,0.22)" : "rgba(26,58,92,0.18)"}`,
      background:    light ? "rgba(255,255,255,0.08)" : "rgba(26,58,92,0.05)",
      fontFamily:    "monospace",
      fontSize:      11,
      letterSpacing: "0.07em",
      color:         light ? "rgba(255,255,255,0.65)" : "rgba(26,58,92,0.6)",
      marginTop:     24,
      whiteSpace:    "nowrap",
    }}>
      {text}
    </div>
  );
}

/* ── Text column ─────────────────────────────────────────────────────────── */
interface TextColProps {
  step:      string;
  year:      string;
  era:       string;
  headline:  string;
  lines:     string[];
  stat:      string;
  light:     boolean;
  eraColor?: string;
}
function TextCol({ step, year, era, headline, lines, stat, light, eraColor = "#d97e3a" }: TextColProps) {
  const cream = "rgba(248,245,240,0.95)";
  const navy  = "#0f2340";
  const muted = light ? "rgba(248,245,240,0.62)" : "rgba(15,35,64,0.58)";
  const main  = light ? cream : navy;

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 64px 0 72px", maxWidth: 560 }}>

      {/* Step label */}
      <div style={{
        fontFamily:    "monospace",
        fontSize:      10,
        fontWeight:    700,
        letterSpacing: "0.20em",
        textTransform: "uppercase" as const,
        color:         "#d97e3a",
        marginBottom:  16,
      }}>
        ÉTAPE {step}
      </div>

      {/* Year */}
      <div style={{
        fontFamily:    "var(--font-slab), Georgia, serif",
        fontWeight:    800,
        fontSize:      "clamp(110px, 14vw, 200px)",
        lineHeight:    0.88,
        color:         main,
        letterSpacing: "-0.045em",
        marginBottom:  8,
      }}>
        {year}
      </div>

      {/* Era badge */}
      <div style={{ marginBottom: 20 }}>
        <span style={{
          fontFamily:    "monospace",
          fontSize:      11,
          fontWeight:    700,
          letterSpacing: "0.18em",
          textTransform: "uppercase" as const,
          color:         eraColor,
        }}>
          {era}
        </span>
      </div>

      {/* Headline */}
      <div style={{
        fontFamily:   "var(--font-slab), Georgia, serif",
        fontWeight:   700,
        fontSize:     "clamp(18px, 1.8vw, 24px)",
        color:        main,
        lineHeight:   1.3,
        marginBottom: 16,
      }}>
        {headline}
      </div>

      {/* Body */}
      {lines.map((l, i) => (
        <p key={i} style={{ fontFamily: "var(--font-sans), system-ui, sans-serif", fontSize: 14, color: muted, lineHeight: 1.75, margin: "0 0 6px" }}>
          {l}
        </p>
      ))}

      <Pill text={stat} light={light} />
    </div>
  );
}

/* ── Image with offset frame ─────────────────────────────────────────────── */
function FramedImage({ src, frameRight = true }: { src: string; frameRight?: boolean }) {
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 500 }}>
      <div style={{
        position: "absolute",
        top: 16,
        right:  frameRight ? -16 : 0,
        bottom: -16,
        left:   frameRight ? 0 : -16,
        border: "2px solid #d97e3a",
        zIndex: 0,
        pointerEvents: "none",
      }} />
      <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", zIndex: 1 }}>
        <Image src={src} alt="" fill style={{ objectFit: "cover" }} unoptimized />
      </div>
    </div>
  );
}

/* ── Browser SVG (Slide 3) ───────────────────────────────────────────────── */
function BrowserSVG({ svgRef }: { svgRef: React.RefObject<SVGSVGElement | null> }) {
  return (
    <svg ref={svgRef as React.RefObject<SVGSVGElement>} viewBox="0 0 440 310" style={{ width: "100%", maxWidth: 440 }}>
      <rect x="8" y="8" width="424" height="294" rx="12" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
      <rect x="8" y="8" width="424" height="44" rx="12" fill="rgba(0,0,0,0.18)"/>
      <rect x="8" y="38" width="424" height="14" fill="rgba(0,0,0,0.18)"/>
      <circle cx="32" cy="30" r="5" fill="rgba(255,100,80,0.8)"/>
      <circle cx="50" cy="30" r="5" fill="rgba(255,200,60,0.8)"/>
      <circle cx="68" cy="30" r="5" fill="rgba(80,210,80,0.8)"/>
      <rect x="94" y="18" width="268" height="24" rx="12" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
      <text className="browser-url" x="108" y="34" fontFamily="monospace" fontSize="11.5" fill="rgba(255,255,255,0.92)" dominantBaseline="middle">abelec.be</text>
      <rect className="browser-cursor" x="108" y="22" width="1.5" height="17" fill="rgba(255,255,255,0.9)"/>
      <rect x="24" y="68" width="392" height="28" rx="4" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
      <rect x="36" y="78" width="60" height="8" rx="4" fill="rgba(255,255,255,0.3)"/>
      <rect x="126" y="78" width="44" height="8" rx="4" fill="rgba(255,255,255,0.15)"/>
      <rect x="182" y="78" width="44" height="8" rx="4" fill="rgba(255,255,255,0.15)"/>
      <rect x="238" y="78" width="44" height="8" rx="4" fill="rgba(255,255,255,0.15)"/>
      <rect x="24" y="112" width="220" height="12" rx="6" fill="rgba(255,255,255,0.35)"/>
      <rect x="24" y="130" width="180" height="8" rx="4" fill="rgba(255,255,255,0.18)"/>
      <rect x="24" y="146" width="195" height="8" rx="4" fill="rgba(255,255,255,0.14)"/>
      <rect x="24" y="172" width="100" height="26" rx="13" fill="rgba(255,255,255,0.25)"/>
      <text x="74" y="188" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fill="rgba(255,255,255,0.85)" fontWeight="600">Commander →</text>
      {[0, 1, 2].map((j) => (
        <g key={j}>
          <rect x={24 + j * 132} y="214" width="120" height="74" rx="6" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8"/>
          <rect x={34 + j * 132} y="224" width="100" height="40" rx="3" fill="rgba(255,255,255,0.1)"/>
          <rect x={34 + j * 132} y="272" width="70" height="7" rx="3" fill="rgba(255,255,255,0.2)"/>
        </g>
      ))}
    </svg>
  );
}

/* ── Europe SVG (Slide 4) ────────────────────────────────────────────────── */
function EuropeSVG({ svgRef }: { svgRef: React.RefObject<SVGSVGElement | null> }) {
  return (
    <svg ref={svgRef as React.RefObject<SVGSVGElement>} viewBox="80 60 210 180" style={{ width: "100%", maxWidth: 380 }}>
      <defs>
        <pattern id="eu-grid" width="15" height="15" patternUnits="userSpaceOnUse">
          <path d="M15 0L0 0 0 15" fill="none" stroke="rgba(248,245,240,0.06)" strokeWidth="0.6"/>
        </pattern>
      </defs>
      <rect x="80" y="60" width="210" height="180" fill="url(#eu-grid)"/>
      {[
        [148,108, 145,88], [148,108, 155,120], [148,108, 118,142],
        [148,108, 175,108], [155,120, 175,108], [118,142, 170,182], [175,108, 170,182],
      ].map(([x1,y1,x2,y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(217,126,58,0.2)" strokeWidth="0.8" strokeDasharray="3 4"/>
      ))}
      {COUNTRIES.map((c, i) => (
        <g key={c.id}>
          <circle className={`eu-ring-${i}`} cx={c.cx} cy={c.cy} r="5" fill="none" stroke="#d97e3a" strokeWidth="1.2" opacity="0"/>
          <circle cx={c.cx} cy={c.cy} r="5" fill="#d97e3a" opacity="0.15"/>
          <circle cx={c.cx} cy={c.cy} r="2.8" fill="#d97e3a"/>
          <text x={c.cx + (c.id === "FR" || c.id === "NL" ? -14 : 7)} y={c.cy + 4} fontSize="7.5" fontFamily="monospace" fontWeight="700" fill="rgba(248,245,240,0.65)" letterSpacing="0.08em">
            {c.id}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Main: HorizontalTimeline
   ═══════════════════════════════════════════════════════════════════════════ */
export default function HorizontalTimeline() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);
  const fillRef    = useRef<HTMLDivElement>(null);
  const eraRef     = useRef<HTMLSpanElement>(null);
  const browserRef = useRef<SVGSVGElement>(null);
  const europeRef  = useRef<SVGSVGElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const counterIv  = useRef<ReturnType<typeof setInterval> | null>(null);
  const pingKill   = useRef<gsap.core.Tween[]>([]);
  const browserTl  = useRef<gsap.core.Timeline | null>(null);

  const scrollToSlide = useCallback((i: number) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const top = wrapper.getBoundingClientRect().top + window.scrollY + i * window.innerHeight;
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track   = trackRef.current;
    const fill    = fillRef.current;
    const era     = eraRef.current;
    if (!wrapper || !track || !fill || !era) return;

    // ── Main horizontal scrub — only animation on scroll ──────────────────
    const main = gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth),
      ease: "none",
      scrollTrigger: {
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          gsap.set(fill, { width: `${self.progress * 100}%` });
          const idx = Math.min(Math.floor(self.progress * 5), 4);
          setActive(idx);
          if (era) era.textContent = ERAS[idx];
        },
      },
    });

    // ── Browser typing loop ────────────────────────────────────────────────
    function startBrowserAnim() {
      const svg = browserRef.current;
      if (!svg) return;
      const urlEl    = svg.querySelector(".browser-url")    as SVGTextElement | null;
      const cursorEl = svg.querySelector(".browser-cursor") as SVGRectElement | null;
      if (!urlEl || !cursorEl) return;

      const fullUrl   = "abelec.be";
      const charWidth = 7.2;
      const startX    = 108;

      gsap.to(cursorEl, { opacity: 0, duration: 0.45, ease: "steps(1)", repeat: -1, yoyo: true });

      browserTl.current = gsap.timeline({ repeat: -1, repeatDelay: 2,
        onRepeat: () => { if (urlEl) urlEl.textContent = ""; },
      });
      for (let i = 0; i < fullUrl.length; i++) {
        const ci = i;
        browserTl.current.add(() => {
          if (urlEl)    urlEl.textContent = fullUrl.slice(0, ci + 1);
          if (cursorEl) gsap.set(cursorEl, { attr: { x: startX + (ci + 1) * charWidth } });
        }, `+=${0.1}`);
      }
      browserTl.current.to({}, { duration: 2 });
    }

    // ── Europe pings ──────────────────────────────────────────────────────
    function startPings() {
      const svg = europeRef.current;
      if (!svg) return;
      pingKill.current = COUNTRIES.map((_, i) => {
        const ring = svg.querySelector(`.eu-ring-${i}`) as SVGCircleElement | null;
        if (!ring) return null!;
        return gsap.fromTo(ring,
          { attr: { r: 4 }, opacity: 0.85 },
          { attr: { r: 18 }, opacity: 0, duration: 1.4, ease: "power2.out", delay: i * 0.45, repeat: -1, repeatDelay: 2.5 }
        );
      }).filter(Boolean);
    }

    // ── Live counter ──────────────────────────────────────────────────────
    function startCounter() {
      const el = counterRef.current;
      if (!el || counterIv.current) return;
      let count = 287590;
      el.textContent = count.toLocaleString("fr-BE");
      counterIv.current = setInterval(() => {
        count += 1;
        if (el) el.textContent = count.toLocaleString("fr-BE");
      }, 2000);
    }

    startBrowserAnim();
    startPings();
    startCounter();

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      main.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      browserTl.current?.kill();
      pingKill.current.forEach((t) => t?.kill());
      if (counterIv.current) clearInterval(counterIv.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  /* ── JSX ─────────────────────────────────────────────────────────────────── */
  return (
    <div>
      {/* ══════════════════════════════════════════════════════════════════════
          INTRO — normal scroll, above the pin
          ══════════════════════════════════════════════════════════════════════ */}
      <div style={{ background: "#F8F5F0", borderTop: "1px solid rgba(26,58,92,0.08)", padding: "96px 72px 88px" }}>
        <p style={{
          fontFamily: "monospace", fontSize: 11, fontWeight: 700,
          letterSpacing: "0.22em", textTransform: "uppercase" as const,
          color: "#d97e3a", marginBottom: 20,
        }}>
          Notre histoire
        </p>
        <h2 style={{
          fontFamily: "var(--font-slab), Georgia, serif", fontWeight: 800,
          fontSize: "clamp(38px, 5vw, 68px)", color: "#0f2340",
          lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: 24,
        }}>
          Quatre décennies,<br />cinq moments clés.
        </h2>
        <p style={{ fontFamily: "monospace", fontSize: 12, color: "rgba(26,58,92,0.42)", letterSpacing: "0.06em" }}>
          Faites défiler pour explorer →
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          500vh PINNED WRAPPER
          ══════════════════════════════════════════════════════════════════════ */}
      <div ref={wrapperRef} style={{ height: "500vh" }}>
        <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>

          {/* ── Horizontal track ── */}
          <div
            ref={trackRef}
            style={{ display: "flex", width: "500vw", height: "100%", willChange: "transform" }}
          >

            {/* ════════════════════════════════════════ SLIDE 1 — 1983 */}
            <div style={{ width: "100vw", height: "100vh", flexShrink: 0, background: "#1B2B4B", display: "flex", alignItems: "center" }}>
              <TextCol step="01/05" year="1983" era="FONDATION"
                headline="Nicola Fiordaliso ouvre Abelec à Binche"
                lines={[
                  "En 1983, Nicola Fiordaliso fonde Abelec dans un petit atelier du Hainaut avec une conviction simple : proposer aux réparateurs belges les pièces introuvables ailleurs.",
                  "L'activité démarre avec une centaine de références pour lave-linge et réfrigérateurs, vendues aux techniciens locaux et aux ménages du bassin de Charleroi.",
                ]}
                stat="500 références · Binche, Hainaut" light />
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 72 }}>
                <FramedImage src="https://picsum.photos/seed/workshop1983/800/600?grayscale" frameRight />
              </div>
            </div>

            {/* ════════════════════════════════════════ SLIDE 2 — 1997 */}
            <div style={{ width: "100vw", height: "100vh", flexShrink: 0, background: "#F5F0E8", display: "flex", alignItems: "center", flexDirection: "row-reverse" }}>
              <TextCol step="02/05" year="1997" era="CATALOGUE"
                headline="Premier catalogue papier — 5 000 références"
                lines={[
                  "Après quatorze ans de croissance organique, Abelec publie son premier catalogue papier : 5 000 références classées par marque et par type d'appareil.",
                  "Distribué à plusieurs centaines de réparateurs, il devient la bible du technicien indépendant dans la région. Les commandes arrivent par fax et téléphone.",
                ]}
                stat="5 000 références · 600+ réparateurs" light={false} />
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", paddingLeft: 72 }}>
                <FramedImage src="https://picsum.photos/seed/catalog1997/800/600?grayscale" frameRight={false} />
              </div>
            </div>

            {/* ════════════════════════════════════════ SLIDE 3 — 2008 */}
            <div style={{ width: "100vw", height: "100vh", flexShrink: 0, background: "#C0541A", display: "flex", alignItems: "center" }}>
              <TextCol step="03/05" year="2008" era="E-COMMERCE"
                headline="Lancement d'abelec.be — 25 ans après la création"
                lines={[
                  "En 2008, Abelec franchit le cap du numérique. Les particuliers peuvent désormais commander directement, sans passer par un technicien agréé.",
                  "Fiches techniques détaillées, guides d'installation, compatibilité par modèle. Le chiffre d'affaires double en trois ans grâce à la portée nationale du web.",
                ]}
                stat="×2 chiffre d'affaires · 18 000 références" light eraColor="rgba(255,255,255,0.85)" />
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 72 }}>
                <BrowserSVG svgRef={browserRef} />
              </div>
            </div>

            {/* ════════════════════════════════════════ SLIDE 4 — 2018 */}
            <div style={{ width: "100vw", height: "100vh", flexShrink: 0, background: "#1B2B4B", display: "flex", alignItems: "center" }}>
              <TextCol step="04/05" year="2018" era="EUROPE"
                headline="Ouverture à 6 pays : France, Pays-Bas, Allemagne, Italie, Luxembourg"
                lines={[
                  "Forte d'un catalogue élargi à 60 000 références, Abelec ouvre ses frontières à cinq nouveaux marchés. Interfaces traduites, transporteurs locaux, délais adaptés.",
                  "Un stock centralisé en Belgique garantit l'expédition sous 48h vers toute l'Europe de l'Ouest. L'entreprise familiale devient une référence continentale.",
                ]}
                stat="6 pays · 60 000 références · Expédition 48h" light />
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 72 }}>
                <EuropeSVG svgRef={europeRef} />
              </div>
            </div>

            {/* ════════════════════════════════════════ SLIDE 5 — TODAY */}
            <div style={{ width: "100vw", height: "100vh", flexShrink: 0, background: "#F5F0E8", display: "flex", alignItems: "center" }}>
              <TextCol step="05/05" year="2026" era="AUJOURD'HUI"
                headline="Identification 3D & 100 000 références"
                lines={[
                  "Abelec lance sa plateforme de seconde génération : identification des pièces par vue 3D interactive, helpdesk humain en temps réel, catalogue de 100 000 références.",
                  "L'intelligence artificielle assiste les particuliers dans l'identification de la panne — sans connaître le numéro de modèle exact.",
                ]}
                stat="100 000 références · 80+ marques" light={false} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingRight: 72, gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "monospace", fontSize: 11, color: "rgba(26,58,92,0.5)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 0 3px rgba(34,197,94,0.2)", display: "inline-block" }}/>
                  En direct
                </div>
                <div ref={counterRef} style={{ fontFamily: "var(--font-slab), Georgia, serif", fontWeight: 800, fontSize: "clamp(52px, 7vw, 96px)", color: "#d97e3a", letterSpacing: "-0.04em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                  287 590
                </div>
                <div style={{ fontFamily: "var(--font-sans), system-ui", fontSize: 14, color: "rgba(26,58,92,0.55)", textAlign: "center", maxWidth: 220, lineHeight: 1.5 }}>
                  appareils réparés<br />depuis 1983
                </div>
              </div>
            </div>

          </div>{/* end track */}

          {/* ── "→ suivant" hint ── */}
          <div style={{
            position:      "absolute",
            bottom:        96,
            right:         72,
            zIndex:        20,
            opacity:       active >= 4 ? 0 : active === 3 ? 0.35 : 0.60,
            transition:    "opacity 0.5s ease",
            pointerEvents: "none",
          }}>
            <span style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.7)" }}>
              suivant →
            </span>
          </div>

          {/* ── Bottom bar: gradient + era + year bar + progress ── */}
          <div style={{
            position:      "absolute",
            bottom:        0,
            left:          0,
            right:         0,
            background:    "linear-gradient(to top, rgba(0,0,0,0.48) 0%, transparent 100%)",
            pointerEvents: "none",
          }}>
            {/* Era label */}
            <div style={{ textAlign: "center", paddingTop: 28, paddingBottom: 10 }}>
              <span ref={eraRef} style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>
                Fondation
              </span>
            </div>

            {/* Year timeline bar */}
            <div style={{ pointerEvents: "auto" }}>
              <TimelineBar active={active} onDotClick={scrollToSlide} />
            </div>

            {/* Progress bar */}
            <div style={{ height: 2, background: "rgba(255,255,255,0.15)", position: "relative" }}>
              <div ref={fillRef} style={{ position: "absolute", top: 0, left: 0, height: "100%", width: "0%", background: "#d97e3a" }} />
            </div>
          </div>

        </div>{/* end sticky */}
      </div>{/* end 500vh wrapper */}
    </div>
  );
}
