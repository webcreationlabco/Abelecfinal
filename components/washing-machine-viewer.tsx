"use client";

import { Suspense, useEffect, useMemo, useRef, RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── Clears any default scene background so the canvas is truly transparent ──
function SceneSetup() {
  const { scene, gl } = useThree();
  useEffect(() => {
    scene.background = null;
    gl.setClearColor(0x000000, 0);
  }, [scene, gl]);
  return null;
}

// ── Model + all animations ────────────────────────────────────────────────────
function WashingMachineModel({ heroRef }: { heroRef: RefObject<HTMLElement | null> }) {
  const { scene: rawScene } = useGLTF("/washing-machine.glb");
  // Clone so this instance owns its own scene graph & materials
  // (prevents conflicts when cinematic-intro also loads the same GLB)
  const scene = useMemo(() => rawScene.clone(true), [rawScene]);
  const groupRef = useRef<THREE.Group>(null);

  // Target values (GSAP writes here)
  const target = useRef({ rotY: 0, scaleMult: 1.0, posX: 0.0, posY: -0.9, opacity: 0 });
  // Lerped values (useFrame reads/writes here → Three.js)
  const lerped = useRef({ rotY: 0, scaleMult: 1.0, posX: 0.0, posY: -0.9, opacity: 0 });

  // ── Initialise material transparency once ──────────────────────────────────
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((m) => {
          const mat = m as THREE.MeshStandardMaterial;
          mat.transparent = true;
          mat.opacity = 0;
        });
      }
    });
  }, [scene]);

  // ── GSAP animations ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!heroRef.current) return;

    // 1) Entry: fade in + drift up
    gsap.to(target.current, {
      opacity: 1,
      posY: -0.45,
      duration: 1.8,
      ease: "power3.out",
      delay: 0.25,
    });

    // 2) Scroll-driven: rotate, scale, drift left
    const scrollAnim = gsap.to(target.current, {
      rotY: Math.PI * 2,   // full 360°
      scaleMult: 1.15,      // 1.0 → 1.15
      posX: -0.45,          // drift left toward center
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,         // instant scrub — R3F lerp handles the easing
      },
    });

    return () => {
      scrollAnim.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [heroRef]);

  // ── Per-frame lerp → Three.js ──────────────────────────────────────────────
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Frame-rate independent lerp factor (~80 ms half-life)
    const k = 1 - Math.pow(0.003, delta);

    const l = lerped.current;
    const t = target.current;

    l.rotY     += (t.rotY     - l.rotY)     * k;
    l.scaleMult+= (t.scaleMult - l.scaleMult) * k;
    l.posX     += (t.posX     - l.posX)     * k;
    l.posY     += (t.posY     - l.posY)     * k;
    l.opacity  += (t.opacity  - l.opacity)  * k;

    const BASE_SCALE = 1.55;

    groupRef.current.rotation.y = l.rotY;
    groupRef.current.scale.setScalar(BASE_SCALE * l.scaleMult);
    groupRef.current.position.set(l.posX, l.posY, 0);

    // Apply opacity to every mesh material
    groupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((m) => {
          (m as THREE.MeshStandardMaterial).opacity = l.opacity;
        });
      }
    });
  });

  return <primitive ref={groupRef} object={scene} />;
}

// ── Public component ──────────────────────────────────────────────────────────
export default function WashingMachineViewer({
  heroRef,
  className = "",
}: {
  heroRef: RefObject<HTMLElement | null>;
  className?: string;
}) {
  return (
    <div className={`w-full h-full min-h-[420px] ${className}`}>
      <Canvas
        camera={{ position: [0, 0.6, 4.0], fov: 42 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <SceneSetup />

        {/* ── 3-point product lighting ─────────────────────────────────── */}

        {/* Base ambient — very low so lights do the work */}
        <ambientLight intensity={0.25} color="#fff8f2" />

        {/* Key: warm, top-right front */}
        <directionalLight
          position={[3.5, 5, 3]}
          intensity={2.0}
          color="#fff5e0"
        />

        {/* Fill: cool, left, mid height — softens shadows */}
        <directionalLight
          position={[-4, 1.5, 2]}
          intensity={0.7}
          color="#e4eeff"
        />

        {/* Rim: behind-top, very subtle — separates model from bg */}
        <directionalLight
          position={[0.5, 3, -5]}
          intensity={0.45}
          color="#ffffff"
        />

        <Suspense fallback={null}>
          <WashingMachineModel heroRef={heroRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/washing-machine.glb");
