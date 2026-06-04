"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// Cursor naranja personalizado que sigue el mouse y se agranda sobre
// elementos interactivos. Solo se renderiza en desktop (pointer fino).

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    // Solo en desktop con puntero fino y hover real
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mq.matches) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, [data-cursor-hover]");
      setHovering(Boolean(interactive));
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference"
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
      }}
    >
      <div
        className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-primary transition-[width,height,opacity] duration-200 ease-out"
        style={{
          width: hovering ? 44 : 16,
          height: hovering ? 44 : 16,
          opacity: hovering ? 0.5 : 1,
        }}
      />
    </div>
  );
}
