"use client";

import { motion } from "framer-motion";

interface SectionTitleProps {
  number: string;
  label: string;
  title: string;
  subtitle?: string;
}

// Variantes para stagger de hijos
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -18 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const barGrow = {
  hidden: { scaleY: 0, originY: 0 },
  show:   { scaleY: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function SectionTitle({ number, label, title, subtitle }: SectionTitleProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className="mb-12"
    >
      {/* Número / label */}
      <motion.p
        variants={fadeLeft}
        className="mb-4 font-display text-xs uppercase tracking-[0.4em] text-orange-primary"
      >
        {number} <span className="text-text-secondary/60">/</span> {label}
      </motion.p>

      {/* Barra + título con clip-path reveal */}
      <div className="flex items-center gap-4">
        <motion.span
          aria-hidden
          variants={barGrow}
          className="h-10 w-3 shrink-0 bg-orange-primary sm:h-12"
          style={{ clipPath: "polygon(60% 0, 100% 0, 40% 100%, 0 100%)" }}
        />

        {/* Clip-path reveal: el título sube desde abajo del contenedor */}
        <div style={{ overflow: "hidden" }}>
          <motion.h2
            variants={{
              hidden: { y: "100%", opacity: 0 },
              show:   { y: "0%",   opacity: 1, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
            }}
            className="font-display text-4xl font-bold tracking-tight text-text-primary md:text-5xl lg:text-6xl"
          >
            {title}
          </motion.h2>
        </div>
      </div>

      {/* Subtítulo */}
      {subtitle && (
        <motion.p variants={fadeUp} className="mt-3 max-w-2xl pl-7 text-text-secondary">
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
