"use client";
import { useEffect, useRef } from "react";

// ── Coordinates calibrated to delivery-map.png (1536×1024) ──────────────────
// User adjustments: WAREHOUSE right+down, NL down, DE left+down, LU left+down, FR right
const WAREHOUSE = { left: 44, top: 48 };

const COUNTRIES = [
  { key: "nl", flag: "🇳🇱", label: "Pays-Bas",   code: "NL", delay: "48h", left: 46,  top: 37 },
  { key: "de", flag: "🇩🇪", label: "Allemagne",  code: "DE", delay: "48h", left: 54,  top: 43 },
  { key: "lu", flag: "🇱🇺", label: "Luxembourg", code: "LU", delay: "24h", left: 47,  top: 54 },
  { key: "fr", flag: "🇫🇷", label: "France",     code: "FR", delay: "48h", left: 39,  top: 63 },
  { key: "it", flag: "🇮🇹", label: "Italie",     code: "IT", delay: "72h", left: 53,  top: 77 },
];

export default function InteractiveDeliveryMap() {
  const svgRef      = useRef<SVGSVGElement>(null);
  const wrapRef     = useRef<HTMLDivElement>(null);
  const imgRef      = useRef<HTMLImageElement>(null);
  const tooltipRef  = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          // 1 — map entrance
          const img = imgRef.current;
          if (img) {
            img.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
            img.style.opacity    = "1";
            img.style.transform  = "scale(1)";
          }
          // 2 — rest of animations after entrance starts
          setTimeout(runAnimations, 300);
        }
      },
      { threshold: 0.3 }
    );
    if (wrapRef.current) observer.observe(wrapRef.current);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function runAnimations() {
    const svg = svgRef.current;
    if (!svg) return;

    COUNTRIES.forEach((c, i) => {
      // Fade in glow track
      const glow = svg.querySelector(`#glow-${c.key}`) as SVGLineElement | null;
      if (glow) {
        setTimeout(() => {
          glow.style.transition = "opacity 0.5s ease";
          glow.style.opacity    = "0.18";
        }, i * 250);
      }

      // Draw dashed line
      const line = svg.querySelector(`#line-${c.key}`) as SVGLineElement | null;
      if (line) {
        const x1  = parseFloat(line.getAttribute("x1")!);
        const y1  = parseFloat(line.getAttribute("y1")!);
        const x2  = parseFloat(line.getAttribute("x2")!);
        const y2  = parseFloat(line.getAttribute("y2")!);
        const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) * 10;
        line.style.strokeDashoffset = String(len);
        setTimeout(() => {
          line.style.transition        = "stroke-dashoffset 1s ease-in-out";
          line.style.strokeDashoffset  = "0";
          // restore dash pattern after draw completes
          setTimeout(() => {
            line.style.transition       = "none";
            line.style.strokeDasharray  = "2 1.5";
            line.style.strokeDashoffset = "0";
          }, 1050);
        }, i * 250);
      }
    });

    // Country badges
    COUNTRIES.forEach((c, i) => {
      const badge = document.getElementById(`badge-${c.key}`);
      if (!badge) return;
      setTimeout(() => {
        badge.style.opacity   = "1";
        badge.style.transform = "translate(-50%, -100%) translateY(0px)";
      }, 1400 + i * 150);
    });

    // Warehouse badge
    const wb = document.getElementById("warehouse-badge");
    if (wb) setTimeout(() => { wb.style.opacity = "1"; }, 300);

    // Pulse rings
    ["r1", "r2", "r3"].forEach((id, i) => {
      const r = document.getElementById(id);
      if (!r) return;
      function pulse() {
        if (!r) return;
        r.style.transition = "none";
        r.style.transform  = "scale(1)";
        r.style.opacity    = "0.6";
        setTimeout(() => {
          r!.style.transition = "transform 1.8s ease-out, opacity 1.8s ease-out";
          r!.style.transform  = "scale(3.5)";
          r!.style.opacity    = "0";
        }, 50);
        setTimeout(pulse, 1800);
      }
      setTimeout(pulse, i * 600);
    });

    // Traveling dots — trigger SMIL via beginElement
    COUNTRIES.forEach((c, i) => {
      const motionEl = svg.querySelector(`#motion-${c.key}`) as SVGAnimationElement | null;
      const opacEl   = svg.querySelector(`#opac-${c.key}`)   as SVGAnimationElement | null;
      if (motionEl && opacEl) {
        setTimeout(() => {
          motionEl.beginElement();
          opacEl.beginElement();
        }, 1600 + i * 300);
      }
    });
  }

  function handleBadgeEnter(c: typeof COUNTRIES[0], el: HTMLDivElement) {
    // Tooltip
    const tooltip = tooltipRef.current;
    const wrap    = wrapRef.current;
    if (tooltip && wrap) {
      const bRect = el.getBoundingClientRect();
      const wRect = wrap.getBoundingClientRect();
      tooltip.innerHTML = `${c.flag} <strong>${c.label}</strong> — Livraison en <strong>${c.delay}</strong>`;
      tooltip.style.left    = `${bRect.left - wRect.left + bRect.width / 2}px`;
      tooltip.style.top     = `${bRect.top  - wRect.top}px`;
      tooltip.style.opacity = "1";
    }
    // Highlight line
    const line = svgRef.current?.querySelector(`#line-${c.key}`) as SVGLineElement | null;
    if (line) { line.style.strokeWidth = "0.9"; line.style.opacity = "1"; }
    // Badge scale
    el.style.transform  = "translate(-50%, -100%) translateY(0px) scale(1.08)";
    el.style.boxShadow  = "0 6px 22px rgba(232,115,42,0.38)";
    el.style.borderColor = "rgba(232,115,42,0.65)";
  }

  function handleBadgeLeave(c: typeof COUNTRIES[0], el: HTMLDivElement) {
    if (tooltipRef.current) tooltipRef.current.style.opacity = "0";
    const line = svgRef.current?.querySelector(`#line-${c.key}`) as SVGLineElement | null;
    if (line) { line.style.strokeWidth = "0.6"; line.style.opacity = "0.8"; }
    el.style.transform   = "translate(-50%, -100%) translateY(0px)";
    el.style.boxShadow   = "0 4px 16px rgba(232,115,42,0.15)";
    el.style.borderColor = "rgba(232,115,42,0.3)";
  }

  return (
    // Outer spotlight wrapper
    <div style={{
      background:    "radial-gradient(ellipse at center, rgba(232,115,42,0.07) 0%, transparent 68%)",
      borderRadius:  "16px",
      padding:       "2px",
    }}>
      <div
        ref={wrapRef}
        style={{ position: "relative", width: "100%", borderRadius: "12px", overflow: "hidden" }}
      >
        {/* ── Map image (entrance-animated) ─────────────────────────── */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src="/images/delivery-map.png"
          alt="Zone de livraison"
          style={{
            width:     "100%",
            height:    "auto",
            display:   "block",
            opacity:   0,
            transform: "scale(0.97)",
          }}
          draggable={false}
        />

        {/* ── SVG overlay ───────────────────────────────────────────── */}
        <svg
          ref={svgRef}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
          aria-hidden="true"
        >
          <defs>
            <filter id="dotGlow" x="-150%" y="-150%" width="400%" height="400%">
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Glow tracks (white, behind dashes) */}
          {COUNTRIES.map((c) => (
            <line
              key={`glow-${c.key}`}
              id={`glow-${c.key}`}
              x1={WAREHOUSE.left} y1={WAREHOUSE.top}
              x2={c.left}         y2={c.top}
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0"
            />
          ))}

          {/* Animated dashed orange lines */}
          {COUNTRIES.map((c) => (
            <line
              key={`line-${c.key}`}
              id={`line-${c.key}`}
              x1={WAREHOUSE.left} y1={WAREHOUSE.top}
              x2={c.left}         y2={c.top}
              stroke="#E8732A"
              strokeWidth="0.6"
              strokeLinecap="round"
              strokeDasharray="2 1.5"
              opacity="0.8"
            />
          ))}

          {/* Traveling dots (SMIL animateMotion, begin="indefinite") */}
          {COUNTRIES.map((c) => (
            <circle key={`dot-${c.key}`} r="0.9" fill="#E8732A" opacity="0" filter="url(#dotGlow)">
              <animateMotion
                id={`motion-${c.key}`}
                begin="indefinite"
                dur="2.5s"
                repeatCount="indefinite"
                path={`M ${WAREHOUSE.left},${WAREHOUSE.top} L ${c.left},${c.top}`}
              />
              <animate
                id={`opac-${c.key}`}
                attributeName="opacity"
                begin="indefinite"
                values="0;1;1;0"
                keyTimes="0;0.08;0.85;1"
                dur="2.5s"
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </svg>

        {/* ── Pins layer ────────────────────────────────────────────── */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>

          {/* Warehouse pin */}
          <div style={{
            position:       "absolute",
            left:           `${WAREHOUSE.left}%`,
            top:            `${WAREHOUSE.top}%`,
            transform:      "translate(-50%, -100%)",
            display:        "flex",
            flexDirection:  "column",
            alignItems:     "center",
          }}>
            {/* "Entrepôt" badge */}
            <div
              id="warehouse-badge"
              style={{
                background:    "#1e3a5f",
                color:         "#fff",
                borderRadius:  "99px",
                padding:       "4px 12px",
                fontSize:      "11px",
                fontWeight:    700,
                whiteSpace:    "nowrap",
                marginBottom:  "5px",
                opacity:       0,
                transition:    "opacity 0.4s ease",
                letterSpacing: "0.02em",
                boxShadow:     "0 2px 10px rgba(30,58,95,0.35)",
              }}
            >
              Entrepôt · BE · 24h
            </div>

            {/* Teardrop pin + pulse rings */}
            <div style={{ position: "relative", width: "18px", height: "24px" }}>
              {/* Rings centered on pin-head (circle center at SVG y≈8 → top = 8-9 = -1px) */}
              {["r1", "r2", "r3"].map((id) => (
                <div
                  key={id}
                  id={id}
                  style={{
                    position:     "absolute",
                    width:        "18px",
                    height:       "18px",
                    top:          "-1px",
                    left:         0,
                    borderRadius: "50%",
                    border:       "2px solid #E8732A",
                    opacity:      0,
                    pointerEvents:"none",
                  }}
                />
              ))}
              {/* SVG teardrop — tip at bottom (y=23), head circle at cy=8 */}
              <svg
                width="18" height="24"
                viewBox="0 0 18 24"
                style={{ display: "block", position: "relative", zIndex: 2 }}
              >
                <path
                  d="M 9,23 C 1,16 1,12 1,8 A 8,8 0 1,1 17,8 C 17,12 17,16 9,23 Z"
                  fill="#1e3a5f"
                />
                <circle cx="9" cy="8" r="3.5" fill="white" opacity="0.92" />
              </svg>
            </div>
          </div>

          {/* Country badges */}
          {COUNTRIES.map((c) => (
            <div
              key={`badge-${c.key}`}
              id={`badge-${c.key}`}
              onMouseEnter={(e) => handleBadgeEnter(c, e.currentTarget as HTMLDivElement)}
              onMouseLeave={(e) => handleBadgeLeave(c, e.currentTarget as HTMLDivElement)}
              style={{
                position:            "absolute",
                left:                `${c.left}%`,
                top:                 `${c.top}%`,
                transform:           "translate(-50%, -100%) translateY(8px)",
                background:          "rgba(255,255,255,0.92)",
                backdropFilter:      "blur(8px)",
                WebkitBackdropFilter:"blur(8px)",
                border:              "1.5px solid rgba(232,115,42,0.3)",
                borderRadius:        "99px",
                padding:             "5px 14px",
                fontSize:            "13px",
                fontWeight:          600,
                color:               "#7a4010",
                whiteSpace:          "nowrap",
                cursor:              "pointer",
                opacity:             0,
                transition:          "opacity 0.4s ease, transform 0.4s ease, box-shadow 0.2s, border-color 0.2s",
                display:             "flex",
                alignItems:          "center",
                gap:                 "5px",
                boxShadow:           "0 4px 16px rgba(232,115,42,0.15)",
                zIndex:              10,
              }}
            >
              <span style={{ width: "7px", height: "7px", background: "#E8732A", borderRadius: "50%", flexShrink: 0 }} />
              {c.code} · {c.delay}
            </div>
          ))}
        </div>

        {/* ── Tooltip ───────────────────────────────────────────────── */}
        <div
          ref={tooltipRef}
          style={{
            position:    "absolute",
            background:  "#1e3a5f",
            color:       "#fff",
            borderRadius:"12px",
            borderTop:   "2px solid #E8732A",
            padding:     "12px 16px",
            fontSize:    "12px",
            lineHeight:  "1.55",
            pointerEvents:"none",
            opacity:     0,
            transition:  "opacity 0.18s",
            whiteSpace:  "nowrap",
            zIndex:      100,
            transform:   "translate(-50%, -130%)",
            boxShadow:   "0 4px 16px rgba(0,0,0,0.22)",
          }}
        />
      </div>
    </div>
  );
}
