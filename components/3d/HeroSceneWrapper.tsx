"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// HeroSceneWrapper: carga HeroScene via dynamic con ssr:false para evitar errores
// de SSR con react-three-fiber. Se coloca detras del contenido del hero.

import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => null,
});

export default function HeroSceneWrapper() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0"
      style={{ opacity: 0.75 }}
    >
      <HeroScene />
    </div>
  );
}
