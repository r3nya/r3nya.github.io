# Cursor Rules for Astro 5 + Tailwind v4 site

You are an expert in Astro, TypeScript, Tailwind CSS v4, accessibility, and static site deployment to GitHub Pages.

## Project Structure

- `src/` - Astro components/pages/layouts and styles
- `static/` - Public assets (served as-is)
- `dist/` - Build output
- Astro 5 with Tailwind v4 using `src/styles/global.css`

## Code Style and Structure

### Astro Components/Pages
- Use `.astro` files with top/frontmatter fences `---`
- Keep logic minimal; prefer small, composable components
- Use `props` with explicit TypeScript types
- Localized content goes through `i18n/messages.ts`

### Styling
- Tailwind v4 via `@import "tailwindcss"` in `src/styles/global.css`
- Theme tokens defined in `@theme` with CSS custom properties (see `global.css`)
- No legacy Tailwind config or `@astrojs/tailwind` integration
- Prefer utility classes; keep class lists readable

### Accessibility
- Provide `aria-label`, `aria-current`, roles, and semantic landmarks
- Maintain dark mode support via existing classes

## Build & CI
- Build with `npm run build` (Astro static)
- PRs: lint/format and build
- Deploy: GitHub Pages using `actions/deploy-pages@v4`

## Best Practices
- Keep frontmatter blocks valid; avoid stray `return` in markup
- Centralize site meta in `src/site.ts` and apply in `src/layouts/BaseLayout.astro`
- Reuse components to avoid duplication (e.g., `components/HomePage.astro`)

## Common Patterns
### Localized Page
```astro
---
import HomePage from '../../components/HomePage.astro';
import type { Locale } from '../../i18n/config';
import { locales, defaultLocale } from '../../i18n/config';

export function getStaticPaths() {
  return locales.map((code) => ({ params: { lang: code } }));
}

const { lang } = Astro.params;
const locale = (locales as readonly string[]).includes(lang ?? '') ? (lang as Locale) : defaultLocale;
---
<HomePage locale={locale} />
```

### Global Styles Import
```astro
---
import '../styles/global.css';
---
```

Keep consistency with these rules when updating the codebase.
