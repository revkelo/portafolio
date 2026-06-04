"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// Hero: grid de puntos animado + glow naranja, nombre con efecto glitch,
// contadores animados, barra de terminal con cursor parpadeante y scroll indicator.

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useLang } from "@/lib/i18n/LangContext";
import HeroPlanetWrapper from "@/components/3d/HeroPlanetWrapper";

// Hook simple para contar de 0 a `target` cuando el elemento entra en viewport.
function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return value;
}

export default function Hero() {
  const { t } = useLang();
  const metricsRef = useRef<HTMLDivElement>(null);
  const inView = useInView(metricsRef, { once: true, margin: "-40px" });

  const years = useCountUp(2, inView);
  const repos = useCountUp(35, inView);
  const projects = useCountUp(6, inView);

  const metrics = [
    { value: `${years}+`, label: t.hero.metrics.years },
    { value: `${repos}+`, label: t.hero.metrics.repos },
    { value: `${projects}+`, label: t.hero.metrics.countries },
  ];

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      {/* Planeta 3D interactivo (carga client-only via dynamic ssr:false) */}
      <HeroPlanetWrapper />

      {/* Grid de puntos animado */}
      <div aria-hidden className="dot-grid pointer-events-none absolute inset-0 z-0" />

      {/* Orbes flotantes decorativos (borrosos, animados desfasados) */}
      <div
        aria-hidden
        className="orb-float pointer-events-none absolute left-[8%] top-[20%] z-0 h-48 w-48 rounded-full bg-orange-primary blur-3xl"
      />
      <div
        aria-hidden
        className="orb-float pointer-events-none absolute right-[12%] top-[12%] z-0 h-64 w-64 rounded-full bg-orange-primary blur-3xl"
        style={{ animationDelay: "2s" }}
      />
      <div
        aria-hidden
        className="orb-float pointer-events-none absolute bottom-[15%] left-[40%] z-0 h-36 w-36 rounded-full bg-orange-dark blur-3xl"
        style={{ animationDelay: "4s" }}
      />

      {/* Glow naranja */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-40 z-0 h-[36rem] w-[36rem] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(240,100,0,0.55) 0%, rgba(196,74,0,0.15) 45%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 sm:py-28 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-4 font-display text-sm uppercase tracking-[0.3em] text-orange-primary"
        >
          {t.hero.location}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.04 }}
          className="mb-2 text-lg text-text-secondary"
        >
          {t.hero.greeting}
        </motion.p>

        {/* Nombre con reveal letra por letra (caen desde arriba) */}
        <h1
          className="font-display text-5xl font-bold leading-[1.05] text-text-primary sm:text-7xl md:text-8xl"
          data-cursor-hover
        >
          <span className="inline-block" aria-label="Kevin">
            {"Kevin".split("").map((letter, i) => (
              <motion.span
                key={`k-${i}`}
                aria-hidden
                className="inline-block"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                  delay: i * 0.04,
                }}
              >
                {letter}
              </motion.span>
            ))}
          </span>
          <br />
          <span className="inline-block text-orange-primary" aria-label="Gonzalez">
            {"Gonzalez".split("").map((letter, i) => (
              <motion.span
                key={`g-${i}`}
                aria-hidden
                className="inline-block"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.3 + i * 0.04,
                }}
              >
                {letter}
              </motion.span>
            ))}
          </span>
        </h1>

        {/* Barra de terminal con cursor parpadeante */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="mt-8 inline-flex max-w-full items-center rounded-lg border border-white/10 bg-surface/70 px-4 py-2.5 font-mono text-sm text-text-secondary backdrop-blur-sm sm:text-base"
        >
          <span className="mr-2 text-orange-primary">{">"}</span>
          <span className="truncate">{t.hero.terminal}</span>
          <span className="terminal-cursor" aria-hidden />
        </motion.div>

        {/* Contadores animados */}
        <motion.div
          ref={metricsRef}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.28 }}
          className="mt-12 grid grid-cols-1 gap-x-12 gap-y-6 sm:grid-cols-3"
        >
          {metrics.map((m) => (
            <div key={m.label}>
              <p className="font-display text-4xl font-bold text-orange-primary sm:text-5xl">
                {m.value}
              </p>
              <p className="mt-1 max-w-[8rem] text-sm text-text-secondary">
                {m.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.36 }}
          className="mt-12 flex flex-col gap-4 sm:flex-row sm:flex-wrap"
        >
          <a
            href="#proyectos"
            className="rounded-full bg-orange-primary px-7 py-3 text-center font-medium text-background transition-colors hover:bg-orange-dark"
            data-cursor-hover
          >
            {t.hero.cta1}
          </a>
          <a
            href="/cv-kevin-gonzalez.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-orange-primary px-7 py-3 text-center font-medium text-orange-primary transition-colors hover:bg-orange-primary hover:text-background"
            data-cursor-hover
          >
            {t.hero.cta2}
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        aria-label={t.hero.scroll}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-text-secondary"
        data-cursor-hover
      >
        <span className="text-xs uppercase tracking-[0.3em]">
          {t.hero.scroll}
        </span>
        <svg
          className="scroll-arrow"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </a>
    </section>
  );
}
