"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// Navbar sticky con blur. Logo "KG" con punto naranja animado, links con
// indicador de seccion activa, toggle ES|EN y drawer lateral en movil.

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/lib/i18n/LangContext";
import { useTheme } from "@/lib/theme/ThemeContext";

const sections = [
  { id: "hero", key: "home" },
  { id: "about", key: "about" },
  { id: "experience", key: "experience" },
  { id: "stack", key: "stack" },
  { id: "proyectos", key: "projects" },
  { id: "contacto", key: "contact" },
] as const;

export default function Navbar() {
  const { t, lang, setLang } = useLang();
  const { theme, toggle: toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("hero");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Indicador de seccion activa via IntersectionObserver.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -55% 0px", threshold: 0 },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const LangToggle = ({ className = "" }: { className?: string }) => (
    <div
      className={`flex items-center rounded-full border border-orange-primary/30 p-0.5 text-xs ${className}`}
      data-cursor-hover
    >
      {(["es", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`rounded-full px-2.5 py-1 font-medium uppercase transition-colors ${
            lang === l
              ? "bg-orange-primary text-background"
              : "text-text-secondary hover:text-orange-primary"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );

  const ThemeToggle = ({ className = "" }: { className?: string }) => (
    <button
      onClick={toggleTheme}
      data-cursor-hover
      aria-label="Toggle theme"
      className={`flex h-8 w-8 items-center justify-center rounded-full border border-orange-primary/30 text-text-secondary transition-colors hover:border-orange-primary hover:text-orange-primary ${className}`}
    >
      {theme === "dark" ? (
        /* Sol — cambiar a claro */
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm0-14a6 6 0 1 0 0 12A6 6 0 0 0 12 6z" opacity="0"/>
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
        </svg>
      ) : (
        /* Luna — cambiar a oscuro */
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-orange-primary/20 bg-background/70 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="#hero"
          className="group flex items-center font-display text-2xl font-bold tracking-tight text-orange-primary"
          data-cursor-hover
        >
          KG
          <span className="ml-0.5 mt-2 h-1.5 w-1.5 rounded-full bg-orange-primary pulse-dot" />
        </a>

        {/* Links desktop */}
        <ul className="hidden items-center gap-8 md:flex">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="relative text-sm text-text-secondary transition-colors hover:text-orange-primary"
                data-cursor-hover
              >
                {t.nav[s.key]}
                {active === s.id && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1.5 left-0 h-0.5 w-full bg-orange-primary"
                  />
                )}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <ThemeToggle className="hidden sm:flex" />
          <LangToggle className="hidden sm:flex" />
          <a
            href="#contacto"
            className="hidden rounded-full border border-orange-primary/40 px-4 py-1.5 text-sm text-orange-primary transition-colors hover:bg-orange-primary hover:text-background md:inline-block"
            data-cursor-hover
          >
            {t.nav.cta}
          </a>

          {/* Hamburger movil */}
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
            data-cursor-hover
          >
            <span className="h-0.5 w-5 bg-text-primary" />
            <span className="h-0.5 w-5 bg-text-primary" />
          </button>
        </div>
      </nav>

      {/* Drawer movil */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
              className="fixed right-0 top-0 z-50 flex h-full w-72 flex-col gap-2 border-l border-orange-primary/20 bg-surface p-8 md:hidden"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="font-display text-xl font-bold text-orange-primary">
                  KG
                </span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="text-2xl text-text-secondary hover:text-orange-primary"
                >
                  ×
                </button>
              </div>

              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={() => setOpen(false)}
                  className={`border-b border-white/5 py-3 font-display text-lg transition-colors ${
                    active === s.id
                      ? "text-orange-primary"
                      : "text-text-primary hover:text-orange-primary"
                  }`}
                >
                  {t.nav[s.key]}
                </a>
              ))}

              <div className="mt-6 flex items-center gap-3">
                <ThemeToggle />
                <LangToggle />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
