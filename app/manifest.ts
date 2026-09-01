import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kevin Gonzalez - Cloud & DevOps Engineer",
    short_name: "KG Portfolio",
    description: "Portafolio de Kevin Gonzalez. Cloud & DevOps Engineer, Full-Stack Developer y Data Governance desde Bogotá, Colombia.",
    start_url: "/",
    display: "standalone",
    background_color: "#0d0d0d",
    theme_color: "#f56f0d",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
