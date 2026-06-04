"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// Contact: ticker horizontal, badge de disponibilidad, email con borde SVG animado,
// stats animados, botones con hover fill y toast de copiado.

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";
import { useLang } from "@/lib/i18n/LangContext";

const EMAIL = "kgagudelo@gmail.com";

// ── Iconos ────────────────────────────────────────────────────────────────────
const Icon = ({ name }: { name: "github" | "linkedin" | "mail" }) => {
  const paths: Record<string, React.ReactNode> = {
    github: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />,
    linkedin: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></>,
    mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 5L2 7" /></>,
  };
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
};

// ── Ticker horizontal ─────────────────────────────────────────────────────────
function Ticker({ lang }: { lang: string }) {
  const text = lang === "es"
    ? "HABLEMOS · CONSTRUYAMOS ALGO · DISPONIBLE · LET'S TALK · BUILD TOGETHER · "
    : "LET'S TALK · BUILD TOGETHER · AVAILABLE NOW · HABLEMOS · CONSTRUYAMOS · ";
  const repeated = text.repeat(4);

  return (
    <div className="overflow-hidden border-y border-orange-primary/15 py-3 my-12">
      <div
        className="flex w-max gap-0 font-display text-sm font-bold uppercase tracking-[0.2em] text-orange-primary/50"
        style={{ animation: "marquee-fwd 18s linear infinite" }}
      >
        <span className="whitespace-nowrap pr-0">{repeated}</span>
        <span className="whitespace-nowrap pr-0">{repeated}</span>
      </div>
    </div>
  );
}

// ── Stat counter ──────────────────────────────────────────────────────────────
function StatItem({ value, label, active }: { value: string; label: string; active: boolean }) {
  const [display, setDisplay] = useState("0");
  const num = parseInt(value.replace(/\D/g, "")) || 0;
  const suffix = value.replace(/[0-9]/g, "");

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const duration = 1200;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(String(Math.round(eased * num)) + suffix);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, num, suffix]);

  return (
    <div className="text-center">
      <p className="font-display text-3xl font-bold text-orange-primary sm:text-4xl">{display}</p>
      <p className="mt-1 text-xs uppercase tracking-widest text-text-secondary/60">{label}</p>
    </div>
  );
}

// ── Email con borde SVG animado ───────────────────────────────────────────────
function EmailButton({ email, copy, copyLabel, onCopy }: { email: string; copy: string; copyLabel: string; onCopy: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative mt-10 inline-block w-full max-w-2xl" data-cursor-hover>
      {/* SVG border que se traza al hover */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ overflow: "visible" }}
      >
        <rect
          x="1" y="1" width="98" height="98" rx="12"
          fill="none"
          stroke="#f56f0d"
          strokeWidth="1.5"
          pathLength={1}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: hovered ? 0 : 1,
            transition: "stroke-dashoffset 0.7s cubic-bezier(0.22,1,0.36,1)",
            opacity: hovered ? 1 : 0,
          }}
        />
      </svg>

      <button
        onClick={onCopy}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative w-full rounded-xl border border-border bg-surface/40 px-6 py-5 text-left backdrop-blur-sm transition-colors hover:bg-surface/70"
      >
        <span className="block font-display text-xl font-bold text-orange-primary sm:text-2xl md:text-4xl break-all">
          {email}
        </span>
        <span className="mt-2 flex items-center gap-2 text-xs uppercase tracking-widest text-text-secondary/50 transition-colors group-hover:text-orange-primary/70">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          {copyLabel}
        </span>
      </button>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function Contact() {
  const { t, lang } = useLang();
  const [copied, setCopied] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  const channels = [
    { label: "GitHub",   href: "https://github.com/revkelo",           icon: "github"   as const },
    { label: "LinkedIn", href: "https://linkedin.com/in/kagonzalezdev", icon: "linkedin" as const },
    { label: "Email",    href: `mailto:${EMAIL}`,                        icon: "mail"     as const },
  ];

  const stats = lang === "es"
    ? [{ value: "2+", label: "años exp." }, { value: "35+", label: "repositorios" }, { value: "6+", label: "proyectos" }]
    : [{ value: "2+", label: "yrs exp." },  { value: "35+", label: "repositories" }, { value: "6+", label: "projects" }];

  return (
    <section id="contacto" className="section-glass relative overflow-hidden py-16 md:py-24 lg:py-32">

      {/* Watermark 05 */}
      <span aria-hidden className="pointer-events-none absolute -top-8 -left-4 select-none font-display text-[200px] font-bold leading-none text-orange-primary opacity-5">
        {t.contact.number}
      </span>

      {/* Glow central */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(245,111,13,0.5) 0%, transparent 65%)" }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle number={t.contact.number} label={t.contact.label} title={t.contact.title} subtitle={t.contact.subtitle} />

        {/* CTA grande */}
        <motion.h3
          className="font-display font-bold leading-[1.0] text-text-primary mb-12"
          style={{ fontSize: "clamp(2.2rem, 6vw, 5.5rem)" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {t.contact.cta}
        </motion.h3>

        {/* Layout 2 columnas */}
        <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:gap-16">

          {/* Columna izquierda — email + botones */}
          <div className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="mb-3 text-sm uppercase tracking-widest text-text-secondary/50">
                {lang === "es" ? "Escríbeme a" : "Reach me at"}
              </p>
              <EmailButton email={EMAIL} copy={t.contact.copy} copyLabel={t.contact.copy} onCopy={copyEmail} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex flex-wrap gap-3"
            >
              {channels.map((c, i) => (
                <motion.a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.07 }}
                  className="flex items-center gap-2 rounded-full border border-orange-primary/40 px-5 py-2.5 text-sm text-orange-primary transition-all hover:bg-orange-primary hover:text-background hover:shadow-[0_0_18px_rgba(245,111,13,0.35)]"
                  data-cursor-hover
                >
                  <Icon name={c.icon} />
                  {c.label}
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Columna derecha — stats */}
          <motion.div
            ref={statsRef}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-row justify-around lg:flex-col lg:justify-center lg:gap-8 rounded-2xl border border-border bg-surface/30 p-6 backdrop-blur-sm"
          >
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                className="text-center lg:text-left"
              >
                <StatItem value={s.value} label="" active={statsInView} />
                <p className="mt-1 text-xs uppercase tracking-widest text-text-secondary/60">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Frase final */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 text-center font-display text-xl font-bold italic text-orange-primary sm:text-2xl"
        >
          {t.contact.closing}
        </motion.p>
        <p className="mt-2 text-center text-sm text-text-secondary/50">{t.contact.availability}</p>
      </div>

      {/* Footer */}
      <div className="relative z-10 mx-auto mt-20 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-3 border-t border-border pt-8 sm:flex-row sm:justify-between">
          <p className="text-sm text-text-secondary/50">© {new Date().getFullYear()} Kevin Gonzalez — {t.footer.rights}</p>
          <div className="flex gap-6 text-sm text-text-secondary/50">
            <a href="https://github.com/revkelo" target="_blank" rel="noopener noreferrer" className="hover:text-orange-primary transition-colors">GitHub</a>
            <a href="https://linkedin.com/in/kagonzalezdev" target="_blank" rel="noopener noreferrer" className="hover:text-orange-primary transition-colors">LinkedIn</a>
          </div>
          <p className="text-sm text-text-secondary/30">Hecho con ❤️ en Bogotá 🇨🇴</p>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 z-[9999] -translate-x-1/2 flex items-center gap-2 rounded-full bg-orange-primary px-5 py-2.5 text-sm font-semibold text-background shadow-xl"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
            {t.contact.copied}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
