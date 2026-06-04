"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// ProjectCard: card de proyecto con colores via CSS vars (funciona sin Tailwind CSS en dev).

import { motion } from "framer-motion";
import type { Project } from "@/lib/data/projects";
import { useLang } from "@/lib/i18n/LangContext";

function tagColor(tag: string): { bg: string; color: string; border: string } {
  const t = tag.toLowerCase();
  if (t.includes("python"))    return { bg: "rgba(59,130,246,0.12)", color: "#60a5fa", border: "rgba(59,130,246,0.25)" };
  if (t.includes("typescript") || t.includes("react"))
                               return { bg: "rgba(6,182,212,0.12)",  color: "#22d3ee", border: "rgba(6,182,212,0.25)" };
  if (t.includes("flutter") || t.includes("dart"))
                               return { bg: "rgba(14,165,233,0.12)", color: "#38bdf8", border: "rgba(14,165,233,0.25)" };
  if (t.includes("aws") || t.includes("docker"))
                               return { bg: "rgba(245,111,13,0.12)", color: "#fb923c", border: "rgba(245,111,13,0.25)" };
  if (t.includes("fastapi"))   return { bg: "rgba(34,197,94,0.12)",  color: "#4ade80", border: "rgba(34,197,94,0.25)" };
  return { bg: "var(--surface-alt)", color: "var(--text-secondary)", border: "var(--border)" };
}

export default function ProjectCard({
  project,
  index,
  featured = false,
}: {
  project: Project;
  index: number;
  featured?: boolean;
  horizontal?: boolean;
}) {
  const { lang, t } = useLang();
  const description = lang === "en" ? project.description_en : project.description;
  const inProgress = project.status === "in-progress";
  const isPrivate = !project.github;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.07 }}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        borderRadius: "1rem",
        border: "1px solid var(--border)",
        background: "var(--surface)",
        padding: featured ? "1.75rem" : "1.25rem",
        overflow: "hidden",
        transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
        height: "100%",
      }}
      whileHover={{
        y: -4,
        boxShadow: "0 0 32px -8px rgba(245,111,13,0.5)",
        borderColor: "#f56f0d",
      }}
      data-cursor-hover
    >
      {/* Decoración diagonal featured */}
      {featured && (
        <div style={{
          position: "absolute", top: 0, right: 0,
          width: 64, height: 64, overflow: "hidden", borderRadius: "0 1rem 0 0",
        }}>
          <div style={{
            position: "absolute", top: -32, right: -32,
            width: 64, height: 64, transform: "rotate(45deg)",
            background: "rgba(245,111,13,0.2)",
          }} />
        </div>
      )}

      {/* Número proyecto */}
      {featured && (
        <span style={{
          position: "absolute", top: "0.5rem", left: "1rem",
          fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700,
          color: "#f56f0d", opacity: 0.18, userSelect: "none", pointerEvents: "none",
        }}>
          {String(index + 1).padStart(2, "0")}
        </span>
      )}

      {/* Header: título + badge */}
      <div style={{
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        gap: "0.75rem", marginBottom: "0.75rem",
        marginTop: featured ? "1.25rem" : 0,
      }}>
        <h3 style={{
          fontFamily: "var(--font-display)",
          fontSize: featured ? "1.2rem" : "1rem",
          fontWeight: 700,
          color: "var(--text-primary)",
          flex: 1, wordBreak: "break-word",
        }}>
          {project.title}
        </h3>
        <span style={{
          display: "flex", alignItems: "center", gap: "0.35rem",
          borderRadius: "999px",
          border: `1px solid ${inProgress ? "rgba(245,111,13,0.4)" : "rgba(74,222,128,0.4)"}`,
          padding: "0.2rem 0.65rem",
          fontSize: "0.72rem",
          color: inProgress ? "#f56f0d" : "#4ade80",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: inProgress ? "#f56f0d" : "#4ade80",
          }} />
          {inProgress ? t.projects.statusInProgress : t.projects.statusCompleted}
        </span>
      </div>

      {/* Descripción */}
      <p style={{
        flex: 1,
        fontSize: featured ? "0.95rem" : "0.85rem",
        lineHeight: 1.65,
        color: "var(--text-secondary)",
        marginBottom: "1rem",
      }}>
        {description}
      </p>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1rem" }}>
        {project.tags.map((tag) => {
          const c = tagColor(tag);
          return (
            <span key={tag} style={{
              borderRadius: "999px",
              border: `1px solid ${c.border}`,
              background: c.bg,
              padding: "0.15rem 0.6rem",
              fontSize: "0.72rem",
              color: c.color,
            }}>
              {tag}
            </span>
          );
        })}
      </div>

      {/* Links */}
      <div style={{ display: "flex", gap: "1rem", fontSize: "0.85rem" }}>
        {isPrivate ? (
          <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "var(--text-secondary)", opacity: 0.5 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            {t.projects.private}
          </span>
        ) : (
          <a href={project.github!} target="_blank" rel="noopener noreferrer"
            style={{ color: "var(--text-secondary)", textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#f56f0d")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
          >
            {t.projects.code} →
          </a>
        )}
        {project.demo ? (
          <a href={project.demo} target="_blank" rel="noopener noreferrer"
            style={{ color: "var(--text-secondary)", textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#f56f0d")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
          >
            {t.projects.demo} →
          </a>
        ) : (
          <span style={{ color: "var(--text-secondary)", opacity: 0.3 }}>{t.projects.demo}</span>
        )}
      </div>
    </motion.article>
  );
}
