"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SECTIONS = [
  { key: "h", label: "Home",       id: "hero"       },
  { key: "a", label: "About",      id: "about"      },
  { key: "e", label: "Experience", id: "experience" },
  { key: "s", label: "Stack",      id: "stack"      },
  { key: "p", label: "Projects",   id: "proyectos"  },
  { key: "c", label: "Contact",    id: "contacto"   },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function KeyboardShortcuts() {
  const [open, setOpen]   = useState(false);
  const [gMode, setGMode] = useState(false);
  const gTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;

      if (e.key === "?")      { setOpen(v => !v); return; }
      if (e.key === "Escape") { setOpen(false); setGMode(false); return; }

      if (gMode) {
        const s = SECTIONS.find(sec => sec.key === e.key);
        if (s) scrollTo(s.id);
        setGMode(false);
        if (gTimer.current) clearTimeout(gTimer.current);
        return;
      }

      if (e.key === "g") {
        setGMode(true);
        gTimer.current = setTimeout(() => setGMode(false), 1500);
        return;
      }

      if (e.key === "j") {
        const els = SECTIONS.map(s => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
        const cur = [...els].reverse().find(el => el.getBoundingClientRect().top < 80) ?? els[0];
        const idx = els.indexOf(cur);
        els[Math.min(idx + 1, els.length - 1)]?.scrollIntoView({ behavior: "smooth" });
        return;
      }
      if (e.key === "k") {
        const els = SECTIONS.map(s => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
        const cur = [...els].reverse().find(el => el.getBoundingClientRect().top < 80) ?? els[0];
        const idx = els.indexOf(cur);
        els[Math.max(idx - 1, 0)]?.scrollIntoView({ behavior: "smooth" });
        return;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [gMode]);

  const SHORTCUTS = [
    { keys: ["j"], desc: "Sección siguiente" },
    { keys: ["k"], desc: "Sección anterior" },
    { keys: ["g", "h"], desc: "Ir a Home" },
    { keys: ["g", "a"], desc: "Ir a About" },
    { keys: ["g", "e"], desc: "Ir a Experience" },
    { keys: ["g", "s"], desc: "Ir a Stack" },
    { keys: ["g", "p"], desc: "Ir a Projects" },
    { keys: ["g", "c"], desc: "Ir a Contact" },
    { keys: ["?"], desc: "Mostrar / ocultar atajos" },
    { keys: ["Esc"], desc: "Cerrar paneles" },
  ];

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1, borderColor: "rgba(245,111,13,0.5)" }}
        onClick={() => setOpen(v => !v)}
        aria-label="Atajos de teclado"
        style={{
          position: "fixed", bottom: "1.5rem", left: "1.5rem", zIndex: 200,
          width: 36, height: 36, borderRadius: "0.5rem",
          background: "rgba(13,13,13,0.90)",
          border: "1px solid rgba(245,111,13,0.22)",
          color: "rgba(245,111,13,0.65)", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(10px)", fontFamily: "monospace",
          fontSize: "0.85rem", fontWeight: 700,
          transition: "border-color 0.2s",
        }}
      >
        ?
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 400, backdropFilter: "blur(4px)" }}
            />
            {/* Wrapper centrador — evita conflicto transform con Framer Motion */}
            <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 401, pointerEvents: "none" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              style={{
                width: "min(380px, 92vw)",
                pointerEvents: "auto",
                background: "rgba(10,10,10,0.98)",
                border: "1px solid rgba(245,111,13,0.18)",
                borderRadius: "1.25rem", padding: "1.75rem",
                boxShadow: "0 0 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(245,111,13,0.06)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <div>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                    Keyboard shortcuts
                  </h2>
                  {gMode && (
                    <p style={{ fontSize: "0.7rem", color: "#f56f0d", margin: "4px 0 0" }}>
                      g presionado — escribe una letra...
                    </p>
                  )}
                </div>
                <button onClick={() => setOpen(false)} style={{ all: "unset", cursor: "pointer", color: "var(--text-secondary)", fontSize: "1.2rem", lineHeight: 1 }}>×</button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {SHORTCUTS.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{s.desc}</span>
                    <div style={{ display: "flex", gap: "0.2rem", alignItems: "center", flexShrink: 0 }}>
                      {s.keys.map((k, ki) => (
                        <span key={`${k}-${ki}`} style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
                          {ki > 0 && <span style={{ color: "var(--text-secondary)", fontSize: "0.62rem" }}>then</span>}
                          <kbd style={{
                            fontFamily: "monospace", fontSize: "0.7rem", fontWeight: 700,
                            padding: "2px 8px", borderRadius: "0.3rem",
                            background: "rgba(245,111,13,0.1)", color: "#f56f0d",
                            border: "1px solid rgba(245,111,13,0.22)",
                          }}>{k}</kbd>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <p style={{ marginTop: "1.25rem", fontSize: "0.65rem", color: "rgba(255,255,255,0.15)", textAlign: "center" }}>
                tip: escribe <kbd style={{ fontFamily: "monospace", padding: "1px 4px", background: "rgba(245,111,13,0.1)", borderRadius: 3, color: "#f56f0d", border: "1px solid rgba(245,111,13,0.2)" }}>revkelo</kbd> para un easter egg 🥚
              </p>
            </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
