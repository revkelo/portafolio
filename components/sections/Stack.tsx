"use client";

import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";
import { useLang } from "@/lib/i18n/LangContext";

// Mapa tech → slug de skillicons.dev
const ICONS: Record<string, string> = {
  "AWS": "aws", "Docker": "docker", "Kubernetes": "kubernetes",
  "Terraform": "terraform", "Azure": "azure", "Azure DevOps": "azure",
  "GitHub Actions": "githubactions", "AWS Lambda": "aws", "EC2": "aws", "S3": "aws",
  "Python": "python", "FastAPI": "fastapi", "Java": "java",
  "Spring Boot": "spring", "Node.js": "nodejs", "Dart": "dart",
  "TypeScript": "ts", "React": "react", "Flutter": "flutter",
  "Three.js": "threejs", "Next.js": "nextjs", "HTML/CSS": "html",
  "Tailwind": "tailwind", "GSAP": "js",
  "PySpark": "python", "OpenAI": "openai", "PostgreSQL": "postgres",
  "MySQL": "mysql", "Supabase": "supabase", "Redis": "redis",
  "DynamoDB": "dynamodb", "MariaDB": "mysql",
  "LangChain": "python", "Databricks": "python",
};

function icon(slug: string) {
  return `https://skillicons.dev/icons?i=${slug}`;
}

const categories = [
  {
    key: "cloud",
    title: "Cloud & DevOps",
    badge: "Expert",
    badgeColor: "#22c55e",
    accent: "#f56f0d",
    span: 2,
    emoji: "☁️",
    techs: ["AWS","Docker","Kubernetes","Terraform","Azure","Azure DevOps","GitHub Actions","AWS Lambda","EC2","S3","CI/CD"],
  },
  {
    key: "backend",
    title: "Backend",
    badge: "Expert",
    badgeColor: "#22c55e",
    accent: "#fb923c",
    span: 1,
    emoji: "⚙️",
    techs: ["Python","FastAPI","Java","Spring Boot","Node.js","Dart","REST APIs"],
  },
  {
    key: "frontend",
    title: "Frontend",
    badge: "Advanced",
    badgeColor: "#a78bfa",
    accent: "#a78bfa",
    span: 1,
    emoji: "✦",
    techs: ["TypeScript","React","Flutter","Next.js","Three.js","HTML/CSS","Tailwind","GSAP"],
  },
  {
    key: "data",
    title: "Data & IA",
    badge: "Advanced",
    badgeColor: "#38bdf8",
    accent: "#38bdf8",
    span: 2,
    emoji: "◈",
    techs: ["PySpark","LangChain","Databricks","OpenAI","Great Expectations","Power BI","RAG","DAMA-DMBOK"],
  },
  {
    key: "db",
    title: "Databases",
    badge: "Advanced",
    badgeColor: "#4ade80",
    accent: "#4ade80",
    span: 1,
    emoji: "◉",
    techs: ["PostgreSQL","MySQL","Supabase","Redis","DynamoDB","MariaDB","Oracle"],
  },
] as const;

function TechChip({ name }: { name: string }) {
  const slug = ICONS[name];
  return (
    <motion.div
      whileHover={{ scale: 1.06, y: -1 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      style={{
        display: "flex", alignItems: "center", gap: 6,
        borderRadius: "0.55rem",
        border: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(255,255,255,0.04)",
        padding: "5px 10px",
        backdropFilter: "blur(6px)",
        cursor: "default",
        transition: "border-color 0.2s, background 0.2s",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "rgba(245,111,13,0.3)";
        el.style.background = "rgba(245,111,13,0.08)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "rgba(255,255,255,0.07)";
        el.style.background = "rgba(255,255,255,0.04)";
      }}
    >
      {slug && (
        <img
          src={icon(slug)}
          alt={name}
          width={15}
          height={15}
          style={{ objectFit: "contain", flexShrink: 0 }}
          loading="lazy"
        />
      )}
      <span style={{
        fontSize: "0.72rem", fontWeight: 500, whiteSpace: "nowrap",
        color: "var(--text-secondary)",
        fontFamily: "var(--font-display)",
        letterSpacing: "0.01em",
      }}>
        {name}
      </span>
    </motion.div>
  );
}

export default function Stack() {
  const { t } = useLang();

  return (
    <section id="stack" className="section-glass relative overflow-hidden py-10 md:py-14 lg:py-20">

      {/* Decoración fondo */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div style={{
          position: "absolute", top: "10%", right: "-10%",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,111,13,0.06) 0%, transparent 65%)",
        }} />
        <div style={{
          position: "absolute", bottom: "5%", left: "-5%",
          width: 350, height: 350, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(56,189,248,0.05) 0%, transparent 65%)",
        }} />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          number={t.stack.number}
          label={t.stack.label}
          title={t.stack.title}
          subtitle={t.stack.subtitle}
        />

        {/* Bento Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
              className={cat.span === 2 ? "sm:col-span-2 lg:col-span-2" : ""}
              style={{
                position: "relative", borderRadius: "1.5rem", overflow: "hidden",
                background: "var(--surface)",
                border: `1px solid ${cat.accent}18`,
                transition: "box-shadow 0.35s ease, border-color 0.35s ease, transform 0.2s ease",
              }}
              whileHover={{
                scale: 1.012,
                boxShadow: `0 0 0 1px ${cat.accent}35, 0 12px 50px ${cat.accent}14`,
              }}
              data-cursor-hover
            >
              {/* Gradiente diagonal de fondo */}
              <div aria-hidden style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: `linear-gradient(135deg, ${cat.accent}0d 0%, transparent 55%)`,
              }} />

              {/* Línea superior de acento */}
              <div aria-hidden style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 3,
                background: `linear-gradient(to right, ${cat.accent}cc, ${cat.accent}22, transparent)`,
              }} />

              {/* Número watermark */}
              <span aria-hidden style={{
                position: "absolute", bottom: "0.5rem", right: "1rem",
                fontFamily: "var(--font-display)", fontSize: "5rem", fontWeight: 900,
                color: cat.accent, opacity: 0.05, userSelect: "none", lineHeight: 1,
                letterSpacing: "-0.04em",
              }}>
                {String(i + 1).padStart(2, "0")}
              </span>

              <div style={{ padding: "1.4rem 1.4rem 1.5rem", position: "relative" }}>

                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    {/* Ícono emoji en caja */}
                    <div style={{
                      width: 48, height: 48, borderRadius: "0.9rem", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: `linear-gradient(135deg, ${cat.accent}20, ${cat.accent}08)`,
                      border: `1px solid ${cat.accent}28`,
                      fontSize: "1.35rem",
                    }}>
                      {cat.emoji}
                    </div>
                    <div>
                      <h3 style={{
                        fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 700,
                        color: "var(--text-primary)", letterSpacing: "-0.02em", lineHeight: 1.2,
                      }}>
                        {cat.title}
                      </h3>
                      <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: 2, display: "block" }}>
                        {cat.techs.length} tecnologías
                      </span>
                    </div>
                  </div>

                  {/* Badge de nivel */}
                  <span style={{
                    fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em",
                    textTransform: "uppercase", padding: "3px 8px", borderRadius: "999px",
                    background: `${cat.badgeColor}18`, color: cat.badgeColor,
                    border: `1px solid ${cat.badgeColor}30`, flexShrink: 0,
                    fontFamily: "var(--font-display)",
                  }}>
                    {cat.badge}
                  </span>
                </div>

                {/* Línea separadora con color de acento */}
                <div style={{
                  height: 1, marginBottom: "1rem",
                  background: `linear-gradient(to right, ${cat.accent}30, transparent)`,
                }} />

                {/* Tech chips */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                  {cat.techs.map((tech) => (
                    <TechChip key={tech} name={tech} />
                  ))}
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
