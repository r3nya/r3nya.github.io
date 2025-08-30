# Internationalization - AGENTS.md

Internationalization (i18n) system guidelines for AI agents.

## Overview

This directory contains the complete internationalization system supporting English, Russian, and Spanish locales.

## File Structure

- **`config.ts`** - Locale configuration and types
- **`messages.ts`** - All localized content with TypeScript types

## Supported Locales

- **English** (`en`) - Default locale
- **Russian** (`ru`) - Full translation
- **Spanish** (`es`) - Full translation

## Adding New Content

### 1. Update Types

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

### 2. Add Translations

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

## Usage in Components

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

## Routing System

The i18n system works with Astro's dynamic routing:

- Default route: `/` (English)
- Localized routes: `/ru/`, `/es/`
- Invalid locale codes fallback to English

## Best Practices

- **Always provide translations** for all supported locales
- **Use descriptive keys** that indicate content purpose
- **Keep translations consistent** across locales
- **Test with all locales** to ensure proper rendering
- **Maintain TypeScript types** for compile-time validation

## Common Links

Social media links are shared across all locales using the `commonLinks` object to maintain consistency while allowing locale-specific titles.
