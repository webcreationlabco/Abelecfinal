"use client";

import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { motion } from "framer-motion";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const HIGHLIGHTED = new Set([250, 56, 528, 442, 276, 380]);
const EUROPE = new Set([
  8, 20, 40, 112, 56, 70, 100, 191, 196, 203, 208, 233, 246, 250, 276, 300,
  348, 352, 372, 380, 428, 438, 440, 442, 470, 492, 498, 499, 528, 578, 616,
  620, 642, 674, 688, 703, 705, 724, 752, 756, 792, 804, 826, 336, 807,
]);

// ── Pre-projected SVG coordinates ─────────────────────────────────────────
// Projection: geoMercator · scale=2800 · center=[10°,50°] · SVG 800×600
// translate = [400, 300]
// x = 400 + 2800 × (lng − 10) × π/180
// y = 300 − 2800 × [atanh(sin(lat)) − atanh(sin(50°))]   atanh(sin(50°)) ≈ 1.010
const WH = { x: 82, y: 280 }; // warehouse 50.3°N 3.5°E

const ROUTES = [
  { id: "FR", to: { x: 26,  y: 387 }, delay: "0.0s" }, // Paris    48.85°N 2.35°E
  { id: "BE", to: { x: 124, y: 238 }, delay: "0.4s" }, // Brussels 50.85°N 4.35°E
  { id: "LU", to: { x: 211, y: 317 }, delay: "0.8s" }, // Lux.     49.61°N 6.13°E
  { id: "NL", to: { x: 150, y: 107 }, delay: "1.2s" }, // Amsterdam52.37°N 4.89°E
  { id: "DE", to: { x: 566, y: 98  }, delay: "1.6s" }, // Berlin   52.52°N 13.40°E
  { id: "IT", to: { x: 522, y: 868 }, delay: "2.0s" }, // Rome     41.90°N 12.49°E
];

// Teardrop pin: tip at (0,0), body extends upward
const PIN =
  "M0,0 C-9,-2 -13,-11 -13,-18 C-13,-26 -7,-32 0,-32 C7,-32 13,-26 13,-18 C13,-11 9,-2 0,0 Z";

// Quadratic bezier arc lifted upward from midpoint
function arc(from: { x: number; y: number }, to: { x: number; y: number }) {
  const mx   = (from.x + to.x) / 2;
  const my   = (from.y + to.y) / 2;
  const dx   = to.x - from.x;
  const dy   = to.y - from.y;
  const len  = Math.sqrt(dx * dx + dy * dy);
  const lift = Math.max(22, len * 0.42);
  return `M ${from.x},${from.y} Q ${mx},${my - lift} ${to.x},${to.y}`;
}

// ── CSS animation keyframes ────────────────────────────────────────────────
// Cycle = 5s total: draw 0.8s (~16%), hold, fade out
// animation-delay staggers each arc by 0.4s; delay is preserved across iterations
// because all arcs share the same duration (relative phase stays constant)
const STYLE = `
  @keyframes drawArc {
    0%   { stroke-dashoffset: 3000; opacity: 0; }
    2%   { stroke-dashoffset: 3000; opacity: 1; }
    18%  { stroke-dashoffset: 0;    opacity: 1; }
    74%  { stroke-dashoffset: 0;    opacity: 1; }
    90%  { stroke-dashoffset: 0;    opacity: 0; }
    100% { stroke-dashoffset: 3000; opacity: 0; }
  }
  .arc-path {
    stroke-dasharray: 3000;
    stroke-dashoffset: 3000;
  }
`;

// ── Component ──────────────────────────────────────────────────────────────
export default function WorldMap() {
  return (
    <div
      className="w-full overflow-hidden rounded-[14px]"
      style={{
        width:           "100%",
        minHeight:       "480px",
        height:          "500px",
        backgroundColor: "#F8F5F0",
        backgroundImage: "radial-gradient(circle, rgba(26,58,92,0.07) 1px, transparent 1px)",
        backgroundSize:  "20px 20px",
      }}
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [10, 50], scale: 2800 }}
        width={800}
        height={600}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Scoped CSS for arc animations */}
        <style>{STYLE}</style>

        {/* ── Countries ──────────────────────────────────────────────── */}
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies
              .filter((geo) => EUROPE.has(Number(geo.id)))
              .map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={HIGHLIGHTED.has(Number(geo.id)) ? "#d97e3a" : "#E8E4DE"}
                  stroke="#F8F5F0"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover:   { outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
          }
        </Geographies>

        {/* ── Ghost arc tracks ───────────────────────────────────────── */}
        {ROUTES.map((r) => (
          <path
            key={`ghost-${r.id}`}
            d={arc(WH, r.to)}
            fill="none"
            stroke="#1a3a5c"
            strokeWidth={0.5}
            strokeDasharray="3 5"
            opacity={0.15}
          />
        ))}

        {/* ── Animated arcs (CSS stroke-dashoffset) ──────────────────── */}
        {ROUTES.map((r) => (
          <path
            key={`arc-${r.id}`}
            d={arc(WH, r.to)}
            fill="none"
            stroke="#1a3a5c"
            strokeWidth={2}
            strokeLinecap="round"
            className="arc-path"
            style={{
              animation: `drawArc 5s ease-out infinite ${r.delay}`,
            }}
          />
        ))}

        {/* ── Destination dots (SVG SMIL) ─────────────────────────────── */}
        {ROUTES.map((r) => (
          <g key={`dot-${r.id}`}>
            {/* Solid inner dot */}
            <circle cx={r.to.x} cy={r.to.y} r={4} fill="#d97e3a" />
            {/* Expanding pulse ring */}
            <circle cx={r.to.x} cy={r.to.y} r={4} fill="#d97e3a">
              <animate
                attributeName="r"
                from="4"
                to="14"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                from="0.6"
                to="0"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}

        {/* ── Warehouse pin — rendered last (highest z-order) ────────── */}
        <Marker coordinates={[3.5, 50.3]}>
          <motion.g
            animate={{ scale: [1, 1.15, 1], opacity: [1, 0.72, 1] }}
            transition={{
              duration:   2,
              repeat:     Infinity,
              ease:       "easeInOut",
              repeatType: "loop",
            }}
            style={{ transformOrigin: "0px 0px" }}
          >
            <path d={PIN} fill="#1a3a5c" />
            <circle cx={0} cy={-18} r={5} fill="white" />
          </motion.g>
        </Marker>
      </ComposableMap>
    </div>
  );
}
