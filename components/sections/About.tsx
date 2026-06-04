"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// About: bio corta + highlights del stack.

import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";

const highlights = [
  {
    title: "Cloud & DevOps",
    desc: "Infraestructura en AWS y Azure, Docker, CI/CD y arquitecturas serverless.",
  },
  {
    title: "Full-Stack",
    desc: "APIs con FastAPI y Java, frontends con React, Next.js y Flutter.",
  },
  {
    title: "Data Governance",
    desc: "Calidad, gobierno y migracion de datos preservando seguridad y estructura.",
  },
];

export default function About() {
  return (
    <section id="about" className="bg-background py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle
          title="Sobre mi"
          subtitle="Ingeniero enfocado en construir software confiable de punta a punta."
        />

        <div className="grid gap-12 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <p className="text-lg leading-relaxed text-text-secondary">
              Soy <span className="text-text-primary">Kevin Gonzalez</span>,
              Cloud & DevOps Engineer y desarrollador Full-Stack desde Bogota.
              Diseno y despliego sistemas que combinan la nube, automatizacion y
              buenas practicas de gobierno de datos.
            </p>
            <p className="mt-5 text-lg leading-relaxed text-text-secondary">
              Trabajo con Python, FastAPI, Java, TypeScript, React y Flutter,
              apoyado en Docker, AWS y Azure para entregar productos escalables
              y mantenibles.
            </p>
          </motion.div>

          <div className="grid gap-4">
            {highlights.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.1 }}
                className="rounded-2xl border border-white/5 bg-surface p-6 transition-colors hover:border-orange-primary/50"
              >
                <h3 className="font-display text-lg font-bold text-orange-primary">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-text-secondary">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
