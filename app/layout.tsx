// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// Paleta: #0D0D0D fondo | #F06400 naranja | #FFFFFF texto
// Stack: Next.js 16 + TypeScript + Tailwind v4 + Framer Motion + Lenis
// Para agregar secciones: crear en components/sections/ e importar en app/page.tsx

import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/ui/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://github.com/revkelo/portafolio"),
  title: "Kevin Gonzalez — Cloud & DevOps Engineer · Full-Stack Developer",
  description:
    "Portafolio de Kevin Gonzalez. Cloud & DevOps Engineer, Full-Stack Developer y Data Governance. Python, FastAPI, React, Flutter, AWS y Azure desde Bogota, Colombia.",
  keywords: [
    "Kevin Gonzalez",
    "Cloud Engineer",
    "DevOps",
    "Full-Stack",
    "Data Governance",
    "Bogota",
    "AWS",
    "Azure",
  ],
  authors: [{ name: "Kevin Gonzalez", url: "https://github.com/revkelo" }],
  openGraph: {
    title: "Kevin Gonzalez — Cloud & DevOps Engineer",
    description:
      "Cloud & DevOps Engineer · Full-Stack Developer · Data Governance.",
    locale: "es_CO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-text-primary">
        <CustomCursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
