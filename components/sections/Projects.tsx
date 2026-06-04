"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// Projects: destacados en cards grandes (3 col) y el resto en cards pequenas.
// La data vive en lib/data/projects.ts

import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";
import ProjectCard from "@/components/ui/ProjectCard";
import { projects } from "@/lib/data/projects";
import { useLang } from "@/lib/i18n/LangContext";

export default function Projects() {
  const { t } = useLang();

  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section id="proyectos" className="section-glass relative py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          number={t.projects.number}
          label={t.projects.label}
          title={t.projects.title}
          subtitle={t.projects.subtitle}
        />

        {/* Destacados: scroll horizontal en desktop, columna en mobile */}
        <div className="relative">
          {/* Indicador de deslizar (solo desktop, donde el scroll es lateral) */}
          <div className="mb-4 hidden items-center gap-2 text-sm text-text-secondary/70 md:flex">
            <span className="uppercase tracking-[0.2em]">{t.projects.slideHint}</span>
            <motion.span
              aria-hidden
              className="text-lg text-orange-primary"
              animate={{ x: [0, 8, 0] }}
              transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity }}
            >
              →
            </motion.span>
          </div>

          <div className="no-scrollbar flex flex-col gap-6 md:snap-x md:snap-mandatory md:flex-row md:overflow-x-auto md:pb-4">
            {featured.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                featured
                horizontal
              />
            ))}
          </div>

          {/* Degradado de borde derecho para sugerir mas contenido (desktop) */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-px top-0 bottom-4 hidden w-16 md:block"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--background))",
            }}
          />
        </div>

        {/* Resto */}
        {rest.length > 0 && (
          <>
            <p className="mb-6 mt-16 font-display text-sm uppercase tracking-[0.3em] text-text-secondary">
              {t.projects.more}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
