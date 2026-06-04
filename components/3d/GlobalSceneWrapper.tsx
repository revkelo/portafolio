"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// GlobalSceneWrapper: carga GlobalScene via dynamic(ssr:false) y la fija detras
// de todo el contenido 2D. Va como primer hijo del body en app/layout.tsx.
// En mobile (<768px) NO se monta el canvas: el sitio se ve con el diseño 2D y
// las animaciones de Framer Motion, con un fondo de gradiente oscuro (CSS).

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const GlobalScene = dynamic(() => import("./GlobalScene"), {
  ssr: false,
  loading: () => null,
});

export default function GlobalSceneWrapper() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Mobile: sin WebGL. Fondo CSS con gradiente oscuro radial naranja sutil.
  if (mounted && isMobile) {
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, rgba(240,100,0,0.10) 0%, transparent 45%), #0d0d0d",
        }}
      />
    );
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 0.9 }}
    >
      <GlobalScene />
    </div>
  );
}
