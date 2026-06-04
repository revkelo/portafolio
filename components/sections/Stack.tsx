"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// Stack: grid responsive de categorias tecnologicas con tilt 3D en hover.

import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";
import { useLang } from "@/lib/i18n/LangContext";

const icons: Record<string, React.ReactNode> = {
  cloud:    <path d="M17.5 19a4.5 4.5 0 0 0 .5-8.97A6 6 0 0 0 6.34 9.5 4 4 0 0 0 7 17.5" />,
  backend:  <path d="M4 6h16M4 12h16M4 18h10" />,
  frontend: <path d="m8 6-6 6 6 6M16 6l6 6-6 6" />,
  data:     <path d="M3 6c0 1.66 4 3 9 3s9-1.34 9-3-4-3-9-3-9 1.34-9 3Zm0 0v12c0 1.66 4 3 9 3s9-1.34 9-3V6" />,
  db:       <path d="M12 8c4.97 0 9-1.34 9-3s-4.03-3-9-3-9 1.34-9 3 4.03 3 9 3Zm9 4c0 1.66-4 3-9 3s-9-1.34-9-3m18-5v10c0 1.66-4 3-9 3s-9-1.34-9-3V7" />,
};

const categories = [
  {
    icon: "cloud" as const,
    title: "Cloud & DevOps",
    techs: ["AWS", "Docker", "Kubernetes", "Terraform", "Azure", "GitHub Actions", "CI/CD"],
    wide: true,
  },
  {
    icon: "backend" as const,
    title: "Backend",
    techs: ["Python", "FastAPI", "Java", "Spring Boot", "Node.js"],
    wide: false,
  },
  {
    icon: "frontend" as const,
    title: "Frontend",
    techs: ["TypeScript", "React", "Flutter", "Three.js", "Next.js"],
    wide: false,
  },
  {
    icon: "data" as const,
    title: "Data & IA",
    techs: ["DAMA-DMBOK", "Great Expectations", "Databricks", "LangChain", "PySpark"],
    wide: false,
  },
  {
    icon: "db" as const,
    title: "Databases",
    techs: ["MySQL", "PostgreSQL", "Supabase", "DynamoDB", "Redis"],
    wide: true,
  },
];

export default function Stack() {
  const { t } = useLang();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    e.currentTarget.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.02)`;
  };
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)";
  };

  return (
    <section id="stack" className="section-glass relative overflow-hidden py-16 md:py-24 lg:py-32">
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          number={t.stack.number}
          label={t.stack.label}
          title={t.stack.title}
          subtitle={t.stack.subtitle}
        />

        {/* Grid: 1 col mobile → 2 cols tablet → 3 cols desktop */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(1, 1fr)", gap: "1.25rem" }}
          className="sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transition: "transform 0.15s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "1rem",
                padding: "1.5rem",
                position: "relative",
                overflow: "hidden",
                // Cards "wide" ocupan 2 columnas en desktop
                gridColumn: cat.wide ? "span 1" : undefined,
              }}
              className={cat.wide ? "lg:col-span-1 sm:col-span-2 lg:col-span-1" : ""}
              data-cursor-hover
            >
              {/* Número categoría */}
              <span
                aria-hidden
                style={{
                  position: "absolute", top: "0.75rem", right: "1rem",
                  fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700,
                  color: "#f56f0d", opacity: 0.12, userSelect: "none", pointerEvents: "none",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Ícono + título */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <span style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: 40, height: 40, borderRadius: "0.5rem",
                  background: "rgba(245,111,13,0.1)", color: "#f56f0d",
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    {icons[cat.icon]}
                  </svg>
                </span>
                <h3 style={{
                  fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 700,
                  color: "var(--text-primary)",
                }}>
                  {cat.title}
                </h3>
              </div>

              {/* Pills de tecnologías */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {cat.techs.map((tech) => (
                  <span
                    key={tech}
                    style={{
                      borderRadius: "999px",
                      border: "1px solid var(--border)",
                      background: "var(--surface-alt)",
                      padding: "0.2rem 0.75rem",
                      fontSize: "0.78rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
