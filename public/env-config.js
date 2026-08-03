// Valor por defecto para desarrollo local (npm run dev). En Docker, este archivo
// se sobreescribe al arrancar el contenedor con la URL real de la Api.
window.__ENV__ = {
  VITE_API_URL: "http://localhost:5080",
};
