"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// Card de proyecto: badge de estado (pulsante si esta en desarrollo),
// descripcion bilingue, tags como pills y manejo de proyectos privados.

import { motion } from "framer-motion";
import type { Project } from "@/lib/data/projects";
import { useLang } from "@/lib/i18n/LangContext";

// Colores de marca por tecnologia para las tech tags.
function tagClass(tag: string): string {
  const t = tag.toLowerCase();
  if (t.includes("python"))
    return "bg-blue-900/30 text-blue-300 border-blue-700/40";
  if (t.includes("typescript") || t.includes("react"))
    return "bg-cyan-900/30 text-cyan-300 border-cyan-700/40";
  if (t.includes("flutter") || t.includes("dart"))
    return "bg-sky-900/30 text-sky-300 border-sky-700/40";
  if (t.includes("aws") || t.includes("docker"))
    return "bg-orange-900/30 text-orange-300 border-orange-700/40";
  if (t.includes("fastapi"))
    return "bg-green-900/30 text-green-300 border-green-700/40";
  return "bg-white/5 text-text-secondary border-white/10";
}

export default function ProjectCard({
  project,
  index,
  featured = false,
  horizontal = false,
}: {
  project: Project;
  index: number;
  featured?: boolean;
  horizontal?: boolean;
}) {
  const { lang, t } = useLang();

  const description = lang === "en" ? project.description_en : project.description;
  const inProgress = project.status === "in-progress";
  const statusLabel = inProgress
    ? t.projects.statusInProgress
    : t.projects.statusCompleted;
  const isPrivate = !project.github;

  return (
    <motion.article
      initial={horizontal ? { opacity: 0, x: 40 } : { opacity: 0, y: 28 }}
      whileInView={horizontal ? { opacity: 1, x: 0 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.08 }}
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:border-orange-primary hover:shadow-[0_0_40px_-12px_rgba(240,100,0,0.6)] ${
        featured ? "md:p-8" : ""
      } ${
        horizontal
          ? "min-w-[340px] snap-start md:w-[380px] md:flex-none"
          : ""
      }`}
      data-cursor-hover
    >
      {/* Decoracion diagonal naranja en la esquina superior derecha (featured) */}
      {featured && (
        <div
          aria-hidden
          className="absolute top-0 right-0 h-16 w-16 overflow-hidden rounded-tr-2xl"
        >
          <div className="absolute -top-8 -right-8 h-16 w-16 rotate-45 bg-orange-primary/20" />
        </div>
      )}

      {/* Numero de proyecto (01, 02, 03) en naranja semi-transparente */}
      {featured && (
        <span
          aria-hidden
          className="pointer-events-none absolute left-4 top-2 select-none font-display text-2xl font-bold text-orange-primary opacity-20"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      )}

      <div className={`mb-4 flex items-start justify-between gap-4 ${featured ? "mt-6" : ""}`}>
        <h3
          className={`min-w-0 break-words font-display font-bold text-text-primary transition-colors group-hover:text-orange-primary ${
            featured ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"
          }`}
        >
          {project.title}
        </h3>

        {/* Badge de estado */}
        <span
          className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${
            inProgress
              ? "border-orange-primary/40 text-orange-primary"
              : "border-emerald-500/40 text-emerald-400"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              inProgress ? "bg-orange-primary pulse-dot" : "bg-emerald-400"
            }`}
          />
          {statusLabel}
        </span>
      </div>

      <p
        className={`mb-5 flex-1 leading-relaxed text-text-secondary ${
          featured ? "text-base" : "text-sm"
        }`}
      >
        {description}
      </p>

      {/* Tags como pills con colores de marca por tecnologia */}
      <div className="mb-5 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className={`rounded-full border px-2.5 py-1 text-xs ${tagClass(tag)}`}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4 text-sm">
        {isPrivate ? (
          <span className="flex items-center gap-1.5 text-text-secondary/50">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            {t.projects.private}
          </span>
        ) : (
          <a
            href={project.github!}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary transition-colors hover:text-orange-primary"
          >
            {t.projects.code} →
          </a>
        )}

        {project.demo ? (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary transition-colors hover:text-orange-primary"
          >
            {t.projects.demo} →
          </a>
        ) : (
          <span className="cursor-not-allowed text-text-secondary/30">
            {t.projects.demo}
          </span>
        )}
      </div>
    </motion.article>
  );
}
