"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SECRET = "revkelo";

const LINES = [
  { delay: 0,    text: "$ npm run kevin",                    color: "#f56f0d" },
  { delay: 350,  text: "> Initializing Kevin Gonzalez...",   color: "#c0b8b0" },
  { delay: 750,  text: "> ✔  Cloud & DevOps        ONLINE", color: "#4ade80" },
  { delay: 1050, text: "> ✔  Backend (Python/Java)  ONLINE", color: "#4ade80" },
  { delay: 1300, text: "> ✔  Full-Stack Dev         ONLINE", color: "#4ade80" },
  { delay: 1550, text: "> ✔  Data Governance        ONLINE", color: "#4ade80" },
  { delay: 1900, text: "> ☁️  AWS / Azure: Connected",        color: "#38bdf8" },
  { delay: 2150, text: "> 🐳  Docker / K8s: Running",         color: "#38bdf8" },
  { delay: 2400, text: "> 🤖  LangChain / RAG: Active",       color: "#38bdf8" },
  { delay: 2750, text: "> 📍  Location: Bogotá, Colombia",    color: "#a78bfa" },
  { delay: 3100, text: "> 📬  kgagudelo@gmail.com",           color: "#a78bfa" },
  { delay: 3500, text: "SUCCESS  kevin@revkelo ready to ship 🚀", color: "#4ade80" },
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
              <span style={{ marginLeft: "auto", fontSize: "0.68rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.05em" }}>
                kevin@revkelo — bash
              </span>
            </div>

            {/* Output */}
            <div style={{ padding: "1.1rem 1.25rem", minHeight: 240 }}>
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
