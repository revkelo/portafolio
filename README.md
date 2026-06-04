# Portfolio — Kevin Gonzalez

**Live:** [revkelo.dev](https://revkelo.dev) · [GitHub](https://github.com/revkelo) · [LinkedIn](https://linkedin.com/in/kagonzalezdev)

Portafolio web profesional con escena 3D inmersiva, animaciones de scroll, carrusel de tecnologías, modo oscuro/claro y soporte bilingüe ES/EN.

**Concepto visual:** Dark Tech + Orange Fire — oscuro, minimalista, con naranja como energía.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16 (App Router) + TypeScript |
| Estilos | Tailwind CSS v4 con `@theme` dinámico |
| Animaciones | Framer Motion + GSAP |
| 3D | React Three Fiber + @react-three/drei + Three.js |
| Scroll | Lenis (smooth scroll) |
| i18n | Context bilingüe ES/EN con `localStorage` |
| Tema | Dark/Light mode via CSS variables + `data-theme` |
| Deploy | Vercel |

## Características

- **Escena 3D** — Wave Field: superficie ondulante de partículas que reacciona al cursor con efecto ripple
- **Scroll animations** — barra de progreso naranja, letras cayendo, texto que se ilumina, timeline que crece
- **Carrusel infinito** — 2 filas de tecnologías deslizando en sentidos opuestos, pausa al hover
- **Bilingüe** — toggle ES/EN con persistencia
- **Dark/Light mode** — toggle sol/luna, persiste en localStorage
- **Cursor custom** — anillo naranja con trail (solo desktop)
- **Responsive** — mobile, tablet, desktop
- **ngrok support** — `allowedDevOrigins` configurado en `next.config.ts`

## Correr localmente

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción
```

Requisitos: Node.js 20.9+

## Estructura

```
app/
├── layout.tsx          metadata, fuentes, providers
├── page.tsx            secciones en orden + SectionDividers
└── globals.css         tokens CSS, keyframes, dark/light vars

components/
├── sections/
│   ├── Hero.tsx        nombre animado, roles rotativos, métricas, CTA
│   ├── About.tsx       foto sticky, bio scrub, code block, highlights
│   ├── Experience.tsx  timeline con badges de empresa y bullets ▹
│   ├── Stack.tsx       bento grid de categorías con tilt 3D
│   ├── Projects.tsx    cards con tags de colores, scroll horizontal featured
│   └── Contact.tsx     CTA full-width, email copiable, footer
├── ui/
│   ├── Navbar.tsx      sticky + blur, active indicator, drawer mobile
│   ├── TechCarousel.tsx carrusel infinito de tecnologías
│   ├── CustomCursor.tsx anillo naranja con trail (desktop)
│   ├── ScrollProgress.tsx barra de progreso naranja
│   ├── SectionTitle.tsx  número + línea naranja + título
│   └── ProjectCard.tsx   card con branded tags y decoración diagonal
└── 3d/
    ├── GlobalScene.tsx    Wave Field — ola de partículas, ripple del cursor
    └── GlobalSceneWrapper.tsx mobile detection, dynamic import ssr:false

lib/
├── data/projects.ts    fuente única de proyectos del portafolio
├── i18n/
│   ├── LangContext.tsx  Context + Provider + hook useLang()
│   └── translations.ts todas las cadenas ES + EN
└── theme/
    └── ThemeContext.tsx Context dark/light + hook useTheme()
```

## Agregar un proyecto

Editar `lib/data/projects.ts`:

```ts
{
  id: "mi-proyecto",
  title: "Mi Proyecto",
  description: "Descripción en español.",
  description_en: "English description.",
  tags: ["TypeScript", "AWS"],
  github: "https://github.com/revkelo/mi-proyecto", // null si privado
  demo: null,
  status: "completed", // o "in-progress"
  featured: true,
}
```

## Agregar una sección

1. Crear `components/sections/MiSeccion.tsx` con `"use client"`
2. Importar en `app/page.tsx` y colocar en orden con `<SectionDivider />`
3. Añadir las cadenas en `lib/i18n/translations.ts` (ES + EN)

---

## Nuevas características (2026)

- **Full-page scroll** — navegación por secciones con `FullPageScroll` + `SectionSlot`
- **Keyboard shortcuts** — `j/k` navega secciones, `g+letra` salta directo, `?` muestra panel
- **Easter egg** — escribe `revkelo` en cualquier página
- **Music player** — ambient drone Am7 generado con Web Audio API
- **Back to top** — botón flotante naranja aparece al bajar
- **Experience split-screen** — panel sticky izquierdo + bullets animados derecha
- **Stack bento grid** — colores por categoría, iconos reales de skillicons.dev
- **OpenGraph image** — generada dinámicamente con Next.js ImageResponse
- **Security headers** — X-Frame-Options, XSS Protection, Content-Type, Permissions-Policy
- **robots.txt + sitemap.ts** — SEO completo

---

Desarrollado por **Kevin Gonzalez** · Bogotá, Colombia
