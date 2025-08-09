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
- Minimal logic in components; prefer composition
- Localized content via `i18n/messages.ts`

### Styling Conventions  
- Use Tailwind utility classes
- Custom theme tokens in `src/styles/global.css`
- Maintain accessibility with proper ARIA labels and semantic HTML
- Support both light and dark themes

### Content Management
- Site metadata in `src/site.ts`
- Localized strings in `src/i18n/messages.ts`
- Profile information centrally managed with TypeScript types

### Build Process
- Static site generation for GitHub Pages
- Automatic formatting with Prettier
- Custom directories: `static/` for public assets, `dist/` for output