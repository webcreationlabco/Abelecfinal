"use client";

/**
 * CinematicIntro — desktop only (<768px renders null).
 *
 * WHY CSS sticky instead of GSAP pin:true
 * GSAP pin:true physically moves DOM nodes, which causes React's
 * reconciler to throw "NotFoundError: removeChild". CSS sticky pins
 * the panel in the browser compositor without touching the DOM, so
 * React and GSAP coexist safely.
 *
 * Structure:
 *   <wrapper  style={{ height: "400vh" }}>          ← creates scroll room
 *     <sticky style={{ position:"sticky", top:0 }}> ← browser-pinned panel
 *       <Canvas />   <TextOverlay />   <HeroSlide />
 *     </sticky>
 *   </wrapper>
 *
 * ScrollTrigger watches the wrapper (start:"top top", end:"+=300vh"),
 * giving exactly 300 vh of scroll-linked progress (0→1) while the
 * sticky panel is visible. scrub:1 = 1-second lag for smoothness.
 */

import { useRef, useEffect, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Search } from "lucide-react";
import { useT } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger);

// ─── shared anim target (GSAP writes / useFrame reads) ────────────────────────
type AnimTarget = {
  rotY: number;
  scaleAll: number;
  posX: number;
  posY: number;
  opacity: number;
};

// ── Clear Three.js default scene background ───────────────────────────────────
function SceneSetup() {
  const { scene, gl } = useThree();
  useEffect(() => {
    scene.background = null;
    gl.setClearColor(0x000000, 0);
  }, [scene, gl]);
  return null;
}

// ── 3D Model ──────────────────────────────────────────────────────────────────
const BASE_SCALE = 2.15; // fills ~60% of viewport height at scaleAll=0.85

function WashingMachineModel({ target }: { target: React.MutableRefObject<AnimTarget> }) {
  const { scene: rawScene } = useGLTF("/washing-machine.glb");
  // Clone so this instance owns its scene graph & materials independently
  const scene = useMemo(() => rawScene.clone(true), [rawScene]);
  const groupRef = useRef<THREE.Group>(null);
  const matsRef  = useRef<THREE.MeshStandardMaterial[]>([]);

  // Cache materials once — avoid per-frame scene traversal
  useEffect(() => {
    const mats: THREE.MeshStandardMaterial[] = [];
    scene.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;
      const arr  = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      arr.forEach((m) => {
        const mat = m as THREE.MeshStandardMaterial;
        mat.transparent = true;
        mat.opacity     = 0;
        mats.push(mat);
      });
    });
    matsRef.current = mats;
  }, [scene]);

  // Write GSAP-driven values directly to Three.js — no React state
  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;
    const { rotY, scaleAll, posX, posY, opacity } = target.current;
    g.rotation.y = rotY;
    g.scale.setScalar(BASE_SCALE * scaleAll);
    g.position.set(posX, posY, 0);
    matsRef.current.forEach((m) => { m.opacity = opacity; });
  });

  return <primitive ref={groupRef} object={scene} />;
}

// ── Inner content ─────────────────────────────────────────────────────────────
function CinematicIntroContent() {
  const t = useT();

  // Wrapper creates the 400 vh scroll space; sticky child is the visual panel
  const wrapperRef     = useRef<HTMLDivElement>(null);
  const textBlockRef   = useRef<HTMLDivElement>(null);
  const line1Ref       = useRef<HTMLSpanElement>(null);
  const line2Ref       = useRef<HTMLSpanElement>(null);
  const line3Ref       = useRef<HTMLSpanElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  const target = useRef<AnimTarget>({
    rotY: 0, scaleAll: 0.85, posX: 0, posY: -0.42, opacity: 0,
  });

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const ctx = gsap.context(() => {

      // 1. Entry — fires on load, not scroll-driven
      gsap.to(target.current, {
        opacity: 1,
        posY: -0.05,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.15,
      });

      // 2. Scroll-driven timeline
      //    trigger = wrapper (400 vh)
      //    end "+=300vh" → progress 0→1 over the pinned 300 vh window
      //    NO pin:true — CSS sticky handles the visual pinning
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "+=300vh",
          scrub: 1,
        },
      });

      // Full Y rotation over entire scroll
      tl.to(target.current, { rotY: Math.PI * 2, ease: "none", duration: 1 }, 0);

      // Scale: up 0.85→1.1 (0–60%), down 1.1→0.78 (60–100%)
      tl.to(target.current, { scaleAll: 1.1,  ease: "power1.inOut", duration: 0.6 }, 0);
      tl.to(target.current, { scaleAll: 0.78, ease: "power2.in",    duration: 0.4 }, 0.6);

      // Drift right — final 30% (70–100%)
      tl.to(target.current, { posX: 1.45, ease: "power2.inOut", duration: 0.3 }, 0.7);

      // Text line 1: 15–35%
      tl.fromTo(line1Ref.current,
        { opacity: 0, y: 34 },
        { opacity: 1, y: 0, ease: "power2.out", duration: 0.2 },
        0.15);

      // Text line 2: 35–55%
      tl.fromTo(line2Ref.current,
        { opacity: 0, y: 34 },
        { opacity: 1, y: 0, ease: "power2.out", duration: 0.2 },
        0.35);

      // Text line 3: 55–75%
      tl.fromTo(line3Ref.current,
        { opacity: 0, y: 34 },
        { opacity: 1, y: 0, ease: "power2.out", duration: 0.2 },
        0.55);

      // Text block fades out: 75–85%
      tl.to(textBlockRef.current,
        { opacity: 0, ease: "power1.in", duration: 0.1 },
        0.75);

      // Hero content slides in from left: 75–100%
      tl.fromTo(heroContentRef.current,
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, ease: "power2.out", duration: 0.25 },
        0.75);

    }, wrapper);

    return () => ctx.revert();
  }, []);

  return (
    // Outer wrapper — 400 vh tall, no overflow clipping
    <div ref={wrapperRef} style={{ height: "400vh" }}>

      {/* Sticky panel — browser pins this, not GSAP */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "#F5F0E8",
        }}
      >
        {/* ── Full-screen R3F canvas ──────────────────────────────────────── */}
        <Canvas
          camera={{ position: [0, 0.2, 4.5], fov: 42 }}
          gl={{ alpha: true, antialias: true }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            background: "transparent",
          }}
        >
          <SceneSetup />

          <ambientLight intensity={0.2} color="#fff8f2" />
          <directionalLight position={[4, 5, 3]}    intensity={1.2} color="#fff5e0" />
          <directionalLight position={[-4, 1.5, 2]} intensity={0.6} color="#e4eeff" />
          <directionalLight position={[0.5, 3, -5]} intensity={0.4} color="#ffffff" />

          <Suspense fallback={null}>
            <WashingMachineModel target={target} />
          </Suspense>
        </Canvas>

        {/* ── Scroll text — centered below machine ──────────────────────────── */}
        <div
          ref={textBlockRef}
          className="absolute inset-0 flex flex-col items-center justify-end pointer-events-none z-10"
          style={{ paddingBottom: "16vh" }}
        >
          <span
            ref={line1Ref}
            className="block font-slab text-abelec-navy-ink font-bold leading-[1.1] text-center"
            style={{ fontSize: "clamp(26px, 4vw, 58px)", opacity: 0, willChange: "opacity, transform" }}
          >
            La pièce détachée
          </span>
          <span
            ref={line2Ref}
            className="block font-slab text-abelec-navy-ink font-bold leading-[1.1] text-center"
            style={{ fontSize: "clamp(26px, 4vw, 58px)", opacity: 0, willChange: "opacity, transform" }}
          >
            électroménager
          </span>
          <span
            ref={line3Ref}
            className="block font-slab text-abelec-orange italic font-bold leading-[1.2] text-center mt-1"
            style={{ fontSize: "clamp(26px, 4vw, 58px)", opacity: 0, willChange: "opacity, transform" }}
          >
            depuis 1983.
          </span>
        </div>

        {/* ── Hero content — slides in from left during transition ──────────── */}
        <div
          ref={heroContentRef}
          className="absolute inset-y-0 left-0 flex flex-col justify-center z-20"
          style={{
            width: "48%",
            paddingLeft: "clamp(32px, 6vw, 96px)",
            paddingRight: "24px",
            opacity: 0,
            willChange: "opacity, transform",
          }}
        >
          <p className="eyebrow mb-4">EST. · {t("hero.eyebrow")}</p>

          <h1 className="mb-5">
            <span className="block">{t("hero.title1")}</span>
            <span className="block text-abelec-orange italic font-medium">
              {t("hero.title2")}
            </span>
          </h1>

          <p className="text-[17px] text-abelec-muted leading-relaxed mb-7">
            {t("hero.sub1")}{" "}
            <strong className="text-abelec-navy-ink">{t("hero.sub2")}</strong>
          </p>

          <div
            className="relative bg-white rounded-2xl flex items-center"
            style={{
              height: "64px",
              border: "2px solid rgba(26,58,92,0.15)",
              boxShadow: "0 8px 40px rgba(26,58,92,0.10)",
            }}
          >
            <div className="flex items-center flex-1 px-5 min-w-0">
              <Search size={17} strokeWidth={2} className="text-abelec-muted-2 shrink-0 mr-3" />
              <span className="text-abelec-muted-2 text-[15px]">
                Référence, marque, modèle...
              </span>
            </div>
            <div className="pr-2 shrink-0">
              <span
                className="bg-abelec-orange text-white font-bold text-[14px] px-5 rounded-xl flex items-center gap-2"
                style={{ height: "50px" }}
              >
                <Search size={15} strokeWidth={2.2} />
                {t("hero.searchBtn")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-5 flex-wrap mt-3">
            {([t("hero.searchMeta1"), t("hero.searchMeta2"), t("hero.searchMeta3")] as string[]).map((label, i) => (
              <span key={i} className="flex items-center gap-1.5 text-[11px] text-abelec-muted-2 font-mono">
                <span
                  className="w-[5px] h-[5px] rounded-full shrink-0"
                  style={{ background: "rgba(217,126,58,0.45)" }}
                />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Public export — skips the intro on mobile ─────────────────────────────────
export default function CinematicIntro() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (window.innerWidth >= 768) setShow(true);
  }, []);

  if (!show) return null;
  return <CinematicIntroContent />;
}

useGLTF.preload("/washing-machine.glb");
