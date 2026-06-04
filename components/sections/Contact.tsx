"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// Contact: email grande clickeable + GitHub, LinkedIn, Email. CTA "Hablemos".

import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";

const EMAIL = "kgagudelo@gmail.com";

const channels = [
  { label: "GitHub", href: "https://github.com/revkelo" },
  { label: "LinkedIn", href: "https://linkedin.com/in/kagonzalezdev" },
  { label: "Email", href: `mailto:${EMAIL}` },
];

export default function Contact() {
  return (
    <section id="contacto" className="bg-surface-alt py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle
          title="Contacto"
          subtitle="Tienes un proyecto en mente? Hablemos."
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <a
            href={`mailto:${EMAIL}`}
            className="font-display text-3xl font-bold text-text-primary transition-colors hover:text-orange-primary sm:text-5xl"
          >
            {EMAIL}
          </a>

          <div className="mt-10 flex flex-wrap gap-4">
            {channels.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  c.href.startsWith("http") ? "noopener noreferrer" : undefined
                }
                className="rounded-full border border-orange-primary/40 px-6 py-3 text-orange-primary transition-colors hover:bg-orange-primary hover:text-background"
              >
                {c.label}
              </a>
            ))}
          </div>

          <p className="mt-16 font-display text-2xl font-bold text-orange-primary">
            Hablemos.
          </p>
        </motion.div>
      </div>

      <footer className="mx-auto mt-20 max-w-6xl px-6">
        <div className="border-t border-white/5 pt-8 text-sm text-text-secondary">
          © {new Date().getFullYear()} Kevin Gonzalez — Bogota, Colombia.
        </div>
      </footer>
    </section>
  );
}
