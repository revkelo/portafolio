"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// ContactScene: cuando Contact entra en viewport (IntersectionObserver), las
// particulas convergen hacia el centro con GSAP y forman una esfera/anillo
// brillante naranja que pulsa.
// IMPORTANTE: importar via dynamic(ssr:false) (ver ContactSceneWrapper).

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "gsap";

const COUNT = 220;

function Particles({ converged }: { converged: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const startedRef = useRef(false);

  // Posiciones dispersas iniciales (se mutan con GSAP al converger).
  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, []);

  // Al converger: animar cada particula hacia un anillo alrededor del centro.
  useEffect(() => {
    if (!converged || startedRef.current) return;
    const geo = pointsRef.current?.geometry;
    if (!geo) return;
    startedRef.current = true;

    const attr = geo.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;

    for (let i = 0; i < COUNT; i++) {
      // Destino: anillo/esfera de radio ~1.6 alrededor del centro.
      const a = (i / COUNT) * Math.PI * 2;
      const r = 1.4 + Math.random() * 0.4;
      const tx = Math.cos(a) * r;
      const ty = Math.sin(a) * r * 0.6;
      const tz = (Math.random() - 0.5) * 0.6;

      const proxy = { x: arr[i * 3], y: arr[i * 3 + 1], z: arr[i * 3 + 2] };
      gsap.to(proxy, {
        x: tx,
        y: ty,
        z: tz,
        duration: 2,
        delay: i * 0.004,
        ease: "power3.inOut",
        onUpdate: () => {
          arr[i * 3] = proxy.x;
          arr[i * 3 + 1] = proxy.y;
          arr[i * 3 + 2] = proxy.z;
          attr.needsUpdate = true;
        },
      });
    }
  }, [converged]);

  useFrame(({ clock }) => {
    if (pointsRef.current && converged) {
      pointsRef.current.rotation.z += 0.002;
    }
    if (coreRef.current) {
      const pulse = 1 + Math.sin(clock.elapsedTime * 1.5) * 0.12;
      coreRef.current.scale.setScalar(converged ? pulse : 0.001);
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#f06400"
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>

      {/* Nucleo brillante que aparece y pulsa al converger */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#f06400"
          emissive="#f06400"
          emissiveIntensity={1.5}
          toneMapped={false}
          transparent
          opacity={0.85}
        />
      </mesh>
    </group>
  );
}

export default function ContactScene() {
  const [isMobile, setIsMobile] = useState(false);
  const [converged, setConverged] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // IntersectionObserver: dispara la convergencia al entrar en viewport.
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setConverged(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={hostRef} className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, isMobile ? 1 : 2]}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[3, 3, 3]} color="#f06400" intensity={2} />
        <Particles converged={converged} />
      </Canvas>
    </div>
  );
}
