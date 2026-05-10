"use client";

import { useEffect, useRef } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  shape: 0 | 1 | 2 | 3 | 4;
  rotation: number;
  rgba: string;
  boundR: number; // half bounding-box used for bounce & repulsion
  hexR: number;   // hex bolt radius (used only for shape 0)
}

// ── Colors ─────────────────────────────────────────────────────────────────
const NAVY   = "rgba(26,58,92,0.3)";
const ORANGE = "rgba(217,126,58,0.25)";

// ── Shape drawers ──────────────────────────────────────────────────────────
// ctx is already translated to particle center and rotated.

/** 1. Boulon hexagonal — 14–20px (radius 7–10) */
function drawHexBolt(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    const x = r * Math.cos(a);
    const y = r * Math.sin(a);
    if (i === 0) { ctx.moveTo(x, y); } else { ctx.lineTo(x, y); }
  }
  ctx.closePath();
  ctx.stroke();
  // Inner circle (socket)
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.36, 0, Math.PI * 2);
  ctx.stroke();
}

/** 2. Joint torique — outer r=12, inner r=7 */
function drawORing(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.arc(0, 0, 12, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 7, 0, Math.PI * 2);
  ctx.stroke();
}

/** 3. Rondelle — outer r=10, inner r=5 */
function drawWasher(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.stroke();
}

/** 4. Vis — 8px wide, 18px tall, tête hexagonale + trait horizontal */
function drawScrew(ctx: CanvasRenderingContext2D) {
  // Hex head centered at (0, -5) — radius 3.5 → width ≈ 7px, height ≈ 6px
  const hr = 3.5;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i;
    const x = hr * Math.cos(a);
    const y = -5 + hr * Math.sin(a);
    if (i === 0) { ctx.moveTo(x, y); } else { ctx.lineTo(x, y); }
  }
  ctx.closePath();
  ctx.stroke();
  // Horizontal trait at head center
  ctx.beginPath();
  ctx.moveTo(-2.5, -5);
  ctx.lineTo(2.5, -5);
  ctx.stroke();
  // Shaft: 3px wide, from y=-1.5 to y=+9
  ctx.beginPath();
  ctx.rect(-1.5, -1.5, 3, 10.5);
  ctx.stroke();
}

/** 5. Courroie — 22px wide, 10px tall — ellipse + 2 poulies */
function drawBelt(ctx: CanvasRenderingContext2D) {
  const pr = 5; // pulley radius
  const cx = 6; // center-to-center half-distance → total width = 2*(pr+cx)=22
  // Left pulley
  ctx.beginPath();
  ctx.arc(-cx, 0, pr, 0, Math.PI * 2);
  ctx.stroke();
  // Right pulley
  ctx.beginPath();
  ctx.arc(cx, 0, pr, 0, Math.PI * 2);
  ctx.stroke();
  // Belt tangents
  ctx.beginPath();
  ctx.moveTo(-cx, -pr);
  ctx.lineTo(cx, -pr);
  ctx.moveTo(-cx, pr);
  ctx.lineTo(cx, pr);
  ctx.stroke();
}

// Bounding half-sizes per shape (for bounce margins)
const BOUND: [number, number, number, number, number] = [
  10, // hex bolt max radius
  12, // o-ring
  10, // washer
  11, // screw half-height
  11, // belt half-width
];

// ── Particle factory ───────────────────────────────────────────────────────
function makeParticle(w: number, h: number): Particle {
  const shape = Math.floor(Math.random() * 5) as 0 | 1 | 2 | 3 | 4;
  const hexR  = 7 + Math.random() * 3;          // 7–10 px (only for hex bolt)
  const boundR = shape === 0 ? hexR : BOUND[shape];

  const speed = 0.3 + Math.random() * 0.4;      // 0.3–0.7 px/frame
  const angle = Math.random() * Math.PI * 2;
  const vx = Math.cos(angle) * speed;
  const vy = Math.sin(angle) * speed;

  return {
    x: boundR + Math.random() * (w - 2 * boundR),
    y: boundR + Math.random() * (h - 2 * boundR),
    vx,
    vy,
    baseVx: vx,
    baseVy: vy,
    shape,
    rotation: Math.random() * Math.PI * 2,
    rgba: Math.random() < 0.7 ? NAVY : ORANGE,
    boundR,
    hexR,
  };
}

// ── Component ──────────────────────────────────────────────────────────────
export default function ParticlesBg() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const particles  = useRef<Particle[]>([]);
  const mouse      = useRef({ x: -9999, y: -9999 });
  const rafRef     = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ── Resize ──
    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width  = parent?.offsetWidth  ?? window.innerWidth;
      canvas.height = parent?.offsetHeight ?? window.innerHeight;
    };

    const init = () => {
      resize();
      particles.current = Array.from({ length: 50 }, () =>
        makeParticle(canvas.width, canvas.height)
      );
    };

    init();

    // ── Mouse (window-level — works even with pointer-events:none) ──
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mouse.current = { x: -9999, y: -9999 }; };

    // ── Animation ──
    const REPULSE_DIST     = 130;
    const REPULSE_STRENGTH = 0.10;
    const RETURN_LERP      = 0.016;
    const MAX_SPEED        = 1.8;

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 1.2;

      for (const p of particles.current) {
        // Repulsion
        const dx   = p.x - mouse.current.x;
        const dy   = p.y - mouse.current.y;
        const dist = Math.hypot(dx, dy);
        if (dist < REPULSE_DIST && dist > 0) {
          const force = ((REPULSE_DIST - dist) / REPULSE_DIST) * REPULSE_STRENGTH;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Speed cap
        const spd = Math.hypot(p.vx, p.vy);
        if (spd > MAX_SPEED) { p.vx *= MAX_SPEED / spd; p.vy *= MAX_SPEED / spd; }

        // Drift back toward base velocity
        p.vx += (p.baseVx - p.vx) * RETURN_LERP;
        p.vy += (p.baseVy - p.vy) * RETURN_LERP;

        // Move + rotate
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += 0.005;

        // Bounce
        const m = p.boundR;
        if (p.x < m)               { p.x = m;                p.vx = Math.abs(p.vx);  p.baseVx = Math.abs(p.baseVx);  }
        if (p.x > canvas.width - m){ p.x = canvas.width - m; p.vx = -Math.abs(p.vx); p.baseVx = -Math.abs(p.baseVx); }
        if (p.y < m)               { p.y = m;                p.vy = Math.abs(p.vy);  p.baseVy = Math.abs(p.baseVy);  }
        if (p.y > canvas.height- m){ p.y = canvas.height - m;p.vy = -Math.abs(p.vy); p.baseVy = -Math.abs(p.baseVy); }

        // Draw
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.strokeStyle = p.rgba;

        switch (p.shape) {
          case 0: drawHexBolt(ctx, p.hexR); break;
          case 1: drawORing(ctx);           break;
          case 2: drawWasher(ctx);          break;
          case 3: drawScrew(ctx);           break;
          case 4: drawBelt(ctx);            break;
        }

        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    tick();

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", init);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", init);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0, pointerEvents: "none", background: "transparent" }}
    />
  );
}
