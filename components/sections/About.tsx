"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// About: foto placeholder (iniciales KG) + bio bilingue + 3 highlights.

import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";
import { useLang } from "@/lib/i18n/LangContext";

export default function About() {
  const { t } = useLang();

  return (
    <section id="about" className="bg-background py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          number={t.about.number}
          label={t.about.label}
          title={t.about.title}
          subtitle={t.about.subtitle}
        />

        <div className="grid gap-12 md:grid-cols-[260px_1fr] md:gap-16">
          {/* Foto placeholder con iniciales KG (hasta agregar public/photo.jpg) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mx-auto w-full max-w-[260px]"
          >
            <div
              className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-2xl border border-orange-primary/30 bg-surface"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 50% 30%, rgba(240,100,0,0.18), transparent 60%)",
              }}
            >
              <span className="font-display text-7xl font-bold text-orange-primary">
                KG
              </span>
            </div>
            <p className="mt-3 text-center text-xs text-text-secondary/60">
              {t.about.photoHint}
            </p>
          </motion.div>

          <div>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-lg leading-relaxed text-text-secondary"
            >
              {t.about.bio}
            </motion.p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {t.about.highlights.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                    delay: i * 0.1,
                  }}
                  className="rounded-2xl border border-white/5 bg-surface p-5 transition-colors hover:border-orange-primary/50"
                  data-cursor-hover
                >
                  <span
                    aria-hidden
                    className="mb-3 block h-1 w-6 bg-orange-primary"
                    style={{
                      clipPath: "polygon(30% 0, 100% 0, 70% 100%, 0 100%)",
                    }}
                  />
                  <h3 className="font-display text-base font-bold text-orange-primary">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-text-secondary">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
