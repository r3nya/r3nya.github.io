# Development Guide - CLAUDE.md

Development best practices and guidelines for Claude Code.

## Development Commands

```bash
# Development
npm run dev          # Start development server on port 4321
npm run build        # Build for production
npm run preview      # Preview production build locally

# Code Quality
npm run format       # Format code with Prettier
npm run format:check # Check formatting without making changes
npm run test:e2e     # Run E2E tests with Node.js test runner (Puppeteer)
npm run test:unit    # Run unit tests with Vitest for Astro components (with snapshots)

# Utilities
npm run clean        # Remove dist directory
```

## Component Development
- Use `.astro` files with frontmatter fences (`---`)
- Explicit TypeScript types for props
- Minimal logic in components; prefer small, composable components
- Localized content via `i18n/messages.ts`
- Keep frontmatter blocks valid; avoid stray `return` statements in markup
- Reuse components to avoid duplication (e.g., `components/HomePage.astro`)

## Styling Conventions  
- **Tailwind v4** via `@import "tailwindcss"` in `src/styles/global.css`
- Theme tokens defined in `@theme` with CSS custom properties
- No legacy Tailwind config or `@astrojs/tailwind` integration
- Prefer utility classes; keep class lists readable
- Custom theme tokens in `src/styles/global.css`
- Support both light and dark themes via existing classes

## Accessibility Best Practices
- Provide `aria-label`, `aria-current`, roles, and semantic landmarks
- Maintain semantic HTML structure
- Ensure proper contrast ratios for both light and dark themes
- Test keyboard navigation

## Content Management
- Centralize site metadata in `src/site.ts` and apply in `src/layouts/BaseLayout.astro`
- Localized strings in `src/i18n/messages.ts`
- Profile information centrally managed with TypeScript types

## Build Process
- Build with `npm run build` (Astro static site generation)
- PRs should include lint/format checks and successful builds
- Deploy to GitHub Pages using `actions/deploy-pages@v4`
- Custom directories: `static/` for public assets, `dist/` for output