# Architecture - CLAUDE.md

Architecture overview and technical details for Claude Code.

## Core Structure
- **Astro 5** static site generator with TypeScript support
- **Tailwind CSS v4** via Vite plugin (no legacy config file)
- **i18n system** with locale-specific routing (`/[lang]/`)
- **GitHub Pages** deployment with custom domain (r3nya.ru)

## Directory Structure
- `src/` - Source code
  - `components/` - Reusable Astro components
  - `layouts/BaseLayout.astro` - Main page layout with meta tags
  - `pages/` - Route definitions with i18n support
  - `i18n/` - Internationalization configuration and messages
  - `styles/global.css` - Tailwind imports and custom theme tokens
  - `site.ts` - Site metadata and profile configuration
- `static/` - Static assets (replaces default `public/`)
- `dist/` - Build output directory
- `e2e-tests/` - End-to-end tests for production validation
- `src/test/` - Unit tests for component testing

## Key Files
- `astro.config.mjs` - Astro configuration with custom directories
- `src/site.ts` - Centralized site metadata and profile information
- `src/i18n/config.ts` - Supported locales and default locale
- `src/i18n/messages.ts` - Localized content for all supported languages
- `src/styles/global.css` - Tailwind v4 theme tokens and custom CSS

## Styling System
- **Tailwind v4** with custom theme tokens defined in `@theme` directive
- **Color palette** with light/dark variants (palette-1 through palette-6)
- **Custom font** using monospace stack (`font-monocode`)
- **Dark mode** support via `dark:` classes and CSS custom properties

## Internationalization
- **Locales**: English (default), Russian, Spanish
- **Routing**: `/[lang]/` dynamic routes for localized pages
- **Content**: Centralized in `src/i18n/messages.ts` with typed messages
- **Fallback**: Default locale (English) for invalid language codes

## Testing Strategy
- **E2E tests** using Puppeteer for production site validation (located in `e2e-tests/`)
  - Tests the live site at https://r3nya.ru (no local server needed)
  - Automated weekly runs via GitHub Actions for production health monitoring
- **Unit tests** using Vitest with Astro Container API for component testing (located in `src/test/`)
- **Snapshot testing** for render diff validation - ensures components render consistently
- **Clean snapshots** - Astro development attributes are stripped to ensure cross-environment compatibility