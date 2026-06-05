"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BackToTop() {
  const [visible, setVisible]    = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!isDesktop) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 8 }}
          whileHover={{ scale: 1.12, boxShadow: "0 0 24px rgba(245,111,13,0.4)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Volver arriba"
          className="hidden sm:flex"
          style={{
            position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 200,
            width: 40, height: 40, borderRadius: "50%",
            background: "var(--nav-bg-scrolled)",
            border: "1px solid rgba(245,111,13,0.4)",
            color: "#f56f0d", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            transition: "border-color 0.2s",
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
