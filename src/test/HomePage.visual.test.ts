import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import { chromium, type Browser, type Page } from 'playwright';
import { createServer, type Server } from 'node:http';
import { readFileSync } from 'node:fs';
import { extname, resolve, sep } from 'node:path';

describe('HomePage Visual Regression', () => {
  let browser: Browser;
  let page: Page;
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    const root = resolve('dist');
    const contentTypes: Record<string, string> = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'text/javascript',
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
      '.ico': 'image/x-icon',
    };
    server = createServer((request, response): void => {
      const pathname = new URL(request.url ?? '/', 'http://localhost').pathname;
      const file = resolve(
        root,
        `.${pathname}${pathname.endsWith('/') ? 'index.html' : ''}`,
      );
      if (!file.startsWith(root + sep)) {
        response.writeHead(404).end();
        return;
      }
      try {
        const body = readFileSync(file);
        response.writeHead(200, {
          'Content-Type':
            contentTypes[extname(file)] ?? 'application/octet-stream',
        });
        response.end(body);
      } catch {
        response.writeHead(404).end();
      }
    });
    await new Promise<void>((resolve, reject): void => {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', resolve);
    });
    const address = server.address();
    if (!address || typeof address === 'string')
      throw new Error('Missing test server port');
    baseUrl = `http://127.0.0.1:${address.port}`;
    browser = await chromium.launch({ headless: true });
    page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  });

  beforeEach(async () => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
    await page.goto(baseUrl);
    await page.evaluate((): void => localStorage.clear());
    await page.reload();
    await page.locator('[data-theme-toggle]').waitFor({ state: 'visible' });
  });

  afterAll(async () => {
    await browser?.close();
    if (server)
      await new Promise<void>((resolve, reject): void => {
        server.close((error?: Error): void =>
          error ? reject(error) : resolve(),
        );
      });
  });

  it.each(['en', 'ru', 'es', 'default'])(
    'matches %s locale snapshot',
    async (locale) => {
      await page.goto(`${baseUrl}/${locale === 'default' ? '' : `${locale}/`}`);
      await page.locator('[data-theme-toggle]').waitFor({ state: 'visible' });
      await expect(
        await page.screenshot({ fullPage: true }),
      ).toMatchFileSnapshot(`__screenshots__/homepage-${locale}.png`);
    },
  );

  it('persists the selected theme across reloads and locale navigation', async () => {
    await page.locator('[data-theme-toggle]').click();
    expect(await page.getAttribute('html', 'data-theme')).toBe('dark');
    expect(
      await page.locator('[data-theme-toggle]').getAttribute('aria-pressed'),
    ).toBe('true');
    await page.reload();
    expect(await page.getAttribute('html', 'data-theme')).toBe('dark');
    await page.locator('a[data-lang="ru"]').click();
    await page.waitForURL(`${baseUrl}/ru/`);
    expect(await page.getAttribute('html', 'data-theme')).toBe('dark');
    await page.locator('[data-theme-toggle]').click();
    expect(await page.getAttribute('html', 'data-theme')).toBe('light');
    expect(
      await page.evaluate((): string | null => localStorage.getItem('theme')),
    ).toBe('light');
  });

  it('follows system theme changes until a preference is selected', async () => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await expect
      .poll(() =>
        page.locator('[data-theme-toggle]').getAttribute('aria-pressed'),
      )
      .toBe('true');
    expect(
      await page.evaluate(
        (): string =>
          getComputedStyle(document.documentElement).backgroundColor,
      ),
    ).toBe('rgb(36, 36, 36)');
    const grid = await page.evaluate(
      (): string => getComputedStyle(document.documentElement).backgroundImage,
    );
    expect(grid).toContain('246, 240, 223');
    await page.locator('[data-theme-toggle]').click();
    await page.emulateMedia({ colorScheme: 'light' });
    await page.emulateMedia({ colorScheme: 'dark' });
    expect(await page.getAttribute('html', 'data-theme')).toBe('light');
  });

  it('keeps localized mobile content near the top with a keyboard-accessible tooltip', async () => {
    await page.setViewportSize({ width: 375, height: 812 });
    for (const locale of ['en', 'ru', 'es']) {
      await page.goto(`${baseUrl}/${locale}/`);
      await page.locator('[data-theme-toggle]').waitFor({ state: 'visible' });
      const header = await page.locator('.profile-header').boundingBox();
      expect(header?.y).toBeLessThan(110);
      expect(
        await page.evaluate(
          (): boolean => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      expect(await page.locator('.social-links__link').count()).toBe(4);
      const nickname = page.locator('.profile-header__nickname');
      await nickname.focus();
      expect(await page.locator('[role="tooltip"]').isVisible()).toBe(true);
    }
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.locator('.profile-header__nickname').blur();
    await expect(await page.screenshot({ fullPage: true })).toMatchFileSnapshot(
      '__screenshots__/homepage-mobile-dark.png',
    );
  });

  it('dismisses the nickname tooltip with Escape and restores it on refocus', async () => {
    const nickname = page.locator('.profile-header__nickname');
    const tooltip = page.locator('[role="tooltip"]');
    await nickname.focus();
    expect(await tooltip.isVisible()).toBe(true);
    await page.keyboard.press('Escape');
    expect(await tooltip.isVisible()).toBe(false);
    expect(
      await nickname.evaluate(
        (element): boolean => element === document.activeElement,
      ),
    ).toBe(true);
    await nickname.blur();
    await nickname.focus();
    expect(await tooltip.isVisible()).toBe(true);
  });

  it('keeps the theme toggle working when browser storage is blocked', async () => {
    const context = await browser.newContext();
    try {
      await context.addInitScript((): void => {
        Object.defineProperty(window, 'localStorage', {
          get(): never {
            throw new DOMException('Blocked', 'SecurityError');
          },
        });
      });
      const isolatedPage = await context.newPage();
      await isolatedPage.emulateMedia({ colorScheme: 'light' });
      await isolatedPage.goto(baseUrl);
      await isolatedPage.locator('[data-theme-toggle]').click();
      expect(await isolatedPage.getAttribute('html', 'data-theme')).toBe(
        'dark',
      );
      await isolatedPage.locator('a[data-lang="es"]').click();
      await isolatedPage.waitForURL(`${baseUrl}/es/`);
      expect(await isolatedPage.getAttribute('html', 'data-theme')).toBe(
        'dark',
      );
    } finally {
      await context.close();
    }
  });
});
