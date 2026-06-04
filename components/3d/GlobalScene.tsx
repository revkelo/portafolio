"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// GlobalScene: UN SOLO Canvas WebGL fijo que persiste en TODA la pagina.
//
// CONCEPTO: "Digital Universe" — el codigo y el espacio se fusionan.
// La escena es un universo digital: un nucleo-servidor (Digital Core) rodeado
// de nodos de tecnologias conectados por lineas, streams de datos en helices,
// y un grid de red de fondo tipo Matrix. Todo sobre un cielo estrellado sutil.
//
// Objetos por seccion:
//   - DigitalCore   (siempre)        - DataStreams (siempre)
//   - NetworkGrid   (siempre)        - Stars (siempre, sutil)
//   - CursorOrb     (siempre, desktop) - ScrollCamera (siempre)
//   - AboutPillars  (visible solo en about)
//   - (stack)       las conexiones brillan + chispas viajan por las lineas
//   - (contact)     los nodos convergen hacia el centro
//
// Reglas tecnicas:
//   - NO <Text> de drei (CDN de fuente crashea).
//   - NO <EffectComposer> (WebGL Context Lost con alpha:true).
//   - El glow naranja se logra via emissive en materiales + CSS.
//   - useMemo para posiciones/geometrias estaticas. Nunca crear objetos
//     Three.js dentro de useFrame.
// IMPORTANTE: importar SIEMPRE via dynamic(ssr:false) (ver GlobalSceneWrapper).

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Stars, Line } from "@react-three/drei";
import * as THREE from "three";

// Paleta del Digital Universe.
const ORANGE = "#f06400";
const ORANGE_DARK = "#c44a00";

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
// NODOS DE TECNOLOGIAS — la "red de servicios" que orbita el Digital Core.
// ----------------------------------------------------------------------------
interface TechNode {
  color: string;
  label: string;
  r: number;
  speed: number;
  angle: number;
}

const TECH_NODES: TechNode[] = [
  { color: "#3776AB", label: "Python", r: 2.5, speed: 0.6, angle: 0 },
  { color: "#FF9900", label: "AWS", r: 3.2, speed: 0.4, angle: 1.05 },
  { color: "#2496ED", label: "Docker", r: 2.0, speed: 0.9, angle: 2.1 },
  { color: "#009688", label: "FastAPI", r: 3.5, speed: 0.5, angle: 3.14 },
  { color: "#3178C6", label: "TypeScript", r: 2.8, speed: 0.7, angle: 4.2 },
  { color: "#02569B", label: "Flutter", r: 2.2, speed: 1.0, angle: 5.24 },
];

// ----------------------------------------------------------------------------
// DIGITAL CORE + RED DE NODOS.
// Es el corazon de la escena: un icosaedro wireframe (nodo/servidor) con un
// core solido que pulsa, rodeado de 6 nodos que orbitan, cada uno conectado al
// centro por una linea. En "stack" las conexiones brillan y viajan chispas; en
// "contact" los nodos convergen hacia el centro.
// ----------------------------------------------------------------------------
function NodeOrbit({
  node,
  posRef,
  converge,
  brighten,
}: {
  node: TechNode;
  // Buffer compartido que escribimos cada frame para que la linea/chispa lo lean.
  posRef: React.RefObject<THREE.Vector3>;
  converge: React.RefObject<number>; // 0..1 hacia el centro (contact)
  brighten: React.RefObject<number>; // 0..1 brillo extra (stack)
}) {
  const ref = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * node.speed + node.angle;
    // Radio efectivo: se contrae hacia el centro cuando convergemos (contact).
    const r = node.r * (1 - converge.current * 0.92);
    const x = Math.cos(t) * r;
    const z = Math.sin(t) * r;
    const y = Math.sin(t * 0.5) * 0.4 * (1 - converge.current);
    ref.current.position.set(x, y, z);
    posRef.current.set(x, y, z);

    if (matRef.current) {
      matRef.current.emissiveIntensity = 1.1 + brighten.current * 1.6;
    }
  });

  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.14, 24, 24]} />
        <meshStandardMaterial
          ref={matRef}
          color={node.color}
          emissive={node.color}
          emissiveIntensity={1.1}
          roughness={0.3}
          metalness={0.5}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// Linea de conexion centro -> nodo. Reescribe sus puntos cada frame siguiendo
// la posicion viva del nodo. En stack sube su opacidad (brighten).
function NodeConnection({
  node,
  posRef,
  brighten,
}: {
  node: TechNode;
  posRef: React.RefObject<THREE.Vector3>;
  brighten: React.RefObject<number>;
}) {
  const lineRef = useRef<{
    geometry: THREE.BufferGeometry;
    material: THREE.Material & { opacity: number };
  }>(null);
  const points = useMemo(
    () => [new THREE.Vector3(0, 0, 0), new THREE.Vector3()],
    [],
  );

  useFrame(() => {
    const obj = lineRef.current;
    if (!obj) return;
    points[1].copy(posRef.current);
    obj.geometry.setFromPoints(points);
    obj.material.opacity = 0.25 + brighten.current * 0.55;
  });

  return (
    <Line
      // @ts-expect-error drei Line ref expone geometry/material en runtime
      ref={lineRef}
      points={[
        [0, 0, 0],
        [node.r, 0, 0],
      ]}
      color={node.color}
      lineWidth={0.8}
      transparent
      opacity={0.3}
    />
  );
}

// Chispa que viaja desde el centro hasta el nodo a lo largo de la linea.
// Solo visible/animada en stack (brighten > 0).
function NodeSpark({
  posRef,
  color,
  offset,
  brighten,
}: {
  posRef: React.RefObject<THREE.Vector3>;
  color: string;
  offset: number;
  brighten: React.RefObject<number>;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    // Progreso 0..1 que recorre la linea de forma ciclica.
    const tt = (clock.elapsedTime * 0.6 + offset) % 1;
    ref.current.position.copy(posRef.current).multiplyScalar(tt);
    const s = 0.04 + Math.sin(tt * Math.PI) * 0.03;
    ref.current.scale.setScalar(s * Math.max(0.001, brighten.current));
    if (matRef.current) {
      matRef.current.opacity = brighten.current;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial
        ref={matRef}
        color={color}
        transparent
        opacity={0}
        toneMapped={false}
      />
    </mesh>
  );
}

function DigitalCore({
  isMobile,
  inStack,
  inContact,
}: {
  isMobile: boolean;
  inStack: boolean;
  inContact: boolean;
}) {
  const wireRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  // Estados interpolados (viven en RAF, sin GSAP).
  const brighten = useRef(0); // stack: brillo de conexiones + chispas
  const converge = useRef(0); // contact: nodos hacia el centro

  // Posiciones vivas de cada nodo (compartidas con lineas/chispas).
  const nodePositions = useMemo(
    () => TECH_NODES.map(() => new THREE.Vector3()),
    [],
  );

  const scale = isMobile ? 0.9 : 1.4;

  useFrame(({ clock }, delta) => {
    // Interpolar estados de seccion.
    brighten.current +=
      ((inStack ? 1 : 0) - brighten.current) * Math.min(1, delta * 2.5);
    converge.current +=
      ((inContact ? 1 : 0) - converge.current) * Math.min(1, delta * 1.6);

    const t = clock.elapsedTime;
    if (wireRef.current) {
      wireRef.current.rotation.y += delta * 0.12;
      wireRef.current.rotation.x += delta * 0.05;
    }
    if (coreRef.current) {
      // El core del servidor pulsa de tamaño.
      coreRef.current.scale.setScalar(Math.sin(t) * 0.05 + 0.4);
    }
  });

  return (
    <Float speed={1.2} floatIntensity={0.25} rotationIntensity={0.2}>
      <group scale={scale}>
        {/* Luz interior que emana del core (compensa el bloom removido). */}
        <pointLight
          position={[0, 0, 0]}
          color={ORANGE}
          intensity={2.5}
          distance={9}
          decay={2}
        />

        {/* Icosaedro wireframe — el nodo/servidor central. */}
        <mesh ref={wireRef}>
          <icosahedronGeometry args={[1.2, 2]} />
          <meshBasicMaterial
            color={ORANGE}
            wireframe
            transparent
            opacity={0.6}
            toneMapped={false}
          />
        </mesh>

        {/* Core solido interior que pulsa — el "corazon" del servidor. */}
        <mesh ref={coreRef}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial
            color={ORANGE}
            emissive={ORANGE}
            emissiveIntensity={2.4}
            roughness={0.2}
            metalness={0.3}
            toneMapped={false}
          />
        </mesh>

        {/* Red de nodos: cada nodo + su linea + su chispa. */}
        {TECH_NODES.map((node, i) => (
          <group key={node.label}>
            <NodeOrbit
              node={node}
              posRef={{ current: nodePositions[i] }}
              converge={converge}
              brighten={brighten}
            />
            <NodeConnection
              node={node}
              posRef={{ current: nodePositions[i] }}
              brighten={brighten}
            />
            <NodeSpark
              posRef={{ current: nodePositions[i] }}
              color={node.color}
              offset={i / TECH_NODES.length}
              brighten={brighten}
            />
          </group>
        ))}
      </group>
    </Float>
  );
}

// ----------------------------------------------------------------------------
// DATA STREAMS — 3 helices de particulas (datos fluyendo por un cable).
// ----------------------------------------------------------------------------
const HELIX_POINTS = 150;

interface HelixDef {
  color: string;
  radius: number;
  phase: number;
  dir: number; // sentido de avance de la hélice
  rotSpeed: number;
}

const HELICES: HelixDef[] = [
  { color: ORANGE, radius: 2.2, phase: 0, dir: 1, rotSpeed: 0.08 },
  { color: ORANGE_DARK, radius: 2.8, phase: 2.1, dir: -1, rotSpeed: -0.05 },
  { color: "#ffffff", radius: 3.4, phase: 4.2, dir: 1, rotSpeed: 0.03 },
];

function Helix({ def, isMobile }: { def: HelixDef; isMobile: boolean }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(HELIX_POINTS * 3);
    const height = 16;
    const step = height / HELIX_POINTS;
    const turns = 6; // vueltas de la hélice
    for (let i = 0; i < HELIX_POINTS; i++) {
      const t = i * ((turns * Math.PI * 2) / HELIX_POINTS);
      arr[i * 3] = def.radius * Math.cos(t * def.dir + def.phase);
      arr[i * 3 + 1] = i * step - height / 2;
      arr[i * 3 + 2] = def.radius * Math.sin(t * def.dir + def.phase);
    }
    return arr;
  }, [def]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * def.rotSpeed;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={isMobile ? 0.05 : 0.07}
        color={def.color}
        transparent
        opacity={def.color === "#ffffff" ? 0.35 : 0.8}
        sizeAttenuation
      />
    </points>
  );
}

function DataStreams({ isMobile }: { isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {HELICES.map((def, i) => (
        <Helix key={i} def={def} isMobile={isMobile} />
      ))}
    </group>
  );
}

// ----------------------------------------------------------------------------
// NETWORK GRID — grid sutil de fondo (sensacion de espacio digital / Matrix).
// Se acerca lentamente a la camara con wrap-around.
// ----------------------------------------------------------------------------
const GRID_SIZE = 8;
const GRID_SPACING = 2;

function NetworkGrid() {
  const groupRef = useRef<THREE.Group>(null);

  // Geometria de un grid 8x8 (lineas H y V) construida una sola vez.
  const geometry = useMemo(() => {
    const half = (GRID_SIZE * GRID_SPACING) / 2;
    const pts: number[] = [];
    for (let i = 0; i <= GRID_SIZE; i++) {
      const o = -half + i * GRID_SPACING;
      // Linea horizontal.
      pts.push(-half, o, 0, half, o, 0);
      // Linea vertical.
      pts.push(o, -half, 0, o, half, 0);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(pts, 3),
    );
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    // Avanza hacia la camara y hace wrap para sensacion infinita.
    groupRef.current.position.z += delta * 0.4;
    if (groupRef.current.position.z > -4) {
      groupRef.current.position.z = -12;
    }
  });

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <group ref={groupRef} position={[0, 0, -8]}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial
          color={ORANGE}
          transparent
          opacity={0.04}
          toneMapped={false}
        />
      </lineSegments>
    </group>
  );
}

// ----------------------------------------------------------------------------
// ABOUT: 3 "pilares del stack" en orbita lenta (Cloud / Data / Code).
// ----------------------------------------------------------------------------
function AboutPillars({
  mouse,
  isMobile,
}: {
  mouse: React.RefObject<{ x: number; y: number }>;
  isMobile: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const cubeRef = useRef<THREE.Mesh>(null);
  const octaRef = useRef<THREE.Mesh>(null);
  const icoRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (groupRef.current && mouse.current) {
      // El conjunto reacciona suavemente al mouse.
      const ty = mouse.current.x * 0.3;
      const tx = mouse.current.y * 0.2;
      groupRef.current.rotation.y += (ty - groupRef.current.rotation.y) * 0.04;
      groupRef.current.rotation.x += (tx - groupRef.current.rotation.x) * 0.04;
    }
    if (cubeRef.current) {
      cubeRef.current.rotation.x = t * 0.3;
      cubeRef.current.rotation.y = t * 0.2;
    }
    if (octaRef.current) {
      octaRef.current.rotation.y = t * 0.4;
      octaRef.current.rotation.z = t * 0.2;
    }
    if (icoRef.current) {
      icoRef.current.rotation.x = t * 0.25;
      icoRef.current.rotation.y = t * 0.35;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Cloud — cubo wireframe naranja. */}
      <Float speed={1} floatIntensity={0.6} rotationIntensity={0.2}>
        <mesh ref={cubeRef} position={[-3.4, 1, -2]}>
          <boxGeometry args={[0.9, 0.9, 0.9]} />
          <meshBasicMaterial
            color={ORANGE}
            wireframe
            transparent
            opacity={0.7}
            toneMapped={false}
          />
        </mesh>
      </Float>

      {/* Data — octaedro wireframe naranja. */}
      <Float speed={1.3} floatIntensity={0.5} rotationIntensity={0.2}>
        <mesh ref={octaRef} position={[3.6, -1, -1]}>
          <octahedronGeometry args={[0.8, 0]} />
          <meshBasicMaterial
            color={ORANGE}
            wireframe
            transparent
            opacity={0.7}
            toneMapped={false}
          />
        </mesh>
      </Float>

      {/* Code — icosaedro pequeño emissive. */}
      {!isMobile && (
        <Float speed={1.5} floatIntensity={0.5} rotationIntensity={0.3}>
          <mesh ref={icoRef} position={[0, 2.6, -3]}>
            <icosahedronGeometry args={[0.55, 0]} />
            <meshStandardMaterial
              color={ORANGE_DARK}
              emissive={ORANGE}
              emissiveIntensity={1.6}
              roughness={0.3}
              toneMapped={false}
            />
          </mesh>
        </Float>
      )}
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
        color={ORANGE}
        emissive={ORANGE}
        emissiveIntensity={3}
        toneMapped={false}
      />
    </mesh>
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
  starCount,
}: {
  mouse: React.RefObject<{ x: number; y: number }>;
  progress: React.RefObject<number>;
  isMobile: boolean;
  starCount: number;
}) {
  const inAbout = useInSection(progress, SECTIONS.about);
  const inStack = useInSection(progress, SECTIONS.stack);
  const inContact = useInSection(progress, SECTIONS.contact);

  return (
    <>
      {/* Iluminacion dramatica. */}
      <ambientLight intensity={0.06} />
      <pointLight position={[5, 5, 5]} color={ORANGE} intensity={2} />
      <pointLight position={[-5, -3, 3]} color="#ff8c42" intensity={1} />
      <pointLight position={[0, -5, -2]} color="#1a0a00" intensity={0.5} />
      <pointLight position={[-3, 4, -3]} color="#0a0a1a" intensity={0.3} />

      {/* Cielo estrellado sutil (fondo del universo digital). */}
      <Stars
        radius={90}
        depth={50}
        count={starCount}
        factor={4}
        saturation={0}
        fade
        speed={0.4}
      />

      {/* Fondo: grid de red + streams de datos en helice. */}
      <NetworkGrid />
      <DataStreams isMobile={isMobile} />

      {!isMobile && <CursorOrb mouse={mouse} />}
      <ScrollCamera progress={progress} />

      {/* Digital Core: siempre visible, reacciona a stack/contact. */}
      <DigitalCore
        isMobile={isMobile}
        inStack={inStack}
        inContact={inContact}
      />

      {/* About: pilares del stack en orbita. */}
      <group visible={inAbout}>
        <AboutPillars mouse={mouse} isMobile={isMobile} />
      </group>
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

  const starCount = isMobile ? 600 : 1400;

  return (
    <Canvas
      frameloop="always"
      camera={{ position: [0, 0, 5], fov: 60 }}
      dpr={[1, isMobile ? 1 : 1.5]}
      gl={{
        alpha: true,
        antialias: !isMobile,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: false,
        stencil: false,
        depth: true,
      }}
      onCreated={({ gl }) => {
        // Previene que el navegador descarte el contexto WebGL al minimizar/cambiar tab.
        gl.domElement.addEventListener(
          "webglcontextlost",
          (e) => e.preventDefault(),
          false,
        );
      }}
      style={{ position: "fixed", inset: 0, zIndex: 0, background: "transparent" }}
    >
      <SceneContents
        mouse={mouse}
        progress={progress}
        isMobile={isMobile}
        starCount={starCount}
      />
    </Canvas>
  );
}
