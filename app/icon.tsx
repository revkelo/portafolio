import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#0d0d0d",
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Acento naranja superior izquierdo */}
        <div
          style={{
            position: "absolute",
            top: 3,
            left: 3,
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "#f06400",
          }}
        />
        <span
          style={{
            fontFamily: "sans-serif",
            fontSize: 14,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-1px",
          }}
        >
          KG
        </span>
      </div>
    ),
    { ...size },
  );
}
