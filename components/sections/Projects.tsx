"use client";

// PORTAFOLIO DE KEVIN GONZALEZ - revkelo
// Projects: grid responsive - featured en 2 cols desktop, resto en 3 cols.

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
    <section id="proyectos" className="section-glass relative py-10 md:py-14 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          number={t.projects.number}
          label={t.projects.label}
          title={t.projects.title}
          subtitle={t.projects.subtitle}
        />

        {/* Featured: 1 col mobile → 2 cols desktop */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(1, 1fr)",
          gap: "1.25rem",
        }}
          className="md:grid-cols-2"
        >
          {featured.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} featured />
          ))}
        </div>

        {/* Resto */}
        {rest.length > 0 && (
          <>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              style={{
                marginTop: "3rem", marginBottom: "1.25rem",
                fontFamily: "var(--font-display)", fontSize: "0.78rem",
                textTransform: "uppercase", letterSpacing: "0.2em",
                color: "var(--text-secondary)",
              }}
            >
              {t.projects.more}
            </motion.p>

            {/* 1 col mobile → 2 cols tablet → 3 cols desktop */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(1, 1fr)",
              gap: "1rem",
            }}
              className="sm:grid-cols-2 lg:grid-cols-3"
            >
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
