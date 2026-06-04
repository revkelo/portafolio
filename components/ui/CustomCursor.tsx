"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// Cursor personalizado: punto naranja 12px + anillo exterior 36px que sigue con
// delay. En hover sobre links/botones el cursor se transforma en crosshair.
// Solo se renderiza en desktop (pointer fino).

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Posiciones via refs para no re-renderizar en cada movimiento.
  const target = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mq.matches) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      const el = e.target as HTMLElement;
      setHovering(Boolean(el.closest("a, button, [data-cursor-hover]")));
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

  return (
    <div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[9999]">
      {/* Punto central */}
      <div
        ref={dotRef}
        className="fixed left-0 top-0 rounded-full transition-opacity duration-150"
        style={{
          width: 12,
          height: 12,
          background: '#f56f0d',
          opacity: hovering ? 0 : 1,
        }}
      />

      {/* Anillo exterior — en hover se transforma en crosshair */}
      <div
        ref={ringRef}
        className="fixed left-0 top-0 flex items-center justify-center transition-all duration-200 ease-out"
        style={{
          width: hovering ? 36 : 36,
          height: hovering ? 36 : 36,
        }}
      >
        {hovering ? (
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            stroke="#f56f0d"
            strokeWidth="1.5"
          >
            <circle cx="18" cy="18" r="11" opacity="0.5" />
            <path d="M18 4v8M18 24v8M4 18h8M24 18h8" />
          </svg>
        ) : (
          <span className="block h-9 w-9 rounded-full" style={{ border: '1px solid rgba(245,111,13,0.6)' }} />
        )}
      </div>
    </div>
  );
}
