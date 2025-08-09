# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal homepage built with Astro 5 and Tailwind CSS v4, deployed to GitHub Pages. The site supports internationalization (i18n) with English, Russian, and Spanish locales and features a dark/light theme system.

## Development Commands

```bash
# Development
npm run dev          # Start development server on port 4321
npm run build        # Build for production
npm run preview      # Preview production build locally

# Code Quality
npm run format       # Format code with Prettier
npm run format:check # Check formatting without making changes
npm run test         # Run tests with Node.js test runner

# Utilities
npm run clean        # Remove dist directory
```

## Architecture

### Core Structure
- **Astro 5** static site generator with TypeScript support
- **Tailwind CSS v4** via Vite plugin (no legacy config file)
- **i18n system** with locale-specific routing (`/[lang]/`)
- **GitHub Pages** deployment with custom domain (r3nya.ru)

### Directory Structure
- `src/` - Source code
  - `components/` - Reusable Astro components
  - `layouts/BaseLayout.astro` - Main page layout with meta tags
  - `pages/` - Route definitions with i18n support
  - `i18n/` - Internationalization configuration and messages
  - `styles/global.css` - Tailwind imports and custom theme tokens
  - `site.ts` - Site metadata and profile configuration
- `static/` - Static assets (replaces default `public/`)
- `dist/` - Build output directory
- `tests/` - E2E and component tests

### Key Files
- `astro.config.mjs` - Astro configuration with custom directories
- `src/site.ts` - Centralized site metadata and profile information
- `src/i18n/config.ts` - Supported locales and default locale
- `src/i18n/messages.ts` - Localized content for all supported languages
- `src/styles/global.css` - Tailwind v4 theme tokens and custom CSS

### Styling System
- **Tailwind v4** with custom theme tokens defined in `@theme` directive
- **Color palette** with light/dark variants (palette-1 through palette-6)
- **Custom font** using monospace stack (`font-monocode`)
- **Dark mode** support via `dark:` classes and CSS custom properties

### Internationalization
- **Locales**: English (default), Russian, Spanish
- **Routing**: `/[lang]/` dynamic routes for localized pages
- **Content**: Centralized in `src/i18n/messages.ts` with typed messages
- **Fallback**: Default locale (English) for invalid language codes

### Testing
- **E2E tests** using Puppeteer for full page testing
- **Component tests** with Node.js test runner
- Tests located in `tests/` directory

## Development Guidelines

### Component Development
- Use `.astro` files with frontmatter fences (`---`)
- Explicit TypeScript types for props
- Minimal logic in components; prefer small, composable components
- Localized content via `i18n/messages.ts`
- Keep frontmatter blocks valid; avoid stray `return` statements in markup
- Reuse components to avoid duplication (e.g., `components/HomePage.astro`)

### Styling Conventions  
- **Tailwind v4** via `@import "tailwindcss"` in `src/styles/global.css`
- Theme tokens defined in `@theme` with CSS custom properties
- No legacy Tailwind config or `@astrojs/tailwind` integration
- Prefer utility classes; keep class lists readable
- Custom theme tokens in `src/styles/global.css`
- Support both light and dark themes via existing classes

### Accessibility Best Practices
- Provide `aria-label`, `aria-current`, roles, and semantic landmarks
- Maintain semantic HTML structure
- Ensure proper contrast ratios for both light and dark themes
- Test keyboard navigation

### Content Management
- Centralize site metadata in `src/site.ts` and apply in `src/layouts/BaseLayout.astro`
- Localized strings in `src/i18n/messages.ts`
- Profile information centrally managed with TypeScript types

### Build Process
- Build with `npm run build` (Astro static site generation)
- PRs should include lint/format checks and successful builds
- Deploy to GitHub Pages using `actions/deploy-pages@v4`
- Custom directories: `static/` for public assets, `dist/` for output

## Common Code Patterns

### Localized Page Template
```astro
---
import HomePage from '../../components/HomePage.astro';
import type { Locale } from '../../i18n/config';
import { locales, defaultLocale } from '../../i18n/config';

export function getStaticPaths() {
  return locales.map((code) => ({ params: { lang: code } }));
}

const { lang } = Astro.params;
const locale = (locales as readonly string[]).includes(lang ?? '') 
  ? (lang as Locale) 
  : defaultLocale;
---
<HomePage locale={locale} />
```

### Global Styles Import
```astro
---
import '../styles/global.css';
---
```

### Component Props Interface
```astro
---
export interface Props {
  locale: Locale;
  title?: string;
}

const { locale, title } = Astro.props;
---
```