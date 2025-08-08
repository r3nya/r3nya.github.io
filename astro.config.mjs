import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://r3nya.ru',
  srcDir: 'src',
  publicDir: 'static',
  outDir: 'dist',

  vite: {
    plugins: [tailwindcss()],
  },
});
