// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { VisualRegressionTester } from './visual-helpers';

describe('HomePage Visual Regression', () => {
  let visualTester: VisualRegressionTester;

  beforeAll(async () => {
    visualTester = new VisualRegressionTester();
    await visualTester.setup();
  });

  afterAll(async () => {
    await visualTester.cleanup();
  });

  it('matches English locale snapshot', async () => {
    const htmlPath = join(process.cwd(), 'dist', 'en', 'index.html');
    const html = readFileSync(htmlPath, 'utf-8');

    const result = await visualTester.captureScreenshot(html, 'homepage-en', {
      threshold: 0.1,
    });

    expect(result.pass).toBe(true);
    if (!result.pass) {
      console.log(
        `Visual regression failed: ${result.diffPixels} pixels differ (${result.diffPercentage?.toFixed(2)}%)`,
      );
      console.log('Check src/test/__visual_diffs__ for diff images');
    }
  });

  it('matches Russian locale snapshot', async () => {
    const htmlPath = join(process.cwd(), 'dist', 'ru', 'index.html');
    const html = readFileSync(htmlPath, 'utf-8');

    const result = await visualTester.captureScreenshot(html, 'homepage-ru', {
      threshold: 0.1,
    });

    expect(result.pass).toBe(true);
    if (!result.pass) {
      console.log(
        `Visual regression failed: ${result.diffPixels} pixels differ (${result.diffPercentage?.toFixed(2)}%)`,
      );
      console.log('Check src/test/__visual_diffs__ for diff images');
    }
  }, 30000);

  it('matches Spanish locale snapshot', async () => {
    const htmlPath = join(process.cwd(), 'dist', 'es', 'index.html');
    const html = readFileSync(htmlPath, 'utf-8');

    const result = await visualTester.captureScreenshot(html, 'homepage-es', {
      threshold: 0.1,
    });

    expect(result.pass).toBe(true);
    if (!result.pass) {
      console.log(
        `Visual regression failed: ${result.diffPixels} pixels differ (${result.diffPercentage?.toFixed(2)}%)`,
      );
      console.log('Check src/test/__visual_diffs__ for diff images');
    }
  }, 30000);

  it('matches default route snapshot', async () => {
    const htmlPath = join(process.cwd(), 'dist', 'index.html');
    const html = readFileSync(htmlPath, 'utf-8');

    const result = await visualTester.captureScreenshot(
      html,
      'homepage-default',
      {
        threshold: 0.1,
      },
    );

    expect(result.pass).toBe(true);
    if (!result.pass) {
      console.log(
        `Visual regression failed: ${result.diffPixels} pixels differ (${result.diffPercentage?.toFixed(2)}%)`,
      );
      console.log('Check src/test/__visual_diffs__ for diff images');
    }
  }, 30000);
});
