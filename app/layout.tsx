// PORTAFOLIO DE KEVIN GONZALEZ - revkelo
// Paleta: #0D0D0D fondo | #F06400 naranja | #FFFFFF texto
// Stack: Next.js 16 + TypeScript + Tailwind v4 + Framer Motion + Lenis
// Para agregar secciones: crear en components/sections/ e importar en app/page.tsx

import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
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

/*
 * El dominio del sitio. Por defecto es el real, no un marcador de posicion:
 * todo lo de abajo -canonical, Open Graph, sitemap, el @id del grafo- se
 * construye a partir de esta constante, asi que si apunta a un dominio que no
 * existe, el canonical le dice a Google que la pagina de verdad es una copia
 * de otra que no responde, y la de verdad deja de indexarse.
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portafolio.kgstudio.top";

/*
 * El `@id` de la persona vive en el hub y es el mismo para toda la zona: parla,
 * examia, reinicia e itep citan este. Un `@id` por sitio serían ocho personas
 * distintas con el mismo nombre.
 */
const KEVIN = "https://kgstudio.top/#kevin";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    // 67 caracteres se cortaban en el resultado de busqueda; este cabe.
    default: "Kevin Gonzalez · Cloud & DevOps Engineer",
    template: "%s | Kevin Gonzalez",
  },
  /*
   * La marca personal es `kagonzalezdev`, no `revkelo`: eso ultimo es solo el
   * usuario de GitHub, por razones historicas. El hub declara la marca en su
   * grafo y aqui decia otra cosa, asi que los dos sitios se contradecian sobre
   * como se llama la misma persona.
   *
   * Y 240 caracteres se cortaban a 160: la mitad de la lista de tecnologias no
   * la leia nadie.
   */
  description:
    "Portafolio de Kevin Gonzalez (kagonzalezdev): Cloud & DevOps y desarrollo full-stack desde Bogotá. Python, Next.js, Flutter, AWS y Azure.",
  keywords: [
    "Kevin Gonzalez",
    "revkelo",
    "Cloud Engineer Colombia",
    "DevOps Engineer Bogotá",
    "Full-Stack Developer",
    "Data Governance",
    "Python Developer",
    "FastAPI",
    "AWS Engineer",
    "Azure",
    "React Developer",
    "Flutter Developer",
    "Next.js",
    "Kubernetes",
    "Terraform",
    "Bogotá Colombia",
    "Ingeniero de Sistemas",
    "Universidad El Bosque",
    "portafolio desarrollador",
  ],
  // El autor apunta al hub, que es donde vive su ficha, no a GitHub: allí
  // `revkelo` es solo el usuario, y la marca personal es `kagonzalezdev`.
  authors: [{ name: "Kevin Gonzalez", url: "https://kgstudio.top/" }],
  creator: "Kevin Gonzalez",
  publisher: "Kevin Gonzalez",
  category: "Technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "es-CO": SITE_URL,
      "en-US": `${SITE_URL}?lang=en`,
    },
  },
  openGraph: {
    title: "Kevin Gonzalez - Cloud & DevOps Engineer · Full-Stack Developer",
    description:
      "Cloud & DevOps Engineer · Full-Stack Developer · Data Governance. Python, AWS, FastAPI, Flutter desde Bogotá, Colombia.",
    url: SITE_URL,
    siteName: "Kevin Gonzalez Portfolio",
    locale: "es_CO",
    alternateLocale: ["en_US"],
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Kevin Gonzalez - Cloud & DevOps Engineer · Full-Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kevin Gonzalez - Cloud & DevOps Engineer",
    description:
      "Cloud & DevOps · Full-Stack · Data Governance. Python, AWS, FastAPI, Flutter. Bogotá, Colombia.",
    images: ["/opengraph-image"],
    creator: "@kagonzalezdev",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
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
        {/* Preconnect a CDNs externos para reducir latencia en primera carga */}
        <link rel="preconnect" href="https://skillicons.dev" />
        <link rel="dns-prefetch" href="https://skillicons.dev" />
        <link rel="preconnect" href="https://flagcdn.com" />

        {/* Anti-FOUC: aplica variables CSS inline antes del primer render.
            Usa style.setProperty (maxima prioridad) para que Tailwind @theme no interfiera. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){var e=document.documentElement;e.setAttribute('data-theme','light');var v={'--color-background':'#f3decd','--color-surface':'#e7d2c1','--color-surface-alt':'#dfcab9','--color-text-primary':'#25211c','--color-text-secondary':'#5a4535','--color-border':'rgba(37,33,28,0.10)','--background':'#f3decd','--surface':'#e7d2c1','--surface-alt':'#dfcab9','--text-primary':'#25211c','--text-secondary':'#5a4535','--border':'rgba(37,33,28,0.10)','--glass-bg':'rgba(243,222,205,0.88)','--nav-bg-scrolled':'rgba(243,222,205,0.95)','--nav-bg-default':'rgba(243,222,205,0.65)','--code-bg':'rgba(37,33,28,0.07)','--code-keyword':'#6b4f3a','--code-brace':'#25211c','--code-bool':'#16a34a','--code-str':'#c04800','--code-border':'rgba(37,33,28,0.18)','--hero-overlay':'rgba(243,222,205,0.72)'};for(var k in v)e.style.setProperty(k,v[k]);}}catch(e){}})();`,
          }}
        />

        {/* JSON-LD: structured data para SEO y AI crawlers */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              /*
               * La identidad no se vuelve a describir aquí: se cita.
               *
               * Este nodo declaraba un `#person` propio con el cargo, los
               * estudios, la dirección y el empleo repetidos del hub. Eran dos
               * fichas de la misma persona con `@id` distintos, que es
               * exactamente lo que impide que Google las una, y dos sitios
               * donde corregir el mismo dato el día que cambie. El hub es la
               * fuente de verdad de `https://kgstudio.top/#kevin`; el resto de
               * la zona lo cita, y aquí se deja solo lo justo para que el nodo
               * se entienda suelto.
               */
              {
                "@context": "https://schema.org",
                "@type": "Person",
                "@id": KEVIN,
                "name": "Kevin Gonzalez",
                "alternateName": ["kagonzalezdev", "revkelo"],
                "url": "https://kgstudio.top/",
                "jobTitle": "Cloud & DevOps Engineer",
                "sameAs": [
                  "https://github.com/revkelo",
                  "https://www.linkedin.com/in/kagonzalezdev",
                  "https://www.tiktok.com/@kagonzalezdev"
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "@id": `${SITE_URL}/#website`,
                "url": SITE_URL,
                "name": "Kevin Gonzalez Portfolio",
                "description": "Portafolio profesional de Kevin Gonzalez - Cloud & DevOps Engineer, Full-Stack Developer.",
                "author": { "@id": KEVIN },
                "inLanguage": ["es-CO", "en-US"],
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": `${SITE_URL}/?q={search_term_string}`,
                  "query-input": "required name=search_term_string"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "WebPage",
                "@id": `${SITE_URL}/#webpage`,
                "url": SITE_URL,
                "name": "Kevin Gonzalez - Cloud & DevOps Engineer · Full-Stack Developer",
                "isPartOf": { "@id": `${SITE_URL}/#website` },
                "about": { "@id": KEVIN },
                "description": "Portafolio de Kevin Gonzalez. Cloud & DevOps Engineer, Full-Stack Developer y Data Governance desde Bogotá, Colombia.",
                "breadcrumb": {
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Inicio", "item": SITE_URL }
                  ]
                }
              }
            ])
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
