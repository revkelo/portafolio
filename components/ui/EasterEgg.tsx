"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SECRET = "revkelo";

const LINES = [
  { delay: 0,    text: "⚠  INTRUSION DETECTED - scanning...",          color: "#ef4444" },
  { delay: 600,  text: "  [████████████████████] 100%",                  color: "#f56f0d" },
  { delay: 1100, text: "  visitor.identify() → curious human 👀",        color: "#c0b8b0" },
  { delay: 1500, text: "  threat_level: NONE  (just a fan, probably)",   color: "#4ade80" },
  { delay: 2000, text: "",                                                color: "#c0b8b0" },
  { delay: 2050, text: "$ sudo load-kevin --full",                        color: "#f56f0d" },
  { delay: 2400, text: "  ██╗  ██╗ ██████╗",                             color: "#f56f0d" },
  { delay: 2550, text: "  ██║ ██╔╝██╔════╝",                             color: "#f56f0d" },
  { delay: 2700, text: "  █████╔╝ ██║  ███╗",                            color: "#f56f0d" },
  { delay: 2850, text: "  ██╔═██╗ ██║   ██║",                            color: "#f56f0d" },
  { delay: 3000, text: "  ██║  ██╗╚██████╔╝  v2.0.26",                  color: "#f56f0d" },
  { delay: 3150, text: "  ╚═╝  ╚═╝ ╚═════╝   Cloud & DevOps Engineer",  color: "#fb923c" },
  { delay: 3500, text: "",                                                color: "#c0b8b0" },
  { delay: 3550, text: "$ kevin --diagnostics",                           color: "#f56f0d" },
  { delay: 3850, text: "  ✔  AWS uptime ................ 98%",            color: "#4ade80" },
  { delay: 4050, text: "  ✔  Coffee intake ............. optimal ☕",     color: "#4ade80" },
  { delay: 4250, text: "  ✔  Docker containers ......... stable 🐳",      color: "#4ade80" },
  { delay: 4450, text: "  ✔  Bugs fixed ................ countless ✨",   color: "#4ade80" },
  { delay: 4650, text: "  ✗  Bugs created .............. [CLASSIFIED] 🤫",color: "#facc15" },
  { delay: 4900, text: "  ✔  Vibe check ................ immaculate 😎",  color: "#4ade80" },
  { delay: 5200, text: "",                                                color: "#c0b8b0" },
  { delay: 5250, text: "  📍  Bogotá, Colombia  🇨🇴",                      color: "#a78bfa" },
  { delay: 5500, text: "  📬  kgagudelo@gmail.com",                       color: "#a78bfa" },
  { delay: 5800, text: "",                                                color: "#c0b8b0" },
  { delay: 5850, text: "  🥚  easter egg desbloqueado - eres de los nuestros.", color: "#f56f0d" },
  { delay: 6200, text: "  🚀  kevin@revkelo ~ ready to ship", color: "#4ade80" },
];

export default function EasterEgg() {
  const [show, setShow]         = useState(false);
  const [typed, setTyped]       = useState("");
  const [lines, setLines]       = useState<typeof LINES>([]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (["INPUT", "TEXTAREA"].includes(tag)) return;
      if (e.key === "Escape") { setShow(false); return; }

      const next = (typed + e.key.toLowerCase()).slice(-SECRET.length);
      setTyped(next);
      if (next === SECRET) {
        setShow(true);
        setTyped("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [typed]);

  useEffect(() => {
    if (!show) { setLines([]); return; }
    setLines([]);
    LINES.forEach(line => {
      setTimeout(() => setLines(prev => [...prev, line]), line.delay);
    });
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShow(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 500, backdropFilter: "blur(6px)", cursor: "pointer" }}
          />
          <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 501, pointerEvents: "none" }}>
          <motion.div
            initial={{ opacity: 0, y: 48, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 48, scale: 0.93 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            style={{
              pointerEvents: "auto",
              width: "min(520px, 92vw)",
              background: "#0a0a0a",
              border: "1px solid rgba(245,111,13,0.25)",
              borderRadius: "1.1rem", overflow: "hidden",
              boxShadow: "0 0 100px rgba(245,111,13,0.12), 0 40px 80px rgba(0,0,0,0.8)",
              fontFamily: "'Courier New', monospace",
            }}
          >
            {/* Traffic lights */}
            <div style={{
              display: "flex", alignItems: "center", gap: "0.45rem",
              padding: "0.65rem 1rem",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              background: "rgba(255,255,255,0.025)",
            }}>
              <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff5f57", flexShrink: 0 }} />
              <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#ffbd2e", flexShrink: 0 }} />
              <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#28c840", flexShrink: 0 }} />
              <span style={{ marginLeft: "auto", fontSize: "0.68rem", color: "rgba(245,111,13,0.5)", letterSpacing: "0.05em" }}>
                kevin@revkelo - zsh - 80×24
              </span>
            </div>

            {/* Output */}
            <div style={{ padding: "1.1rem 1.25rem", minHeight: 320, maxHeight: "60vh", overflowY: "auto" }}>
              {lines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ fontSize: "0.8rem", color: line.color, marginBottom: "0.28rem", lineHeight: 1.6, whiteSpace: "pre" }}
                >
                  {line.text}
                </motion.div>
              ))}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear", repeatType: "reverse" }}
                style={{ color: "rgba(245,111,13,0.5)", fontSize: "0.85rem" }}
              >
                █
              </motion.span>
            </div>

            <div style={{
              padding: "0.5rem 1rem", textAlign: "center",
              borderTop: "1px solid rgba(255,255,255,0.04)",
              background: "rgba(255,255,255,0.015)",
            }}>
              <span style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.2)" }}>
                🥚 easter egg desbloqueado · click o Esc para cerrar
              </span>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
