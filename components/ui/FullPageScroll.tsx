"use client";

// Full-page scroll con scroll interno por sección.
// Comportamiento:
//   - Scroll dentro de una sección → mueve el contenido de ESA sección.
//   - Al llegar al borde (top/bottom) → siguiente/anterior sección.
//   - Dots de navegación en la derecha.
//   - Emite "sectionchange" para que GlobalScene mueva la cámara.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";

const LABELS = ["home", "about", "experience", "stack", "projects", "contact"] as const;
export const TOTAL_SECTIONS = LABELS.length;
const COOLDOWN_MS = 800;

const SectionCtx = createContext(0);
export const useSectionIndex = () => useContext(SectionCtx);

export default function FullPageScroll({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState(0);
  const locked = useRef(false);
  const touchStart = useRef(0);
  // Ref al div que contiene los slots de cada sección.
  const stackRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (next: number) => {
      if (locked.current || next < 0 || next >= TOTAL_SECTIONS) return;
      locked.current = true;
      setCurrent(next);
      window.dispatchEvent(
        new CustomEvent("sectionchange", {
          detail: { index: next, total: TOTAL_SECTIONS },
        })
      );
      setTimeout(() => { locked.current = false; }, COOLDOWN_MS);
    },
    []
  );

  // Listener para navegación programática desde otros componentes (ej. CTAs del hero).
  useEffect(() => {
    const handler = (e: Event) => {
      const { index } = (e as CustomEvent<{ index: number }>).detail;
      go(index);
    };
    window.addEventListener("navigate-section", handler);
    return () => window.removeEventListener("navigate-section", handler);
  }, [go]);

  useEffect(() => {
    // Devuelve true si hay que dejar pasar el scroll al interior de la sección.
    const shouldPassThrough = (deltaY: number): boolean => {
      if (!stackRef.current) return false;
      const slot = stackRef.current.children[current] as HTMLElement | undefined;
      if (!slot) return false;
      const { scrollTop, scrollHeight, clientHeight } = slot;
      const isScrollable = scrollHeight > clientHeight + 2;
      if (!isScrollable) return false;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 6;
      const atTop = scrollTop <= 1;
      if (deltaY > 0 && atBottom) return false; // borde inferior → transicionar
      if (deltaY < 0 && atTop) return false;     // borde superior → transicionar
      return true; // en medio → scroll interno
    };

    const onWheel = (e: WheelEvent) => {
      if (shouldPassThrough(e.deltaY)) return; // deja al navegador hacer scroll interno
      e.preventDefault();
      if (Math.abs(e.deltaY) < 15 || locked.current) return;
      go(e.deltaY > 0 ? current + 1 : current - 1);
    };

    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        go(current + 1);
      }
      if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        go(current - 1);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStart.current = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const d = touchStart.current - e.changedTouches[0].clientY;
      if (Math.abs(d) > 60) go(d > 0 ? current + 1 : current - 1);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [current, go]);

  return (
    <SectionCtx.Provider value={current}>
      {/* Viewport fijo */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", zIndex: 10 }}>
        {/* Stack que se desplaza entre secciones */}
        <div
          ref={stackRef}
          style={{
            transform: `translateY(-${current * 100}dvh)`,
            transition: "transform 0.82s cubic-bezier(0.77,0,0.175,1)",
            willChange: "transform",
          }}
        >
          {children}
        </div>
      </div>

      {/* Navigation dots */}
      <nav
        aria-label="Page sections"
        style={{
          position: "fixed",
          right: "1.25rem",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 300,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.55rem",
        }}
      >
        {LABELS.map((label, i) => {
          const active = i === current;
          return (
            <button
              key={label}
              aria-label={`Ir a ${label}`}
              onClick={() => go(i)}
              title={label}
              style={{
                all: "unset",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "0.45rem",
                padding: "3px 2px",
              }}
            >
              <span
                style={{
                  fontSize: "0.6rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: active ? "#f56f0d" : "rgba(245,111,13,0.3)",
                  transition: "color 0.3s ease, opacity 0.3s ease",
                  opacity: active ? 1 : 0,
                  pointerEvents: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </span>
              <span
                style={{
                  display: "block",
                  width: 6,
                  height: active ? 20 : 6,
                  borderRadius: 3,
                  background: active ? "#f56f0d" : "rgba(245,111,13,0.22)",
                  boxShadow: active
                    ? "0 0 10px rgba(245,111,13,0.7), 0 0 0 1.5px rgba(0,0,0,0.6)"
                    : "0 0 0 1px rgba(0,0,0,0.4)",
                  transition: "all 0.38s cubic-bezier(0.22,1,0.36,1)",
                  flexShrink: 0,
                }}
              />
            </button>
          );
        })}
      </nav>

      {/* Flecha indicadora abajo */}
      {current < TOTAL_SECTIONS - 1 && (
        <motion.button
          key={`arrow-${current}`}
          aria-label="Siguiente sección"
          onClick={() => go(current + 1)}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          style={{
            all: "unset",
            position: "fixed",
            bottom: "1.25rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 300,
            cursor: "pointer",
            color: "rgba(245,111,13,0.55)",
          }}
        >
          <svg
            className="scroll-arrow"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.button>
      )}
    </SectionCtx.Provider>
  );
}
