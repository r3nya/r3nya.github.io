# Visual Regression Testing

This project uses visual regression testing to catch unintended visual changes in the UI.

## Overview

Visual regression tests capture screenshots of rendered components and compare them against baseline snapshots. Any visual differences are detected and reported, helping catch:

- Unintended layout changes
- CSS regressions
- Font rendering issues
- Color and theme inconsistencies
- Cross-browser rendering differences

## Technology Stack

- **Playwright** - Headless Chromium for screenshot capture
- **pixelmatch** - Pixel-level image comparison
- **pngjs** - PNG image processing
- **Vitest** - Test runner and assertions

## Running Visual Tests

### Run visual regression tests

```bash
npm run test:visual
```

This will compare current screenshots against baseline snapshots.

### Update baseline snapshots

```bash
npm run test:visual:update
```

Use this when you've intentionally changed the UI and want to update the baseline snapshots.

### Run all tests (unit + visual)

```bash
npm run test:unit
```

Note: Visual tests are separated with `.visual.test.ts` suffix and can be run independently.

## Test Structure

Visual regression tests are located in `src/test/` with the naming pattern `*.visual.test.ts`.

Example test structure:

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { VisualRegressionTester } from './visual-helpers';
import Component from '../components/Component.astro';

describe('Component Visual Regression', () => {
  let visualTester: VisualRegressionTester;

  beforeAll(async () => {
    visualTester = new VisualRegressionTester();
    await visualTester.setup();
  });

  afterAll(async () => {
    await visualTester.cleanup();
  });

  it('should match snapshot', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Component, {
      props: {
        /* your props */
      },
    });

    const result = await visualTester.captureScreenshot(
      html,
      'component-name',
      {
        threshold: 0.1, // 10% difference threshold
      },
    );

    expect(result.pass).toBe(true);
  });
});
```

## Directory Structure

```
src/test/
├── __visual_snapshots__/     # Baseline screenshots (committed to git)
├── __visual_diffs__/          # Diff images (ignored by git)
├── visual-helpers.ts          # Visual regression utilities
└── *.visual.test.ts           # Visual regression test files
```

## Configuration

### Threshold

The `threshold` option controls pixel difference sensitivity (0-1):

- `0.0` - Exact match required
- `0.1` - Default, allows minor anti-aliasing differences
- `0.5` - Very lenient, only catches major differences

### Viewport

Default viewport is 1280x720. Modify in `visual-helpers.ts`:

```typescript
this.page = await this.browser.newPage({
  viewport: { width: 1280, height: 720 },
});
```

## Best Practices

1. **Commit baseline snapshots** - Store in `__visual_snapshots__/` directory
2. **Review diffs carefully** - Check `__visual_diffs__/` when tests fail
3. **Use descriptive snapshot names** - Include component name and variant
4. **Test multiple states** - Light/dark themes, locales, responsive breakpoints
5. **Update snapshots intentionally** - Only run `test:visual:update` after reviewing changes

## Troubleshooting

### Tests fail with dimension mismatch

This usually happens when:

- Font rendering differs between environments
- System fonts are different
- Browser version changed

Solution: Update snapshots on the primary development machine.

### Random pixel differences

Small pixel differences can occur due to:

- Anti-aliasing differences
- GPU rendering variations
- Font hinting

Solution: Increase the `threshold` value or ensure consistent rendering environment.

### CI/CD Integration

For CI environments:

1. Install Playwright browsers with `npx playwright install --with-deps chromium`
2. Use consistent Node.js version
3. Consider using Docker for reproducible environments
4. May need to update snapshots in CI if rendering differs

Example GitHub Actions setup:

```yaml
- name: Install Playwright browsers
  run: npx playwright install --with-deps chromium

- name: Run visual tests
  run: npm run test:visual
```

## Current Test Coverage

- Homepage (English, Russian, Spanish)
- Dark theme variant
- Profile header component
- Social links component
- Language switcher component

## Adding New Visual Tests

1. Create a new test file: `ComponentName.visual.test.ts`
2. Import `VisualRegressionTester` helper
3. Set up and tear down the tester in `beforeAll`/`afterAll`
4. Render your component with Astro Container API
5. Capture screenshot with descriptive name
6. Run `npm run test:visual:update` to create baseline
7. Commit the baseline snapshot to git

Example:

```typescript
it('should match new component snapshot', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(NewComponent, {
    props: { variant: 'primary' },
  });

  const result = await visualTester.captureScreenshot(
    html,
    'new-component-primary',
  );

  expect(result.pass).toBe(true);
});
```
