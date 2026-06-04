"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// HeroPlanetWrapper: carga HeroPlanet via dynamic(ssr:false). Se posiciona en el
// Hero. pointer-events-auto para permitir arrastrar el planeta con OrbitControls.

import dynamic from "next/dynamic";

const HeroPlanet = dynamic(() => import("./HeroPlanet"), {
  ssr: false,
  loading: () => null,
});

export default function HeroPlanetWrapper() {
  return (
    <div className="absolute inset-0 z-0">
      <HeroPlanet />
    </div>
  );
}
