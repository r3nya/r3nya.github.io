import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
  inject,
} from 'vitest';
import { chromium, type Browser, type Page } from 'playwright';

describe('HomePage browser behavior', () => {
  let browser: Browser;
  let page: Page;
  const baseUrl = inject('siteUrl');

  beforeAll(async () => {
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
  });

  it.each([375, 1280])(
    'keeps content stable while theme controls initialize at %i px',
    async (width) => {
      await page.setViewportSize({ width, height: 900 });
      let releaseScripts: () => void = (): void => {};
      const scriptsReady = new Promise<void>((resolve): void => {
        releaseScripts = resolve;
      });
      await page.route('**/*.js', async (route): Promise<void> => {
        await scriptsReady;
        await route.continue();
      });
      try {
        await page.goto(`${baseUrl}/ru/`, { waitUntil: 'commit' });
        await page.locator('.profile-header').waitFor({ state: 'visible' });
        await page.waitForFunction((): boolean => {
          const main = document.querySelector('main');
          return main !== null && getComputedStyle(main).display === 'flex';
        });
        const before = await page.locator('.profile-header').boundingBox();
        expect(await page.locator('[data-theme-toggle]').isVisible()).toBe(
          false,
        );
        releaseScripts();
        await page.locator('[data-theme-toggle]').waitFor({ state: 'visible' });
        const after = await page.locator('.profile-header').boundingBox();
        expect(before).not.toBeNull();
        expect(after).toEqual(before);
      } finally {
        releaseScripts();
        await page.unrouteAll({ behavior: 'wait' });
      }
    },
  );

  it('loads a new document on locale navigation and resets the temporary theme', async () => {
    await page.evaluate((): void => {
      document.documentElement.dataset.navigationMarker = 'previous-document';
    });
    await page.locator('[data-theme-toggle]').click();
    expect(await page.getAttribute('html', 'data-theme')).toBe('dark');
    expect(
      await page.locator('[data-theme-toggle]').getAttribute('aria-pressed'),
    ).toBe('true');
    await page.locator('a[data-lang="ru"]').click();
    await page.waitForURL(`${baseUrl}/ru/`);
    await page.locator('[data-theme-toggle]').waitFor({ state: 'visible' });
    expect(
      await page.getAttribute('html', 'data-navigation-marker'),
    ).toBeNull();
    expect(await page.getAttribute('html', 'data-theme')).toBeNull();
    expect(
      await page.evaluate((): string | null => localStorage.getItem('theme')),
    ).toBeNull();
    await page.locator('[data-theme-toggle]').click();
    expect(await page.getAttribute('html', 'data-theme')).toBe('dark');
    await page.reload();
    await page.locator('[data-theme-toggle]').waitFor({ state: 'visible' });
    expect(await page.getAttribute('html', 'data-theme')).toBeNull();
    expect(
      await page.locator('[data-theme-toggle]').getAttribute('aria-pressed'),
    ).toBe('false');
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

  it.each([
    { system: 'light', saved: 'dark', pressed: 'false' },
    { system: 'dark', saved: 'light', pressed: 'true' },
  ] as const)(
    'uses the $system system theme despite an old $saved saved preference',
    async ({ system, saved, pressed }) => {
      await page.evaluate(
        (theme: string): void => localStorage.setItem('theme', theme),
        saved,
      );
      await page.emulateMedia({ colorScheme: system });
      await page.reload();
      await page.locator('[data-theme-toggle]').waitFor({ state: 'visible' });
      expect(await page.getAttribute('html', 'data-theme')).toBeNull();
      expect(
        await page.locator('[data-theme-toggle]').getAttribute('aria-pressed'),
      ).toBe(pressed);
      await page.locator('[data-theme-toggle]').click();
      expect(
        await page.evaluate((): string | null => localStorage.getItem('theme')),
      ).toBe(saved);
    },
  );
});
