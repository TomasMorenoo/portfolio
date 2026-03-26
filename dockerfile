# Etapa 1: Build
FROM node:lts-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servidor Nginx
FROM nginx:alpine
# Copiamos los archivos generados por Astro a Nginx
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]