import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { chromium, type Browser, type Page } from 'playwright';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('HomePage Visual Regression', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await chromium.launch({ headless: true });
    page = await browser.newPage({
      viewport: { width: 1280, height: 720 },
    });
  });

  afterAll(async () => {
    await page.close();
    await browser.close();
  });

  it('matches English locale snapshot', async () => {
    const htmlPath = join(process.cwd(), 'dist', 'en', 'index.html');
    const html = readFileSync(htmlPath, 'utf-8');
    await page.setContent(html, { waitUntil: 'load' });
    await expect(await page.screenshot({ fullPage: true })).toMatchFileSnapshot(
      '__screenshots__/homepage-en.png',
    );
  });

  it('matches Russian locale snapshot', async () => {
    const htmlPath = join(process.cwd(), 'dist', 'ru', 'index.html');
    const html = readFileSync(htmlPath, 'utf-8');
    await page.setContent(html, { waitUntil: 'load' });
    await expect(await page.screenshot({ fullPage: true })).toMatchFileSnapshot(
      '__screenshots__/homepage-ru.png',
    );
  });

  it('matches Spanish locale snapshot', async () => {
    const htmlPath = join(process.cwd(), 'dist', 'es', 'index.html');
    const html = readFileSync(htmlPath, 'utf-8');
    await page.setContent(html, { waitUntil: 'load' });
    await expect(await page.screenshot({ fullPage: true })).toMatchFileSnapshot(
      '__screenshots__/homepage-es.png',
    );
  });

  it('matches default route snapshot', async () => {
    const htmlPath = join(process.cwd(), 'dist', 'index.html');
    const html = readFileSync(htmlPath, 'utf-8');
    await page.setContent(html, { waitUntil: 'load' });
    await expect(await page.screenshot({ fullPage: true })).toMatchFileSnapshot(
      '__screenshots__/homepage-default.png',
    );
  });
});
