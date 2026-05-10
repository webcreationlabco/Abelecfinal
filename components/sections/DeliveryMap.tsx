"use client";
import React, { useState, useEffect, useRef } from "react";

// react-simple-maps@3 — typed shim to bypass bundler/types resolution mismatch
/* eslint-disable @typescript-eslint/no-require-imports */
const {
  ComposableMap,
  Geographies,
  Geography,
  Line,
  Marker,
} = require("react-simple-maps") as {
  ComposableMap: React.ComponentType<{
    projection?: string;
    projectionConfig?: { center: [number, number]; scale: number };
    width?: number;
    height?: number;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }>;
  Geographies: React.ComponentType<{
    geography: string;
    children: (args: { geographies: Array<{ rsmKey: string; id: string }> }) => React.ReactNode;
  }>;
  Geography: React.ComponentType<{
    geography: unknown;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    style?: { default?: React.CSSProperties; hover?: React.CSSProperties; pressed?: React.CSSProperties };
  }>;
  Line: React.ComponentType<{
    from: [number, number];
    to: [number, number];
    stroke?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
    strokeLinecap?: string;
    opacity?: number;
  }>;
  Marker: React.ComponentType<{
    coordinates: [number, number];
    children?: React.ReactNode;
  }>;
};

// ── Data ──────────────────────────────────────────────────────────────────────
const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

const HIGHLIGHTED: Record<string, true> = {
  "056": true, // BE
  "442": true, // LU
  "250": true, // FR
  "528": true, // NL
  "276": true, // DE
  "380": true, // IT
};

const WAREHOUSE: [number, number] = [4.35, 50.85];

const DESTINATIONS = [
  { key: "nl", code: "NL", label: "Pays-Bas",   time: "48h", coords: [4.9,   52.37] as [number, number] },
  { key: "de", code: "DE", label: "Allemagne",  time: "48h", coords: [13.4,  52.52] as [number, number] },
  { key: "lu", code: "LU", label: "Luxembourg", time: "24h", coords: [6.13,  49.61] as [number, number] },
  { key: "fr", code: "FR", label: "France",     time: "48h", coords: [2.35,  48.85] as [number, number] },
  { key: "it", code: "IT", label: "Italie",     time: "72h", coords: [12.5,  41.9 ] as [number, number] },
];

// Measured pill width so the rect is centred nicely
const BADGE_W = 72;
const BADGE_H = 22;

// ── Component ──────────────────────────────────────────────────────────────────
export default function DeliveryMap() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* @keyframes must be in a real <style> tag — not inline styles */}
      <style>{`
        @keyframes rsm-pulse {
          0%   { r: 8;  opacity: 0.65; }
          100% { r: 22; opacity: 0; }
        }
        .rsm-ring { animation: rsm-pulse 1.8s ease-out infinite; }
        .rsm-ring-1 { animation-delay: 0s;   }
        .rsm-ring-2 { animation-delay: 0.6s; }
        .rsm-ring-3 { animation-delay: 1.2s; }
      `}</style>

      <div ref={wrapRef}>
        <div style={{
          opacity:    visible ? 1 : 0,
          transform:  visible ? "scale(1)" : "scale(0.97)",
          transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
        }}>
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ center: [10, 50], scale: 900 }}
            width={800}
            height={600}
            style={{ width: "100%", height: "auto" }}
          >
            {/* ── Countries ── */}
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const isHL  = Boolean(HIGHLIGHTED[geo.id]);
                  const isHov = hovered === geo.id;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={isHL ? (isHov ? "#d4651f" : "#E8732A") : "#e8e4df"}
                      stroke={isHL ? "none" : "#d1cdc8"}
                      strokeWidth={isHL ? 0 : 0.5}
                      onMouseEnter={() => isHL && setHovered(geo.id)}
                      onMouseLeave={() => setHovered(null)}
                      style={{ default: { outline: "none" }, hover: { outline: "none" }, pressed: { outline: "none" } }}
                    />
                  );
                })
              }
            </Geographies>

            {/* ── Delivery lines ── */}
            {DESTINATIONS.map((d) => (
              <Line
                key={`line-${d.key}`}
                from={WAREHOUSE}
                to={d.coords}
                stroke="#E8732A"
                strokeWidth={1.5}
                strokeDasharray="5 3"
                strokeLinecap="round"
                opacity={0.75}
              />
            ))}

            {/* ── Country badge markers ── */}
            {DESTINATIONS.map((d) => (
              <Marker key={`m-${d.key}`} coordinates={d.coords}>
                {/* Tooltip — shown on hover */}
                {hovered === d.key && (
                  <g>
                    {/* Orange top accent bar */}
                    <rect
                      x={-(BADGE_W / 2 + 4)} y={-(BADGE_H + 44)}
                      width={BADGE_W + 8} height={2}
                      rx={1}
                      fill="#E8732A"
                    />
                    {/* Tooltip background */}
                    <rect
                      x={-(BADGE_W / 2 + 4)} y={-(BADGE_H + 42)}
                      width={BADGE_W + 8} height={26}
                      rx={6}
                      fill="#1e3a5f"
                      filter="url(#shadow)"
                    />
                    {/* Tooltip text */}
                    <text
                      x={0} y={-(BADGE_H + 24)}
                      textAnchor="middle"
                      fontSize={9}
                      fill="white"
                      fontFamily="sans-serif"
                      fontWeight={500}
                    >
                      {d.label} — {d.time}
                    </text>
                  </g>
                )}

                {/* Badge pill */}
                <rect
                  x={-BADGE_W / 2} y={-(BADGE_H + 8)}
                  width={BADGE_W} height={BADGE_H}
                  rx={BADGE_H / 2}
                  fill="rgba(255,255,255,0.96)"
                  stroke="rgba(232,115,42,0.4)"
                  strokeWidth={1.5}
                  style={{
                    filter: hovered === d.key ? "drop-shadow(0 3px 8px rgba(232,115,42,0.4))" : "drop-shadow(0 1px 3px rgba(0,0,0,0.12))",
                    cursor: "default",
                  }}
                  onMouseEnter={() => setHovered(d.key)}
                  onMouseLeave={() => setHovered(null)}
                />
                {/* Orange dot inside badge */}
                <circle
                  cx={-BADGE_W / 2 + 10} cy={-(BADGE_H / 2 + 8)}
                  r={3.5}
                  fill="#E8732A"
                  style={{ pointerEvents: "none" }}
                />
                {/* Badge label */}
                <text
                  x={-BADGE_W / 2 + 18} y={-(BADGE_H / 2 + 8) + 4}
                  fontSize={11}
                  fontWeight={600}
                  fill="#7a4010"
                  fontFamily="sans-serif"
                  style={{ pointerEvents: "none" }}
                >
                  {d.code} · {d.time}
                </text>
                {/* Tiny connector dot at map point */}
                <circle r={3} fill="#E8732A" opacity={0.6} style={{ pointerEvents: "none" }} />
              </Marker>
            ))}

            {/* ── Warehouse marker — Brussels ── */}
            <Marker coordinates={WAREHOUSE}>
              <defs>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.18" />
                </filter>
              </defs>

              {/* Pulse rings — SVG animation avoids transform-origin issues */}
              <circle className="rsm-ring rsm-ring-1" cx={0} cy={0} r={8} fill="none" stroke="#E8732A" strokeWidth={1.5} />
              <circle className="rsm-ring rsm-ring-2" cx={0} cy={0} r={8} fill="none" stroke="#E8732A" strokeWidth={1.5} />
              <circle className="rsm-ring rsm-ring-3" cx={0} cy={0} r={8} fill="none" stroke="#E8732A" strokeWidth={1.5} />

              {/* Center dot */}
              <circle cx={0} cy={0} r={5} fill="#E8732A" />
              <circle cx={0} cy={0} r={2.5} fill="white" />

              {/* "Entrepot" badge above */}
              <rect
                x={-38} y={-40}
                width={76} height={22}
                rx={11}
                fill="#1e3a5f"
                filter="url(#shadow)"
              />
              <text
                x={0} y={-25}
                textAnchor="middle"
                fontSize={9}
                fill="white"
                fontFamily="sans-serif"
                fontWeight={700}
                letterSpacing={0.5}
              >
                Entrepot · BE · 24h
              </text>
            </Marker>
          </ComposableMap>
        </div>
      </div>
    </>
  );
}
