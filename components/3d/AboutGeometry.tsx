"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// AboutGeometry: 3 formas geometricas que flotan alrededor del contenido de About
// y reaccionan al mouse (se acercan/alejan). El emissive del torus pulsa.
// IMPORTANTE: importar via dynamic(ssr:false) (ver AboutGeometryWrapper).

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function Shapes({
  mouse,
  isMobile,
}: {
  mouse: React.RefObject<{ x: number; y: number }>;
  isMobile: boolean;
}) {
  const icoRef = useRef<THREE.Mesh>(null);
  const octaRef = useRef<THREE.Mesh>(null);
  const torusRef = useRef<THREE.Mesh>(null);
  const torusMat = useRef<THREE.MeshStandardMaterial>(null);

  // Posiciones base de cada forma.
  const bases: Record<string, THREE.Vector3> = {
    ico: new THREE.Vector3(-3, 1, -2),
    octa: new THREE.Vector3(3.5, -1, -1),
    torus: new THREE.Vector3(0, 2.5, -3),
  };

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const mx = mouse.current?.x ?? 0;
    const my = mouse.current?.y ?? 0;

    if (icoRef.current) {
      icoRef.current.rotation.x = t * 0.2;
      icoRef.current.rotation.y = t * 0.15;
      // Reacciona al mouse: se desplaza ligeramente.
      icoRef.current.position.x = bases.ico.x + mx * 0.6;
      icoRef.current.position.y = bases.ico.y + my * 0.4;
    }
    if (octaRef.current) {
      octaRef.current.rotation.y = t * 0.4;
      octaRef.current.rotation.z = t * 0.2;
      octaRef.current.position.x = bases.octa.x - mx * 0.5;
      octaRef.current.position.y = bases.octa.y - my * 0.3;
    }
    if (torusRef.current) {
      torusRef.current.rotation.x = t * 0.3;
      torusRef.current.position.x = bases.torus.x + mx * 0.3;
    }
    if (torusMat.current) {
      // El emissive pulsa con el tiempo.
      torusMat.current.emissiveIntensity = 0.5 + Math.sin(t) * 0.4;
    }
  });

  return (
    <>
      {/* Icosahedron wireframe naranja, flotacion lenta */}
      <Float speed={1} floatIntensity={0.6} rotationIntensity={0.2}>
        <mesh ref={icoRef} position={bases.ico.toArray()}>
          <icosahedronGeometry args={[0.8, 0]} />
          <meshBasicMaterial color="#f06400" wireframe transparent opacity={0.6} />
        </mesh>
      </Float>

      {/* Octahedron semi-transparente naranja */}
      <mesh ref={octaRef} position={bases.octa.toArray()}>
        <octahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial
          color="#f06400"
          transparent
          opacity={0.35}
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>

      {/* Torus naranja con emissive pulsante */}
      {!isMobile && (
        <Float speed={1.4} floatIntensity={0.5}>
          <mesh ref={torusRef} position={bases.torus.toArray()}>
            <torusGeometry args={[0.5, 0.18, 24, 80]} />
            <meshStandardMaterial
              ref={torusMat}
              color="#c44a00"
              emissive="#f06400"
              emissiveIntensity={0.5}
              roughness={0.4}
            />
          </mesh>
        </Float>
      )}
    </>
  );
}

export default function AboutGeometry() {
  const [isMobile, setIsMobile] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("resize", check);
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 55 }}
      dpr={[1, isMobile ? 1 : 2]}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[4, 4, 4]} color="#f06400" intensity={1.5} />
      <pointLight position={[-4, -2, 2]} color="#ffffff" intensity={0.4} />
      <Shapes mouse={mouse} isMobile={isMobile} />
    </Canvas>
  );
}
