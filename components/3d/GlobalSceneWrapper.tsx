"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// GlobalSceneWrapper: carga GlobalScene via dynamic(ssr:false) y la fija detras
// de todo el contenido 2D. Va como primer hijo del body en app/layout.tsx.

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const GlobalScene = dynamic(() => import("./GlobalScene"), {
  ssr: false,
  loading: () => null,
});

export default function GlobalSceneWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    >
      <GlobalScene />
    </div>
  );
}
