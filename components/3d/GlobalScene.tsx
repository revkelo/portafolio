"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// GlobalScene: UN SOLO Canvas WebGL fijo que persiste en TODA la pagina.
//
// CONCEPTO: "Wave Field" — una superficie viva de puntos que ondea como un
// campo de datos o una funcion matematica. Elegante, organico, tecnico.
// Un grid NxN de puntos cuya altura (Y) oscila con ondas senoidales que parten
// del centro; una malla de lineas une los puntos (solo desktop) creando una red
// deformable; particulas mas brillantes flotan sobre la ola; una esfera emissive
// pulsa en el origen como fuente de la onda; todo sobre un cielo estrellado sutil.
//
// Objetos por seccion:
//   - WaveGrid      (siempre)        - WaveParticles (siempre)
//   - WaveMesh      (siempre, desktop)- CentralHalo   (siempre)
//   - Stars         (siempre, sutil) - CursorOrb (siempre, desktop)
//   - ScrollCamera  (siempre)
//
// Variacion por seccion (progress 0..1):
//   - hero:    amplitud normal, ola estandar
//   - about:   amplitud sube, ola mas dramatica
//   - stack:   frecuencia aumenta — ola mas rapida y compacta
//   - contact: los puntos convergen y se aplanan (amplitud -> 0)
//
// Reglas tecnicas:
//   - NO <Text> de drei (CDN de fuente crashea).
//   - NO <EffectComposer> (WebGL Context Lost con alpha:true).
//   - El glow naranja se logra via emissive en materiales + CSS.
//   - useMemo para posiciones/geometrias estaticas. Nunca crear objetos
//     Three.js dentro de useFrame; solo se reescriben BufferAttributes.
// IMPORTANTE: importar SIEMPRE via dynamic(ssr:false) (ver GlobalSceneWrapper).

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

// Paleta del Wave Field.
const ORANGE = "#f06400";
const ORANGE_DARK = "#c44a00";

// Parametros del grid.
const GRID_DESKTOP = 30; // 30x30 = 900 puntos
const GRID_MOBILE = 20; // 20x20 = 400 puntos
const SPACING = 0.35;

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

// Pesos por seccion leidos directo de progress.current en useFrame (sin state).
// Devuelve cuanto "pertenece" el progreso a cada seccion clave para mezclar
// amplitud / frecuencia / convergencia de forma continua.
function sectionWeights(p: number) {
  // Triangular-ish: 1 en el centro del rango, cae a 0 fuera con margen.
  const inRange = (a: number, b: number) => {
    const m = 0.05; // margen de transicion
    if (p <= a - m || p >= b + m) return 0;
    if (p < a) return (p - (a - m)) / m;
    if (p > b) return (b + m - p) / m;
    return 1;
  };
  return {
    about: inRange(SECTIONS.about[0], SECTIONS.about[1]),
    stack: inRange(SECTIONS.stack[0], SECTIONS.stack[1]),
    contact: inRange(SECTIONS.contact[0], SECTIONS.contact[1]),
  };
}

// ----------------------------------------------------------------------------
// WAVE GRID — los N*N puntos de la ola. La superficie principal.
// Comparte el array de posiciones con WaveMesh y WaveParticles via refs para
// que todos lean la misma altura de ola sin recalcular.
// ----------------------------------------------------------------------------
interface WaveShared {
  positions: Float32Array;
  n: number;
  half: number;
  // Estados interpolados (viven en RAF). Los lee WaveParticles tambien.
  amp: React.RefObject<number>;
  freq: React.RefObject<number>;
  flat: React.RefObject<number>; // 0..1 convergencia/aplanado (contact)
}

// Calcula la altura de la ola en un punto (x,z) dado el tiempo y estados.
function waveHeight(
  x: number,
  z: number,
  t: number,
  amp: number,
  freq: number,
  flat: number,
) {
  const dist = Math.sqrt(x * x + z * z);
  const y =
    amp *
    Math.sin(x * 1.2 * freq + t) *
    Math.cos(z * 0.8 * freq + t * 0.7) *
    Math.sin(dist * 0.5 - t * 1.2);
  return y * (1 - flat);
}

function WaveGrid({
  shared,
  progress,
}: {
  shared: WaveShared;
  progress: React.RefObject<number>;
}) {
  const pointsRef = useRef<THREE.Points>(null);

  // Posiciones iniciales del grid (x,z fijos; y se recalcula cada frame).
  const positions = shared.positions;

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const w = sectionWeights(progress.current ?? 0);

    // Targets por seccion.
    const targetAmp = 0.8 + w.about * 0.4; // about: amplitud sube a 1.2
    const targetFreq = 1 + w.stack * 0.9; // stack: frecuencia aumenta
    const targetFlat = w.contact; // contact: aplanar hacia 0

    // Interpolar estados de forma suave.
    const k = Math.min(1, delta * 2.2);
    shared.amp.current += (targetAmp - shared.amp.current) * k;
    shared.freq.current += (targetFreq - shared.freq.current) * k;
    shared.flat.current += (targetFlat - shared.flat.current) * k;

    const amp = shared.amp.current;
    const freq = shared.freq.current;
    const flat = shared.flat.current;
    const n = shared.n;
    const half = shared.half;

    // Recalcular Y de cada vertice.
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const idx = (i * n + j) * 3;
        const x = positions[idx] + 0; // x ya esta en el array
        const z = positions[idx + 2];
        positions[idx + 1] = waveHeight(x, z, t, amp, freq, flat);
      }
    }
    void half;

    const geo = pointsRef.current?.geometry;
    if (geo) {
      const attr = geo.getAttribute("position") as THREE.BufferAttribute;
      attr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color={ORANGE}
        transparent
        opacity={0.7}
        sizeAttenuation
        toneMapped={false}
      />
    </points>
  );
}

// ----------------------------------------------------------------------------
// WAVE MESH — la red de lineas entre puntos adyacentes del grid (solo desktop).
// Lee el MISMO array de posiciones que WaveGrid (ya actualizado este frame) y
// vuelca cada par adyacente en su propio buffer de lineas.
// ----------------------------------------------------------------------------
function WaveMesh({ shared }: { shared: WaveShared }) {
  const lineRef = useRef<THREE.LineSegments>(null);
  const n = shared.n;

  // Buffer de lineas: por cada celda, una arista horizontal y una vertical.
  // Cantidad de segmentos = horizontales + verticales.
  const segPositions = useMemo(() => {
    const horiz = n * (n - 1);
    const vert = (n - 1) * n;
    return new Float32Array((horiz + vert) * 2 * 3); // 2 vertices * 3 comps
  }, [n]);

  useFrame(() => {
    const src = shared.positions;
    const dst = segPositions;
    let s = 0;
    // Aristas horizontales: (i, j) -> (i, j+1).
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - 1; j++) {
        const a = (i * n + j) * 3;
        const b = (i * n + (j + 1)) * 3;
        dst[s++] = src[a];
        dst[s++] = src[a + 1];
        dst[s++] = src[a + 2];
        dst[s++] = src[b];
        dst[s++] = src[b + 1];
        dst[s++] = src[b + 2];
      }
    }
    // Aristas verticales: (i, j) -> (i+1, j).
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n; j++) {
        const a = (i * n + j) * 3;
        const b = ((i + 1) * n + j) * 3;
        dst[s++] = src[a];
        dst[s++] = src[a + 1];
        dst[s++] = src[a + 2];
        dst[s++] = src[b];
        dst[s++] = src[b + 1];
        dst[s++] = src[b + 2];
      }
    }
    const geo = lineRef.current?.geometry;
    if (geo) {
      const attr = geo.getAttribute("position") as THREE.BufferAttribute;
      attr.needsUpdate = true;
    }
  });

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[segPositions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        color={ORANGE}
        transparent
        opacity={0.12}
        toneMapped={false}
      />
    </lineSegments>
  );
}

// ----------------------------------------------------------------------------
// WAVE PARTICLES — particulas flotantes sobre la ola. Mas grandes y brillantes
// que los puntos del grid. Cada una sigue la altura de la ola en su (x,z) mas un
// offset propio que oscila suavemente.
// ----------------------------------------------------------------------------
function WaveParticles({
  shared,
  count,
}: {
  shared: WaveShared;
  count: number;
}) {
  const pointsRef = useRef<THREE.Points>(null);

  // Datos estaticos por particula: x, z y offset/fase de flotacion.
  const data = useMemo(() => {
    const xs = new Float32Array(count);
    const zs = new Float32Array(count);
    const offs = new Float32Array(count);
    const phases = new Float32Array(count);
    const span = shared.half * 2;
    for (let i = 0; i < count; i++) {
      xs[i] = (Math.random() - 0.5) * span;
      zs[i] = (Math.random() - 0.5) * span;
      offs[i] = 0.2 + Math.random() * 0.6; // offset sobre la ola
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { xs, zs, offs, phases };
  }, [count, shared.half]);

  const positions = useMemo(() => new Float32Array(count * 3), [count]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const amp = shared.amp.current;
    const freq = shared.freq.current;
    const flat = shared.flat.current;
    for (let i = 0; i < count; i++) {
      const x = data.xs[i];
      const z = data.zs[i];
      const baseY = waveHeight(x, z, t, amp, freq, flat);
      const floatY = data.offs[i] * (1 - flat) + Math.sin(t + data.phases[i]) * 0.08;
      positions[i * 3] = x;
      positions[i * 3 + 1] = baseY + floatY;
      positions[i * 3 + 2] = z;
    }
    const geo = pointsRef.current?.geometry;
    if (geo) {
      const attr = geo.getAttribute("position") as THREE.BufferAttribute;
      attr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#ff8c2a"
        transparent
        opacity={0.9}
        sizeAttenuation
        toneMapped={false}
      />
    </points>
  );
}

// ----------------------------------------------------------------------------
// CENTRAL HALO — esfera emissive en el origen. Pulsa con el reloj: es el
// "origen" de la ola de donde parten las ondas concentricas.
// ----------------------------------------------------------------------------
function CentralHalo() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const s = 1 + Math.sin(clock.elapsedTime * 1.6) * 0.18;
    meshRef.current.scale.setScalar(s);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.15, 24, 24]} />
      <meshStandardMaterial
        color={ORANGE}
        emissive={ORANGE}
        emissiveIntensity={3}
        roughness={0.2}
        metalness={0.2}
        toneMapped={false}
      />
    </mesh>
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
// Ajustada para la ola: vista desde arriba que deriva lateralmente.
// ----------------------------------------------------------------------------
const CAMERA_KEYS: { at: number; pos: [number, number, number] }[] = [
  { at: 0.0, pos: [0, 3, 8] },
  { at: 0.25, pos: [2, 2, 7] },
  { at: 0.5, pos: [-2, 1, 6] },
  { at: 0.75, pos: [1, 2, 7] },
  { at: 1.0, pos: [0, 2, 6] },
];

function ScrollCamera({ progress }: { progress: React.RefObject<number> }) {
  const target = useMemo(() => new THREE.Vector3(0, 3, 8), []);

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
// Contenido de la escena (dentro del Canvas). Construye el buffer compartido del
// grid y reacciona al mouse inclinando el plano de la ola.
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
  const groupRef = useRef<THREE.Group>(null);

  // Estados interpolados de la ola (compartidos por todos los sub-componentes).
  const amp = useRef(0.8);
  const freq = useRef(1);
  const flat = useRef(0);

  // Buffer del grid + posiciones x,z fijas. Una sola vez.
  const shared = useMemo<WaveShared>(() => {
    const n = isMobile ? GRID_MOBILE : GRID_DESKTOP;
    const half = ((n - 1) * SPACING) / 2;
    const positions = new Float32Array(n * n * 3);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const idx = (i * n + j) * 3;
        positions[idx] = -half + j * SPACING; // x
        positions[idx + 1] = 0; // y (se recalcula en RAF)
        positions[idx + 2] = -half + i * SPACING; // z
      }
    }
    return { positions, n, half, amp, freq, flat };
  }, [isMobile]);

  const particleCount = isMobile ? 30 : 70;

  // Reaccion al mouse: el plano de la ola se inclina ligeramente.
  useFrame(() => {
    const g = groupRef.current;
    if (!g || !mouse.current) return;
    g.rotation.x += (mouse.current.y * 0.08 - g.rotation.x) * 0.05;
    g.rotation.y += (mouse.current.x * 0.08 - g.rotation.y) * 0.05;
  });

  return (
    <>
      {/* Iluminacion: el halo y los emissive llevan el peso del color. */}
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 4, 2]} color={ORANGE} intensity={2.2} distance={20} decay={2} />
      <pointLight position={[-5, 2, -3]} color={ORANGE_DARK} intensity={1} />
      <pointLight position={[5, 1, 4]} color="#ff8c42" intensity={0.8} />

      {/* Cielo estrellado muy sutil — la ola es la protagonista. */}
      <Stars
        radius={120}
        depth={60}
        count={isMobile ? 600 : starCount}
        factor={3}
        saturation={0}
        fade
        speed={0.3}
      />

      <ScrollCamera progress={progress} />
      {!isMobile && <CursorOrb mouse={mouse} />}

      {/* Campo de ola: grid de puntos + malla de lineas + particulas + halo. */}
      <group ref={groupRef}>
        <WaveGrid shared={shared} progress={progress} />
        {!isMobile && <WaveMesh shared={shared} />}
        <WaveParticles shared={shared} count={particleCount} />
        <CentralHalo />
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

  const starCount = isMobile ? 600 : 1500;

  return (
    <Canvas
      frameloop="always"
      camera={{ position: [0, 3, 8], fov: 60 }}
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
