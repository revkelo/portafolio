"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// Titulo de seccion reutilizable: numero de seccion (01 / ABOUT),
// linea diagonal naranja a la izquierda y subtitulo opcional.

import { motion } from "framer-motion";

interface SectionTitleProps {
  number: string;
  label: string;
  title: string;
  subtitle?: string;
}

export default function SectionTitle({
  number,
  label,
  title,
  subtitle,
}: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mb-12"
    >
      {/* Numero de seccion: 01 / ABOUT */}
      <p className="mb-4 font-display text-xs uppercase tracking-[0.4em] text-orange-primary">
        {number} <span className="text-text-secondary/60">/</span> {label}
      </p>

      <div className="flex items-center gap-4">
        {/* Linea diagonal naranja de 2px a la izquierda */}
        <span
          aria-hidden
          className="h-10 w-3 shrink-0 bg-orange-primary sm:h-12"
          style={{ clipPath: "polygon(60% 0, 100% 0, 40% 100%, 0 100%)" }}
        />
        <h2 className="font-display text-4xl font-bold tracking-tight text-text-primary md:text-5xl lg:text-6xl">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="mt-3 max-w-2xl pl-7 text-text-secondary">{subtitle}</p>
      )}
    </motion.div>
  );
}
