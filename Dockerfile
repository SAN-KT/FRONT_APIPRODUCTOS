# #region Etapa 1: compilar (Node, con todas las herramientas de build)
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build
# #endregion

# #region Etapa 2: servir (Nginx, liviano, sin Node ni herramientas de build)
FROM nginx:alpine AS final

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Este script corre solo al arrancar el contenedor y genera env-config.js
# con la URL real de la Api (ver docker-entrypoint.d/30-generar-env-config.sh)
COPY docker-entrypoint.d/30-generar-env-config.sh /docker-entrypoint.d/30-generar-env-config.sh
RUN chmod +x /docker-entrypoint.d/30-generar-env-config.sh

EXPOSE 80
# #endregion
