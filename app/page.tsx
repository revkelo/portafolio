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

// Separador futurista: linea con gradiente naranja a ambos lados + rombo central.
function SectionDivider() {
  return (
    <div
      aria-hidden
      className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-2 sm:px-6 lg:px-8"
    >
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-primary/20 to-transparent" />
      <span className="text-xs text-orange-primary/40">◆</span>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-primary/20 to-transparent" />
    </div>
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
