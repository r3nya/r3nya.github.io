# Code Patterns - CLAUDE.md

Common code patterns and examples for Claude Code.

## Localized Page Template
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

## Global Styles Import
```astro
---
import '../styles/global.css';
---
```

## Component Props Interface
```astro
---
export interface Props {
  locale: Locale;
  title?: string;
}

const { locale, title } = Astro.props;
---
```

## i18n Message Usage
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

## Theme Token Usage in CSS
```css
@theme {
  --color-palette-1-light: #f8fafc;
  --color-palette-1-dark: #0f172a;
}
```

## Responsive Component Pattern
```astro
---
interface Props {
  variant?: 'mobile' | 'desktop';
}

const { variant = 'desktop' } = Astro.props;
---

<div class={`
  grid gap-4
  ${variant === 'mobile' ? 'grid-cols-1' : 'md:grid-cols-2'}
`}>
  <!-- Component content -->
</div>
```

## Icon Component Usage
```astro
---
import Icon from './Icon.astro';
---

<a href={link.url}>
  <Icon name={link.icon} />
  <span>{link.title}</span>
</a>
```