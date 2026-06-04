"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// About: foto sticky, bio, highlights y bloque de código.

import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";
import TechCarousel from "@/components/ui/TechCarousel";
import { useLang } from "@/lib/i18n/LangContext";

export default function About() {
  const { t } = useLang();

  return (
    <section
      id="about"
      className="section-glass relative overflow-hidden py-16 md:py-24 lg:py-32"
    >
      {/* Watermark */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-8 -left-4 select-none font-display text-[200px] font-bold leading-none text-orange-primary opacity-5"
      >
        {t.about.number}
      </span>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          number={t.about.number}
          label={t.about.label}
          title={t.about.title}
          subtitle={t.about.subtitle}
        />

        <div className="grid gap-12 md:grid-cols-[280px_1fr] md:items-start md:gap-16">

          {/* Foto sticky */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mx-auto w-full max-w-[260px] md:max-w-none md:sticky md:top-24"
          >
            <div className="relative aspect-[4/5] rounded-2xl">
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                <img
                  src="/photo.jpg"
                  alt="Kevin Gonzalez"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: "center 15%" }}
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(245,111,13,0.3) 0%, transparent 55%)" }}
                />
              </div>
              {/* Marco SVG animado */}
              <svg
                aria-hidden
                className="pointer-events-none absolute -inset-2 h-[calc(100%+1rem)] w-[calc(100%+1rem)]"
                viewBox="0 0 100 125"
                preserveAspectRatio="none"
              >
                <motion.path
                  d="M 7.5,1.5 L 92.5,1.5 Q 98.5,1.5 98.5,7.5 L 98.5,117.5 Q 98.5,123.5 92.5,123.5 L 7.5,123.5 Q 1.5,123.5 1.5,117.5 L 1.5,7.5 Q 1.5,1.5 7.5,1.5 Z"
                  fill="none"
                  stroke="#f56f0d"
                  strokeWidth="1.5"
                  pathLength={1}
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.7 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 1.4, ease: "easeInOut", delay: 0.3 }}
                />
              </svg>
            </div>
          </motion.div>

          {/* Contenido */}
          <div className="flex flex-col gap-8">

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-lg leading-relaxed"
              style={{ color: "var(--text-primary)" }}
            >
              {t.about.bio}
            </motion.p>

            {/* Highlights */}
            <div className="grid gap-4 sm:grid-cols-3">
              {t.about.highlights.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.1 }}
                  className="relative overflow-hidden rounded-2xl border border-white/5 p-5 transition-colors hover:border-orange-primary/40"
                  style={{ background: "var(--surface)" }}
                  data-cursor-hover
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -top-1 right-2 select-none font-display text-4xl font-bold text-orange-primary"
                    style={{ opacity: 0.12 }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    aria-hidden
                    className="mb-3 block h-1 w-6 bg-orange-primary"
                    style={{ clipPath: "polygon(30% 0, 100% 0, 70% 100%, 0 100%)" }}
                  />
                  <h3 className="relative font-display text-base font-bold text-orange-primary">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Código decorativo */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
              className="rounded-xl p-4 font-mono text-xs"
              style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(245,111,13,0.15)" }}
            >
              <span style={{ color: "var(--text-secondary)" }}>const </span>
              <span style={{ color: "#f56f0d" }}>kevin</span>
              <span style={{ color: "var(--text-primary)" }}> = &#123;</span>
              <br />
              <span className="block pl-4" style={{ color: "var(--text-secondary)" }}>
                available: <span style={{ color: "#4ade80" }}>true</span>,
              </span>
              <span className="block pl-4" style={{ color: "var(--text-secondary)" }}>
                location: <span style={{ color: "#f56f0d" }}>&#39;Bogotá 🇨🇴&#39;</span>,
              </span>
              <span className="block pl-4" style={{ color: "var(--text-secondary)" }}>
                focus: <span style={{ color: "#f56f0d" }}>&#39;Cloud &amp; DevOps&#39;</span>,
              </span>
              <span className="block pl-4" style={{ color: "var(--text-secondary)" }}>
                english: <span style={{ color: "#f56f0d" }}>&#39;B1 (iTEP)&#39;</span>
              </span>
              <span style={{ color: "var(--text-primary)" }}>&#125;</span>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Carrusel de tecnologías debajo del bloque de código */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
        className="mt-12"
      >
        <TechCarousel />
      </motion.div>
    </section>
  );
}
