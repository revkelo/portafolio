"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// Card individual de proyecto con hover naranja + tags como pills.

import { motion } from "framer-motion";
import type { Project } from "@/lib/data/projects";

export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.08 }}
      className="group flex h-full flex-col rounded-2xl border border-white/5 bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-orange-primary"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <h3 className="font-display text-xl font-bold text-text-primary transition-colors group-hover:text-orange-primary">
          {project.title}
        </h3>
        <span className="shrink-0 rounded-full border border-orange-primary/30 px-3 py-1 text-xs text-orange-primary">
          {project.status}
        </span>
      </div>

      <p className="mb-5 flex-1 text-sm leading-relaxed text-text-secondary">
        {project.description}
      </p>

      <div className="mb-5 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-orange-primary/10 px-2.5 py-1 text-xs text-orange-primary"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4 text-sm">
        {project.github ? (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary transition-colors hover:text-orange-primary"
          >
            GitHub →
          </a>
        ) : (
          <span className="text-text-secondary/40">Privado</span>
        )}
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary transition-colors hover:text-orange-primary"
          >
            Demo →
          </a>
        )}
      </div>
    </motion.article>
  );
}
