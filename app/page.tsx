import type { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Stack from "@/components/sections/Stack";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";

/*
 * Estos metadatos pisan a los del layout: los de la portada mandan.
 *
 * Se cambiaron los dos sitios porque tener el titulo escrito dos veces es la
 * forma de que se separen, y ya habia pasado: el layout decia una cosa y esto
 * otra. La marca es `kagonzalezdev`; `revkelo` es solo el usuario de GitHub.
 */
export const metadata: Metadata = {
  title: "Kevin Gonzalez · Cloud & DevOps Engineer",
  description:
    "Portafolio de Kevin Gonzalez (kagonzalezdev): Cloud & DevOps y desarrollo full-stack desde Bogotá. Python, Next.js, Flutter, AWS y Azure.",
};

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content" role="main" aria-label="Portafolio de Kevin Gonzalez">
        <Hero />
        <About />
        <Experience />
        <Stack />
        <Projects />
        <Contact />
      </main>
    </>
  );
}
