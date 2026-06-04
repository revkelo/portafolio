"use client";

// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// ContactSceneWrapper: carga ContactScene via dynamic(ssr:false). Capa decorativa
// detras del contenido de Contact.

import dynamic from "next/dynamic";

const ContactScene = dynamic(() => import("./ContactScene"), {
  ssr: false,
  loading: () => null,
});

export default function ContactSceneWrapper() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0"
      style={{ opacity: 0.9 }}
    >
      <ContactScene />
    </div>
  );
}
