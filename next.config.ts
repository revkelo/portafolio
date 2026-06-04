import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite acceder al dev server desde ngrok y otras herramientas de tunneling
  allowedDevOrigins: [
    "*.ngrok.io",
    "*.ngrok-free.app",
    "*.ngrok.app",
    "localhost",
    "127.0.0.1",
  ],
};

export default nextConfig;
