"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// Hero: grid de puntos animado + glow naranja, nombre con efecto glitch,
// contadores animados, barra de terminal con cursor parpadeante y scroll indicator.

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useScroll, useTransform, useSpring } from "framer-motion";
import { useLang } from "@/lib/i18n/LangContext";

// Hook simple para contar de 0 a `target` cuando el elemento entra en viewport.
// Devuelve tambien `done` para disparar un flash naranja al terminar.
function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  const [done, setDone] = useState(false);
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
      else setDone(true);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return { value, done };
}

export default function Hero() {
  const { t } = useLang();
  const metricsRef = useRef<HTMLDivElement>(null);
  const inView = useInView(metricsRef, { once: true, margin: "-40px" });

  // Roles rotativos: aparece uno, se va, aparece el siguiente (AnimatePresence).
  const roles = t.hero.roles;
  const [roleIndex, setRoleIndex] = useState(0);
  useEffect(() => {
    setRoleIndex(0);
    const id = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2600);
    return () => clearInterval(id);
  }, [roles]);

  const years    = useCountUp(2,  inView);
  const repos    = useCountUp(35, inView);
  const projects = useCountUp(6,  inView);
  const uptime   = useCountUp(98, inView);

  const metrics = [
    { value: `${years.value}+`,   done: years.done,    label: t.hero.metrics.years   },
    { value: `${repos.value}+`,   done: repos.done,    label: t.hero.metrics.repos   },
    { value: `${projects.value}+`,done: projects.done, label: t.hero.metrics.countries},
    { value: `${uptime.value}%`,  done: uptime.done,   label: "uptime achieved"       },
  ];

  // Parallax con useScroll — el contenido sube más lento que el scroll
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const yText    = useSpring(useTransform(scrollYProgress, [0, 1], [0, -80]),  { stiffness: 80, damping: 20 });
  const yDecor   = useSpring(useTransform(scrollYProgress, [0, 1], [0, -140]), { stiffness: 60, damping: 20 });
  const opacity  = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden pb-8"
    >
      {/* Overlay modo claro: suaviza el canvas 3D oscuro sobre fondo beige */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 transition-colors duration-300"
        style={{ background: "var(--hero-overlay)" }}
      />

      {/* Lineas diagonales naranjas sutiles (banner original de Kevin) */}
      <div aria-hidden className="diagonal-lines pointer-events-none absolute inset-0 z-0" />

      {/* Puntos de esquina con parallax más rápido */}
      <motion.div aria-hidden style={{ y: yDecor }} className="corner-dots pointer-events-none absolute left-7 top-7 z-0 opacity-50" />
      <motion.div aria-hidden style={{ y: yDecor }} className="corner-dots pointer-events-none absolute bottom-14 right-7 z-0 opacity-50" />

      {/* Línea vertical separadora — estilo banner */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-[54%] top-0 z-0 hidden w-px lg:block"
        style={{
          background:
            "linear-gradient(to bottom, transparent 5%, rgba(245,111,13,0.30) 25%, rgba(245,111,13,0.30) 75%, transparent 95%)",
        }}
      />


      <motion.div style={{ y: yText, opacity }} className="relative z-10 mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 sm:py-28 lg:px-8">
        {/* Open to work badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-5 inline-flex items-center gap-2"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
          </span>
          <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-green-400">
            Open to work
          </span>
          <span className="h-3 w-px bg-orange-primary/30" />
          <span className="font-display text-xs uppercase tracking-[0.2em] text-orange-primary/70">
            {t.hero.location}
          </span>
        </motion.div>

        <motion.p
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.04 }}
          className="mb-2 font-display text-base italic text-orange-primary sm:text-lg"
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
          <span
            className="inline-block text-text-primary"
            aria-label="Gonzalez"
          >
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

        {/* Roles rotativos: uno aparece, se va y entra el siguiente */}
        <div className="mt-5 flex h-8 items-center sm:h-9">
          <span
            aria-hidden
            className="mr-3 h-5 w-1 rounded-full bg-orange-primary sm:h-6"
          />
          <AnimatePresence mode="wait">
            <motion.span
              key={`${roleIndex}-${roles[roleIndex]}`}
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -18, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-xl font-semibold text-text-secondary sm:text-2xl"
            >
              {roles[roleIndex]}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Linea horizontal naranja que se traza de 0 a 100% al cargar */}
        <motion.div
          aria-hidden
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 h-0.5 max-w-md bg-gradient-to-r from-orange-primary to-orange-primary/0"
        />

        {/* Barra de terminal con cursor parpadeante */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="mt-8 inline-flex max-w-full items-center rounded-lg border border-orange-primary/30 bg-surface/80 px-5 py-3 font-mono text-base text-text-secondary backdrop-blur-sm sm:text-lg"
        >
          <span className="mr-2.5 font-bold text-orange-primary">{">"}</span>
          <span className="truncate tracking-tight">{t.hero.terminal}</span>
          <span className="terminal-cursor" aria-hidden />
        </motion.div>

        {/* Contadores — 2x2 en mobile, fila en desktop */}
        <motion.div
          ref={metricsRef}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.28 }}
          className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 sm:flex sm:flex-wrap sm:items-stretch sm:gap-y-6"
        >
          {metrics.map((m, i) => (
            <div key={m.label} className="flex items-stretch">
              {i > 0 && (
                <span
                  aria-hidden
                  className="mr-6 hidden w-px self-stretch bg-orange-primary/40 sm:mr-8 sm:ml-2 sm:block"
                />
              )}
              <div>
                <p className={`font-display text-3xl font-bold text-orange-primary sm:text-5xl ${m.done ? "metric-flash" : ""}`}>
                  {m.value}
                </p>
                <p className="mt-1 text-xs text-text-secondary sm:text-sm sm:max-w-[8rem]">
                  {m.label}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.36 }}
          className="mt-12 flex flex-col gap-4 sm:flex-row sm:flex-wrap"
        >
          <a
            href="#proyectos"
            className="cta-shine rounded-full bg-orange-primary px-7 py-3 text-center font-medium text-background transition-colors hover:bg-orange-dark"
            data-cursor-hover
          >
            {t.hero.cta1}
          </a>
          <a
            href="/cv-kevin-gonzalez.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-shine rounded-full bg-surface border border-orange-primary/60 px-7 py-3 text-center font-medium text-text-primary transition-colors hover:bg-orange-primary hover:text-background hover:border-orange-primary"
            data-cursor-hover
          >
            {t.hero.cta2}
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator: flecha + linea vertical naranja que pulsa */}
      <a
        href="#about"
        aria-label={t.hero.scroll}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-orange-primary"
        data-cursor-hover
      >
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
        <span
          aria-hidden
          className="pulse-dot h-10 w-px rounded-full bg-gradient-to-b from-orange-primary to-transparent"
        />
      </a>
    </section>
  );
}
