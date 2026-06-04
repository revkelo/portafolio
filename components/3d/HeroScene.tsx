"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// HeroScene: escena 3D de R3F con orbe wireframe naranja + campo de particulas.
// IMPORTANTE: este componente debe importarse via dynamic(ssr:false) (ver HeroSceneWrapper).

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Campo de 800 particulas distribuidas en la superficie de una esfera de radio 3.5.
function Particles() {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 800;
    const radius = 3.5;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distribucion uniforme sobre la esfera.
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      arr[i * 3] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05;
      pointsRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#f06400"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Esfera central wireframe naranja que gira y pulsa suavemente.
function CoreSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
      meshRef.current.rotation.x += delta * 0.08;
      const scale = 1 + Math.sin(state.clock.elapsedTime) * 0.05;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.5, 2]} />
      <meshBasicMaterial color="#f06400" transparent opacity={0.15} wireframe />
    </mesh>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 55 }}
      style={{ background: "transparent" }}
      gl={{ alpha: true }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[2, 3, 1]} color="#f06400" intensity={1.5} />
      <Particles />
      <CoreSphere />
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.4}
        enableZoom={false}
        enablePan={false}
      />
    </Canvas>
  );
}
