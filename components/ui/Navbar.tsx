"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// Navbar sticky con blur. Logo "KG" en naranja + links de seccion.

import { useEffect, useState } from "react";

const links = [
  { href: "#hero", label: "Inicio" },
  { href: "#about", label: "About" },
  { href: "#stack", label: "Stack" },
  { href: "#proyectos", label: "Proyectos" },
  { href: "#contacto", label: "Contacto" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-orange-primary/20 bg-background/70 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a
          href="#hero"
          className="font-display text-2xl font-bold tracking-tight text-orange-primary"
        >
          KG
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-text-secondary transition-colors hover:text-orange-primary"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contacto"
          className="rounded-full border border-orange-primary/40 px-4 py-1.5 text-sm text-orange-primary transition-colors hover:bg-orange-primary hover:text-background"
        >
          Hablemos
        </a>
      </nav>
    </header>
  );
}
