# Components - CLAUDE.md

Component development guidelines for Claude Code.

## Component Architecture

This directory contains reusable Astro components that follow consistent patterns and conventions.

## Component Guidelines

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

- Use Tailwind utility classes
- Support both light and dark themes via `dark:` classes
- Keep class lists readable with proper spacing
- Use semantic CSS classes when needed

### Accessibility

- Include proper ARIA attributes (`aria-label`, `aria-current`, etc.)
- Use semantic HTML elements (`header`, `nav`, `section`, etc.)
- Ensure keyboard navigation support
- Provide descriptive alt text for images

## Current Components

- **`HomePage.astro`** - Main homepage layout component
- **`ProfileHeader.astro`** - Profile name and headline display
- **`SocialLinks.astro`** - Social media links section
- **`LangSwitcher.astro`** - Language switching navigation
- **`Icon.astro`** - SVG icon component with multiple icon types

## Component Testing

Components in this directory are tested using:

- **Unit tests** with Vitest and Astro Container API
- **Snapshot testing** for render diff validation
- **Clean snapshots** without development-specific attributes
- Tests located in `src/test/` directory
