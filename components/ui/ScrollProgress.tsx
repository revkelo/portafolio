"use client";

// PORTAFOLIO DE KEVIN GONZALEZ - revkelo
// Barra de progreso de scroll: linea naranja fija en el top que crece de 0 a
// 100% segun cuanto se ha scrolleado la pagina. Solo corre en el browser.

import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed left-0 top-0 z-[9998] h-0.5"
      style={{
        width: `${progress}%`,
        background: "#f56f0d",
        transition: "width 0.1s linear",
        boxShadow: "0 0 10px rgba(245,111,13,0.6)",
      }}
    />
  );
}
