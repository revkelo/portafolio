"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// TechOrbit: esferas que orbitan el centro a distintos radios/velocidades.
// Al hacer hover una esfera crece y aparece su label. Central sphere naranja.
// IMPORTANTE: importar via dynamic(ssr:false) (ver TechOrbitWrapper).

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface TechItem {
  name: string;
  color: string;
  radius: number;
  speed: number;
  angle: number;
}

const techItems: TechItem[] = [
  { name: "Python", color: "#3776AB", radius: 2.5, speed: 0.8, angle: 0 },
  { name: "AWS", color: "#FF9900", radius: 3.2, speed: 0.5, angle: 1 },
  { name: "Docker", color: "#2496ED", radius: 2.0, speed: 1.1, angle: 2 },
  { name: "FastAPI", color: "#009688", radius: 3.8, speed: 0.7, angle: 3 },
  { name: "TypeScript", color: "#3178C6", radius: 2.8, speed: 0.9, angle: 4 },
  { name: "React", color: "#61DAFB", radius: 1.8, speed: 1.3, angle: 5 },
];

function OrbitingTech({ item }: { item: TechItem }) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * item.speed + item.angle;
    ref.current.position.x = Math.cos(t) * item.radius;
    ref.current.position.z = Math.sin(t) * item.radius;
    ref.current.position.y = Math.sin(t * 0.5) * 0.4;

    const targetScale = hovered ? 1.8 : 1;
    ref.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.12,
    );
  });

  return (
    <group ref={ref}>
      <mesh
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <sphereGeometry args={[0.12, 24, 24]} />
        <meshStandardMaterial
          color={item.color}
          emissive={item.color}
          emissiveIntensity={hovered ? 0.8 : 0.3}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
      {hovered && (
        <Text
          fontSize={0.2}
          color="#ffffff"
          position={[0, 0.3, 0]}
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.004}
          outlineColor="#000000"
        >
          {item.name}
        </Text>
      )}
    </group>
  );
}

function Scene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central sphere naranja semi-transparente */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#f06400"
          emissive="#f06400"
          emissiveIntensity={0.6}
          transparent
          opacity={0.5}
          roughness={0.2}
        />
      </mesh>
      {techItems.map((item) => (
        <OrbitingTech key={item.name} item={item} />
      ))}
    </group>
  );
}

export default function TechOrbit() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 1.5, 7], fov: 50 }}
      dpr={[1, isMobile ? 1 : 2]}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 0]} color="#f06400" intensity={2} />
      <pointLight position={[5, 5, 5]} color="#ffffff" intensity={0.5} />
      <Scene />
    </Canvas>
  );
}
