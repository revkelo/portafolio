"use client";

// SectionSlot: contenedor de cada sección en el full-page scroll.
// - Montaje perezoso: solo renderiza el contenido cuando el usuario navega
//   a esa sección por primera vez (así las animaciones Framer Motion corren
//   al momento correcto, no todas en el arranque).
// - overflowY: auto - el usuario puede hacer scroll dentro de la sección;
//   FullPageScroll detecta cuando llega al borde y transiciona a la siguiente.

import { useEffect, useRef, useState } from "react";
import { useSectionIndex } from "./FullPageScroll";

interface SectionSlotProps {
  index: number;
  children: React.ReactNode;
}

export default function SectionSlot({ index, children }: SectionSlotProps) {
  const current = useSectionIndex();
  // Hero (index 0) se monta inmediatamente; el resto espera a ser navegado.
  const [mounted, setMounted] = useState(index === 0);

  useEffect(() => {
    if (current === index && !mounted) setMounted(true);
  }, [current, index, mounted]);

  return (
    <div
      style={{
        height: "100dvh",
        overflowY: "auto",
        overflowX: "hidden",
        position: "relative",
        scrollbarWidth: "none",          // Firefox
        msOverflowStyle: "none" as React.CSSProperties["msOverflowStyle"],
      }}
    >
      {mounted && children}
    </div>
  );
}
