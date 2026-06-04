"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// GlobalScene: Canvas 3D fijo que persiste en TODA la pagina (fondo del viaje).
// Contiene: campo de estrellas, particulas que reaccionan al mouse, cursor 3D
// con trail, y una camara que se mueve segun el progreso de scroll.
// IMPORTANTE: importar SIEMPRE via dynamic(ssr:false) (ver GlobalSceneWrapper).

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

// Deteccion de mobile (se evalua una sola vez, en cliente).
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

// ----------------------------------------------------------------------------
// 5 + 7. Particulas que reaccionan al mouse (el grupo se inclina) + drift propio.
// ----------------------------------------------------------------------------
function MouseParticles({
  mouse,
  count,
}: {
  mouse: React.RefObject<{ x: number; y: number }>;
  count: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
    }
    if (groupRef.current && mouse.current) {
      // El grupo COMPLETO se inclina siguiendo la posicion del mouse.
      const targetX = mouse.current.y * 0.1;
      const targetY = mouse.current.x * 0.15;
      groupRef.current.rotation.x +=
        (targetX - groupRef.current.rotation.x) * 0.05;
      groupRef.current.rotation.y +=
        (targetY - groupRef.current.rotation.y) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color="#f06400"
          transparent
          opacity={0.5}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

// ----------------------------------------------------------------------------
// 7. Cursor 3D que sigue al mouse con lerp suave (deja sensacion de trail).
// ----------------------------------------------------------------------------
function CursorOrb({
  mouse,
}: {
  mouse: React.RefObject<{ x: number; y: number }>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (!meshRef.current || !mouse.current) return;
    // Mapear mouse normalizado (-1..1) al espacio 3D segun el viewport.
    target.set(
      (mouse.current.x * viewport.width) / 2,
      (mouse.current.y * viewport.height) / 2,
      2,
    );
    meshRef.current.position.lerp(target, 0.1);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial
        color="#f06400"
        emissive="#f06400"
        emissiveIntensity={2}
        toneMapped={false}
      />
    </mesh>
  );
}

// ----------------------------------------------------------------------------
// 8. Camara que se mueve segun el progreso de scroll (lerp entre posiciones).
// ----------------------------------------------------------------------------
const CAMERA_KEYS: { at: number; pos: [number, number, number] }[] = [
  { at: 0.0, pos: [0, 0, 5] },
  { at: 0.25, pos: [1, 0.5, 4.5] },
  { at: 0.5, pos: [-1, -0.5, 4] },
  { at: 0.75, pos: [0.5, 1, 5] },
  { at: 1.0, pos: [0, 0, 3.5] },
];

function ScrollCamera({
  progress,
}: {
  progress: React.RefObject<number>;
}) {
  const target = useMemo(() => new THREE.Vector3(0, 0, 5), []);

  useFrame(({ camera }) => {
    const p = THREE.MathUtils.clamp(progress.current ?? 0, 0, 1);

    // Encontrar el segmento de keyframes en el que estamos e interpolar.
    let a = CAMERA_KEYS[0];
    let b = CAMERA_KEYS[CAMERA_KEYS.length - 1];
    for (let i = 0; i < CAMERA_KEYS.length - 1; i++) {
      if (p >= CAMERA_KEYS[i].at && p <= CAMERA_KEYS[i + 1].at) {
        a = CAMERA_KEYS[i];
        b = CAMERA_KEYS[i + 1];
        break;
      }
    }
    const span = b.at - a.at || 1;
    const local = (p - a.at) / span;
    target.set(
      THREE.MathUtils.lerp(a.pos[0], b.pos[0], local),
      THREE.MathUtils.lerp(a.pos[1], b.pos[1], local),
      THREE.MathUtils.lerp(a.pos[2], b.pos[2], local),
    );

    camera.position.lerp(target, 0.04);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ----------------------------------------------------------------------------
// Escena raiz.
// ----------------------------------------------------------------------------
export default function GlobalScene() {
  const isMobile = useIsMobile();
  const mouse = useRef({ x: 0, y: 0 });
  const progress = useRef(0);

  // Posicion del mouse normalizada (-1..1).
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Progreso de scroll 0..1.
  useEffect(() => {
    const onScroll = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      progress.current = docHeight > 0 ? window.scrollY / docHeight : 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const particleCount = isMobile ? 100 : 200;
  const starCount = isMobile ? 1500 : 3000;

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      dpr={[1, isMobile ? 1 : 2]}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.1} />
      <pointLight position={[5, 5, 5]} color="#f06400" intensity={1.2} />

      <Stars
        radius={100}
        depth={50}
        count={starCount}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      <MouseParticles mouse={mouse} count={particleCount} />
      {!isMobile && <CursorOrb mouse={mouse} />}
      <ScrollCamera progress={progress} />
    </Canvas>
  );
}
