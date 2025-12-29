/// <reference path="../.astro/types.d.ts" />

// Environment variables type definitions
interface ImportMetaEnv {
  /**
   * Enable snow fall effect on the page.
   * Set to "true" to enable, defaults to "false".
   * Automatically enabled between Dec 15 and Jan 15 in CI.
   */
  readonly PUBLIC_SNOW_FALL_ENABLED: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Custom module declarations for Astro components
declare module '*.astro' {
  const Component: unknown;
  export default Component;
}
