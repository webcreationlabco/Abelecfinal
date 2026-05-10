"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/* ═══════════════════════════════════════════════════════════════════════════
   TYPE A — Floating parts constellation
   Large, spread-out, clearly visible
   ═══════════════════════════════════════════════════════════════════════════ */

// Deterministic icon positions (% from top-left of container)
const ICON_CONFIG = [
  { x: 12,  y: 14,  dx: 22,  dy: 14,  rot: 120,  d: 7.0, size: 44 },
  { x: 68,  y: 8,   dx: -18, dy: 20,  rot: -90,  d: 8.5, size: 38 },
  { x: 44,  y: 30,  dx: 14,  dy: -16, rot: 180,  d: 6.0, size: 50 },
  { x: 82,  y: 44,  dx: -20, dy: 12,  rot: 100,  d: 9.0, size: 36 },
  { x: 8,   y: 58,  dx: 18,  dy: -14, rot: -150, d: 7.5, size: 42 },
  { x: 55,  y: 68,  dx: -12, dy: 18,  rot: 130,  d: 8.0, size: 46 },
  { x: 28,  y: 80,  dx: 16,  dy: -20, rot: -80,  d: 6.5, size: 40 },
  { x: 76,  y: 76,  dx: -22, dy: -10, rot: 160,  d: 9.5, size: 34 },
  { x: 90,  y: 22,  dx: -16, dy: 18,  rot: -110, d: 7.2, size: 38 },
];

function GearIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  );
}
function WrenchIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  );
}
function BoltIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  );
}
function ChipIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="7" width="10" height="10" rx="1"/>
      <line x1="9" y1="7" x2="9" y2="4"/><line x1="12" y1="7" x2="12" y2="4"/><line x1="15" y1="7" x2="15" y2="4"/>
      <line x1="9" y1="17" x2="9" y2="20"/><line x1="12" y1="17" x2="12" y2="20"/><line x1="15" y1="17" x2="15" y2="20"/>
      <line x1="7" y1="9" x2="4" y2="9"/><line x1="7" y1="15" x2="4" y2="15"/>
      <line x1="17" y1="9" x2="20" y2="9"/><line x1="17" y1="15" x2="20" y2="15"/>
    </svg>
  );
}
function FilterIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  );
}
function SpringIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M12 2 Q18 5 12 9 Q6 12 12 16 Q18 19 12 22"/>
    </svg>
  );
}
function HexIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/>
    </svg>
  );
}
function RingIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  );
}
function ScrewIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <line x1="12" y1="3" x2="12" y2="21"/>
      <path d="M8 7 Q12 5 16 7"/>
      <path d="M8 11 Q12 9 16 11"/>
      <path d="M8 15 Q12 13 16 15"/>
      <path d="M9 19 Q12 17.5 15 19"/>
    </svg>
  );
}

const ICONS = [GearIcon, WrenchIcon, BoltIcon, ChipIcon, FilterIcon, SpringIcon, HexIcon, RingIcon, ScrewIcon];

export function ConstellationWidget() {
  const containerRef = useRef<HTMLDivElement>(null);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const driftTweens = useRef<gsap.core.Tween[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const els = refs.current.filter(Boolean) as HTMLDivElement[];
    if (!container || els.length === 0) return;

    // Set initial positions
    els.forEach((el, i) => {
      const c = ICON_CONFIG[i];
      gsap.set(el, {
        left: `${c.x}%`,
        top:  `${c.y}%`,
        xPercent: -50,
        yPercent: -50,
        rotation: 0,
        opacity: 1,
      });
    });

    // Infinite drift
    driftTweens.current = els.map((el, i) => {
      const c = ICON_CONFIG[i];
      return gsap.to(el, {
        x: c.dx,
        y: c.dy,
        rotation: c.rot * 0.15,
        duration: c.d,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: i * 0.4,
      });
    });

    // Hover scatter
    const handleEnter = () => {
      els.forEach((el, i) => {
        const c = ICON_CONFIG[i];
        const angle = (c.x / 100 - 0.5) * Math.PI * 2;
        driftTweens.current[i]?.pause();
        gsap.to(el, {
          x: Math.cos(angle) * 70,
          y: Math.sin(angle) * 50,
          rotation: c.rot,
          scale: 1.4,
          opacity: 0.6,
          duration: 0.55,
          ease: "power3.out",
          overwrite: true,
        });
      });
    };

    const handleLeave = () => {
      els.forEach((el, i) => {
        gsap.to(el, {
          x: ICON_CONFIG[i].dx,
          y: ICON_CONFIG[i].dy,
          rotation: 0,
          scale: 1,
          opacity: 1,
          duration: 1.4,
          ease: "elastic.out(1, 0.55)",
          overwrite: true,
          onComplete: () => driftTweens.current[i]?.resume(),
        });
      });
    };

    container.addEventListener("mouseenter", handleEnter);
    container.addEventListener("mouseleave", handleLeave);
    return () => {
      driftTweens.current.forEach((t) => t.kill());
      container.removeEventListener("mouseenter", handleEnter);
      container.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full cursor-default select-none"
      style={{ height: "340px" }}
    >
      {ICONS.map((Icon, i) => (
        <div
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          className="absolute text-abelec-navy/40"
          style={{ willChange: "transform, opacity" }}
        >
          <Icon size={ICON_CONFIG[i].size} />
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TYPE B — Sonar / orbital pulse  (no numbers)
   Concentric rings that pulse outward, on-brand, premium
   ═══════════════════════════════════════════════════════════════════════════ */

export function SonarWidget() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<(HTMLDivElement | null)[]>([]);
  const hasStarted = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const rings = ringsRef.current.filter(Boolean) as HTMLDivElement[];
    if (!container || rings.length === 0) return;

    // Set initial state
    rings.forEach((r) => gsap.set(r, { scale: 0.1, opacity: 0 }));

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true;

          rings.forEach((r, i) => {
            gsap.to(r, {
              scale: 1,
              opacity: 0,
              duration: 3.2,
              ease: "power1.out",
              repeat: -1,
              delay: i * 0.8,
              onRepeat: () => gsap.set(r, { scale: 0.1, opacity: 0.7 }),
            });
            // Set initial opacity for first pulse
            gsap.set(r, { opacity: 0.7 });
          });
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center w-full"
      style={{ height: "340px" }}
    >
      <div className="relative" style={{ width: "260px", height: "260px" }}>
        {/* Pulse rings */}
        {[260, 200, 140, 88].map((size, i) => (
          <div
            key={i}
            ref={(el) => { ringsRef.current[i] = el; }}
            className="absolute rounded-full"
            style={{
              width:  size,
              height: size,
              top:    "50%",
              left:   "50%",
              transform: "translate(-50%, -50%)",
              border: `${i === 0 ? 1 : i === 1 ? 1.5 : 2}px solid #d97e3a`,
              willChange: "transform, opacity",
            }}
          />
        ))}

        {/* Static center rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="rounded-full"
            style={{ width: 48, height: 48, border: "1.5px solid rgba(26,58,92,0.15)" }}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="rounded-full"
            style={{ width: 80, height: 80, border: "1px dashed rgba(217,126,58,0.2)" }}
          />
        </div>

        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="rounded-full"
            style={{
              width: 12,
              height: 12,
              background: "#d97e3a",
              boxShadow: "0 0 12px rgba(217,126,58,0.5)",
            }}
          />
        </div>

        {/* Cross-hair lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.06]"
          viewBox="0 0 260 260"
        >
          <line x1="130" y1="0" x2="130" y2="260" stroke="#1a3a5c" strokeWidth="1" strokeDasharray="4 6"/>
          <line x1="0" y1="130" x2="260" y2="130" stroke="#1a3a5c" strokeWidth="1" strokeDasharray="4 6"/>
        </svg>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TYPE C — Kinetic typography
   Word wipes in left→right, then oscillates
   ═══════════════════════════════════════════════════════════════════════════ */

export function KineticWord({ word }: { word: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const wordRef   = useRef<HTMLDivElement>(null);
  const lineRef   = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const wordEl  = wordRef.current;
    const lineEl  = lineRef.current;
    if (!wrapper || !wordEl || !lineEl) return;

    gsap.set(wordEl, { clipPath: "inset(0 100% 0 0)", y: 6 });
    gsap.set(lineEl, { scaleX: 0, transformOrigin: "left center" });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;

          // Line draws first
          gsap.to(lineEl, {
            scaleX: 1,
            duration: 0.5,
            ease: "power2.out",
          });

          // Word reveals 0.15s later
          gsap.to(wordEl, {
            clipPath: "inset(0 0% 0 0)",
            y: 0,
            duration: 1.0,
            ease: "power3.inOut",
            delay: 0.15,
            onComplete: () => {
              gsap.to(wordEl, {
                y: -5,
                duration: 2.8,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
              });
            },
          });
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="flex flex-col items-center justify-center w-full gap-3"
      style={{ height: "340px" }}
    >
      {/* Decorative line above */}
      <div
        ref={lineRef}
        style={{ width: "40px", height: "2px", background: "#d97e3a" }}
      />

      <div
        ref={wordRef}
        className="font-slab font-bold text-abelec-navy select-none leading-none text-center"
        style={{
          fontSize: "clamp(64px, 8vw, 96px)",
          letterSpacing: "-0.04em",
          opacity: 0.18,
          willChange: "transform, clip-path",
        }}
      >
        {word}
      </div>
    </div>
  );
}
