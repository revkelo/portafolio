"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// About: foto placeholder (iniciales KG) + bio bilingue + 3 highlights.

import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";
import { useLang } from "@/lib/i18n/LangContext";
import { useTheme } from "@/lib/theme/ThemeContext";

export default function About() {
  const { t } = useLang();
  const { theme } = useTheme();
  const light = theme === "light";

  // Colores del bloque de codigo segun el tema (contraste en modo claro).
  const codeKey = light ? "text-[#5a5a5a]" : "text-[#c0c0c0]";
  const codeEq = light ? "text-[#0d0d0d]" : "text-white";
  const codeBool = light ? "text-green-700" : "text-green-400";
  const codeStr = light ? "text-orange-700" : "text-orange-300";

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

        <div className="grid gap-12 md:grid-cols-[300px_1fr] md:items-start md:gap-16">
          {/* Foto: sticky en desktop para que quede fija mientras se lee la bio */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mx-auto w-full max-w-[260px] md:max-w-none md:sticky md:top-24"
          >
            <div className="relative aspect-[4/5] rounded-2xl">
              <div className="absolute inset-0 overflow-hidden rounded-2xl border border-border">
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
                      "linear-gradient(to top, rgba(245,111,13,0.25) 0%, transparent 50%)",
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
                {/* path equivale al rect rx=6 pero como trayecto cerrado
                    para que pathLength animate sin el gap del rect */}
                <motion.path
                  d="M 7.5,1.5 L 92.5,1.5 Q 98.5,1.5 98.5,7.5 L 98.5,117.5 Q 98.5,123.5 92.5,123.5 L 7.5,123.5 Q 1.5,123.5 1.5,117.5 L 1.5,7.5 Q 1.5,1.5 7.5,1.5 Z"
                  fill="none"
                  stroke="#f56f0d"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
                  initial={{ color: light ? "rgba(74,74,74,0.3)" : "rgba(192,192,192,0.25)" }}
                  whileInView={{ color: light ? "#0d0d0d" : "#FFFFFF" }}
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
                  className="relative overflow-hidden rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-orange-primary/50"
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
              className={`mt-6 rounded-lg p-4 font-mono text-xs ${
                light ? "border border-orange-primary/20 bg-[#e8e3de]" : "bg-[#111]"
              }`}
            >
              <span className={codeKey}>const </span>
              <span className="text-[#f06400]">kevin</span>
              <span className={codeEq}> = </span>
              <span className={codeKey}>&#123;</span>
              <br />
              <span className={`block pl-4 ${codeKey}`}>
                available: <span className={codeBool}>true</span>,
              </span>
              <span className={`block pl-4 ${codeKey}`}>
                location: <span className={codeStr}>&#39;Bogotá 🇨🇴&#39;</span>,
              </span>
              <span className={`block pl-4 ${codeKey}`}>
                focus: <span className={codeStr}>&#39;Cloud &amp; DevOps&#39;</span>,
              </span>
              <span className={`block pl-4 ${codeKey}`}>
                english: <span className={codeStr}>&#39;B1 (iTEP)&#39;</span>
              </span>
              <span className={codeKey}>&#125;</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
