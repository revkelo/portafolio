"use client";

import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";
import TechCarousel from "@/components/ui/TechCarousel";
import { useLang } from "@/lib/i18n/LangContext";

export default function About() {
  const { t } = useLang();

  return (
    <section
      id="about"
      className="section-glass relative overflow-hidden py-10 md:py-14 lg:py-20"
    >
      <span aria-hidden className="pointer-events-none absolute -top-8 -left-4 select-none font-display text-[200px] font-bold leading-none text-orange-primary opacity-5">
        {t.about.number}
      </span>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          number={t.about.number}
          label={t.about.label}
          title={t.about.title}
          subtitle={t.about.subtitle}
        />

        {/* ── Fila 1: foto | bio + código ── */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[280px_1fr] md:items-stretch md:gap-14">

          {/* Foto — igual que antes */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mx-auto w-full max-w-[280px] md:max-w-none"
          >
            <div className="relative aspect-[4/5] rounded-2xl">
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                <img
                  src="/photo.jpg"
                  alt="Kevin Gonzalez"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: "center 15%" }}
                />
              </div>
              <motion.div
                aria-hidden
                className="pointer-events-none absolute rounded-[20px]"
                style={{ inset: "-3px", border: "1.5px solid #f56f0d" }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.75 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
              />
            </div>
          </motion.div>

          {/* Bio + código — justify-between llena la altura de la foto */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <p className="text-base leading-relaxed md:text-[1.05rem]" style={{ color: "var(--text-primary)" }}>
              {t.about.bio}
            </p>

            {/* Info pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { icon: "🟢", label: "Disponible" },
                { icon: "☁️", label: "Cloud & DevOps" },
                { icon: "📍", label: "Bogotá, Colombia" },
                { icon: "🎓", label: "Ing. Sistemas — UEB" },
              ].map((pill) => (
                <span
                  key={pill.label}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.35rem",
                    padding: "0.3rem 0.75rem", borderRadius: "999px",
                    background: "rgba(245,111,13,0.07)",
                    border: "1px solid rgba(245,111,13,0.18)",
                    fontSize: "0.75rem", color: "var(--text-secondary)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  <span>{pill.icon}</span>
                  <span>{pill.label}</span>
                </span>
              ))}
            </div>

            <div
              className="rounded-xl p-4 font-mono text-xs leading-relaxed"
              style={{ background: "var(--code-bg)", border: "1px solid var(--code-border)" }}
            >
              <span style={{ color: "var(--code-keyword)" }}>const </span>
              <span style={{ color: "var(--code-str)" }}>kevin</span>
              <span style={{ color: "var(--code-brace)" }}> = &#123;</span><br />
              <span className="block pl-4" style={{ color: "var(--code-keyword)" }}>
                available: <span style={{ color: "var(--code-bool)" }}>true</span>,
              </span>
              <span className="block pl-4" style={{ color: "var(--code-keyword)" }}>
                location: <span style={{ color: "var(--code-str)" }}>&#39;Bogotá{" "}
                  <img src="https://flagcdn.com/16x12/co.png" alt="🇨🇴" width={16} height={12}
                    style={{ display: "inline", verticalAlign: "middle", marginBottom: 2 }} />
                &#39;</span>,
              </span>
              <span className="block pl-4" style={{ color: "var(--code-keyword)" }}>
                focus: <span style={{ color: "var(--code-str)" }}>&#39;Cloud &amp; DevOps&#39;</span>,
              </span>
              <span className="block pl-4" style={{ color: "var(--code-keyword)" }}>
                english: <span style={{ color: "var(--code-str)" }}>&#39;B1 (iTEP)&#39;</span>
              </span>
              <span style={{ color: "var(--code-brace)" }}>&#125;</span>
            </div>
          </motion.div>
        </div>

        {/* ── Fila 2: highlight cards — fila completa ── */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {t.about.highlights.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.1 }}
              className="relative overflow-hidden rounded-2xl border border-white/5 p-5 transition-all hover:border-orange-primary/40"
              style={{ background: "var(--surface)" }}
              data-cursor-hover
            >
              <span aria-hidden className="pointer-events-none absolute -top-1 right-2 select-none font-display text-4xl font-bold text-orange-primary" style={{ opacity: 0.12 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span aria-hidden className="mb-3 block h-1 w-6 bg-orange-primary" style={{ clipPath: "polygon(30% 0, 100% 0, 70% 100%, 0 100%)" }} />
              <h3 className="relative font-display text-base font-bold text-orange-primary">{item.title}</h3>
              <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Carrusel */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="mt-10"
        >
          <TechCarousel />
        </motion.div>
      </div>
    </section>
  );
}
