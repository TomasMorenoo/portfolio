import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

export default defineConfig({
  integrations: [tailwind()],
  output: 'server', // Verificá que diga esto
  adapter: node({
    mode: 'standalone',
  }),
  server: {
    host: '0.0.0.0', // ESTO ES CLAVE para Docker
    port: 4321,
  },
  vite: {
    server: {
      watch: {
        usePolling: true,
      },
    },
  },
});