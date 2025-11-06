# AGENTS.md

This file provides comprehensive guidance to AI agents when working with code in this repository.

## Project Overview

This is a personal homepage built with Astro 5 and Tailwind CSS v4, deployed to GitHub Pages. The site supports internationalization (i18n) with English, Russian, and Spanish locales and features a dark/light theme system.

## Quick Start

```bash
# Development
npm run dev            # Start development server on port 4321
npm run build          # Build for production
npm run preview        # Preview production build locally
npm run clean          # Remove dist directory

# Code Quality
npm run format         # Format code with Prettier
npm run format:check   # Check formatting without making changes

# Testing
npm run test:unit      # Run unit tests with snapshots
npm run test:visual    # Run visual regression tests (requires build)
npm run test:e2e       # Run E2E tests on production site
```

## Key Technologies

- **Astro 5** - Static site generator with TypeScript support
- **Tailwind CSS v4** - Utility-first CSS framework with BEM methodology (via Vite plugin, no legacy config file)
- **Vitest** - Unit testing with snapshot support
- **Playwright** - E2E and visual regression testing
- **Puppeteer** - Production site validation
- **GitHub Pages** - Deployment with custom domain (r3nya.ru)

## Important Instructions

Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (\*.md) or README files. Only create documentation files if explicitly requested by the User.

**Exception**: AGENTS.md files are explicitly encouraged and should be created/updated to provide development guidance.

## TypeScript Guidelines

- **Use `unknown` instead of `any`** when you can't find the correct type/interface
- **Always provide explicit types** for function parameters and return values
- **Create proper interfaces** for object types when possible
- **Prefer type safety** over convenience

## CSS Architecture

- **Component-based CSS** - Each component has its own `.css` file imported directly
- **BEM methodology** - Block Element Modifier naming convention for classes
- **Tailwind v4** via `@import "tailwindcss"` in `src/styles/global.css`
- **Tailwind @apply** - Use `@apply` directive to apply Tailwind utilities in CSS files
- **Reference imports** - Use `@import '../styles/global.css' reference;` to access theme tokens
- **Theme tokens** - Defined in `@theme` directive with CSS custom properties
- **No legacy config** - No Tailwind config file or `@astrojs/tailwind` integration
- **Keep it simple** - Avoid over-engineering; only add complexity when needed

## Code Formatting

- **Always run `npm run format`** after completing any task that modifies code files
- This ensures consistent code formatting with Prettier across the project

---

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
  - `config/site.ts` - Site metadata and profile configuration
  - `test/` - Unit tests for component testing
- `static/` - Static assets (replaces default `public/`)
- `dist/` - Build output directory
- `e2e-tests/` - End-to-end tests for production validation

### Key Files

- `astro.config.mjs` - Astro configuration with custom directories
- `src/config/site.ts` - Centralized site metadata and profile information
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

### Build Process

- Build with `npm run build` (Astro static site generation)
- PRs should include lint/format checks and successful builds
- Deploy to GitHub Pages using `actions/deploy-pages@v4`
- Custom directories: `static/` for public assets, `dist/` for output

---

## Development Best Practices

### Component Development Best Practices

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

- Centralize site metadata in `src/config/site.ts` and apply in `src/layouts/BaseLayout.astro`
- Localized strings in `src/i18n/messages.ts`
- Profile information centrally managed with TypeScript types

---

## Component Development

### Component Architecture

Components are located in `src/components/` and follow consistent patterns and conventions.

### File Structure

- Use `.astro` files with frontmatter fences (`---`)
- Explicit TypeScript interfaces for props
- Minimal logic in components; prefer small, composable components

### Naming Conventions

- PascalCase for component names (e.g., `ProfileHeader.astro`)
- Descriptive names that indicate component purpose
- Avoid generic names like `Container.astro` or `Wrapper.astro`

### Props and Interfaces

```astro
---
interface Props {
  locale: Locale;
  title?: string;
  className?: string;
}

const { locale, title, className = 'default-class' } = Astro.props;
---
```

### Localization

- Always use localized content via `i18n/messages.ts`
- Pass `locale` prop to components that need translations
- Access translations with `const t = messages[locale];`

### Styling

- **Component-based CSS** - Each component has its own `.css` file imported directly
- **BEM methodology** - Block Element Modifier naming convention for classes
- **Tailwind @apply** - Use `@apply` directive to apply Tailwind utilities in CSS files
- **Reference imports** - Use `@import '../styles/global.css' reference;` to access theme tokens
- Use Tailwind utility classes
- Support both light and dark themes via `dark:` classes
- Keep class lists readable with proper spacing

### Accessibility

- Include proper ARIA attributes (`aria-label`, `aria-current`, etc.)
- Use semantic HTML elements (`header`, `nav`, `section`, etc.)
- Ensure keyboard navigation support
- Provide descriptive alt text for images

### Current Components

- **`HomePage.astro`** - Main homepage layout component
- **`ProfileHeader.astro`** - Profile name and headline display
- **`SocialLinks.astro`** - Social media links section
- **`LangSwitcher.astro`** - Language switching navigation
- **`Icon.astro`** - SVG icon component with multiple icon types

---

## Internationalization (i18n)

### Overview

The i18n system supports English, Russian, and Spanish locales and is located in `src/i18n/`.

### File Structure

- **`config.ts`** - Locale configuration and types
- **`messages.ts`** - All localized content with TypeScript types

### Supported Locales

- **English** (`en`) - Default locale
- **Russian** (`ru`) - Full translation
- **Spanish** (`es`) - Full translation

### Adding New Content

#### 1. Update Types

First, add new keys to the `Messages` type in `messages.ts`:

```typescript
export type Messages = {
  title: string;
  name: string;
  headline: string;
  // Add your new key here
  newContent: string;
  links: {
    title: string;
    icon: 'github' | 'linkedin' | 'paper-plane' | 'twitter';
    url: string;
  }[];
};
```

#### 2. Add Translations

Add translations for all supported locales:

```typescript
export const messages: Record<Locale, Messages> = {
  en: {
    title: 'Andrey Makarov aka r3nya',
    name: 'Andrey Makarov',
    headline: 'Software Developer 👨‍💻',
    newContent: 'Your English content here',
    // ... other content
  },
  ru: {
    title: 'Андрей Макаров aka r3nya',
    name: 'Андрей Макаров',
    headline: 'Разработчик ПО 👨‍💻',
    newContent: 'Ваш русский контент здесь',
    // ... other content
  },
  es: {
    title: 'Andrey Makárov aka r3nya',
    name: 'Andrey Makárov',
    headline: 'Desarrollador 👨‍💻',
    newContent: 'Su contenido en español aquí',
    // ... other content
  },
};
```

### Usage in Components

```astro
---
import { messages } from '../i18n/messages';
import type { Locale } from '../i18n/config';

interface Props {
  locale: Locale;
}

const { locale } = Astro.props;
const t = messages[locale];
---

<h1>{t.title}</h1>
<p>{t.newContent}</p>
```

### Routing System

The i18n system works with Astro's dynamic routing:

- Default route: `/` (English)
- Localized routes: `/ru/`, `/es/`
- Invalid locale codes fallback to English

### Best Practices

- **Always provide translations** for all supported locales
- **Use descriptive keys** that indicate content purpose
- **Keep translations consistent** across locales
- **Test with all locales** to ensure proper rendering
- **Maintain TypeScript types** for compile-time validation

### Common Links

Social media links are shared across all locales using the `commonLinks` object to maintain consistency while allowing locale-specific titles.

---

## Unit Testing

### Overview

Unit tests are located in `src/test/` and use Vitest with the experimental Astro Container API.

### Testing Stack

- **Vitest** - Fast unit test framework with ESM support
- **happy-dom** - Lightweight DOM implementation for testing
- **@testing-library/dom** - DOM utilities and query methods
- **@testing-library/jest-dom** - Additional DOM matchers
- **Astro Container API** - Official way to render Astro components in tests

### Running Tests

```bash
# Run unit tests
npm run test:unit

# Run tests in watch mode (for development)
npx vitest

# Generate/update snapshots
npx vitest -u
```

### Test Structure

#### Test Files

- `ProfileHeader.test.ts` - Tests profile header component rendering
- `SocialLinks.test.ts` - Tests social media links across all locales
- `LangSwitcher.test.ts` - Tests language switcher for each locale
- `Icon.test.ts` - Tests all icon types and custom classes
- `HomePage.test.ts` - Tests complete homepage for all locales

#### Shared Utilities

- `helpers.ts` - Test utilities and component rendering helper
- `setup.ts` - Global test setup and configuration

### Snapshot Testing

All tests use snapshot testing to capture complete HTML output:

```typescript
it('renders with English locale', async () => {
  const result = await renderAstroComponent(Component, {
    props: { locale: 'en' },
  });

  expect(result.innerHTML).toMatchSnapshot();
});
```

#### Benefits

- **Comprehensive coverage** - Captures complete rendered HTML
- **Regression detection** - Any changes to output are caught
- **Maintainable** - No need to check individual fields manually
- **Cross-environment compatibility** - Snapshots work across machines

### Clean Snapshots

The test helper automatically removes Astro development attributes that contain absolute file paths:

- `data-astro-source-file` - Removed to ensure CI compatibility
- `data-astro-source-loc` - Removed to prevent path-based failures

This ensures snapshots work consistently across:

- Local development machines
- CI/CD environments
- Cloud testing platforms

### Writing Tests

#### Basic Component Test

```typescript
// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import YourComponent from '../components/YourComponent.astro';
import { renderAstroComponent } from './helpers';

describe('YourComponent', () => {
  it('renders correctly', async () => {
    const result = await renderAstroComponent(YourComponent, {
      props: {
        title: 'Test Title',
      },
    });

    expect(result.innerHTML).toMatchSnapshot();
  });
});
```

#### Multi-Locale Testing

```typescript
it('renders with Russian locale', async () => {
  const result = await renderAstroComponent(Component, {
    props: {
      locale: 'ru',
    },
  });

  expect(result.innerHTML).toMatchSnapshot();
});
```

### Best Practices

- **Test all locale variations** for i18n components
- **Use descriptive test names** that indicate what's being tested
- **Use `it('matches...')` form** instead of `it('should match...')` for consistency
- **Keep tests focused** - one concept per test
- **Update snapshots carefully** - review changes before committing
- **Test edge cases** - empty props, invalid data, etc.

---

## E2E Testing

### Overview

E2E tests are located in `e2e-tests/` and validate the production website functionality.

### Test Environment

These E2E tests are designed to run against the **live production site** at `https://r3nya.ru`. They do **NOT** require a local development server to be running.

### Test Structure

#### Files

- `e2e.test.js` - Main E2E test suite using Node.js test runner and Playwright
- `HomePage.js` - Page object model for the homepage with reusable methods and selectors

### Test Coverage

- **Homepage availability** - Verifies the site loads with HTTP 200 status
- **Page title validation** - Ensures correct title rendering
- **Social media links** - Validates all social links are present and functional
- **Cross-browser compatibility** - Tests with headless Chromium via Playwright

### Running Tests

```bash
# Run E2E tests locally (tests production site)
npm run test:e2e

# Manual execution
node --test e2e-tests/*test.js
```

### Automated Testing

E2E tests run automatically via GitHub Actions:

- **Schedule**: Every Sunday at 6:00 AM UTC
- **Trigger**: Manual execution via workflow_dispatch
- **Purpose**: Monitor production site health and catch regressions

### Important Notes

⚠️ **Production Testing**: These tests interact with the live website at https://r3nya.ru
⚠️ **No Local Server**: Do not start `npm run dev` or `npm run preview` for these tests
⚠️ **Network Dependency**: Tests require internet connectivity to reach the production site

### Test Philosophy

These E2E tests serve as a **production health monitor** rather than development validation. They ensure:

- The live site is accessible and functional
- Core user journeys work as expected
- Social media integration remains intact
- Page performance and rendering are acceptable

---

## Visual Regression Testing

### Overview

Visual regression tests capture screenshots of rendered pages and compare them against baseline snapshots to catch unintended visual changes.

### Technology Stack

- **Playwright** - Headless Chromium for screenshot capture
- **pixelmatch** - Pixel-level image comparison
- **pngjs** - PNG image processing
- **Vitest** - Test runner and assertions

### Running Tests

```bash
# Run visual regression tests
npm run test:visual

# Update baseline snapshots (when UI changes are intentional)
npm run test:visual:update
```

### Test Structure

Visual regression tests are located in `src/test/` with the naming pattern `*.visual.test.ts`.

- `HomePage.visual.test.ts` - Homepage visual tests for all locales

### Directory Structure

```
src/test/
├── __visual_snapshots__/     # Baseline screenshots (committed to git)
├── __visual_diffs__/          # Diff images (ignored by git)
├── visual-helpers.ts          # Visual regression utilities
└── *.visual.test.ts           # Visual regression test files
```

### Configuration

- **Viewport**: 1280x720 (configurable in `visual-helpers.ts`)
- **Threshold**: 0.1 (10% pixel difference tolerance)
- **Browser**: Headless Chromium via Playwright
- **JavaScript**: Disabled for faster rendering

### Best Practices

- **Use `it('matches...')` form** for test names (not `it('should match...')`)
- **Commit baseline snapshots** to git
- **Review diffs carefully** when tests fail (check `__visual_diffs__/`)
- **Test multiple states** - Different locales, themes, responsive breakpoints
- **Update intentionally** - Only run `test:visual:update` after reviewing changes
- **Build first** - Visual tests require `npm run build` to generate HTML files

### Workflow

1. Make UI changes
2. Run `npm run build` to generate updated HTML
3. Run `npm run test:visual` to check for regressions
4. If changes are intentional, run `npm run test:visual:update`
5. Review and commit new baseline snapshots

---

## Testing Strategy

- **Unit Tests**: Component testing with clean snapshots (no absolute paths)
- **Visual Regression Tests**: Pixel-level screenshot comparison (requires build)
- **E2E Tests**: Production site validation (runs weekly via GitHub Actions)
- **Snapshot Testing**: Render diff validation across all locales

---

## Code Patterns

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

### i18n Message Usage

```astro
---
import { messages } from '../i18n/messages';
import type { Locale } from '../i18n/config';

interface Props {
  locale: Locale;
}

const { locale } = Astro.props;
const t = messages[locale];
---

<h1>{t.title}</h1>
<p>{t.description}</p>
```

### Theme Token Usage in CSS

```css
@theme {
  --color-palette-1-light: #f8fafc;
  --color-palette-1-dark: #0f172a;
}
```

### Responsive Component Pattern

```astro
---
interface Props {
  variant?: 'mobile' | 'desktop';
}

const { variant = 'desktop' } = Astro.props;
---

<div
  class={`
  grid gap-4
  ${variant === 'mobile' ? 'grid-cols-1' : 'md:grid-cols-2'}
`}
>
  <!-- Component content -->
</div>
```

### Icon Component Usage

```astro
---
import Icon from './Icon.astro';
---

<a href={link.url}>
  <Icon name={link.icon} />
  <span>{link.title}</span>
</a>
```
