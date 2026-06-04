"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// TechCarousel: carrusel infinito de tecnologias con dos filas en sentidos opuestos.
// Sin dependencias externas — CSS animation pura para el loop infinito.

import { motion } from "framer-motion";

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
];

function TechItem({ name, icon }: { name: string; icon: string }) {
  return (
    <div
      className="group flex shrink-0 items-center gap-2.5 rounded-full border border-white/5 bg-surface/60 px-4 py-2.5 backdrop-blur-sm transition-colors hover:border-orange-primary/40 hover:bg-surface"
      data-cursor-hover
    >
      <img
        src={icon}
        alt={name}
        width={22}
        height={22}
        className="opacity-75 transition-opacity group-hover:opacity-100"
        loading="lazy"
      />
      <span className="font-display text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors whitespace-nowrap">
        {name}
      </span>
    </div>
  );
}

function MarqueeRow({
  items,
  reverse = false,
  speed = 35,
}: {
  items: typeof ROW_1;
  reverse?: boolean;
  speed?: number;
}) {
  // Duplicar 3 veces para loop sin cortes
  const doubled = [...items, ...items, ...items];

  return (
    <div className="overflow-hidden">
      <div
        className="flex gap-3"
        style={{
          animation: `marquee-${reverse ? "reverse" : "forward"} ${speed}s linear infinite`,
        }}
      >
        {doubled.map((tech, i) => (
          <TechItem key={`${tech.name}-${i}`} name={tech.name} icon={tech.icon} />
        ))}
      </div>
    </div>
  );
}

export default function TechCarousel() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden py-10"
      aria-label="Tecnologías"
    >
      {/* Gradiente en los bordes para efecto fade */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-background to-transparent" />

      <div className="flex flex-col gap-3">
        <MarqueeRow items={ROW_1} speed={40} />
        <MarqueeRow items={ROW_2} reverse speed={38} />
      </div>
    </motion.section>
  );
}
