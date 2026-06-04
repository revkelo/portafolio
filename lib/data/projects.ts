// PORTAFOLIO DE KEVIN GONZALEZ — revkelo
// Paleta: #0D0D0D fondo | #F06400 naranja | #FFFFFF texto
// Stack: Next.js 16 + TypeScript + Tailwind + Framer Motion + Lenis
//
// GUIA PARA FUTURAS CONVERSACIONES CON IA:
// Este archivo contiene todos los proyectos del portafolio.
// Para agregar un proyecto nuevo, anadir un objeto al array con la misma estructura.

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  github: string | null;
  demo: string | null;
  status: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: "monetiq",
    title: "MonetIQ",
    description:
      "App movil de finanzas personales con IA — analisis inteligente de gastos, WhatsApp webhook y recomendaciones.",
    tags: ["Flutter", "Next.js", "Supabase", "TypeScript", "AI"],
    github: null, // privado
    demo: null,
    status: "En desarrollo",
    featured: true,
  },
  {
    id: "som3d",
    title: "SOM 3D",
    description:
      "Pipeline para convertir estudios DICOM en modelos medicos 3D — segmentacion con TotalSegmentator y visualizacion con Three.js.",
    tags: ["Python", "FastAPI", "Three.js", "Docker", "AWS"],
    github: null, // privado
    demo: null,
    status: "Completado",
    featured: true,
  },
  {
    id: "focuszone",
    title: "FocusZone",
    description:
      "Plataforma de bienestar digital con Pomodoro, retos semanales, IA (Lumi) y leaderboard para estudiantes UEB.",
    tags: ["TypeScript", "React", "Supabase", "Vercel"],
    github: "https://github.com/revkelo/FocusZone",
    demo: null,
    status: "Completado",
    featured: true,
  },
  {
    id: "asisvoz",
    title: "AsisVoz",
    description:
      "App de escritorio para transcribir audio/video con Deepgram, exportar PDF/DOCX con diarizacion y Q&A con DeepSeek.",
    tags: ["Python", "Deepgram", "OpenRouter", "CustomTkinter"],
    github: "https://github.com/revkelo/AsisVoz",
    demo: null,
    status: "Completado",
    featured: false,
  },
  {
    id: "migracion365",
    title: "Migracion365",
    description:
      "Herramienta para migrar Google Drive a Microsoft 365 para la UEB, preservando permisos y estructura.",
    tags: ["Python", "Google Drive API", "Microsoft MSAL"],
    github: "https://github.com/revkelo/Migracion365",
    demo: null,
    status: "Completado",
    featured: false,
  },
  {
    id: "cea-serverless",
    title: "CEA Serverless",
    description:
      "Sistema de gestion para escuela de conduccion en arquitectura serverless AWS con Lambda, DynamoDB y API Gateway.",
    tags: ["Python", "AWS Lambda", "DynamoDB", "SAM"],
    github: "https://github.com/revkelo/CEA-Serverless",
    demo: null,
    status: "Completado",
    featured: false,
  },
];
