// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// Sistema bilingue ES/EN. Todas las cadenas de la UI viven aqui.
// Para agregar idioma: replicar la estructura del objeto `es` bajo una nueva clave.

export type Lang = "es" | "en";

export const translations = {
  es: {
    nav: {
      home: "Inicio",
      about: "Sobre mí",
      stack: "Stack",
      projects: "Proyectos",
      contact: "Contacto",
      cta: "Hablemos",
    },
    hero: {
      location: "Bogotá, Colombia",
      greeting: "Hola, soy",
      terminal: "Building things with Python, FastAPI & AWS",
      cta1: "Ver proyectos",
      cta2: "Descargar CV",
      scroll: "Scroll",
      metrics: {
        years: "años de proyectos",
        repos: "repositorios",
        countries: "países impactados",
      },
    },
    about: {
      number: "01",
      label: "ABOUT",
      title: "Sobre mí",
      subtitle:
        "Ingeniero enfocado en construir software confiable de punta a punta.",
      bio: "Ingeniero de Sistemas (UEB, 2026) con experiencia en Cloud & DevOps, desarrollo full-stack y gobernanza de datos. He construido sistemas médicos 3D en AWS, migrado plataformas institucionales a Microsoft 365 y desarrollado aplicaciones móviles con IA.",
      photoHint: "Agrega tu foto en public/photo.jpg",
      highlights: [
        {
          title: "Cloud & AWS",
          desc: "Infraestructura en AWS y Azure, Docker, CI/CD y arquitecturas serverless.",
        },
        {
          title: "Data Governance",
          desc: "Calidad, gobierno y migración de datos preservando seguridad y estructura.",
        },
        {
          title: "Full-Stack Dev",
          desc: "APIs con FastAPI y Java, frontends con React, Next.js y Flutter.",
        },
      ],
    },
    stack: {
      number: "02",
      label: "STACK",
      title: "Stack",
      subtitle: "Tecnologías con las que construyo a diario.",
    },
    projects: {
      number: "03",
      label: "PROJECTS",
      title: "Proyectos",
      subtitle: "Una selección de lo que he construido recientemente.",
      featured: "Destacados",
      more: "Más proyectos",
      private: "Privado",
      demo: "Demo",
      code: "Código",
      statusInProgress: "En desarrollo",
      statusCompleted: "Completado",
    },
    contact: {
      number: "04",
      label: "CONTACT",
      title: "Contacto",
      subtitle: "¿Tienes un proyecto en mente? Hablemos.",
      cta: "¿Tienes un proyecto?",
      copy: "Click para copiar",
      copied: "¡Copiado!",
      closing: "Construyamos algo genial juntos.",
    },
    footer: {
      rights: "Bogotá, Colombia.",
    },
  },
  en: {
    nav: {
      home: "Home",
      about: "About",
      stack: "Stack",
      projects: "Projects",
      contact: "Contact",
      cta: "Let's talk",
    },
    hero: {
      location: "Bogotá, Colombia",
      greeting: "Hi, I'm",
      terminal: "Building things with Python, FastAPI & AWS",
      cta1: "View projects",
      cta2: "Download CV",
      scroll: "Scroll",
      metrics: {
        years: "years of projects",
        repos: "repositories",
        countries: "countries impacted",
      },
    },
    about: {
      number: "01",
      label: "ABOUT",
      title: "About me",
      subtitle: "Engineer focused on building reliable software end to end.",
      bio: "Systems Engineer (UEB, 2026) with experience in Cloud & DevOps, full-stack development and data governance. I've built 3D medical systems on AWS, migrated institutional platforms to Microsoft 365, and developed AI-powered mobile apps.",
      photoHint: "Add your photo at public/photo.jpg",
      highlights: [
        {
          title: "Cloud & AWS",
          desc: "Infrastructure on AWS and Azure, Docker, CI/CD and serverless architectures.",
        },
        {
          title: "Data Governance",
          desc: "Data quality, governance and migration preserving security and structure.",
        },
        {
          title: "Full-Stack Dev",
          desc: "APIs with FastAPI and Java, frontends with React, Next.js and Flutter.",
        },
      ],
    },
    stack: {
      number: "02",
      label: "STACK",
      title: "Stack",
      subtitle: "Technologies I build with every day.",
    },
    projects: {
      number: "03",
      label: "PROJECTS",
      title: "Projects",
      subtitle: "A selection of what I've built recently.",
      featured: "Featured",
      more: "More projects",
      private: "Private",
      demo: "Demo",
      code: "Code",
      statusInProgress: "In progress",
      statusCompleted: "Completed",
    },
    contact: {
      number: "04",
      label: "CONTACT",
      title: "Contact",
      subtitle: "Got a project in mind? Let's talk.",
      cta: "Have a project?",
      copy: "Click to copy",
      copied: "Copied!",
      closing: "Let's build something great together.",
    },
    footer: {
      rights: "Bogotá, Colombia.",
    },
  },
};

export type Translations = (typeof translations)["es"];
