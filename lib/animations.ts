// Variants de Framer Motion reutilizables.
// Uso: <motion.div {...fadeUp(0.1)}>

export const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: "-40px" },
  transition:  { duration: 0.5, ease: "easeOut" as const, delay },
});

export const fadeLeft = (delay = 0) => ({
  initial:     { opacity: 0, x: -20 },
  whileInView: { opacity: 1, x: 0 },
  viewport:    { once: true, margin: "-80px" },
  transition:  { duration: 0.6, ease: "easeOut" as const, delay },
});

export const fadeRight = (delay = 0) => ({
  initial:     { opacity: 0, x: 20 },
  whileInView: { opacity: 1, x: 0 },
  viewport:    { once: true, margin: "-80px" },
  transition:  { duration: 0.6, ease: "easeOut" as const, delay },
});

export const scaleIn = (delay = 0) => ({
  initial:     { opacity: 0, scale: 0.92 },
  whileInView: { opacity: 1, scale: 1 },
  viewport:    { once: true, margin: "-40px" },
  transition:  { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const, delay },
});
