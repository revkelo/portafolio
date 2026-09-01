// PORTAFOLIO DE KEVIN GONZALEZ - revkelo
// Sistema bilingue ES/EN. Todas las cadenas de la UI viven aqui.
// Para agregar idioma: replicar la estructura del objeto `es` bajo una nueva clave.

export type Lang = "es" | "en";

export const translations = {
  es: {
    nav: {
      home: "Inicio",
      about: "Sobre mí",
      experience: "Experiencia",
      stack: "Stack",
      projects: "Proyectos",
      contact: "Contacto",
      cta: "Hablemos",
    },
    hero: {
      location: "Bogotá, Colombia",
      greeting: "Hola, soy",
      roles: [
        "Cloud & DevOps Engineer",
        "Ingeniero de Sistemas",
        "Full-Stack Developer",
        "Data Governance",
      ],
      terminal: "Building things with Python, FastAPI & AWS",
      cta1: "Ver proyectos",
      cta2: "Descargar CV",
      scroll: "Scroll",
      metrics: {
        years: "años exp.",
        repos: "repositorios",
        countries: "proyectos",
        uptime: "uptime logrado",
      },
    },
    about: {
      number: "01",
      label: "ABOUT",
      title: "Sobre mí",
      subtitle:
        "Ingeniero enfocado en construir software confiable de punta a punta.",
      bio: "Ingeniero de Sistemas de la Universidad El Bosque con enfoque en Arquitectura Cloud, prácticas DevOps y Gobierno de Datos. Mi trabajo combina el desarrollo de software Full-Stack con la automatización de plataformas de datos de alta escala en entornos corporativos.",
      photoHint: "Agrega tu foto en public/photo.jpg",
      highlights: [
        {
          title: "Cloud & AWS",
          desc: "Lambda · EC2 · S3 · RDS · Kubernetes",
        },
        {
          title: "Gobierno de Datos",
          desc: "DAMA-DMBOK · Great Expectations · Databricks",
        },
        {
          title: "Full-Stack Dev",
          desc: "Python · FastAPI · Java · TypeScript · Flutter",
        },
      ],
    },
    experience: {
      number: "02",
      label: "EXPERIENCE",
      title: "Experiencia",
      subtitle: "Donde he construido, automatizado y gobernado datos.",
      current: "Actual",
      items: [
        {
          company: "Corona",
          role: "Analista de Gobierno de Datos",
          period: "Ago 2026 - presente",
          type: "Remoto, Bogotá",
          bullets: [
            "ABAC en Unity Catalog (RLS, CLS, OLS) con governed tags y funciones dinámicas",
            "Sincronización de usuarios y grupos automatizada en Python (Databricks SDK, SCIM API) sobre Jobs",
            "Validación de tablas Delta con Great Expectations y monitoreo continuo en Power BI",
            "Roles RLS y modelos de compartición en Power BI para el consumidor final",
            "Arquitectura Medallion sobre Azure · Databricks · Power BI",
          ],
        },
        {
          company: "Corona",
          role: "Practicante Gobierno de Datos",
          period: "Feb 2026 - Ago 2026",
          type: "Híbrido, Bogotá",
          bullets: [
            "🏆 Ganador a Mejor Practicante, entre 180 postulados de distintas empresas",
            "Reglas de calidad con Great Expectations + Databricks",
            "DAMA-DMBOK: políticas, flujos y dashboards en Power BI",
            "Automatizó el 100% de las pruebas de calidad de datos",
            "Catalogación de metadatos y linaje con Azure DevOps",
          ],
        },
        {
          company: "Proyectos Independientes",
          role: "Ingeniero DevOps & Cloud",
          period: "Jun 2024 - presente",
          type: "Remoto",
          bullets: [
            "Arquitecturas Serverless con AWS Lambda",
            "Kubernetes: pods, servicios y escalado",
            "Migración 365 UEB (Google Drive → Microsoft 365, cero pérdidas)",
          ],
        },
        {
          company: "Universidad El Bosque",
          role: "Ing. Full-Stack - Proyecto Meritorio",
          period: "Ene 2025 - Nov 2025",
          type: "Bogotá",
          bullets: [
            "SOM3D para 3Dvinci Studios: pipeline DICOM → modelo 3D médico",
            "AWS EC2/S3/RDS, FastAPI, Docker y Three.js",
          ],
        },
      ],
    },
    stack: {
      number: "03",
      label: "STACK",
      title: "Stack",
      subtitle: "Tecnologías con las que construyo a diario.",
    },
    projects: {
      number: "04",
      label: "PROJECTS",
      title: "Proyectos",
      subtitle: "Una selección de lo que he construido recientemente.",
      featured: "Destacados",
      slideHint: "Desliza para ver más",
      more: "Más proyectos",
      private: "Privado",
      demo: "Demo",
      code: "Código",
      statusInProgress: "En desarrollo",
      statusCompleted: "Completado",
    },
    contact: {
      number: "05",
      label: "CONTACT",
      title: "Contacto",
      subtitle: "¿Tienes un proyecto en mente? Hablemos.",
      cta: "¿Tienes un proyecto?",
      copy: "Click para copiar",
      copied: "¡Copiado!",
      closing: "Construyamos algo genial juntos.",
      availability: "Disponible para proyectos freelance y oportunidades full-time.",
    },
    footer: {
      rights: "Bogotá, Colombia.",
    },
  },
  en: {
    nav: {
      home: "Home",
      about: "About",
      experience: "Experience",
      stack: "Stack",
      projects: "Projects",
      contact: "Contact",
      cta: "Let's talk",
    },
    hero: {
      location: "Bogotá, Colombia",
      greeting: "Hi, I'm",
      roles: [
        "Cloud & DevOps Engineer",
        "Systems Engineer",
        "Full-Stack Developer",
        "Data Governance",
      ],
      terminal: "Building things with Python, FastAPI & AWS",
      cta1: "View projects",
      cta2: "Download CV",
      scroll: "Scroll",
      metrics: {
        years: "yrs exp.",
        repos: "repositories",
        countries: "projects",
        uptime: "uptime achieved",
      },
    },
    about: {
      number: "01",
      label: "ABOUT",
      title: "About me",
      subtitle: "Engineer focused on building reliable software end to end.",
      bio: "Systems Engineer from Universidad El Bosque focused on Cloud Architecture, DevOps practices, and Data Governance. My work combines Full-Stack software development with large-scale data platform automation in corporate environments.",
      photoHint: "Add your photo at public/photo.jpg",
      highlights: [
        {
          title: "Cloud & AWS",
          desc: "Lambda · EC2 · S3 · RDS · Kubernetes",
        },
        {
          title: "Data Governance",
          desc: "DAMA-DMBOK · Great Expectations · Databricks",
        },
        {
          title: "Full-Stack Dev",
          desc: "Python · FastAPI · Java · TypeScript · Flutter",
        },
      ],
    },
    experience: {
      number: "02",
      label: "EXPERIENCE",
      title: "Experience",
      subtitle: "Where I've built, automated, and governed data.",
      current: "Current",
      items: [
        {
          company: "Corona",
          role: "Data Governance Analyst",
          period: "Aug 2026 - present",
          type: "Remote, Bogotá",
          bullets: [
            "ABAC in Unity Catalog (RLS, CLS, OLS) with governed tags and dynamic functions",
            "Automated user and group sync in Python (Databricks SDK, SCIM API) orchestrated with Jobs",
            "Delta table validation with Great Expectations and continuous monitoring in Power BI",
            "RLS roles and sharing models in Power BI for the end consumer",
            "Medallion architecture on Azure · Databricks · Power BI",
          ],
        },
        {
          company: "Corona",
          role: "Data Governance Intern",
          period: "Feb 2026 - Aug 2026",
          type: "Hybrid, Bogotá",
          bullets: [
            "🏆 Best Intern award, out of 180 applicants from different companies",
            "Data quality rules with Great Expectations + Databricks",
            "DAMA-DMBOK: policies, workflows and Power BI dashboards",
            "Automated 100% of data quality testing",
            "Metadata cataloging and lineage with Azure DevOps",
          ],
        },
        {
          company: "Independent Projects",
          role: "DevOps & Cloud Engineer",
          period: "Jun 2024 - present",
          type: "Remote",
          bullets: [
            "Serverless architectures with AWS Lambda",
            "Kubernetes: pods, services and scaling",
            "365 UEB Migration (Google Drive → Microsoft 365, zero data loss)",
          ],
        },
        {
          company: "Universidad El Bosque",
          role: "Full-Stack Eng. - Meritorious Project",
          period: "Jan 2025 - Nov 2025",
          type: "Bogotá",
          bullets: [
            "SOM3D for 3Dvinci Studios: DICOM → 3D medical model pipeline",
            "AWS EC2/S3/RDS, FastAPI, Docker and Three.js",
          ],
        },
      ],
    },
    stack: {
      number: "03",
      label: "STACK",
      title: "Stack",
      subtitle: "Technologies I build with every day.",
    },
    projects: {
      number: "04",
      label: "PROJECTS",
      title: "Projects",
      subtitle: "A selection of what I've built recently.",
      featured: "Featured",
      slideHint: "Slide to see more",
      more: "More projects",
      private: "Private",
      demo: "Demo",
      code: "Code",
      statusInProgress: "In progress",
      statusCompleted: "Completed",
    },
    contact: {
      number: "05",
      label: "CONTACT",
      title: "Contact",
      subtitle: "Got a project in mind? Let's talk.",
      cta: "Have a project?",
      copy: "Click to copy",
      copied: "Copied!",
      closing: "Let's build something great together.",
      availability: "Available for freelance projects and full-time opportunities.",
    },
    footer: {
      rights: "Bogotá, Colombia.",
    },
  },
};

export type Translations = (typeof translations)["es"];
