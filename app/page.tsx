// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// Paleta: #0D0D0D fondo | #F06400 naranja | #FFFFFF texto
// Stack: Next.js 16 + TypeScript + Tailwind v4 + Framer Motion + Lenis
// Para agregar secciones: crear en components/sections/ e importar aqui en orden.

import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Stack from "@/components/sections/Stack";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";

// Separador futurista: linea fina con gradiente naranja -> transparente -> naranja
function SectionDivider() {
  return (
    <div
      aria-hidden
      className="h-px w-full"
      style={{
        background:
          "linear-gradient(90deg, transparent, #f06400, transparent)",
      }}
    />
  );
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SectionDivider />
        <About />
        <SectionDivider />
        <Experience />
        <SectionDivider />
        <Stack />
        <SectionDivider />
        <Projects />
        <SectionDivider />
        <Contact />
      </main>
    </>
  );
}
