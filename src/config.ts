// Config inyectada en tiempo de arranque del contenedor (ver public/env-config.js
// y el entrypoint del Dockerfile). No existe cuando se corre "npm run dev" directo.
declare global {
  interface Window {
    __ENV__?: { VITE_API_URL?: string };
  }
}

// Orden de prioridad: config de runtime (Docker) > variable de entorno de build (Vite) > default
export const API_URL =
  window.__ENV__?.VITE_API_URL || import.meta.env.VITE_API_URL || "http://localhost:5080";
