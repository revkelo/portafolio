"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/lib/data/projects";
import { useLang } from "@/lib/i18n/LangContext";

const TAG_ICONS: Record<string, string> = {
  "Python": "python", "TypeScript": "ts", "React": "react", "Next.js": "nextjs",
  "Flutter": "flutter", "Dart": "dart", "FastAPI": "fastapi", "Java": "java",
  "Spring Boot": "spring", "Docker": "docker", "AWS": "aws", "AWS Lambda": "aws",
  "DynamoDB": "dynamodb", "Supabase": "supabase", "Three.js": "threejs",
  "Vercel": "vercel", "NGINX": "nginx", "Redis": "redis",
  "JavaScript": "js", "HTML": "html", "CSS": "css",
};

function tagColor(tag: string) {
  const t = tag.toLowerCase();
  if (t.includes("python"))    return { bg: "rgba(59,130,246,0.12)", color: "#60a5fa", border: "rgba(59,130,246,0.25)" };
  if (t.includes("typescript") || t.includes("react")) return { bg: "rgba(6,182,212,0.12)", color: "#22d3ee", border: "rgba(6,182,212,0.25)" };
  if (t.includes("flutter") || t.includes("dart")) return { bg: "rgba(14,165,233,0.12)", color: "#38bdf8", border: "rgba(14,165,233,0.25)" };
  if (t.includes("aws") || t.includes("docker")) return { bg: "rgba(245,111,13,0.12)", color: "#fb923c", border: "rgba(245,111,13,0.25)" };
  if (t.includes("fastapi"))   return { bg: "rgba(34,197,94,0.12)", color: "#4ade80", border: "rgba(34,197,94,0.25)" };
  return { bg: "var(--surface-alt)", color: "var(--text-secondary)", border: "var(--border)" };
}

export default function ProjectCard({ project, index, featured = false }: {
  project: Project; index: number; featured?: boolean;
}) {
  const { lang, t } = useLang();
  const [hovered, setHovered] = useState(false);
  const description = lang === "en" ? project.description_en : project.description;
  const inProgress  = project.status === "in-progress";
  const isPrivate   = !project.github;

  // Tech icons available for this project
  const techIcons = project.tags
    .map(tag => ({ tag, slug: TAG_ICONS[tag] }))
    .filter(x => x.slug)
    .slice(0, 6);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.07 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", display: "flex", flexDirection: "column",
        borderRadius: "1.1rem", overflow: "hidden",
        border: "1px solid rgba(245,111,13,0.10)",
        background: "var(--surface)",
        padding: featured ? "1.75rem" : "1.25rem",
        height: "100%",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
      }}
      whileHover={{
        y: -5,
        boxShadow: "0 0 0 1px rgba(245,111,13,0.3), 0 12px 40px rgba(245,111,13,0.12)",
        borderColor: "rgba(245,111,13,0.3)",
      }}
      data-cursor-hover
    >
      {/* Top accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(to right, ${inProgress ? "#f56f0d" : "#4ade80"}, transparent)`,
        opacity: hovered ? 1 : 0.4, transition: "opacity 0.3s",
      }} />

      {/* Hover: tech icons preview overlay */}
      <AnimatePresence>
        {hovered && techIcons.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "absolute", top: "0.75rem", right: "0.75rem",
              display: "flex", gap: "0.3rem",
              background: "var(--glass-bg)", backdropFilter: "blur(8px)",
              border: "1px solid rgba(245,111,13,0.2)",
              borderRadius: "0.6rem", padding: "0.35rem 0.5rem",
            }}
          >
            {techIcons.map(({ tag, slug }) => (
              <img
                key={tag}
                src={`https://skillicons.dev/icons?i=${slug}`}
                alt={tag}
                title={tag}
                width={18}
                height={18}
                style={{ objectFit: "contain" }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Featured number */}
      {featured && (
        <span style={{
          position: "absolute", bottom: "0.75rem", right: "1rem",
          fontFamily: "var(--font-display)", fontSize: "4rem", fontWeight: 900,
          color: "#f56f0d", opacity: 0.05, userSelect: "none", lineHeight: 1,
          letterSpacing: "-0.05em",
        }}>
          {String(index + 1).padStart(2, "0")}
        </span>
      )}

      {/* Title + status */}
      <div style={{
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        gap: "0.75rem", marginBottom: "0.7rem",
        marginTop: featured ? "0.5rem" : 0,
      }}>
        <h3 style={{
          fontFamily: "var(--font-display)", fontSize: featured ? "1.15rem" : "0.95rem",
          fontWeight: 700, color: "var(--text-primary)", flex: 1,
        }}>
          {project.title}
        </h3>
        <span style={{
          display: "flex", alignItems: "center", gap: "0.3rem",
          borderRadius: "999px",
          border: `1px solid ${inProgress ? "rgba(245,111,13,0.35)" : "rgba(74,222,128,0.35)"}`,
          padding: "0.18rem 0.6rem", fontSize: "0.68rem",
          color: inProgress ? "#f56f0d" : "#4ade80", whiteSpace: "nowrap", flexShrink: 0,
        }}>
          <motion.span
            animate={inProgress ? { opacity: [1, 0.3, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ width: 5, height: 5, borderRadius: "50%", background: inProgress ? "#f56f0d" : "#4ade80", display: "block" }}
          />
          {inProgress ? t.projects.statusInProgress : t.projects.statusCompleted}
        </span>
      </div>

      {/* Description */}
      <p style={{
        flex: 1, fontSize: featured ? "0.9rem" : "0.82rem",
        lineHeight: 1.7, color: "var(--text-secondary)", marginBottom: "1rem",
      }}>
        {description}
      </p>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "1rem" }}>
        {project.tags.map(tag => {
          const c = tagColor(tag);
          return (
            <span key={tag} style={{
              borderRadius: "0.45rem", border: `1px solid ${c.border}`,
              background: c.bg, padding: "0.18rem 0.55rem",
              fontSize: "0.7rem", color: c.color, fontWeight: 500,
            }}>
              {tag}
            </span>
          );
        })}
      </div>

      {/* Links */}
      <div style={{ display: "flex", gap: "0.85rem", fontSize: "0.82rem", marginTop: "auto" }}>
        {isPrivate ? (
          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "var(--text-secondary)", opacity: 0.4 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            {t.projects.private}
          </span>
        ) : (
          <a href={project.github!} target="_blank" rel="noopener noreferrer"
            style={{ color: "var(--text-secondary)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.3rem", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#f56f0d")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
            {t.projects.code}
          </a>
        )}
        {project.demo ? (
          <a href={project.demo} target="_blank" rel="noopener noreferrer"
            style={{ color: "var(--text-secondary)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.3rem", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#f56f0d")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            {t.projects.demo}
          </a>
        ) : null}
      </div>
    </motion.article>
  );
}
