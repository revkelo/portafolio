"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// Projects: grid 2x2 (desktop) / 1 col (mobile) con las cards de proyectos.
// La data vive en lib/data/projects.ts

import SectionTitle from "@/components/ui/SectionTitle";
import ProjectCard from "@/components/ui/ProjectCard";
import { projects } from "@/lib/data/projects";

export default function Projects() {
  return (
    <section id="proyectos" className="bg-background py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle
          title="Proyectos"
          subtitle="Una seleccion de lo que he construido recientemente."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
