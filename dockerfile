# Etapa 1: Build
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
# Instalamos dependencias
RUN npm install
COPY . .
# Construimos el proyecto (ahora generará un servidor Node, no archivos estáticos)
RUN npm run build

# Etapa 2: Servidor Node.js (Producción)
FROM node:20-slim AS runtime
WORKDIR /app

# Copiamos lo generado en la etapa de build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./

# Configuramos variables de entorno para que Astro escuche al exterior
ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321

# Iniciamos el servidor compilado de Astro
CMD ["node", "./dist/server/entry.mjs"]