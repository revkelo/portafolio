"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// TechCarousel: carrusel infinito de tecnologias — 2 filas en sentidos opuestos.
// - Loop via translateX(-50%) sobre lista duplicada 2x
// - Pausa al hover sobre cualquier item
// - Glow naranja en hover + scale
// - Fade en los bordes

import { motion } from "framer-motion";
import { useState } from "react";

const ROW_1 = [
  { name: "Python",      icon: "https://skillicons.dev/icons?i=python" },
  { name: "TypeScript",  icon: "https://skillicons.dev/icons?i=ts" },
  { name: "React",       icon: "https://skillicons.dev/icons?i=react" },
  { name: "Next.js",     icon: "https://skillicons.dev/icons?i=nextjs" },
  { name: "FastAPI",     icon: "https://skillicons.dev/icons?i=fastapi" },
  { name: "Java",        icon: "https://skillicons.dev/icons?i=java" },
  { name: "Spring Boot", icon: "https://skillicons.dev/icons?i=spring" },
  { name: "Flutter",     icon: "https://skillicons.dev/icons?i=flutter" },
  { name: "Docker",      icon: "https://skillicons.dev/icons?i=docker" },
  { name: "AWS",         icon: "https://skillicons.dev/icons?i=aws" },
  { name: "Databricks",  icon: "https://skillicons.dev/icons?i=spark" },
  { name: "GraphQL",     icon: "https://skillicons.dev/icons?i=graphql" },
];

const ROW_2 = [
  { name: "Azure",       icon: "https://skillicons.dev/icons?i=azure" },
  { name: "Kubernetes",  icon: "https://skillicons.dev/icons?i=kubernetes" },
  { name: "Terraform",   icon: "https://skillicons.dev/icons?i=terraform" },
  { name: "MySQL",       icon: "https://skillicons.dev/icons?i=mysql" },
  { name: "PostgreSQL",  icon: "https://skillicons.dev/icons?i=postgres" },
  { name: "Supabase",    icon: "https://skillicons.dev/icons?i=supabase" },
  { name: "Git",         icon: "https://skillicons.dev/icons?i=git" },
  { name: "Linux",       icon: "https://skillicons.dev/icons?i=linux" },
  { name: "JavaScript",  icon: "https://skillicons.dev/icons?i=js" },
  { name: "Dart",        icon: "https://skillicons.dev/icons?i=dart" },
  { name: "Redis",       icon: "https://skillicons.dev/icons?i=redis" },
  { name: "GitHub",      icon: "https://skillicons.dev/icons?i=github" },
];

function TechItem({ name, icon }: { name: string; icon: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.08, y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="group relative flex shrink-0 cursor-default items-center gap-2.5 rounded-full border border-border bg-surface/60 px-4 py-2.5 backdrop-blur-sm"
      data-cursor-hover
    >
      {/* Glow naranja al hover */}
      <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ boxShadow: "0 0 18px rgba(245,111,13,0.3)", border: "1px solid rgba(245,111,13,0.4)" }}
      />
      <img
        src={icon}
        alt={name}
        width={22}
        height={22}
        className="relative z-10 opacity-70 transition-all duration-300 group-hover:opacity-100 group-hover:drop-shadow-[0_0_6px_rgba(245,111,13,0.7)]"
        loading="lazy"
      />
      <span className="relative z-10 whitespace-nowrap font-display text-sm font-medium text-text-secondary transition-colors duration-300 group-hover:text-text-primary">
        {name}
      </span>
    </motion.div>
  );
}

function MarqueeRow({
  items,
  reverse = false,
  duration = 35,
}: {
  items: typeof ROW_1;
  reverse?: boolean;
  duration?: number;
}) {
  const [paused, setPaused] = useState(false);
  // 2 copias exactas → mover -50% = una copia, loop perfecto
  const list = [...items, ...items];

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex w-max gap-3"
        style={{
          animation: `marquee-${reverse ? "rev" : "fwd"} ${duration}s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {list.map((tech, i) => (
          <TechItem key={`${tech.name}-${i}`} name={tech.name} icon={tech.icon} />
        ))}
      </div>
    </div>
  );
}

export default function TechCarousel() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative overflow-hidden py-8"
      aria-label="Stack tecnológico"
    >
      {/* Fade en bordes */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-background to-transparent" />

      <div className="flex flex-col gap-3">
        <MarqueeRow items={ROW_1} duration={45} />
        <MarqueeRow items={ROW_2} reverse duration={40} />
      </div>
    </motion.section>
  );
}
