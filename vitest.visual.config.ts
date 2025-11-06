/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/test/**/*.visual.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    snapshotOptions: {
      failureThreshold: 0.2,
    },
  },
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
});
