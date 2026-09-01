"use client";

// PORTAFOLIO DE KEVIN GONZALEZ - revkelo
// Wrapper de smooth scroll (Lenis) que envuelve toda la app en el layout.

import { useEffect } from "react";
import { createLenis } from "@/lib/utils/smooth-scroll";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = createLenis();

    let frame: number;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
