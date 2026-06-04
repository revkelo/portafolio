"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// Contact: CTA grande, email copiable (toast "Copiado"), 3 botones con icono,
// frase de cierre. Fondo #0a0a0a con glow naranja sutil al centro.

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";
import { useLang } from "@/lib/i18n/LangContext";

const EMAIL = "kgagudelo@gmail.com";

// Iconos SVG inline.
const Icon = ({ name }: { name: "github" | "linkedin" | "mail" }) => {
  const paths: Record<string, React.ReactNode> = {
    github: (
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    ),
    linkedin: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
    mail: (
      <>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-10 5L2 7" />
      </>
    ),
  };
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
};

export default function Contact() {
  const { t } = useLang();
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback: si clipboard falla, abrir cliente de correo.
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  const channels = [
    { label: "GitHub", href: "https://github.com/revkelo", icon: "github" as const },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/kagonzalezdev",
      icon: "linkedin" as const,
    },
    { label: "Email", href: `mailto:${EMAIL}`, icon: "mail" as const },
  ];

  return (
    <section id="contacto" className="relative overflow-hidden bg-[#0a0a0a] py-16 md:py-24 lg:py-32">
      {/* Glow naranja sutil en el centro */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(240,100,0,0.4) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          number={t.contact.number}
          label={t.contact.label}
          title={t.contact.title}
          subtitle={t.contact.subtitle}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* CTA grande */}
          <h3 className="font-display text-3xl font-bold text-text-primary sm:text-4xl md:text-6xl">
            {t.contact.cta}
          </h3>

          {/* Email copiable */}
          <button
            onClick={copyEmail}
            className="group relative mt-8 inline-flex flex-wrap items-center gap-x-3 gap-y-1 break-all text-left font-display text-xl font-bold text-orange-primary transition-colors hover:text-orange-dark sm:text-2xl md:text-4xl"
            data-cursor-hover
          >
            {EMAIL}
            <span className="text-xs font-normal uppercase tracking-widest text-text-secondary/60 opacity-0 transition-opacity group-hover:opacity-100">
              {t.contact.copy}
            </span>
          </button>

          {/* Botones con icono */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            {channels.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex items-center justify-center gap-2 rounded-full border border-orange-primary/40 px-6 py-3 text-orange-primary transition-colors hover:bg-orange-primary hover:text-background"
                data-cursor-hover
              >
                <Icon name={c.icon} />
                {c.label}
              </a>
            ))}
          </div>

          {/* Frase final */}
          <p className="mt-16 font-display text-2xl font-bold text-orange-primary sm:text-3xl">
            {t.contact.closing}
          </p>
        </motion.div>
      </div>

      <footer className="relative z-10 mx-auto mt-20 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="border-t border-white/5 pt-8 text-sm text-text-secondary">
          © {new Date().getFullYear()} Kevin Gonzalez — {t.footer.rights}
        </div>
      </footer>

      {/* Toast "Copiado" */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 z-[9999] -translate-x-1/2 rounded-full bg-orange-primary px-5 py-2.5 text-sm font-medium text-background shadow-lg"
          >
            {t.contact.copied}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
