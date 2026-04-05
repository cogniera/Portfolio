"use client";

import { Component, ReactNode, useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations, MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";

useGLTF.preload("/lotus_flower_blooming_animation.glb");

const LOTUS_CONFIGS = [
  { x: -3.5, z: -1.5, scale: 0.9,  depthFactor: 0.6,  delay: 0    },
  { x:  0.5, z: -2.5, scale: 1.1,  depthFactor: 1.0,  delay: 0.08 },
  { x:  3.2, z: -1.0, scale: 0.75, depthFactor: 0.4,  delay: 0.15 },
  { x: -1.5, z:  0.5, scale: 0.85, depthFactor: 0.7,  delay: 0.05 },
  { x:  2.0, z:  1.2, scale: 1.0,  depthFactor: 0.85, delay: 0.12 },
  { x: -4.5, z:  0.8, scale: 0.65, depthFactor: 0.3,  delay: 0.2  },
  { x:  4.8, z: -0.3, scale: 0.7,  depthFactor: 0.5,  delay: 0.18 },
];

/* ─── Responsive camera: reacts to resize AND zoom ───────────────── */
function ResponsiveCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    // size.width already reflects CSS pixel width after zoom
    const fov = size.width < 480 ? 78 : size.width < 768 ? 68 : size.width < 1024 ? 60 : 52;
    (camera as THREE.PerspectiveCamera).fov = fov;
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  return null;
}

/* ─── Single lotus instance ──────────────────────────────────────── */
function LotusInstance({
  x, z, scale, depthFactor, delay, scrollOffset,
}: {
  x: number; z: number; scale: number;
  depthFactor: number; delay: number;
  scrollOffset: React.MutableRefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const { scene: origScene, animations } = useGLTF("/lotus_flower_blooming_animation.glb");
  const clonedScene = useMemo(() => origScene.clone(true), [origScene]);
  const { mixer, actions } = useAnimations(animations, clonedScene);

  useEffect(() => {
    const action = Object.values(actions)[0];
    if (!action) return;
    action.play();
    action.paused = true;
    action.time = 0;
  }, [actions]);

  useFrame(() => {
    const raw = Math.max(0, Math.min(1, (scrollOffset.current * 4) - delay));
    const eased = raw < 0.5
      ? 2 * raw * raw
      : 1 - Math.pow(-2 * raw + 2, 2) / 2;

    const action = Object.values(actions)[0];
    if (action) {
      action.time = eased * action.getClip().duration;
      mixer.update(0);
    }

    if (groupRef.current) {
      groupRef.current.position.y = -0.5 + eased * depthFactor * 0.4;
    }
  });

  return (
    <group ref={groupRef} position={[x, -0.5, z]} scale={scale} rotation={[0.45, 0, 0]}>
      <primitive object={clonedScene} />
    </group>
  );
}

/* ─── Pond water with real reflection ────────────────────────────── */
function Pond() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
      <planeGeometry args={[30, 30]} />
      <MeshReflectorMaterial
        blur={[300, 80]}
        mixBlur={0.9}
        mixStrength={70}
        roughness={0.85}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#DDDAF8"
        metalness={0.1}
        mirror={0.6}
      />
    </mesh>
  );
}

/* ─── Full scene ─────────────────────────────────────────────────── */
function LotusScene({ scrollOffset }: { scrollOffset: React.MutableRefObject<number> }) {
  return (
    <>
      <ResponsiveCamera />
      <fog attach="fog" args={["#FFFFFF", 7, 20]} />
      <ambientLight color="#C8C4F4" intensity={1.2} />
      <directionalLight position={[-4, 8, 4]} intensity={1.8} color="#F0EEFF" />
      <directionalLight position={[4, 2, -4]} intensity={0.4} color="#AFA9EC" />
      <Pond />
      {LOTUS_CONFIGS.map((cfg, i) => (
        <LotusInstance key={i} {...cfg} scrollOffset={scrollOffset} />
      ))}
    </>
  );
}

/* ─── Error boundary ─────────────────────────────────────────────── */
class GLBErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/* ─── Canvas wrapper ─────────────────────────────────────────────── */
export default function LotusBackground() {
  const scrollOffset = useRef(0);

  useEffect(() => {
    function onScroll() {
      const max = document.body.scrollHeight - window.innerHeight;
      scrollOffset.current = max > 0 ? window.scrollY / max : 0;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <GLBErrorBoundary>
        <Canvas
          style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
          camera={{ position: [0, 2, 7], fov: 52 }}
          gl={{ antialias: true, alpha: true }}
        >
          <LotusScene scrollOffset={scrollOffset} />
        </Canvas>
      </GLBErrorBoundary>

      <p style={{
        position: "fixed",
        bottom: 12,
        left: 16,
        zIndex: 10,
        fontFamily: "Inter, sans-serif",
        fontSize: 10,
        color: "#BBBBBB",
        pointerEvents: "none",
        userSelect: "none",
      }}>
        Lotus model by Alexander Ruletik (CC-BY 4.0)
      </p>
    </>
  );
}
