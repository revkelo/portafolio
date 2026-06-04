"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// Hero: nombre grande, roles que se alternan, 2 CTA y separador diagonal naranja.

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const roles = ["Cloud & DevOps Engineer", "Full-Stack Developer", "Data Governance"];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setRoleIndex((i) => (i + 1) % roles.length);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden bg-background"
    >
      {/* Gradiente sutil naranja en la esquina inferior derecha */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-40 h-[36rem] w-[36rem] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(240,100,0,0.55) 0%, rgba(196,74,0,0.15) 45%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-4 font-display text-sm uppercase tracking-[0.3em] text-orange-primary"
        >
          Bogota, Colombia
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
          className="font-display text-5xl font-bold leading-[1.05] text-text-primary sm:text-7xl md:text-8xl"
        >
          Kevin
          <br />
          Gonzalez
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="mt-6 flex h-9 items-center"
        >
          <span className="mr-3 text-text-secondary">{">"}</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={roleIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="font-display text-lg text-text-primary sm:text-2xl"
            >
              {roles[roleIndex]}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.32 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <a
            href="#proyectos"
            className="rounded-full bg-orange-primary px-7 py-3 font-medium text-background transition-colors hover:bg-orange-dark"
          >
            Ver proyectos
          </a>
          <a
            href="/cv-kevin-gonzalez.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-orange-primary px-7 py-3 font-medium text-orange-primary transition-colors hover:bg-orange-primary hover:text-background"
          >
            Descargar CV
          </a>
        </motion.div>
      </div>

      {/* Separador diagonal naranja al final */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 h-24 w-full"
        style={{
          background: "linear-gradient(135deg, transparent 60%, #f06400 60%)",
          opacity: 0.9,
          clipPath: "polygon(0 100%, 100% 100%, 100% 60%)",
        }}
      />
    </section>
  );
}
