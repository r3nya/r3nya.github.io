# Unit Tests - CLAUDE.md

Unit testing guidelines and setup for Claude Code.

## Overview

This directory contains unit tests for Astro components using Vitest and the experimental Astro Container API.

## Testing Stack

- **Vitest** - Fast unit test framework with ESM support
- **happy-dom** - Lightweight DOM implementation for testing
- **@testing-library/dom** - DOM utilities and query methods
- **@testing-library/jest-dom** - Additional DOM matchers
- **Astro Container API** - Official way to render Astro components in tests

## Running Tests

```bash
# Run unit tests
npm run test:unit

# Run tests in watch mode (for development)
npx vitest

# Generate/update snapshots
npx vitest -u
```

## Test Structure

### Test Files
- `ProfileHeader.test.ts` - Tests profile header component rendering
- `SocialLinks.test.ts` - Tests social media links across all locales
- `LangSwitcher.test.ts` - Tests language switcher for each locale
- `Icon.test.ts` - Tests all icon types and custom classes
- `HomePage.test.ts` - Tests complete homepage for all locales

### Shared Utilities
- `helpers.ts` - Test utilities and component rendering helper
- `setup.ts` - Global test setup and configuration

## Snapshot Testing

All tests use snapshot testing to capture complete HTML output:

```typescript
it('renders with English locale', async () => {
  const result = await renderAstroComponent(Component, {
    props: { locale: 'en' },
  });

  expect(result.innerHTML).toMatchSnapshot();
});
```

### Benefits
- **Comprehensive coverage** - Captures complete rendered HTML
- **Regression detection** - Any changes to output are caught
- **Maintainable** - No need to check individual fields manually
- **Cross-environment compatibility** - Snapshots work across machines

## Clean Snapshots

The test helper automatically removes Astro development attributes that contain absolute file paths:

- `data-astro-source-file` - Removed to ensure CI compatibility
- `data-astro-source-loc` - Removed to prevent path-based failures

This ensures snapshots work consistently across:
- Local development machines
- CI/CD environments  
- Cloud testing platforms

## Writing Tests

### Basic Component Test
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

### Multi-Locale Testing
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

## Best Practices

- **Test all locale variations** for i18n components
- **Use descriptive test names** that indicate what's being tested
- **Keep tests focused** - one concept per test
- **Update snapshots carefully** - review changes before committing
- **Test edge cases** - empty props, invalid data, etc.