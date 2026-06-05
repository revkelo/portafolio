"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// Cursor personalizado: punto naranja 12px + anillo exterior 36px que sigue con
// delay. En hover sobre links/botones el cursor se transforma en crosshair.
// Solo se renderiza en desktop (pointer fino).

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Posiciones via refs para no re-renderizar en cada movimiento.
  const target = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mq.matches) return;
    setEnabled(true);
    // Solo ocultar el cursor nativo cuando el custom ya está activo
    document.documentElement.classList.add("custom-cursor-active");

    const move = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", move);

    let raf = 0;
    const loop = () => {
      // El punto sigue exacto; el anillo con delay (lerp).
      ring.current.x += (target.current.x - ring.current.x) * 0.18;
      ring.current.y += (target.current.y - ring.current.y) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${target.current.x}px, ${target.current.y}px) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  const ORANGE = '#f56f0d';

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        top: 0,
        left: 0,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      {/* Punto central */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: ORANGE,
          opacity: 1,
          pointerEvents: 'none',
          boxShadow: '0 0 0 1.5px rgba(0,0,0,0.85)',
        }}
      />

      {/* Anillo exterior */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease-out',
          pointerEvents: 'none',
        }}
      >
        <span style={{
          display: 'block',
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: `1.5px solid ${ORANGE}`,
          boxShadow: '0 0 0 1px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(0,0,0,0.4)',
        }} />
      </div>
    </div>
  );
}
