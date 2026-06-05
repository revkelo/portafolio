import type { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Stack from "@/components/sections/Stack";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Kevin Gonzalez — Cloud & DevOps Engineer · Full-Stack Developer",
  description:
    "Portafolio de Kevin Gonzalez (revkelo). Cloud & DevOps Engineer, Full-Stack Developer y Data Governance. Python, FastAPI, AWS, Flutter desde Bogotá, Colombia.",
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
