"use client";

import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";
import { useLang } from "@/lib/i18n/LangContext";

// Identidad visual por empresa
const PALETTE = [
  { color: "#3b82f6", dim: "rgba(59,130,246,0.10)",  glow: "rgba(59,130,246,0.22)",  border: "rgba(59,130,246,0.20)"  }, // Corona – azul
  { color: "#f56f0d", dim: "rgba(245,111,13,0.12)",  glow: "rgba(245,111,13,0.22)",  border: "rgba(245,111,13,0.2)"   }, // PI – naranja
  { color: "#22c55e", dim: "rgba(34,197,94,0.10)",   glow: "rgba(34,197,94,0.20)",   border: "rgba(34,197,94,0.18)"   }, // UEB – verde
];

// Stat destacada si hay un número en los bullets
function extractStat(bullets: string[]): { value: string; label: string } | null {
  for (const b of bullets) {
    const m = b.match(/(\d+\s?%)/);
    if (m) return { value: m[1], label: b.replace(m[1], "").replace(/^[^a-zA-ZáéíóúÁÉÍÓÚ]*/, "").trim() };
  }
  return null;
}

export default function Experience() {
  const { t } = useLang();

  return (
    <section id="experience" className="section-glass relative overflow-hidden py-10 md:py-14 lg:py-20">

      {/* Fondo decorativo */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div style={{
          position: "absolute", top: "20%", right: "-8%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,111,13,0.05) 0%, transparent 65%)",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", left: "-5%",
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 65%)",
        }} />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          number={t.experience.number}
          label={t.experience.label}
          title={t.experience.title}
          subtitle={t.experience.subtitle}
        />

        {/* Timeline wrapper — deja espacio a la izquierda para la línea */}
        <div className="relative lg:pl-10">

          {/* Línea vertical animada */}
          <motion.div
            aria-hidden
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: "easeOut", delay: 0.2 }}
            className="absolute left-0 hidden lg:block"
            style={{
              top: 24, bottom: 24, width: 1, transformOrigin: "top",
              background: "linear-gradient(to bottom, rgba(245,111,13,0.5), rgba(245,111,13,0.08), transparent)",
            }}
          />

          <div className="flex flex-col gap-5">
            {t.experience.items.map((item, i) => {
              const pal      = PALETTE[i] ?? PALETTE[PALETTE.length - 1];
              const initials = item.company.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();
              const stat     = extractStat(item.bullets);
              const isCurrent = i === 0;

              return (
                <motion.div
                  key={item.company}
                  initial={{ opacity: 0, x: -28 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
                  className="relative"
                >
                  {/* Dot del timeline */}
                  <div className="absolute -left-10 top-8 hidden lg:block" style={{ zIndex: 2 }}>
                    <motion.div
                      animate={isCurrent
                        ? { boxShadow: [`0 0 0 0 ${pal.color}80`, `0 0 0 10px ${pal.color}00`] }
                        : {}}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                      style={{
                        width: 14, height: 14, borderRadius: "50%",
                        background: pal.color,
                        border: "2.5px solid var(--background)",
                        boxShadow: isCurrent ? `0 0 12px ${pal.color}80` : "none",
                      }}
                    />
                  </div>

                  {/* Card principal */}
                  <motion.div
                    whileHover={{ y: -4, boxShadow: `0 0 0 1px ${pal.border}, 0 20px 60px ${pal.glow}` }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden rounded-2xl"
                    style={{
                      border: `1px solid ${pal.border}`,
                      background: "var(--surface)",
                    }}
                    data-cursor-hover
                  >
                    {/* Tira de acento superior */}
                    <div style={{
                      height: 3,
                      background: `linear-gradient(to right, ${pal.color}, ${pal.color}50, transparent)`,
                    }} />

                    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr]">

                      {/* ──── LEFT: identidad empresa ──── */}
                      <div
                        className="relative overflow-hidden border-b border-b lg:border-b-0 lg:border-r p-6 flex flex-col gap-4"
                        style={{
                          background: `linear-gradient(145deg, ${pal.dim} 0%, transparent 70%)`,
                          borderColor: `${pal.color}14`,
                        }}
                      >
                        {/* Watermark letras gigantes */}
                        <span aria-hidden style={{
                          position: "absolute", bottom: -16, right: -8,
                          fontFamily: "var(--font-display)", fontSize: "7rem", fontWeight: 900,
                          color: pal.color, opacity: 0.06, userSelect: "none",
                          lineHeight: 1, letterSpacing: "-0.06em", pointerEvents: "none",
                        }}>
                          {initials}
                        </span>

                        {/* Badge + nombre */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                          <motion.div
                            whileHover={{ scale: 1.06 }}
                            style={{
                              width: 56, height: 56, borderRadius: "1rem", flexShrink: 0,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              background: `linear-gradient(135deg, ${pal.color}30, ${pal.color}0c)`,
                              border: `1px solid ${pal.color}35`,
                              boxShadow: isCurrent ? `0 0 24px ${pal.color}35` : "none",
                              fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 900,
                              color: pal.color, letterSpacing: "-0.03em",
                            }}
                          >
                            {initials}
                          </motion.div>

                          <div>
                            <h3 style={{
                              fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700,
                              color: "var(--text-primary)", margin: 0, lineHeight: 1.25,
                            }}>
                              {item.company}
                            </h3>
                            {isCurrent && (
                              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: 5 }}>
                                <motion.span
                                  animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                                  transition={{ repeat: Infinity, duration: 1.8 }}
                                  style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "block", flexShrink: 0 }}
                                />
                                <span style={{
                                  fontSize: "0.62rem", color: "#4ade80", fontWeight: 700,
                                  textTransform: "uppercase", letterSpacing: "0.1em",
                                  fontFamily: "var(--font-display)",
                                }}>
                                  {t.experience.current}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Rol */}
                        <p style={{
                          fontFamily: "var(--font-display)", fontSize: "0.88rem", fontWeight: 700,
                          color: pal.color, margin: 0, lineHeight: 1.35,
                        }}>
                          {item.role}
                        </p>

                        {/* Período */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={pal.color} strokeWidth="2" strokeLinecap="round" style={{ opacity: 0.65, flexShrink: 0 }}>
                            <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                          </svg>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{item.period}</span>
                        </div>

                        {/* Type badge */}
                        <span style={{
                          alignSelf: "flex-start",
                          fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase",
                          letterSpacing: "0.08em", padding: "3px 10px", borderRadius: "999px",
                          background: `${pal.color}12`, border: `1px solid ${pal.color}30`,
                          color: pal.color, fontFamily: "var(--font-display)",
                        }}>
                          {item.type}
                        </span>

                        {/* Stat destacada si hay número */}
                        {stat && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            style={{
                              display: "inline-flex", flexDirection: "column",
                              padding: "0.6rem 1rem", borderRadius: "0.75rem",
                              background: `${pal.color}10`,
                              border: `1px solid ${pal.color}25`,
                              marginTop: "auto",
                            }}
                          >
                            <span style={{
                              fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 900,
                              color: pal.color, lineHeight: 1, letterSpacing: "-0.03em",
                            }}>
                              {stat.value}
                            </span>
                            <span style={{ fontSize: "0.68rem", color: "var(--text-secondary)", marginTop: 2 }}>
                              {stat.label}
                            </span>
                          </motion.div>
                        )}
                      </div>

                      {/* ──── RIGHT: bullets ──── */}
                      <div style={{ padding: "1.5rem" }}>
                        <ul style={{ display: "flex", flexDirection: "column", gap: "0.7rem", margin: 0, padding: 0, listStyle: "none" }}>
                          {item.bullets.map((bullet: string, bi: number) => (
                            <motion.li
                              key={bullet}
                              initial={{ opacity: 0, x: 14 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true, margin: "-10px" }}
                              transition={{ duration: 0.45, delay: bi * 0.08, ease: "easeOut" }}
                              style={{ display: "flex", gap: "0.7rem", alignItems: "flex-start" }}
                            >
                              <motion.span
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: bi * 0.08 + 0.1, type: "spring", stiffness: 400 }}
                                style={{
                                  flexShrink: 0, width: 6, height: 6,
                                  borderRadius: "50%", background: pal.color,
                                  marginTop: "0.5rem", opacity: 0.75,
                                  display: "block",
                                }}
                              />
                              <span style={{
                                fontSize: "0.875rem", lineHeight: 1.7,
                                color: "var(--text-secondary)",
                              }}>
                                {bullet}
                              </span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
