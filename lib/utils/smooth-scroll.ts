// PORTAFOLIO DE KEVIN GONZALEZ - revkelo
// Configuracion de Lenis para smooth scroll global.
// Se consume desde components/ui/SmoothScroll.tsx (client component).

import Lenis from "lenis";

export function createLenis(): Lenis {
  return new Lenis({
    duration: 1.1,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.5,
  });
}
