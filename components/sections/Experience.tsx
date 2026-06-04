"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// Experience: timeline vertical con linea naranja a la izquierda y una card
// por experiencia (empresa, rol, periodo, badge de tipo y bullets).
// La data vive en el sistema i18n (t.experience.items).

import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";
import { useLang } from "@/lib/i18n/LangContext";

export default function Experience() {
  const { t } = useLang();

  return (
    <section id="experience" className="section-glass relative py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          number={t.experience.number}
          label={t.experience.label}
          title={t.experience.title}
          subtitle={t.experience.subtitle}
        />

        {/* Timeline: linea naranja a la izquierda + cards */}
        <div className="relative pl-8 sm:pl-10">
          {/* Linea vertical que crece hacia abajo al entrar en viewport */}
          <motion.span
            aria-hidden
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ transformOrigin: "top" }}
            className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-orange-primary via-orange-primary/40 to-transparent sm:left-[9px]"
          />

          <div className="flex flex-col gap-8">
            {t.experience.items.map((item, i) => (
              <motion.div
                key={item.company}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.2 }}
                className="relative"
              >
                {/* Nodo del timeline */}
                <span
                  aria-hidden
                  className="absolute -left-8 top-6 flex h-4 w-4 items-center justify-center sm:-left-10"
                >
                  <span className="h-4 w-4 rounded-full border-2 border-orange-primary bg-background" />
                  <span className="absolute h-1.5 w-1.5 rounded-full bg-orange-primary" />
                </span>

                <div
                  className="rounded-2xl border border-white/5 bg-surface p-5 transition-colors hover:border-orange-primary/50 sm:p-6"
                  data-cursor-hover
                >
                  <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                    <div>
                      <h3 className="font-display text-lg font-bold text-text-primary sm:text-xl">
                        {item.company}
                      </h3>
                      <p className="mt-0.5 font-medium text-orange-primary">
                        {item.role}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full border border-orange-primary/30 px-3 py-1 text-xs font-medium uppercase tracking-wider text-orange-primary">
                      {item.type}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-text-secondary/70">
                    {item.period}
                  </p>

                  <ul className="mt-4 flex flex-col gap-2">
                    {item.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex gap-2 text-sm leading-relaxed text-text-secondary"
                      >
                        <span aria-hidden className="text-orange-primary">
                          ·
                        </span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
