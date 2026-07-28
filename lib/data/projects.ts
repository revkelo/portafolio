// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// Paleta: #0D0D0D fondo | #F06400 naranja | #FFFFFF texto
// Stack: Next.js 16 + TypeScript + Tailwind + Framer Motion + Lenis
//
// GUIA PARA FUTURAS CONVERSACIONES CON IA:
// Este archivo contiene todos los proyectos del portafolio.
// Para agregar un proyecto nuevo, anadir un objeto al array con la misma estructura.
// `status` usa los valores canonicos: "in-progress" | "completed".

export type ProjectStatus = "in-progress" | "completed";

export interface Project {
  id: string;
  title: string;
  description: string;
  description_en: string;
  tags: string[];
  github: string | null;
  demo: string | null;
  status: ProjectStatus;
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: "parla",
    title: "Parla",
    description:
      "Intérprete médico en vivo español⇄inglés — transcripción en streaming con Deepgram, interpretación con IA que respeta registro y acrónimos clínicos, historial de consultas y cobro por uso.",
    description_en:
      "Live Spanish⇄English medical interpreter — Deepgram streaming transcription, AI interpretation that preserves register and clinical acronyms, session history and usage-based billing.",
    tags: ["Next.js", "TypeScript", "Deepgram", "Supabase", "Stripe"],
    github: "https://github.com/revkelo/parla",
    demo: "https://parla.kgstudio.top",
    status: "completed",
    featured: true,
  },
  {
    id: "monetiq",
    title: "MonetIQ",
    description:
      "App móvil de finanzas personales con IA — análisis inteligente de gastos, WhatsApp webhook y recomendaciones automáticas.",
    description_en:
      "AI-powered personal finance mobile app — smart spending analysis, WhatsApp webhook and automatic recommendations.",
    tags: ["Flutter", "Next.js", "Supabase", "TypeScript", "AI"],
    github: null, // privado
    demo: null,
    status: "in-progress",
    featured: true,
  },
  {
    id: "som3d",
    title: "SOM 3D",
    description:
      "Pipeline para convertir estudios DICOM en modelos médicos 3D con segmentación automática, visualización con Three.js y gestión de hospitales con pagos integrados.",
    description_en:
      "Pipeline to convert DICOM studies into 3D medical models with automatic segmentation, Three.js visualization, and hospital management with integrated payments.",
    tags: ["Python", "FastAPI", "Three.js", "Docker", "AWS"],
    github: null, // privado
    demo: null,
    status: "completed",
    featured: true,
  },
  {
    id: "focuszone",
    title: "FocusZone",
    description:
      "Plataforma de bienestar digital con Pomodoro, retos semanales, IA (Lumi) y leaderboard para estudiantes de la UEB.",
    description_en:
      "Digital wellbeing platform with Pomodoro, weekly challenges, AI (Lumi) and a leaderboard for UEB students.",
    tags: ["TypeScript", "React", "Supabase", "Vercel"],
    github: "https://github.com/revkelo/FocusZone",
    demo: null,
    status: "completed",
    featured: true,
  },
  {
    id: "asisvoz",
    title: "AsisVoz",
    description:
      "App de escritorio para transcribir audio/video con Deepgram, exportar PDF/DOCX con diarización y Q&A con DeepSeek.",
    description_en:
      "Desktop app to transcribe audio/video with Deepgram, export PDF/DOCX with diarization and Q&A powered by DeepSeek.",
    tags: ["Python", "Deepgram", "OpenRouter", "CustomTkinter"],
    github: "https://github.com/revkelo/AsisVoz",
    demo: null,
    status: "completed",
    featured: false,
  },
  {
    id: "migracion365",
    title: "Migración365",
    description:
      "Herramienta para migrar Google Drive a Microsoft 365 para la UEB, preservando permisos y estructura de carpetas.",
    description_en:
      "Tool to migrate Google Drive to Microsoft 365 for UEB, preserving permissions and folder structure.",
    tags: ["Python", "Google Drive API", "Microsoft MSAL"],
    github: "https://github.com/revkelo/Migracion365",
    demo: null,
    status: "completed",
    featured: false,
  },
  {
    id: "cea-serverless",
    title: "CEA Serverless",
    description:
      "Sistema de gestión para escuela de conducción en arquitectura serverless AWS con Lambda, DynamoDB y API Gateway.",
    description_en:
      "Management system for a driving school built on AWS serverless architecture with Lambda, DynamoDB and API Gateway.",
    tags: ["Python", "AWS Lambda", "DynamoDB", "SAM"],
    github: "https://github.com/revkelo/CEA-Serverless",
    demo: null,
    status: "completed",
    featured: false,
  },
  {
    id: "sap-data-quality",
    title: "SAP Data Quality",
    description:
      "Pipeline de calidad de datos con Great Expectations sobre exportaciones SAP Excel — validaciones programáticas, reporte HTML automático.",
    description_en:
      "Data quality pipeline with Great Expectations on SAP Excel exports — programmatic validations and automatic HTML reports.",
    tags: ["Python", "Great Expectations", "PySpark", "Databricks"],
    github: "https://github.com/revkelo/sap-data-quality-greatexpectations",
    demo: null,
    status: "completed",
    featured: false,
  },
  {
    id: "nginx-load-balancer",
    title: "NGINX Load Balancer",
    description:
      "Balanceador de carga NGINX con múltiples instancias Spring Boot — configuración upstream, sticky sessions y health checks.",
    description_en:
      "NGINX load balancer with multiple Spring Boot instances — upstream config, sticky sessions and health checks.",
    tags: ["NGINX", "Spring Boot", "Docker", "Java"],
    github: "https://github.com/revkelo/nginx-load-balancer-springboot",
    demo: null,
    status: "completed",
    featured: false,
  },
  {
    id: "itep-simulator",
    title: "iTEP B1 Simulator",
    description:
      "Simulador del examen iTEP para práctica offline — motor de quiz con temporizador, puntuación y retroalimentación por sección.",
    description_en:
      "iTEP B1 exam simulator for offline practice — quiz engine with timer, scoring, and section-by-section feedback.",
    tags: ["JavaScript", "HTML", "CSS"],
    github: "https://github.com/revkelo/itep-b1-simulator",
    demo: null,
    status: "completed",
    featured: false,
  },
];
