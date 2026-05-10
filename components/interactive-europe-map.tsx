"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// ViewBox matches image ratio (1536×1024 = 3:2 → 150×100 units).
// preserveAspectRatio="none" on a 3:2 container → 1 unit = same px in x & y.
const VW = 150;
const VH = 100;

// Warehouse origin — Belgium (pin location in the image)
const WH = { x: 63, y: 39 };

const ROUTES = [
  { id: "LU", label: "LU · 24h", x: 68,  y: 46,  delay: 0,    color: "#F97316", strokeOpacity: 1,    dashed: false },
  { id: "FR", label: "FR · 48h", x: 41,  y: 68,  delay: 0.7,  color: "#FB923C", strokeOpacity: 0.85, dashed: false },
  { id: "NL", label: "NL · 48h", x: 61,  y: 20,  delay: 1.4,  color: "#FB923C", strokeOpacity: 0.85, dashed: false },
  { id: "DE", label: "DE · 48h", x: 88,  y: 27,  delay: 2.1,  color: "#FB923C", strokeOpacity: 0.85, dashed: false },
  { id: "IT", label: "IT · 72h", x: 81,  y: 80,  delay: 2.8,  color: "#FDBA74", strokeOpacity: 0.7,  dashed: true  },
];

const CYCLE = 8; // seconds per full loop

// Smooth arc: all start from WH.
// Northward destinations (y < WH.y) → curve east to avoid backward tangent.
// Southward destinations → lift midpoint upward (classic flight-path look).
function arcPath(to: { x: number; y: number }): string {
  const mx = (WH.x + to.x) / 2;
  const my = (WH.y + to.y) / 2;
  const dx = to.x - WH.x;
  const dy = to.y - WH.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 0.5) return "";
  const lift = Math.max(7, len * 0.42);
  let cx: number, cy: number;
  if (to.y < WH.y) {
    // Destination above → control point shifted east so arc curves right
    cx = mx + lift * 0.65;
    cy = my;
  } else {
    // Destination below → lift midpoint upward, slight horizontal nudge
    const nudge = (dx !== 0 ? Math.sign(dx) : 1) * lift * 0.2;
    cx = mx - nudge;
    cy = my - lift;
  }
  return `M ${WH.x} ${WH.y} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${to.x} ${to.y}`;
}

const SVG_CSS = `
  @keyframes arcDraw {
    0%   { stroke-dashoffset: 220; opacity: 0; }
    4%   { stroke-dashoffset: 220; opacity: 1; }
    32%  { stroke-dashoffset: 0;   opacity: 1; }
    70%  { stroke-dashoffset: 0;   opacity: 1; }
    88%  { stroke-dashoffset: 0;   opacity: 0; }
    100% { stroke-dashoffset: 220; opacity: 0; }
  }
  .arc-line {
    stroke-dasharray: 220;
    stroke-dashoffset: 220;
  }
  @media (prefers-reduced-motion: reduce) {
    .arc-line {
      animation: none !important;
      stroke-dashoffset: 0 !important;
      opacity: 0.45 !important;
    }
  }
`;

export default function InteractiveEuropeMap() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  // Start animation when section enters viewport
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true); },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="w-full rounded-[14px] overflow-hidden relative select-none"
    >
      {/* Base map */}
      <Image
        src="/images/europe-map.jpg"
        alt="Zone de livraison Europe"
        width={1536}
        height={1024}
        className="w-full h-auto block"
        priority
      />

      {/* SVG overlay — only mounted after entering viewport */}
      {active && (
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 ${VW} ${VH}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <style>{SVG_CSS}</style>

          {/* ── Ghost tracks (always visible, very faint) ────────────── */}
          {ROUTES.map((r) => (
            <path
              key={`ghost-${r.id}`}
              d={arcPath(r)}
              fill="none"
              stroke={r.color}
              strokeWidth={0.3}
              strokeDasharray={r.dashed ? "1.2 1.8" : undefined}
              opacity={0.18}
              pointerEvents="none"
            />
          ))}

          {/* ── Animated arcs ─────────────────────────────────────────── */}
          {ROUTES.map((r) => (
            <path
              key={`arc-${r.id}`}
              d={arcPath(r)}
              fill="none"
              stroke={r.color}
              strokeWidth={hovered === r.id ? 1.6 : 0.9}
              strokeLinecap="round"
              strokeOpacity={r.strokeOpacity}
              strokeDasharray={r.dashed ? "2.5 2" : undefined}
              className="arc-line"
              style={{
                animation: `arcDraw ${CYCLE}s ease-in-out infinite ${r.delay}s`,
                willChange: "stroke-dashoffset",
                filter: hovered === r.id ? `drop-shadow(0 0 2.5px ${r.color})` : undefined,
                transition: "stroke-width 0.2s",
              }}
              pointerEvents="visibleStroke"
              onMouseEnter={() => setHovered(r.id)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}

          {/* ── Destination dots + labels ──────────────────────────────── */}
          {ROUTES.map((r) => {
            const isHov = hovered === r.id;
            // Put label to the right, except near right edge
            const goLeft = r.x > VW * 0.72;
            const lx = goLeft ? r.x - 10.5 : r.x + 2.2;
            return (
              <g
                key={`dest-${r.id}`}
                onMouseEnter={() => setHovered(r.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: "default" }}
              >
                {/* Pulse ring (SMIL, reliable cross-browser) */}
                <circle cx={r.x} cy={r.y} r={1.4} fill={r.color} opacity={r.strokeOpacity}>
                  <animate
                    attributeName="r"
                    from="1.4" to="5.5"
                    dur="2.2s"
                    begin={`${r.delay * 0.3}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.6" to="0"
                    dur="2.2s"
                    begin={`${r.delay * 0.3}s`}
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Solid dot */}
                <circle
                  cx={r.x} cy={r.y}
                  r={isHov ? 1.6 : 1.1}
                  fill={r.color}
                  opacity={r.strokeOpacity}
                />

                {/* Label background */}
                <rect
                  x={lx} y={r.y - 2.6}
                  width={isHov ? 9.5 : 8.8} height={3.8} rx={0.6}
                  fill="rgba(255,255,255,0.93)"
                  stroke={r.color}
                  strokeWidth={isHov ? 0.4 : 0.22}
                />

                {/* Label text */}
                <text
                  x={lx + 1.1} y={r.y + 0.55}
                  fontSize={isHov ? "2.3" : "2"}
                  fill="#1a3a5c"
                  fontFamily="monospace"
                  fontWeight={isHov ? "700" : "500"}
                >
                  {r.label}
                </text>
              </g>
            );
          })}

          {/* ── Warehouse / Belgium ────────────────────────────────────── */}
          <g>
            {/* Cover the static navy pin that is baked into the map image.
                Use a circle filled with the map's orange country colour. */}
            <circle cx={WH.x} cy={WH.y - 2} r={6.5} fill="#D97B35" />

            {/* Double ping rings */}
            {[0, 1].map((i) => (
              <circle key={i} cx={WH.x} cy={WH.y} r={2.5} fill="none" stroke="#F97316" strokeWidth={0.6}>
                <animate attributeName="r" from="2.5" to="8" dur="2s" begin={`${i}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.85" to="0" dur="2s" begin={`${i}s`} repeatCount="indefinite" />
              </circle>
            ))}

            {/* Core dot */}
            <circle cx={WH.x} cy={WH.y} r={2.5} fill="#F97316" />
            <circle cx={WH.x} cy={WH.y} r={1.1} fill="white" />

            {/* Label above — wide enough for full "Entrepôt · BE · 24h" text */}
            <rect
              x={WH.x - 14} y={WH.y - 12}
              width={28} height={4.2} rx={0.7}
              fill="rgba(26,58,92,0.90)"
            />
            <text
              x={WH.x} y={WH.y - 8.9}
              fontSize="2.1"
              fill="white"
              fontFamily="monospace"
              textAnchor="middle"
              fontWeight="600"
              letterSpacing="0.02"
            >
              {`Entrepôt · BE · 24h`}
            </text>
          </g>
        </svg>
      )}
    </div>
  );
}
