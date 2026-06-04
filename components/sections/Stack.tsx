"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// Stack: grid de iconos usando skillicons.dev (https://skillicons.dev).
// Para agregar tecnologias, anadir su slug al array `icons`.

import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";

// Slugs soportados por skillicons.dev
const icons = [
  "python",
  "fastapi",
  "java",
  "ts",
  "js",
  "react",
  "nextjs",
  "flutter",
  "docker",
  "aws",
  "azure",
  "postgres",
  "supabase",
  "git",
  "linux",
  "tailwind",
];

export default function Stack() {
  return (
    <section id="stack" className="bg-surface-alt py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle
          title="Stack"
          subtitle="Tecnologias con las que construyo a diario."
        />

        <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8">
          {icons.map((slug, i) => (
            <motion.div
              key={slug}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              className="flex aspect-square items-center justify-center rounded-xl border border-white/5 bg-surface p-3 transition-colors hover:border-orange-primary"
              data-cursor-hover
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://skillicons.dev/icons?i=${slug}`}
                alt={slug}
                width={48}
                height={48}
                loading="lazy"
                className="h-full w-full object-contain"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
