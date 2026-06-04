import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100dvh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "var(--background)", color: "var(--text-primary)",
      fontFamily: "var(--font-display)", textAlign: "center", gap: "1.5rem",
      padding: "2rem",
    }}>
      <p style={{ fontSize: "6rem", fontWeight: 900, color: "#f56f0d", lineHeight: 1, letterSpacing: "-0.04em", margin: 0 }}>
        404
      </p>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
        Página no encontrada
      </h1>
      <p style={{ color: "var(--text-secondary)", fontSize: "1rem", maxWidth: 360, lineHeight: 1.6 }}>
        Esta ruta no existe en el portafolio. Vuelve al inicio.
      </p>
      <Link
        href="/"
        style={{
          padding: "0.6rem 1.5rem", borderRadius: "999px",
          background: "#f56f0d", color: "#0d0d0d",
          fontWeight: 700, textDecoration: "none", fontSize: "0.9rem",
        }}
      >
        ← Volver al inicio
      </Link>
    </div>
  );
}
