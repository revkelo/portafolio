"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// Stack: cards de categoria con hover naranja. Cada card lista sus tecnologias.
// Para agregar tecnologias, editar el array `categories`.

import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";
import { useLang } from "@/lib/i18n/LangContext";

// Iconos SVG inline simples por categoria (trazos, sin dependencias externas).
const icons: Record<string, React.ReactNode> = {
  cloud: (
    <path d="M17.5 19a4.5 4.5 0 0 0 .5-8.97A6 6 0 0 0 6.34 9.5 4 4 0 0 0 7 17.5" />
  ),
  backend: <path d="M4 6h16M4 12h16M4 18h10" />,
  frontend: <path d="m8 6-6 6 6 6M16 6l6 6-6 6" />,
  data: <path d="M3 6c0 1.66 4 3 9 3s9-1.34 9-3-4-3-9-3-9 1.34-9 3Zm0 0v12c0 1.66 4 3 9 3s9-1.34 9-3V6" />,
  db: <path d="M12 8c4.97 0 9-1.34 9-3s-4.03-3-9-3-9 1.34-9 3 4.03 3 9 3Zm9 4c0 1.66-4 3-9 3s-9-1.34-9-3m18-5v10c0 1.66-4 3-9 3s-9-1.34-9-3V7" />,
};

interface Category {
  icon: keyof typeof icons;
  title: string;
  techs: string[];
  // Clases de span para el bento grid (grid-cols-4 en desktop).
  span: string;
}

const categories: Category[] = [
  {
    icon: "cloud",
    title: "Cloud & DevOps",
    techs: [
      "AWS",
      "Docker",
      "Kubernetes",
      "Terraform",
      "Azure",
      "GitHub Actions",
      "CI/CD",
    ],
    // La mas importante: ancha en desktop, ancha en tablet.
    span: "sm:col-span-2 lg:col-span-2",
  },
  {
    icon: "backend",
    title: "Backend",
    techs: ["Python", "FastAPI", "Java", "Spring Boot"],
    span: "lg:col-span-1",
  },
  {
    icon: "frontend",
    title: "Frontend",
    techs: ["TypeScript", "React", "Flutter", "Three.js"],
    // Columna alta a la derecha: ocupa dos filas en desktop.
    span: "lg:col-span-1 lg:row-span-2",
  },
  {
    icon: "data",
    title: "Data & IA",
    techs: ["DAMA-DMBOK", "Great Expectations", "Databricks", "LangChain"],
    span: "lg:col-span-1",
  },
  {
    icon: "db",
    title: "Databases",
    techs: ["MySQL", "PostgreSQL", "Supabase", "DynamoDB"],
    span: "sm:col-span-2 lg:col-span-2",
  },
];

export default function Stack() {
  const { t } = useLang();

  // Efecto tilt 3D: calcula el angulo de rotacion segun la posicion del cursor.
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    e.currentTarget.style.transform = `perspective(600px) rotateY(${
      x * 12
    }deg) rotateX(${-y * 12}deg) scale(1.02)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform =
      "perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)";
  };

  return (
    <section
      id="stack"
      className="section-glass relative overflow-hidden py-16 md:py-24 lg:py-32"
    >
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          number={t.stack.number}
          label={t.stack.label}
          title={t.stack.title}
          subtitle={t.stack.subtitle}
        />

        {/* Las tecnologias orbitando en 3D ahora viven en el GlobalScene. */}

        {/* Bento grid: cards de distintos tamanos. 1 col movil, 2 tablet, 4 desktop. */}
        <div className="grid auto-rows-[minmax(0,1fr)] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ transition: "transform 0.15s ease" }}
              className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface p-6 hover:border-orange-primary hover:shadow-[0_0_30px_-10px_rgba(245,111,13,0.5)] ${cat.span}`}
              data-cursor-hover
            >
              {/* Numero de categoria (01-05) en naranja semi-transparente */}
              <span
                aria-hidden
                className="pointer-events-none absolute right-4 top-3 select-none font-display text-3xl font-bold text-orange-primary opacity-15"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-primary/10 text-orange-primary transition-colors group-hover:bg-orange-primary/20">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {icons[cat.icon]}
                  </svg>
                </span>
                <h3 className="font-display text-lg font-bold text-text-primary transition-colors group-hover:text-orange-primary">
                  {cat.title}
                </h3>
              </div>

              <ul className="flex flex-wrap gap-2">
                {cat.techs.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full border border-border bg-surface-alt/50 px-3 py-1 text-sm text-text-secondary transition-colors group-hover:border-orange-primary/30"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
