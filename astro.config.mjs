import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import compress from 'astro-compress';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://r3nya.ru',
  srcDir: 'src',
  publicDir: 'static',
  outDir: 'dist',

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [compress(), sitemap()],

  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
});
