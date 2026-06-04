"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// Projects: destacados en cards grandes (3 col) y el resto en cards pequenas.
// La data vive en lib/data/projects.ts

import SectionTitle from "@/components/ui/SectionTitle";
import ProjectCard from "@/components/ui/ProjectCard";
import { projects } from "@/lib/data/projects";
import { useLang } from "@/lib/i18n/LangContext";

export default function Projects() {
  const { t } = useLang();

  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section id="proyectos" className="bg-background py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          number={t.projects.number}
          label={t.projects.label}
          title={t.projects.title}
          subtitle={t.projects.subtitle}
        />

        {/* Destacados */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} featured />
          ))}
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
