"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// AboutGeometryWrapper: carga AboutGeometry via dynamic(ssr:false). Capa decorativa
// detras del contenido de About (pointer-events-none para no bloquear el texto).

import dynamic from "next/dynamic";

const AboutGeometry = dynamic(() => import("./AboutGeometry"), {
  ssr: false,
  loading: () => null,
});

export default function AboutGeometryWrapper() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0"
      style={{ opacity: 0.85 }}
    >
      <AboutGeometry />
    </div>
  );
}
