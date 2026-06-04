"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

// Variables CSS que se inyectan directamente en <html style="...">
// Esto garantiza maxima prioridad en el cascade, por encima de @theme de Tailwind.
const DARK_VARS: Record<string, string> = {
  "--color-background":    "#0d0d0d",
  "--color-surface":       "#161616",
  "--color-surface-alt":   "#0a0a0a",
  "--color-text-primary":  "#ffffff",
  "--color-text-secondary":"#c0b8b0",
  "--color-border":        "rgba(255,255,255,0.10)",
  "--background":          "#0d0d0d",
  "--surface":             "#161616",
  "--surface-alt":         "#0a0a0a",
  "--text-primary":        "#ffffff",
  "--text-secondary":      "#c0b8b0",
  "--border":              "rgba(255,255,255,0.10)",
  "--glass-bg":            "rgba(13,13,13,0.80)",
  "--nav-bg-scrolled":     "rgba(13,13,13,0.88)",
  "--nav-bg-default":      "rgba(13,13,13,0.55)",
  "--code-bg":             "rgba(0,0,0,0.45)",
  "--code-keyword":        "#c0b8b0",
  "--code-brace":          "#ffffff",
  "--code-bool":           "#4ade80",
  "--code-str":            "#f56f0d",
  "--code-border":         "rgba(245,111,13,0.18)",
  "--hero-overlay":        "rgba(13,13,13,0)",
};

const LIGHT_VARS: Record<string, string> = {
  "--color-background":    "#f3decd",
  "--color-surface":       "#e7d2c1",
  "--color-surface-alt":   "#dfcab9",
  "--color-text-primary":  "#25211c",
  "--color-text-secondary":"#5a4535",
  "--color-border":        "rgba(37,33,28,0.10)",
  "--background":          "#f3decd",
  "--surface":             "#e7d2c1",
  "--surface-alt":         "#dfcab9",
  "--text-primary":        "#25211c",
  "--text-secondary":      "#5a4535",
  "--border":              "rgba(37,33,28,0.10)",
  "--glass-bg":            "rgba(243,222,205,0.88)",
  "--nav-bg-scrolled":     "rgba(243,222,205,0.95)",
  "--nav-bg-default":      "rgba(243,222,205,0.65)",
  "--code-bg":             "rgba(37,33,28,0.07)",
  "--code-keyword":        "#6b4f3a",
  "--code-brace":          "#25211c",
  "--code-bool":           "#16a34a",
  "--code-str":            "#c04800",
  "--code-border":         "rgba(37,33,28,0.18)",
  "--hero-overlay":        "rgba(243,222,205,0.72)",
};

export function applyThemeVars(theme: Theme) {
  const vars = theme === "dark" ? DARK_VARS : LIGHT_VARS;
  const el = document.documentElement;
  for (const [key, value] of Object.entries(vars)) {
    el.style.setProperty(key, value);
  }
  el.setAttribute("data-theme", theme);
}

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "dark",
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = (localStorage.getItem("theme") as Theme | null) ?? "dark";
    setTheme(stored);
    applyThemeVars(stored);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next);
      applyThemeVars(next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
