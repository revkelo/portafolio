import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Kevin Gonzalez - Cloud & DevOps Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%",
          display: "flex", flexDirection: "column",
          alignItems: "flex-start", justifyContent: "center",
          background: "#0d0d0d", padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <span style={{ fontSize: 48, fontWeight: 900, color: "#f56f0d" }}>KG</span>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f56f0d" }} />
        </div>
        <h1 style={{ fontSize: 72, fontWeight: 900, color: "#ffffff", margin: 0, lineHeight: 1.1 }}>
          Kevin Gonzalez
        </h1>
        <p style={{ fontSize: 32, color: "#f56f0d", margin: "16px 0 0", fontWeight: 600 }}>
          Cloud & DevOps Engineer · Full-Stack Developer
        </p>
        <p style={{ fontSize: 22, color: "#c0b8b0", margin: "12px 0 0" }}>
          Python · AWS · FastAPI · Flutter · Data Governance · Bogotá, Colombia
        </p>
      </div>
    ),
    size
  );
}
