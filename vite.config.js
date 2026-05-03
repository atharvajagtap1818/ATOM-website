// Reloading Vite config for dynamic pricing
import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import { resolve } from 'path';
import fs from 'fs';

const catalogData = JSON.parse(fs.readFileSync(resolve(__dirname, 'src/data/catalog.json'), 'utf-8'));
const featuredProducts = catalogData.filter(item => item.featured);

export default defineConfig({
  root: 'src',
  publicDir: resolve(__dirname, 'public'),
  server: {
    host: true, // Listen on all local IPs
    allowedHosts: true, // Allow all hosts (tunnel domains)
    cors: true
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        catalog: resolve(__dirname, 'src/catalog-page.html')
      }
    }
  },
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, 'src/partials'),
      context: {
        catalogProducts: {
          full: catalogData,
          featured: featuredProducts,
        }
      }
    }),
  ],
});
