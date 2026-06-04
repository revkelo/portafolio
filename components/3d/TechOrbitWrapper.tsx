"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// TechOrbitWrapper: carga TechOrbit via dynamic(ssr:false). pointer-events-auto
// para permitir hover sobre las esferas orbitando.

import dynamic from "next/dynamic";

const TechOrbit = dynamic(() => import("./TechOrbit"), {
  ssr: false,
  loading: () => null,
});

export default function TechOrbitWrapper() {
  return (
    <div className="h-[420px] w-full sm:h-[500px]">
      <TechOrbit />
    </div>
  );
}
