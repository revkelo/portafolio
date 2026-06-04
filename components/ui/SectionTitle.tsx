"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// Titulo de seccion reutilizable con linea naranja a la izquierda como acento.

import { motion } from "framer-motion";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

export default function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mb-12"
    >
      <div className="flex items-center gap-4">
        <span className="h-8 w-1 rounded-full bg-orange-primary" />
        <h2 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="mt-3 max-w-2xl pl-5 text-text-secondary">{subtitle}</p>
      )}
    </motion.div>
  );
}
