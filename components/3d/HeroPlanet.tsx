"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// HeroPlanet: planeta central interactivo del Hero.
// - Esfera con MeshDistortMaterial naranja (distort sube al hacer hover)
// - Arrastrable con OrbitControls, rota en useFrame y flota con <Float>
// - 2 anillos wireframe orbitando a distintas velocidades
// - Texto flotante con la propuesta de valor
// IMPORTANTE: importar via dynamic(ssr:false) (ver HeroPlanetWrapper).

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  OrbitControls,
  Text,
} from "@react-three/drei";
import * as THREE from "three";

function Planet({ isMobile }: { isMobile: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  // MeshDistortMaterial expone `distort` como propiedad mutable; ref laxo via Mesh.
  const matRef = useRef<{ distort: number } | null>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const scale = isMobile ? 0.8 : 1.2;

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.25;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.15;
    }
    // Interpolar el distort suavemente hacia el objetivo (hover vs idle).
    if (matRef.current) {
      const targetDistort = hovered && !isMobile ? 0.8 : 0.4;
      matRef.current.distort +=
        (targetDistort - matRef.current.distort) * 0.08;
    }
  });

  return (
    <Float speed={1.5} floatIntensity={0.3} rotationIntensity={0.4}>
      <group scale={scale}>
        {/* Esfera central distorsionada */}
        <mesh
          ref={meshRef}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <sphereGeometry args={[1, 64, 64]} />
          <MeshDistortMaterial
            ref={matRef as React.Ref<never>}
            color="#f06400"
            distort={0.4}
            speed={2}
            roughness={0}
            metalness={0.1}
          />
        </mesh>

        {/* Ring 1: rotado 45deg en X, wireframe naranja */}
        <mesh ref={ring1Ref} rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[2.2, 0.008, 16, 120]} />
          <meshBasicMaterial color="#f06400" transparent opacity={0.7} />
        </mesh>

        {/* Ring 2: rotado -30deg en X, mas sutil */}
        <mesh ref={ring2Ref} rotation={[-Math.PI / 6, 0, 0]}>
          <torusGeometry args={[2.8, 0.005, 16, 120]} />
          <meshBasicMaterial color="#f06400" transparent opacity={0.35} />
        </mesh>

        {/* Texto flotante con la propuesta de valor */}
        <Float speed={1} floatIntensity={0.3}>
          <Text
            fontSize={0.15}
            color="#c0c0c0"
            position={[2.5, 1.5, 0]}
            maxWidth={3}
            anchorX="left"
          >
            Cloud & DevOps · Data · AI
          </Text>
        </Float>
      </group>
    </Float>
  );
}

export default function HeroPlanet() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      dpr={[1, isMobile ? 1 : 2]}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 3]} color="#f06400" intensity={2} />
      <pointLight position={[-3, -2, 2]} color="#ffffff" intensity={0.6} />
      <Planet isMobile={isMobile} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </Canvas>
  );
}
