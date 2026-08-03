#!/bin/sh
set -e

# Se ejecuta automaticamente al arrancar el contenedor (mecanismo propio de la
# imagen oficial de Nginx). Sobreescribe env-config.js con la URL real de la Api,
# tomada de la variable de entorno VITE_API_URL pasada al contenedor.
CONFIG_PATH=/usr/share/nginx/html/env-config.js

cat > "$CONFIG_PATH" <<EOF
window.__ENV__ = {
  VITE_API_URL: "${VITE_API_URL:-http://localhost:5080}"
};
EOF

echo "env-config.js generado con VITE_API_URL=${VITE_API_URL:-http://localhost:5080}"
