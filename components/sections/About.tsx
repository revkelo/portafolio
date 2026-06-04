"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// About: foto placeholder (iniciales KG) + bio bilingue + 3 highlights.

import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";
import { useLang } from "@/lib/i18n/LangContext";

export default function About() {
  const { t } = useLang();

  return (
    <section
      id="about"
      className="section-glass relative overflow-hidden py-16 md:py-24 lg:py-32"
    >
      {/* Las geometrias 3D del about ahora viven en el GlobalScene. */}

      {/* Watermark gigante del numero de seccion */}
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

        <div className="grid gap-12 md:grid-cols-[260px_1fr] md:gap-16">
          {/* Foto placeholder con iniciales KG (hasta agregar public/photo.jpg) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mx-auto w-full max-w-[260px]"
          >
            <div className="relative aspect-[4/5] rounded-2xl">
              <div className="absolute inset-0 overflow-hidden rounded-2xl border border-white/10">
                <img
                  src="/photo.jpg"
                  alt="Kevin Gonzalez"
                  className="h-full w-full object-cover object-top"
                />
                {/* Glow naranja sutil en la esquina inferior */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(240,100,0,0.25) 0%, transparent 50%)",
                  }}
                />
              </div>

              {/* Marco naranja que se traza al entrar en viewport */}
              <svg
                aria-hidden
                className="pointer-events-none absolute -inset-2 h-[calc(100%+1rem)] w-[calc(100%+1rem)]"
                viewBox="0 0 100 125"
                preserveAspectRatio="none"
              >
                <motion.rect
                  x="1.5"
                  y="1.5"
                  width="97"
                  height="122"
                  rx="6"
                  fill="none"
                  stroke="#f06400"
                  strokeWidth="1.5"
                  pathLength={1}
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 1.4, ease: "easeInOut", delay: 0.2 }}
                />
              </svg>
            </div>
          </motion.div>

          <div>
            {/* Bio con scrub: cada palabra se ilumina secuencialmente al scrollear */}
            <p className="text-lg leading-relaxed">
              {t.about.bio.split(" ").map((word, i) => (
                <motion.span
                  key={`${word}-${i}`}
                  className="inline-block"
                  initial={{ color: "rgba(192,192,192,0.25)" }}
                  whileInView={{ color: "#FFFFFF" }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.3, delay: i * 0.025 }}
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </p>

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
                  className="relative overflow-hidden rounded-2xl border border-white/5 bg-surface p-5 transition-colors hover:border-orange-primary/50"
                  data-cursor-hover
                >
                  {/* Numero de item semi-transparente arriba a la derecha */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -top-1 right-2 select-none font-display text-4xl font-bold text-orange-primary opacity-15"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    aria-hidden
                    className="mb-3 block h-1 w-6 bg-orange-primary"
                    style={{
                      clipPath: "polygon(30% 0, 100% 0, 70% 100%, 0 100%)",
                    }}
                  />
                  <h3 className="relative font-display text-base font-bold text-orange-primary">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-text-secondary">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Bloque de codigo decorativo */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
              className="mt-6 rounded-lg bg-[#111] p-4 font-mono text-xs"
            >
              <span className="text-[#c0c0c0]">const </span>
              <span className="text-[#f06400]">kevin</span>
              <span className="text-white"> = </span>
              <span className="text-[#c0c0c0]">&#123;</span>
              <br />
              <span className="block pl-4 text-[#c0c0c0]">
                available: <span className="text-green-400">true</span>,
              </span>
              <span className="block pl-4 text-[#c0c0c0]">
                location: <span className="text-orange-300">&#39;Bogotá 🇨🇴&#39;</span>,
              </span>
              <span className="block pl-4 text-[#c0c0c0]">
                focus: <span className="text-orange-300">&#39;Cloud &amp; DevOps&#39;</span>,
              </span>
              <span className="block pl-4 text-[#c0c0c0]">
                english: <span className="text-orange-300">&#39;B1 (iTEP)&#39;</span>
              </span>
              <span className="text-[#c0c0c0]">&#125;</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
