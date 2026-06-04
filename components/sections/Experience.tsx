"use client";

import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";
import { useLang } from "@/lib/i18n/LangContext";

export default function Experience() {
  const { t } = useLang();

  return (
    <section id="experience" className="section-glass relative py-10 md:py-14 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          number={t.experience.number}
          label={t.experience.label}
          title={t.experience.title}
          subtitle={t.experience.subtitle}
        />

        <div className="flex flex-col gap-6">
          {t.experience.items.map((item, i) => (
            <motion.div
              key={item.company}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
              className="grid grid-cols-1 lg:grid-cols-[260px_1fr]"
              style={{
                borderRadius: "1.25rem",
                overflow: "hidden",
                border: "1px solid rgba(245,111,13,0.10)",
                background: "var(--surface)",
                transition: "border-color 0.3s, box-shadow 0.3s",
              }}
              whileHover={{ boxShadow: "0 0 0 1px rgba(245,111,13,0.25), 0 8px 40px rgba(245,111,13,0.08)" }}
              data-cursor-hover
            >
              {/* ── LEFT: info sticky ── */}
              <div
                style={{
                  padding: "1.6rem",
                  borderBottom: "1px solid rgba(245,111,13,0.08)",
                  background: "rgba(245,111,13,0.03)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  position: "relative",
                  overflow: "hidden",
                }}
                className="lg:border-b-0 lg:border-r lg:sticky lg:top-20 lg:self-start"
              >
                {/* Acento top */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 2,
                  background: i === 0
                    ? "linear-gradient(to right, #f56f0d, transparent)"
                    : "linear-gradient(to right, rgba(245,111,13,0.3), transparent)",
                }} />

                {/* Logo / iniciales */}
                <div style={{
                  width: 52, height: 52, borderRadius: "0.9rem",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "linear-gradient(135deg, rgba(245,111,13,0.2), rgba(245,111,13,0.06))",
                  border: "1px solid rgba(245,111,13,0.25)",
                  fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 800,
                  color: "#f56f0d", letterSpacing: "-0.02em",
                }}>
                  {item.company.split(" ").map((w: string) => w[0]).slice(0, 2).join("")}
                </div>

                {/* Empresa + current badge */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                    <h3 style={{
                      fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700,
                      color: "var(--text-primary)", margin: 0,
                    }}>
                      {item.company}
                    </h3>
                    {i === 0 && (
                      <span style={{
                        fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.08em",
                        textTransform: "uppercase", padding: "2px 7px", borderRadius: "999px",
                        background: "rgba(74,222,128,0.12)", color: "#4ade80",
                        border: "1px solid rgba(74,222,128,0.3)",
                      }}>
                        {t.experience.current}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "#f56f0d", margin: "3px 0 0", fontWeight: 600 }}>
                    {item.role}
                  </p>
                </div>

                {/* Periodo */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(245,111,13,0.5)" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{item.period}</span>
                </div>

                {/* Type badge */}
                <span style={{
                  alignSelf: "flex-start", fontSize: "0.7rem", fontWeight: 600,
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  padding: "3px 10px", borderRadius: "999px",
                  border: "1px solid rgba(245,111,13,0.25)",
                  color: "rgba(245,111,13,0.8)",
                  background: "rgba(245,111,13,0.07)",
                }}>
                  {item.type}
                </span>
              </div>

              {/* ── RIGHT: bullets ── */}
              <div style={{ padding: "1.6rem" }}>
                <ul style={{ display: "flex", flexDirection: "column", gap: "0.7rem", margin: 0, padding: 0, listStyle: "none" }}>
                  {item.bullets.map((bullet: string, bi: number) => (
                    <motion.li
                      key={bullet}
                      initial={{ opacity: 0, x: 12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-20px" }}
                      transition={{ duration: 0.4, delay: bi * 0.06, ease: "easeOut" }}
                      style={{ display: "flex", gap: "0.65rem", alignItems: "flex-start" }}
                    >
                      <span style={{
                        flexShrink: 0, marginTop: "0.25rem", width: 6, height: 6,
                        borderRadius: "50%", background: "#f56f0d", opacity: 0.7,
                      }} />
                      <span style={{ fontSize: "0.875rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
                        {bullet}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Línea de tiempo decorativa */}
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
          style={{
            position: "absolute", left: "calc(50% - 1px)", top: "12rem", bottom: "2rem",
            width: 1, transformOrigin: "top",
            background: "linear-gradient(to bottom, rgba(245,111,13,0.15), transparent)",
            pointerEvents: "none",
          }}
          className="hidden lg:block"
        />
      </div>
    </section>
  );
}
