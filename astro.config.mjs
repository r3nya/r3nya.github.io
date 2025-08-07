import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind({ config: { applyBaseStyles: false } })],
  srcDir: 'src',
  publicDir: 'static',
  outDir: 'dist',
});
