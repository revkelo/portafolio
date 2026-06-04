# Portafolio — Kevin Gonzalez

Portafolio web profesional de **Kevin Gonzalez** — Cloud & DevOps Engineer · Full-Stack Developer · Data Governance.

Concepto visual: **Dark Tech + Orange Fire** — minimalista oscuro con el naranja como energia.

## Paleta

| Color     | Uso                          |
| --------- | ---------------------------- |
| `#0D0D0D` | Fondo principal              |
| `#F06400` | Naranja primario (acento)    |
| `#C44A00` | Naranja oscuro (hover)       |
| `#FFFFFF` | Texto principal              |
| `#C0C0C0` | Texto secundario             |

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4** (paleta personalizada vía `@theme` en `app/globals.css`)
- **Framer Motion** — animaciones de entrada (fade + slide)
- **Lenis** — smooth scroll
- **GSAP** + `@gsap/react` — instalado para scroll animations futuras
- **React Three Fiber** + `@react-three/drei` + `three` — instalado para un hero 3D futuro

## Correr localmente

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de produccion (Turbopack por defecto en Next 16)
npm run start    # servir el build
```

Requisitos: Node.js 20.9+.

## Estructura

```
app/
├── layout.tsx          metadata, fuentes (Space Grotesk + Inter), SmoothScroll + CustomCursor
├── page.tsx            ensambla todas las secciones en orden
└── globals.css         tema Tailwind v4, scrollbar naranja, cursor custom

components/
├── sections/
│   ├── Hero.tsx        nombre, roles alternados, CTA, separador diagonal
│   ├── About.tsx       bio + highlights del stack
│   ├── Stack.tsx       grid de iconos (skillicons.dev)
│   ├── Projects.tsx    grid de cards de proyectos
│   └── Contact.tsx     email, GitHub, LinkedIn, footer
└── ui/
    ├── Navbar.tsx      navegacion sticky con blur
    ├── CustomCursor.tsx  cursor naranja (solo desktop)
    ├── SmoothScroll.tsx  wrapper de Lenis
    ├── SectionTitle.tsx  titulo de seccion con linea naranja
    └── ProjectCard.tsx   card individual con hover naranja

lib/
├── data/
│   └── projects.ts     array de proyectos (fuente de datos unica)
└── utils/
    └── smooth-scroll.ts  configuracion de Lenis

public/
└── cv-kevin-gonzalez.pdf  (agregar el CV aqui para el boton "Descargar CV")
```

## Como agregar un proyecto (guia para IA futuras)

Toda la data de proyectos vive en `lib/data/projects.ts`. Para agregar uno nuevo,
añade un objeto al array `projects` con esta estructura:

```ts
{
  id: "mi-proyecto",            // unico, kebab-case
  title: "Mi Proyecto",
  description: "Descripcion corta de una o dos frases.",
  tags: ["TypeScript", "AWS"], // tecnologias (se muestran como pills)
  github: "https://github.com/revkelo/mi-proyecto", // o null si es privado
  demo: null,                   // url del demo o null
  status: "Completado",         // o "En desarrollo"
  featured: true,
}
```

No hay que tocar ningun componente: `Projects.tsx` renderiza automaticamente todo el array.

## Como agregar una seccion nueva

1. Crear el componente en `components/sections/MiSeccion.tsx` (usar `"use client"` si usa hooks/animaciones).
2. Importarlo en `app/page.tsx` y colocarlo en el orden deseado dentro de `<main>`.
3. Si necesita un titulo, reutilizar `components/ui/SectionTitle.tsx`.

## Enlaces

- GitHub: [github.com/revkelo](https://github.com/revkelo)
- LinkedIn: [linkedin.com/in/kagonzalezdev](https://linkedin.com/in/kagonzalezdev)
- Email: kgagudelo@gmail.com
