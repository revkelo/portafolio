"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// GlobalScene: UN SOLO Canvas WebGL fijo que persiste en TODA la pagina.
//
// CONCEPTO: "Wave Field" — una superficie viva de puntos que ondea como un
// campo de datos o una funcion matematica. Elegante, organico, tecnico.
// Un grid NxN de puntos cuya altura (Y) oscila con ondas senoidales superpuestas
// que parten del centro; una malla de lineas une los puntos (solo desktop) creando
// una red deformable; particulas mas brillantes flotan sobre la ola; un sistema de
// anillos concentricos pulsa en el origen como fuente de la onda; todo sobre un
// cielo estrellado sutil. El cursor proyecta un ripple local sobre la ola.
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
//   - contact: los puntos convergen en espiral hacia dentro y se aplanan
//
// Interaccion del cursor:
//   - El mouse 2D se proyecta al plano Y=0 del mundo (raycaster) -> mouseWorld.
//   - Cada punto de la ola recibe un ripple local: una onda que decae con la
//     distancia al cursor, creando una distorsion viva donde pasa el mouse.
//   - Un CursorOrb (anillo + nucleo) se posa sobre la ola siguiendo mouseWorld.
//
// Reglas tecnicas:
//   - NO <Text> de drei (CDN de fuente crashea).
//   - NO <EffectComposer> (WebGL Context Lost con alpha:true).
//   - El glow naranja se logra via emissive en materiales + CSS.
//   - useMemo para posiciones/geometrias/Vector3/Plane/Raycaster estaticos.
//     Nunca crear objetos Three.js dentro de useFrame; solo se reescriben
//     BufferAttributes y se mutan vectores ya instanciados.
// IMPORTANTE: importar SIEMPRE via dynamic(ssr:false) (ver GlobalSceneWrapper).

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

// Paleta del Wave Field.
const ORANGE = "#ff6600";
const ORANGE_DARK = "#cc3300";
const MESH_LINE = "#ffd580"; // oro cálido — contrasta sobre el wave oscuro

// Hook: textura circular para que Points se vean como bolitas, no cuadrados.
function useCircleTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0,   "rgba(255,255,255,1)");
    g.addColorStop(0.55,"rgba(255,255,255,0.85)");
    g.addColorStop(1,   "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.fill();
    return new THREE.CanvasTexture(canvas);
  }, []);
}

// Gradiente de color por altura — contraste dramático: negro profundo → llama.
const COLOR_PEAK   = new THREE.Color("#ffa020"); // pico: naranja cálido
const COLOR_BASE   = new THREE.Color("#ff6800"); // medio: naranja puro
const COLOR_VALLEY = new THREE.Color("#1a0800"); // valle: casi negro cálido

// Parametros del grid.
const GRID_DESKTOP = 62; // 62x62 — cubre viewport desktop de punta a punta
const GRID_MOBILE  = 28; // 28x28 — mobile
const SPACING      = 0.82; // separacion amplia para cubrir todo el ancho

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
// WAVE SOLID — malla solida naranja semi-transparente que sigue exactamente
// los mismos vertices que WaveGrid. Da sensacion de ola de fuego/lava.
// ----------------------------------------------------------------------------
function WaveSolid({ shared }: { shared: WaveShared }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const n = shared.n;

  const indices = useMemo(() => {
    const idx = new Uint32Array((n - 1) * (n - 1) * 6);
    let ptr = 0;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - 1; j++) {
        const a = i * n + j;
        const b = i * n + j + 1;
        const c = (i + 1) * n + j;
        const d = (i + 1) * n + j + 1;
        idx[ptr++] = a; idx[ptr++] = b; idx[ptr++] = c;
        idx[ptr++] = b; idx[ptr++] = d; idx[ptr++] = c;
      }
    }
    return idx;
  }, [n]);

  // Colores del sólido — contraste profundo: negro → naranja-amarillento → blanco caliente
  const colorLow  = useMemo(() => new THREE.Color('#0d0400'), []); // negro-naranja
  const colorMid  = useMemo(() => new THREE.Color('#ff6800'), []); // naranja puro
  const colorHigh = useMemo(() => new THREE.Color('#000000'), []); // negro en pico

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setIndex(new THREE.BufferAttribute(indices, 1));
    const posCopy = new Float32Array(shared.positions.length);
    posCopy.set(shared.positions);
    geo.setAttribute('position', new THREE.BufferAttribute(posCopy, 3));
    // Buffer de colores por vertice (RGB, 3 valores por vertice)
    const colors = new Float32Array(shared.positions.length); // n*n * 3
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [shared.positions, indices]);

  useFrame(() => {
    if (!meshRef.current) return;
    const geo = meshRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const colAttr = geo.attributes.color as THREE.BufferAttribute;
    (posAttr.array as Float32Array).set(shared.positions);
    posAttr.needsUpdate = true;

    // Calcular gradiente segun altura Y + degradado por X (derecha más vivo)
    const amp = shared.amp.current || 1;
    const n = shared.positions.length / 3;
    const tmp = new THREE.Color();
    for (let i = 0; i < n; i++) {
      const x = shared.positions[i * 3];
      const y = shared.positions[i * 3 + 1];
      // 4 stops: negro → naranja → llama → blanco caliente en picos
      const norm = (y / amp); // ~-1..1
      if (norm >= 0.55) {
        // Pico absoluto: naranja → negro
        const tt = Math.min(1, (norm - 0.55) / 0.45);
        tmp.set(
          THREE.MathUtils.lerp(colorMid.r, 0.0, tt),
          THREE.MathUtils.lerp(colorMid.g, 0.0, tt),
          THREE.MathUtils.lerp(colorMid.b, 0.0, tt),
        );
      } else if (norm >= 0) {
        tmp.lerpColors(colorMid, colorHigh, norm / 0.55);
      } else if (norm >= -0.55) {
        tmp.lerpColors(colorLow, colorMid, (norm + 0.55) / 0.55);
      } else {
        tmp.copy(colorLow);
      }
      // Degradado por X: izquierda 40%, derecha 100%
      const xBright = 0.40 + ((x / shared.half) * 0.5 + 0.5) * 0.60;
      colAttr.setXYZ(i, tmp.r * xBright, tmp.g * xBright, tmp.b * xBright);
    }
    colAttr.needsUpdate = true;
    geo.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        vertexColors
        emissive="#ff6600"
        emissiveIntensity={1.5}
        roughness={0.08}
        metalness={0.15}
        transparent
        opacity={0.82}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}

// ----------------------------------------------------------------------------
// WAVE GRID — los N*N puntos de la ola. La superficie principal.
// Comparte el array de posiciones con WaveMesh y WaveParticles via refs para
// que todos lean la misma altura de ola sin recalcular. El mouseWorld tambien se
// comparte para que el ripple del cursor se aplique a la ola entera.
// ----------------------------------------------------------------------------
interface WaveShared {
  positions: Float32Array;
  n: number;
  half: number;
  // Estados interpolados (viven en RAF). Los lee WaveParticles tambien.
  amp: React.RefObject<number>;
  freq: React.RefObject<number>;
  flat: React.RefObject<number>; // 0..1 convergencia/aplanado (contact)
  // Proyeccion del cursor al plano Y=0 del mundo (origen del ripple).
  mouseWorld: THREE.Vector3;
  // Intensidad del ripple (sube cuando el cursor esta sobre la ola).
  rippleStrength: React.RefObject<number>;
}

// Altura base de la ola en (x,z): tres ondas senoidales superpuestas para un
// movimiento mas organico y menos repetitivo. Sin ripple ni convergencia (eso se
// aplica fuera para poder reutilizarla en particulas).
function waveBase(
  x: number,
  z: number,
  t: number,
  amp: number,
  freq: number,
) {
  const dist = Math.sqrt(x * x + z * z);
  const xf = x * freq;
  const zf = z * freq;
  const y =
    amp *
    (Math.sin(xf * 1.2 + t) *
      Math.cos(zf * 0.8 + t * 0.7) *
      Math.sin(dist * 0.5 - t * 1.2) *
      0.5 +
      Math.sin(xf * 0.7 - t * 1.3) * Math.cos(zf * 1.1 + t * 0.4) * 0.3 +
      Math.sin(xf * 2.1 + t * 0.8) * Math.cos(zf * 0.5 - t * 1.8) * 0.2);
  return y;
}

// Ripple local del cursor: una onda concentrica que decae exponencialmente con la
// distancia al mouseWorld. strength escala el efecto (0 = sin cursor sobre la ola).
function cursorRipple(
  x: number,
  z: number,
  t: number,
  mw: THREE.Vector3,
  strength: number,
) {
  if (strength <= 0.001) return 0;
  const dx = x - mw.x;
  const dz = z - mw.z;
  const mouseDist = Math.sqrt(dx * dx + dz * dz);
  const influence = Math.exp(-mouseDist * 1.5) * 0.6;
  return Math.sin(mouseDist * 3 - t * 4) * influence * strength;
}

function WaveGrid({
  shared,
  progress,
}: {
  shared: WaveShared;
  progress: React.RefObject<number>;
}) {
  const circleTex = useCircleTexture();
  const pointsRef = useRef<THREE.Points>(null);

  // Posiciones iniciales del grid (x,z fijos; y se recalcula cada frame).
  const positions = shared.positions;

  // x,z "de reposo" para poder converger en espiral en contact sin perder el
  // layout original cuando flat vuelve a 0.
  const restXZ = useMemo(() => {
    const arr = new Float32Array(positions.length);
    arr.set(positions);
    return arr;
  }, [positions]);

  // Colores por vertice (gradiente por altura). Se actualizan cada frame.
  const colors = useMemo(() => {
    const arr = new Float32Array((positions.length / 3) * 3);
    for (let i = 0; i < arr.length; i += 3) {
      arr[i] = COLOR_BASE.r;
      arr[i + 1] = COLOR_BASE.g;
      arr[i + 2] = COLOR_BASE.b;
    }
    return arr;
  }, [positions.length]);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const w = sectionWeights(progress.current ?? 0);

    // Targets por seccion.
    const targetAmp = 1.4 + w.about * 0.5; // about: amplitud sube
    const targetFreq = 1 + w.stack * 0.9; // stack: frecuencia aumenta
    const targetFlat = 0; // convergencia en contact desactivada — ola sigue normal

    // Interpolar estados de forma suave.
    const k = Math.min(1, delta * 2.2);
    shared.amp.current += (targetAmp - shared.amp.current) * k;
    shared.freq.current += (targetFreq - shared.freq.current) * k;
    shared.flat.current += (targetFlat - shared.flat.current) * k;

    const amp = shared.amp.current;
    const freq = shared.freq.current;
    const flat = shared.flat.current;
    const strength = shared.rippleStrength.current ?? 0;
    const mw = shared.mouseWorld;
    const n = shared.n;

    // Rango de altura para normalizar el gradiente de color (aprox).
    const ampSpan = Math.max(0.0001, amp);

    const geo = pointsRef.current?.geometry;
    const colorAttr = geo?.getAttribute("color") as
      | THREE.BufferAttribute
      | undefined;

    // Espiral hacia dentro en contact: a medida que flat sube, x,z se acercan al
    // centro con un giro proporcional a flat (sensacion de remolino).
    const spiralAngle = flat * 1.6;
    const cosA = Math.cos(spiralAngle);
    const sinA = Math.sin(spiralAngle);
    const pull = 1 - flat * 0.85; // 1 = sin convergencia, ->0.15 al aplanar

    // Recalcular X/Z (convergencia) e Y (ola + ripple) de cada vertice.
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const idx = (i * n + j) * 3;
        const rx = restXZ[idx];
        const rz = restXZ[idx + 2];

        // Convergencia en espiral hacia el centro (solo activa en contact).
        const x = (rx * cosA - rz * sinA) * pull;
        const z = (rx * sinA + rz * cosA) * pull;
        positions[idx] = x;
        positions[idx + 2] = z;

        // Altura: ola base aplanada por flat + ripple del cursor.
        let y = waveBase(x, z, t, amp, freq) * (1 - flat);
        y += cursorRipple(x, z, t, mw, strength) * (1 - flat * 0.5);
        positions[idx + 1] = y;

        // Gradiente 4 stops: negro → naranja → llama → blanco caliente en picos.
        if (colorAttr) {
          const ci = (i * n + j) * 3;
          const norm = THREE.MathUtils.clamp(y / ampSpan, -1, 1);
          let r: number, g: number, b: number;
          if (norm >= 0.6) {
            // Pico absoluto: naranja → negro
            const tt = (norm - 0.6) / 0.4;
            r = THREE.MathUtils.lerp(COLOR_PEAK.r, 0.0, tt);
            g = THREE.MathUtils.lerp(COLOR_PEAK.g, 0.0, tt);
            b = THREE.MathUtils.lerp(COLOR_PEAK.b, 0.0, tt);
          } else if (norm >= 0) {
            const tt = norm / 0.6;
            r = THREE.MathUtils.lerp(COLOR_BASE.r, COLOR_PEAK.r, tt);
            g = THREE.MathUtils.lerp(COLOR_BASE.g, COLOR_PEAK.g, tt);
            b = THREE.MathUtils.lerp(COLOR_BASE.b, COLOR_PEAK.b, tt);
          } else {
            const tt = -norm;
            r = THREE.MathUtils.lerp(COLOR_BASE.r, COLOR_VALLEY.r, tt);
            g = THREE.MathUtils.lerp(COLOR_BASE.g, COLOR_VALLEY.g, tt);
            b = THREE.MathUtils.lerp(COLOR_BASE.b, COLOR_VALLEY.b, tt);
          }
          // Degradado por X: izquierda 40%, derecha 100%
          const xBright = 0.40 + ((positions[idx] / shared.half) * 0.5 + 0.5) * 0.60;
          colors[ci] = r * xBright;
          colors[ci + 1] = g * xBright;
          colors[ci + 2] = b * xBright;
        }
      }
    }

    if (geo) {
      (geo.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
      if (colorAttr) colorAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={circleTex}
        alphaTest={0.2}
        size={0.060}
        vertexColors
        transparent
        opacity={0.95}
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
        color={MESH_LINE}
        transparent
        opacity={0.55}
        toneMapped={false}
      />
    </lineSegments>
  );
}

// ----------------------------------------------------------------------------
// WAVE PARTICLES — particulas flotantes sobre la ola. Mas grandes y brillantes
// que los puntos del grid. Cada una tiene velocidad propia, rebota en los limites
// del grid y deja una "estela" sutil via opacidad ligada a su velocidad.
// ----------------------------------------------------------------------------
function WaveParticles({
  shared,
  count,
}: {
  shared: WaveShared;
  count: number;
}) {
  const circleTex = useCircleTexture();
  const pointsRef = useRef<THREE.Points>(null);

  // Datos estaticos por particula: offset/fase de flotacion.
  const data = useMemo(() => {
    const offs = new Float32Array(count);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      offs[i] = 0.2 + Math.random() * 0.6; // offset sobre la ola
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { offs, phases };
  }, [count]);

  // Posicion x,z viva (se integra con velocidad y rebota). Mutable.
  const xz = useMemo(() => {
    const arr = new Float32Array(count * 2);
    const span = shared.half * 2;
    for (let i = 0; i < count; i++) {
      arr[i * 2] = (Math.random() - 0.5) * span;
      arr[i * 2 + 1] = (Math.random() - 0.5) * span;
    }
    return arr;
  }, [count, shared.half]);

  // Velocidad individual por particula (x,z).
  const velocityRef = useMemo(() => {
    const arr = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      arr[i * 2] = (Math.random() - 0.5) * 0.6;
      arr[i * 2 + 1] = (Math.random() - 0.5) * 0.6;
    }
    return arr;
  }, [count]);

  const positions = useMemo(() => new Float32Array(count * 3), [count]);
  // Estela: color por particula (mas brillante = mas rapida).
  const colors = useMemo(() => new Float32Array(count * 3), [count]);

  const trailColor = useMemo(() => new THREE.Color("#ff7700"), []);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const amp = shared.amp.current;
    const freq = shared.freq.current;
    const flat = shared.flat.current;
    const strength = shared.rippleStrength.current ?? 0;
    const mw = shared.mouseWorld;
    const limit = shared.half;
    const dt = Math.min(delta, 0.05);

    const geo = pointsRef.current?.geometry;
    const colorAttr = geo?.getAttribute("color") as
      | THREE.BufferAttribute
      | undefined;

    for (let i = 0; i < count; i++) {
      // Integrar posicion con velocidad y rebotar en los limites del grid.
      let x = xz[i * 2] + velocityRef[i * 2] * dt;
      let z = xz[i * 2 + 1] + velocityRef[i * 2 + 1] * dt;
      if (x > limit) {
        x = limit;
        velocityRef[i * 2] *= -1;
      } else if (x < -limit) {
        x = -limit;
        velocityRef[i * 2] *= -1;
      }
      if (z > limit) {
        z = limit;
        velocityRef[i * 2 + 1] *= -1;
      } else if (z < -limit) {
        z = -limit;
        velocityRef[i * 2 + 1] *= -1;
      }
      xz[i * 2] = x;
      xz[i * 2 + 1] = z;

      // En contact, las particulas tambien convergen hacia el centro.
      const px = x * (1 - flat * 0.85);
      const pz = z * (1 - flat * 0.85);

      let baseY = waveBase(px, pz, t, amp, freq) * (1 - flat);
      baseY += cursorRipple(px, pz, t, mw, strength) * (1 - flat * 0.5);
      const floatY =
        data.offs[i] * (1 - flat) + Math.sin(t + data.phases[i]) * 0.08;
      positions[i * 3] = px;
      positions[i * 3 + 1] = baseY + floatY;
      positions[i * 3 + 2] = pz;

      // Estela: brillo proporcional a la velocidad de la particula.
      if (colorAttr) {
        const vx = velocityRef[i * 2];
        const vz = velocityRef[i * 2 + 1];
        const speed = Math.sqrt(vx * vx + vz * vz);
        const glow = 0.55 + THREE.MathUtils.clamp(speed * 1.2, 0, 0.45);
        colors[i * 3] = trailColor.r * glow;
        colors[i * 3 + 1] = trailColor.g * glow;
        colors[i * 3 + 2] = trailColor.b * glow;
      }
    }
    if (geo) {
      (geo.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
      if (colorAttr) colorAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={circleTex}
        alphaTest={0.2}
        size={0.12}
        vertexColors
        transparent
        opacity={0.95}
        sizeAttenuation
        toneMapped={false}
      />
    </points>
  );
}

// ----------------------------------------------------------------------------
// CENTRAL HALO — sistema de anillos concentricos emissive en el origen. Es el
// "origen" de la ola de donde parten las ondas concentricas. Tres torus de
// distinto tamano rotan en ejes/velocidades distintas + una esfera que pulsa.
// ----------------------------------------------------------------------------
function CentralHalo() {
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (coreRef.current) {
      const s = 1 + Math.sin(t * 1.6) * 0.18;
      coreRef.current.scale.setScalar(s);
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.6;
      ring1Ref.current.rotation.y = t * 0.4;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.5;
      ring2Ref.current.rotation.z = t * 0.7;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = -t * 0.35;
      ring3Ref.current.rotation.z = -t * 0.5;
    }
  });

  return (
    <group>
      {/* Nucleo pulsante. */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.13, 24, 24]} />
        <meshStandardMaterial
          color={ORANGE}
          emissive={ORANGE}
          emissiveIntensity={3.2}
          roughness={0.2}
          metalness={0.2}
          toneMapped={false}
        />
      </mesh>

      {/* Anillos concentricos, distintos tamanos y ejes de giro. */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[0.1, 0.012, 10, 40]} />
        <meshBasicMaterial color="#ff8c00" toneMapped={false} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[0.2, 0.01, 10, 48]} />
        <meshBasicMaterial color={ORANGE} toneMapped={false} />
      </mesh>
      <mesh ref={ring3Ref}>
        <torusGeometry args={[0.35, 0.008, 10, 56]} />
        <meshBasicMaterial color="#ffae4d" toneMapped={false} />
      </mesh>
    </group>
  );
}

// ----------------------------------------------------------------------------
// Cursor 3D — anillo (torus) + nucleo brillante que se posan sobre la ola donde
// esta el cursor (mouseWorld). El anillo rota y pulsa; el nucleo brilla fuerte.
// La altura sigue mouseWorld.y (la proyeccion al plano) + offset, asi que flota
// justo sobre la superficie de la ola.
// ----------------------------------------------------------------------------
function CursorOrb({ shared }: { shared: WaveShared }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    const g = groupRef.current;
    if (!g) return;
    const mw = shared.mouseWorld;
    // Posa el orb sobre la ola: altura de la ola en mouseWorld + offset.
    const amp = shared.amp.current;
    const freq = shared.freq.current;
    const flat = shared.flat.current;
    const surfaceY =
      waveBase(mw.x, mw.z, clock.elapsedTime, amp, freq) * (1 - flat);
    target.set(mw.x, surfaceY + 0.18, mw.z);
    g.position.lerp(target, 0.18);

    if (ringRef.current) {
      ringRef.current.rotation.z = clock.elapsedTime * 1.5;
      const pulse = 1 + Math.sin(clock.elapsedTime * 4) * 0.25;
      ringRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Anillo naranja que pulsa y gira sobre la ola. */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.25, 0.02, 8, 32]} />
        <meshStandardMaterial
          color={ORANGE}
          emissive={ORANGE}
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>
      {/* Punto central brillante. */}
      <mesh>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial
          color={ORANGE}
          emissive={ORANGE}
          emissiveIntensity={4}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// ----------------------------------------------------------------------------
// Camara que se mueve segun el progreso de scroll (lerp entre keyframes).
// Ajustada para la ola: vista desde arriba que deriva lateralmente.
// ----------------------------------------------------------------------------
const CAMERA_KEYS: { at: number; pos: [number, number, number] }[] = [
  { at: 0.00, pos: [-1.5, 2.2, 7.0] },  // hero: arranca izquierda
  { at: 0.12, pos: [ 4.5, 1.8, 5.6] },  // sweep derecha fuerte
  { at: 0.22, pos: [ 1.5, 1.4, 5.0] },  // zoom in diagonal
  { at: 0.35, pos: [-4.5, 2.0, 6.8] },  // sweep izquierda fuerte
  { at: 0.48, pos: [-1.0, 1.2, 5.2] },  // zoom in izquierda
  { at: 0.60, pos: [ 3.5, 2.4, 7.2] },  // sube y barre derecha
  { at: 0.72, pos: [ 0.5, 1.5, 5.4] },  // cierra hacia centro
  { at: 0.85, pos: [-3.0, 1.8, 6.2] },  // último sweep izquierda
  { at: 1.00, pos: [ 0.0, 1.8, 6.0] },  // contact: centro
];

function ScrollCamera({ progress }: { progress: React.RefObject<number> }) {
  const target = useMemo(() => new THREE.Vector3(-1.5, 2.2, 7.0), []);

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

    camera.position.lerp(target, 0.038);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ----------------------------------------------------------------------------
// MOUSE PROJECTOR — proyecta el mouse 2D al plano Y=0 del mundo via raycaster y
// escribe el resultado en shared.mouseWorld. Tambien gestiona rippleStrength:
// sube cuando el rayo intersecta el plano (cursor sobre la ola), baja si no.
// Vive dentro del <group> para que la proyeccion respete la inclinacion aplicada.
// ----------------------------------------------------------------------------
function MouseProjector({
  shared,
  mouse,
}: {
  shared: WaveShared;
  mouse: React.RefObject<{ x: number; y: number }>;
}) {
  // Plano Y=0 y raycaster instanciados una sola vez (NO en useFrame).
  const plane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
    [],
  );
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const ndc = useMemo(() => new THREE.Vector2(), []);

  useFrame(({ camera }, delta) => {
    if (!mouse.current) return;
    ndc.set(mouse.current.x, mouse.current.y);
    raycaster.setFromCamera(ndc, camera);
    const intersected = raycaster.ray.intersectPlane(plane, hit);

    const k = Math.min(1, delta * 6);
    if (intersected) {
      // Suaviza el seguimiento del punto de la ola.
      shared.mouseWorld.lerp(hit, 0.25);
      shared.rippleStrength.current +=
        (1 - shared.rippleStrength.current) * k;
    } else {
      shared.rippleStrength.current +=
        (0 - shared.rippleStrength.current) * k;
    }
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
  const rippleStrength = useRef(0);

  // Vector compartido del cursor proyectado al mundo. Instanciado una vez.
  const mouseWorld = useMemo(() => new THREE.Vector3(), []);

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
    return {
      positions,
      n,
      half,
      amp,
      freq,
      flat,
      mouseWorld,
      rippleStrength,
    };
  }, [isMobile, mouseWorld]);

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

      {/* Campo de ola: grid de puntos + malla de lineas + particulas + halo.
          El proyector y el cursor viven dentro del group para compartir la
          inclinacion aplicada por el mouse. */}
      <group ref={groupRef} position={[0, -1.8, 0]}>
        <MouseProjector shared={shared} mouse={mouse} />
        {/* Superficie sólida naranja — debajo de los puntos para dar profundidad */}
        <WaveSolid shared={shared} />
        <WaveGrid shared={shared} progress={progress} />
        <WaveMesh shared={shared} />
        <WaveParticles shared={shared} count={particleCount} />
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

  // Progreso 0..1 basado en sección activa (emitido por FullPageScroll).
  useEffect(() => {
    const onSection = (e: Event) => {
      const { index, total } = (e as CustomEvent<{ index: number; total: number }>).detail;
      progress.current = total > 1 ? index / (total - 1) : 0;
    };
    window.addEventListener("sectionchange", onSection);
    return () => window.removeEventListener("sectionchange", onSection);
  }, []);

  const starCount = isMobile ? 600 : 1500;

  return (
    <Canvas
      frameloop="always"
      camera={{ position: [0, 2.2, 6.5], fov: 72 }}
      dpr={[1, isMobile ? 2 : 1.5]}
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

