import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  srcDir: 'src',
  publicDir: 'static',
  outDir: 'dist',

  vite: {
    plugins: [tailwindcss()],
  },
});