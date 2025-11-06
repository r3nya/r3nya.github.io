import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { page } from 'vitest/browser';

describe('HomePage Visual Regression', () => {
  it('matches English locale snapshot', async () => {
    const htmlPath = join(process.cwd(), 'dist', 'en', 'index.html');
    const html = readFileSync(htmlPath, 'utf-8');

    await page.setContent(html, { waitUntil: 'load' });
    await expect(page).toMatchScreenshot('homepage-en.png');
  });

  it('matches Russian locale snapshot', async () => {
    const htmlPath = join(process.cwd(), 'dist', 'ru', 'index.html');
    const html = readFileSync(htmlPath, 'utf-8');

    await page.setContent(html, { waitUntil: 'load' });
    await expect(page).toMatchScreenshot('homepage-ru.png');
  });

  it('matches Spanish locale snapshot', async () => {
    const htmlPath = join(process.cwd(), 'dist', 'es', 'index.html');
    const html = readFileSync(htmlPath, 'utf-8');

    await page.setContent(html, { waitUntil: 'load' });
    await expect(page).toMatchScreenshot('homepage-es.png');
  });

  it('matches default route snapshot', async () => {
    const htmlPath = join(process.cwd(), 'dist', 'index.html');
    const html = readFileSync(htmlPath, 'utf-8');

    await page.setContent(html, { waitUntil: 'load' });
    await expect(page).toMatchScreenshot('homepage-default.png');
  });
});
