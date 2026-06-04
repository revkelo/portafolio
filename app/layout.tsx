// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// Paleta: #0D0D0D fondo | #F06400 naranja | #FFFFFF texto
// Stack: Next.js 16 + TypeScript + Tailwind v4 + Framer Motion + Lenis
// Para agregar secciones: crear en components/sections/ e importar en app/page.tsx

import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";
import BackToTop from "@/components/ui/BackToTop";
import KeyboardShortcuts from "@/components/ui/KeyboardShortcuts";
import EasterEgg from "@/components/ui/EasterEgg";
import MusicPlayer from "@/components/ui/MusicPlayer";
import PageLoader from "@/components/ui/PageLoader";
import GlobalSceneWrapper from "@/components/3d/GlobalSceneWrapper";
import { LangProvider } from "@/lib/i18n/LangContext";
import { ThemeProvider } from "@/lib/theme/ThemeContext";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0d0d0d" },
    { media: "(prefers-color-scheme: light)", color: "#f5f0eb" },
  ],
};

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
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        {/* Script inline anti-FOUC: aplica data-theme antes del primer render */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full">
        {/* Canvas 3D fijo detras de todo el contenido (el viaje persistente) */}
        <GlobalSceneWrapper />
        <ThemeProvider>
          <LangProvider>
            <PageLoader />
            <div aria-hidden className="grain-overlay" />
            <CustomCursor />
            <BackToTop />
            <KeyboardShortcuts />
            <EasterEgg />
            <MusicPlayer />
            <div className="relative z-10">{children}</div>
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
