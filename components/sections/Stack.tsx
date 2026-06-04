"use client";

import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";
import { useLang } from "@/lib/i18n/LangContext";

const ICON_PATHS: Record<string, React.ReactNode> = {
  cloud:    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />,
  backend:  <>
              <path d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
              <circle cx="9" cy="9" r="1" /><circle cx="9" cy="15" r="1" />
            </>,
  frontend: <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>,
  data:     <path d="M18 20V10M12 20V4M6 20v-6" />,
  db:       <>
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
            </>,
};

const categories = [
  {
    icon: "cloud",
    title: "Cloud & DevOps",
    span: 2,
    techs: ["AWS", "Docker", "Kubernetes", "Terraform", "Azure", "Azure DevOps", "GitHub Actions", "CI/CD", "AWS Lambda", "EC2", "S3"],
  },
  {
    icon: "backend",
    title: "Backend",
    span: 1,
    techs: ["Python", "FastAPI", "Java", "Spring Boot", "Node.js", "Dart", "REST APIs"],
  },
  {
    icon: "frontend",
    title: "Frontend",
    span: 1,
    techs: ["TypeScript", "React", "Flutter", "Three.js", "Next.js", "HTML/CSS", "GSAP", "Tailwind"],
  },
  {
    icon: "data",
    title: "Data & IA",
    span: 1,
    techs: ["DAMA-DMBOK", "Great Expectations", "Databricks", "LangChain", "PySpark", "Power BI", "LlamaIndex", "RAG", "OpenAI", "Anthropic"],
  },
  {
    icon: "db",
    title: "Databases",
    span: 1,
    techs: ["MySQL", "PostgreSQL", "Supabase", "DynamoDB", "Redis", "Oracle", "MariaDB"],
  },
] as const;

// Colores de acento por categoría
const ACCENT: Record<string, string> = {
  cloud:    "#f56f0d",
  backend:  "#e05a0c",
  frontend: "#ff8c00",
  data:     "#ff6a00",
  db:       "#f56f0d",
};

export default function Stack() {
  const { t } = useLang();

  return (
    <section id="stack" className="section-glass relative overflow-hidden py-10 md:py-14 lg:py-20">
      {/* Watermark fondo */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-8 -right-6 select-none font-display text-[220px] font-bold leading-none text-orange-primary"
        style={{ opacity: 0.03 }}
      >
        {t.stack.number}
      </span>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          number={t.stack.number}
          label={t.stack.label}
          title={t.stack.title}
          subtitle={t.stack.subtitle}
        />

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => {
            const accent = ACCENT[cat.icon];
            return (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.015 }}
                className={cat.span === 2 ? "sm:col-span-2 lg:col-span-2" : ""}
                style={{
                  position: "relative",
                  borderRadius: "1.25rem",
                  overflow: "hidden",
                  background: "var(--surface)",
                  border: "1px solid rgba(245,111,13,0.10)",
                  transition: "box-shadow 0.3s ease, border-color 0.3s ease",
                  cursor: "default",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 1px ${accent}40, 0 8px 40px ${accent}18`;
                  (e.currentTarget as HTMLElement).style.borderColor = `${accent}35`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,111,13,0.10)";
                }}
                data-cursor-hover
              >
                {/* Línea superior naranja */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: "2px",
                  background: `linear-gradient(to right, ${accent}, transparent)`,
                }} />

                {/* Gradiente sutil de fondo */}
                <div style={{
                  position: "absolute", inset: 0, pointerEvents: "none",
                  background: `radial-gradient(ellipse at top left, ${accent}0a 0%, transparent 65%)`,
                }} />

                {/* Número watermark */}
                <span aria-hidden style={{
                  position: "absolute", bottom: "0.75rem", right: "1.1rem",
                  fontFamily: "var(--font-display)", fontSize: "3.5rem", fontWeight: 800,
                  color: accent, opacity: 0.07, userSelect: "none", lineHeight: 1,
                }}>
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div style={{ padding: "1.5rem", position: "relative" }}>
                  {/* Header: icono + título */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "1.25rem" }}>
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      width: 44, height: 44, borderRadius: "0.75rem", flexShrink: 0,
                      background: `linear-gradient(135deg, ${accent}22, ${accent}0e)`,
                      border: `1px solid ${accent}30`,
                      color: accent,
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        {ICON_PATHS[cat.icon]}
                      </svg>
                    </div>
                    <h3 style={{
                      fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700,
                      color: "var(--text-primary)", letterSpacing: "-0.01em",
                    }}>
                      {cat.title}
                    </h3>
                  </div>

                  {/* Separador */}
                  <div style={{
                    height: "1px", marginBottom: "1.1rem",
                    background: `linear-gradient(to right, ${accent}25, transparent)`,
                  }} />

                  {/* Pills */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {cat.techs.map((tech) => (
                      <span key={tech} style={{
                        borderRadius: "0.5rem",
                        border: "1px solid rgba(245,111,13,0.12)",
                        background: "rgba(245,111,13,0.05)",
                        padding: "0.22rem 0.65rem",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        color: "var(--text-secondary)",
                        letterSpacing: "0.01em",
                        transition: "background 0.2s, color 0.2s",
                      }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.background = `${accent}18`;
                          (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.background = "rgba(245,111,13,0.05)";
                          (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
