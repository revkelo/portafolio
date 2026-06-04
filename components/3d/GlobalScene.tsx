"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// GlobalScene: UN SOLO Canvas WebGL fijo que persiste en TODA la pagina.
// Consolida todos los objetos 3D del sitio en un unico contexto WebGL para
// performance y consistencia visual:
//   - Stars (siempre)            - MouseParticles (siempre)
//   - CursorOrb (siempre, desktop) - ScrollCamera (siempre)
//   - HeroPlanetObjects   (visible solo en hero)
//   - AboutGeometryObjects (visible solo en about)
//   - TechOrbitObjects    (visible solo en stack)
//   - ContactParticles    (visible solo en contact)
// Post-processing: EffectComposer + Bloom para el glow naranja cinematografico.
// IMPORTANTE: importar SIEMPRE via dynamic(ssr:false) (ver GlobalSceneWrapper).

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Stars, Text } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

// Rangos de scroll por seccion (progress 0..1). Orden real de la pagina:
// hero, about, experience, stack, projects, contact.
const SECTIONS = {
  hero: [0.0, 0.22],
  about: [0.22, 0.42],
  experience: [0.42, 0.55],
  stack: [0.55, 0.72],
  projects: [0.72, 0.88],
  contact: [0.88, 1.0],
} as const;

// Hook: ¿el progress actual cae dentro del rango [a, b]? (con un pequeño margen
// para que la transicion de visibilidad no sea brusca en los bordes).
function useInSection(
  progress: React.RefObject<number>,
  range: readonly [number, number],
) {
  const [inSection, setInSection] = useState(range[0] <= 0.0001);
  useFrame(() => {
    const p = progress.current ?? 0;
    const visible = p >= range[0] - 0.04 && p <= range[1] + 0.04;
    setInSection((prev) => (prev === visible ? prev : visible));
  });
  return inSection;
}

// ----------------------------------------------------------------------------
// Particulas que reaccionan al mouse (el grupo se inclina) + drift propio.
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
          size={0.06}
          color="#ff6400"
          transparent
          opacity={0.7}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

// ----------------------------------------------------------------------------
// Cursor 3D que sigue al mouse con lerp suave (sensacion de trail). Brilla fuerte.
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
        emissiveIntensity={3}
        toneMapped={false}
      />
    </mesh>
  );
}

// ----------------------------------------------------------------------------
// HERO: planeta central naranja con emissive + 2 anillos orbitando + texto.
// (Antes vivia en HeroPlanet.tsx con su propio Canvas; ahora es un objeto mas.)
// ----------------------------------------------------------------------------
function HeroPlanetObjects({
  mouse,
  isMobile,
}: {
  mouse: React.RefObject<{ x: number; y: number }>;
  isMobile: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

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
    // El planeta orbita suavemente siguiendo el mouse (en vez de OrbitControls).
    if (groupRef.current && mouse.current) {
      const ty = mouse.current.x * 0.4;
      const tx = mouse.current.y * 0.25;
      groupRef.current.rotation.y +=
        (ty - groupRef.current.rotation.y) * 0.04;
      groupRef.current.rotation.x +=
        (tx - groupRef.current.rotation.x) * 0.04;
    }
  });

  return (
    <Float speed={1.5} floatIntensity={0.3} rotationIntensity={0.4}>
      <group ref={groupRef} scale={scale}>
        {/* Esfera central naranja con emissive (brilla con el bloom) */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial
            color="#f06400"
            emissive="#f06400"
            emissiveIntensity={0.6}
            roughness={0.2}
            metalness={0.3}
          />
        </mesh>

        {/* Ring 1: rotado 45deg en X, emissive fuerte */}
        <mesh ref={ring1Ref} rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[2.2, 0.012, 16, 120]} />
          <meshStandardMaterial
            color="#f06400"
            emissive="#f06400"
            emissiveIntensity={1.5}
            toneMapped={false}
          />
        </mesh>

        {/* Ring 2: rotado -30deg en X, mas sutil */}
        <mesh ref={ring2Ref} rotation={[-Math.PI / 6, 0, 0]}>
          <torusGeometry args={[2.8, 0.008, 16, 120]} />
          <meshStandardMaterial
            color="#f06400"
            emissive="#f06400"
            emissiveIntensity={1.2}
            toneMapped={false}
          />
        </mesh>

        {/* Texto flotante con la propuesta de valor */}
        {!isMobile && (
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
        )}
      </group>
    </Float>
  );
}

// ----------------------------------------------------------------------------
// ABOUT: 3 formas geometricas que flotan y reaccionan al mouse.
// ----------------------------------------------------------------------------
function AboutGeometryObjects({
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

  const bases = useMemo(
    () => ({
      ico: new THREE.Vector3(-3, 1, -2),
      octa: new THREE.Vector3(3.5, -1, -1),
      torus: new THREE.Vector3(0, 2.5, -3),
    }),
    [],
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const mx = mouse.current?.x ?? 0;
    const my = mouse.current?.y ?? 0;

    if (icoRef.current) {
      icoRef.current.rotation.x = t * 0.2;
      icoRef.current.rotation.y = t * 0.15;
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
      torusMat.current.emissiveIntensity = 1.2 + Math.sin(t) * 0.6;
    }
  });

  return (
    <>
      {/* Icosahedron wireframe naranja, flotacion lenta */}
      <Float speed={1} floatIntensity={0.6} rotationIntensity={0.2}>
        <mesh ref={icoRef} position={bases.ico.toArray()}>
          <icosahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial
            color="#f06400"
            emissive="#f06400"
            emissiveIntensity={1.4}
            wireframe
            toneMapped={false}
          />
        </mesh>
      </Float>

      {/* Octahedron naranja con emissive */}
      <mesh ref={octaRef} position={bases.octa.toArray()}>
        <octahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial
          color="#f06400"
          emissive="#f06400"
          emissiveIntensity={0.5}
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
              emissiveIntensity={1.2}
              roughness={0.4}
              toneMapped={false}
            />
          </mesh>
        </Float>
      )}
    </>
  );
}

// ----------------------------------------------------------------------------
// STACK: esferas de tecnologias orbitando un nucleo naranja.
// ----------------------------------------------------------------------------
interface TechItem {
  name: string;
  color: string;
  radius: number;
  speed: number;
  angle: number;
}

const TECH_ITEMS: TechItem[] = [
  { name: "Python", color: "#3776AB", radius: 2.5, speed: 0.8, angle: 0 },
  { name: "AWS", color: "#FF9900", radius: 3.2, speed: 0.5, angle: 1 },
  { name: "Docker", color: "#2496ED", radius: 2.0, speed: 1.1, angle: 2 },
  { name: "FastAPI", color: "#009688", radius: 3.8, speed: 0.7, angle: 3 },
  { name: "TypeScript", color: "#3178C6", radius: 2.8, speed: 0.9, angle: 4 },
  { name: "React", color: "#61DAFB", radius: 1.8, speed: 1.3, angle: 5 },
];

function OrbitingTech({ item }: { item: TechItem }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * item.speed + item.angle;
    ref.current.position.x = Math.cos(t) * item.radius;
    ref.current.position.z = Math.sin(t) * item.radius;
    ref.current.position.y = Math.sin(t * 0.5) * 0.4;
  });

  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.14, 24, 24]} />
        <meshStandardMaterial
          color={item.color}
          emissive={item.color}
          emissiveIntensity={1.1}
          roughness={0.3}
          metalness={0.5}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function TechOrbitObjects() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    // Posicionado bajo y atras para que orbite "detras" del contenido del stack.
    <group ref={groupRef} position={[0, -0.5, -1]}>
      {/* Nucleo naranja brillante */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#f06400"
          emissive="#f06400"
          emissiveIntensity={1.4}
          transparent
          opacity={0.7}
          roughness={0.2}
          toneMapped={false}
        />
      </mesh>
      {TECH_ITEMS.map((item) => (
        <OrbitingTech key={item.name} item={item} />
      ))}
    </group>
  );
}

// ----------------------------------------------------------------------------
// CONTACT: particulas que convergen en un anillo perfecto que pulsa.
// La convergencia arranca cuando la seccion entra en viewport (active=true).
// ----------------------------------------------------------------------------
const CONTACT_COUNT = 220;

function ContactParticles({
  active,
  isMobile,
}: {
  active: boolean;
  isMobile: boolean;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  // Estado de convergencia interpolado 0..1 (suave, sin GSAP para vivir en RAF).
  const conv = useRef(0);

  // Posiciones iniciales DENTRO del viewport + destino en anillo perfecto.
  const { start, ringTargets } = useMemo(() => {
    const start = new Float32Array(CONTACT_COUNT * 3);
    const ringTargets = new Float32Array(CONTACT_COUNT * 3);
    for (let i = 0; i < CONTACT_COUNT; i++) {
      // Inicio: disperso DENTRO del viewport visible.
      start[i * 3] = (Math.random() - 0.5) * 6;
      start[i * 3 + 1] = (Math.random() - 0.5) * 4;
      start[i * 3 + 2] = (Math.random() - 0.5) * 3;
      // Destino: anillo PERFECTO (radio fijo) con cos/sin.
      const a = (i / CONTACT_COUNT) * Math.PI * 2;
      const r = 1.7;
      ringTargets[i * 3] = Math.cos(a) * r;
      ringTargets[i * 3 + 1] = Math.sin(a) * r;
      ringTargets[i * 3 + 2] = 0;
    }
    return { start, ringTargets };
  }, []);

  // Buffer mutable que copia las posiciones iniciales.
  const positions = useMemo(() => start.slice(), [start]);

  useFrame(({ clock }, delta) => {
    // Avanzar/retroceder la convergencia segun visibilidad.
    const target = active ? 1 : 0;
    conv.current += (target - conv.current) * Math.min(1, delta * 1.6);
    const c = THREE.MathUtils.smoothstep(conv.current, 0, 1);

    const geo = pointsRef.current?.geometry;
    if (geo) {
      const attr = geo.getAttribute("position") as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;
      for (let i = 0; i < CONTACT_COUNT; i++) {
        arr[i * 3] = THREE.MathUtils.lerp(
          start[i * 3],
          ringTargets[i * 3],
          c,
        );
        arr[i * 3 + 1] = THREE.MathUtils.lerp(
          start[i * 3 + 1],
          ringTargets[i * 3 + 1],
          c,
        );
        arr[i * 3 + 2] = THREE.MathUtils.lerp(
          start[i * 3 + 2],
          ringTargets[i * 3 + 2],
          c,
        );
      }
      attr.needsUpdate = true;
    }

    if (pointsRef.current) {
      pointsRef.current.rotation.z += 0.002 * c;
    }
    if (coreRef.current) {
      const pulse = 1 + Math.sin(clock.elapsedTime * 1.5) * 0.12;
      coreRef.current.scale.setScalar(Math.max(0.001, c * pulse));
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={isMobile ? 0.05 : 0.07}
          color="#ff6400"
          transparent
          opacity={0.85}
          sizeAttenuation
        />
      </points>

      {/* Nucleo brillante que aparece y pulsa al converger */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#f06400"
          emissive="#f06400"
          emissiveIntensity={2}
          toneMapped={false}
          transparent
          opacity={0.85}
        />
      </mesh>
    </group>
  );
}

// ----------------------------------------------------------------------------
// Camara que se mueve segun el progreso de scroll (lerp entre keyframes).
// ----------------------------------------------------------------------------
const CAMERA_KEYS: { at: number; pos: [number, number, number] }[] = [
  { at: 0.0, pos: [0, 0, 5] },
  { at: 0.2, pos: [0.5, 0.2, 4.8] },
  { at: 0.4, pos: [-0.5, -0.3, 4.5] },
  { at: 0.6, pos: [0.8, 0.4, 5.2] },
  { at: 0.8, pos: [-0.3, 0.6, 4.8] },
  { at: 1.0, pos: [0, 0, 3.8] },
];

function ScrollCamera({ progress }: { progress: React.RefObject<number> }) {
  const target = useMemo(() => new THREE.Vector3(0, 0, 5), []);

  useFrame(({ camera }) => {
    const p = THREE.MathUtils.clamp(progress.current ?? 0, 0, 1);

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

    camera.position.lerp(target, 0.025);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ----------------------------------------------------------------------------
// Contenido de la escena (dentro del Canvas). Gestiona visibilidad por seccion.
// ----------------------------------------------------------------------------
function SceneContents({
  mouse,
  progress,
  isMobile,
  particleCount,
  starCount,
}: {
  mouse: React.RefObject<{ x: number; y: number }>;
  progress: React.RefObject<number>;
  isMobile: boolean;
  particleCount: number;
  starCount: number;
}) {
  const inHero = useInSection(progress, SECTIONS.hero);
  const inAbout = useInSection(progress, SECTIONS.about);
  const inStack = useInSection(progress, SECTIONS.stack);
  const inContact = useInSection(progress, SECTIONS.contact);

  return (
    <>
      {/* Iluminacion dramatica */}
      <ambientLight intensity={0.05} />
      <pointLight position={[5, 5, 5]} color="#f06400" intensity={2} />
      <pointLight position={[-5, -3, 3]} color="#ff8c42" intensity={1} />
      <pointLight position={[0, -5, -2]} color="#1a0a00" intensity={0.5} />
      {/* Luz de relleno fria muy sutil */}
      <pointLight position={[-3, 4, -3]} color="#0a0a1a" intensity={0.3} />

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

      {/* Objetos por seccion: visibles solo en su rango de scroll. Usamos
          <group visible> para no montar/desmontar y mantener fps estable. */}
      <group visible={inHero}>
        <HeroPlanetObjects mouse={mouse} isMobile={isMobile} />
      </group>

      <group visible={inAbout}>
        <AboutGeometryObjects mouse={mouse} isMobile={isMobile} />
      </group>

      <group visible={inStack}>
        <TechOrbitObjects />
      </group>

      <group visible={inContact}>
        <ContactParticles active={inContact} isMobile={isMobile} />
      </group>

      <EffectComposer>
        <Bloom
          intensity={0.8}
          luminanceThreshold={0.3}
          luminanceSmoothing={0.9}
          blendFunction={BlendFunction.ADD}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

// ----------------------------------------------------------------------------
// Escena raiz: un solo Canvas para todo el sitio.
// ----------------------------------------------------------------------------
export default function GlobalScene() {
  const mouse = useRef({ x: 0, y: 0 });
  const progress = useRef(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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
      <SceneContents
        mouse={mouse}
        progress={progress}
        isMobile={isMobile}
        particleCount={particleCount}
        starCount={starCount}
      />
    </Canvas>
  );
}
