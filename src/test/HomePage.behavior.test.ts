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

  it.each(['en', 'ru', 'es'])(
    'reaches every control and link with Tab in %s',
    async (locale) => {
      await page.goto(`${baseUrl}/${locale}/`);
      await page.locator('[data-theme-toggle]').waitFor({ state: 'visible' });
      for (const selector of [
        '.base-layout__skip-link',
        ...['en', 'ru', 'es']
          .filter((code) => code !== locale)
          .map((code) => `.lang-switcher__link[data-lang="${code}"]`),
        '[data-theme-toggle]',
        '.profile-header__nickname',
        '.social-links__link:nth-child(1)',
        '.social-links__link:nth-child(2)',
        '.social-links__link:nth-child(3)',
        '.social-links__link:nth-child(4)',
      ]) {
        await page.keyboard.press('Tab');
        expect(
          await page
            .locator(':focus')
            .evaluate((el, selector) => el.matches(selector), selector),
        ).toBe(true);
      }
    },
  );

  it('gives contact cards the same hover and keyboard feedback', async () => {
    const link = page.locator('.social-links__link').first();
    const appearance = async () => ({
      ...(await link.evaluate((element) => ({
        transform: getComputedStyle(element).transform,
        shadow: getComputedStyle(element).boxShadow,
      }))),
      decoration: await link
        .locator('.social-links__title')
        .evaluate((element) => getComputedStyle(element).textDecorationLine),
    });
    await link.hover();
    const hover = await appearance();
    expect(hover.decoration).toBe('underline');
    await page.mouse.move(0, 0);
    await page.keyboard.press('Tab');
    await link.focus();
    expect(await appearance()).toEqual(hover);
  });

  it.each(['light', 'dark'] as const)(
    'matches browser chrome to the %s system background',
    async (theme) => {
      await page.emulateMedia({ colorScheme: theme });
      const content = await page
        .locator(
          `meta[name="theme-color"][media="(prefers-color-scheme: ${theme})"]`,
        )
        .getAttribute('content');
      expect(content).toBe(theme === 'light' ? '#f4f1e8' : '#242424');
    },
  );

  it.each([375, 1280])(
    'scales profile typography with the browser font size at %i px',
    async (width) => {
      await page.setViewportSize({ width, height: 900 });
      const selectors = [
        '.profile-header__title',
        '.profile-header__nickname',
        '.social-links__arrow',
      ];
      for (const selector of selectors) {
        const element = page.locator(selector).first();
        const original = await element.evaluate((el) =>
          parseFloat(getComputedStyle(el).fontSize),
        );
        await page
          .locator('html')
          .evaluate((el) => (el.style.fontSize = '20px'));
        const enlarged = await element.evaluate((el) =>
          parseFloat(getComputedStyle(el).fontSize),
        );
        expect(enlarged / original).toBeCloseTo(1.25);
        await page
          .locator('html')
          .evaluate((el) => el.style.removeProperty('font-size'));
      }
    },
  );

  it.each(['/', '/en/', '/ru/', '/es/'])(
    'links to canonical locale URLs from %s',
    async (path) => {
      await page.goto(`${baseUrl}${path}`);
      for (const [locale, target] of [
        ['en', '/'],
        ['ru', '/ru/'],
        ['es', '/es/'],
        ['x-default', '/'],
      ]) {
        const href = await page
          .locator(`link[rel="alternate"][hreflang="${locale}"]`)
          .getAttribute('href');
        expect(href).toBe(`https://r3nya.ru${target}`);
        const response = await page.request.get(`${baseUrl}${target}`, {
          maxRedirects: 0,
        });
        expect(response.status()).toBe(200);
        const destination = await browser.newPage();
        try {
          await destination.goto(`${baseUrl}${target}`);
          expect(
            await destination
              .locator('link[rel="canonical"]')
              .getAttribute('href'),
          ).toBe(href);
        } finally {
          await destination.close();
        }
      }
    },
  );

  it.each(['light', 'dark'] as const)(
    'shows keyboard focus against the %s page background',
    async (theme) => {
      await page.emulateMedia({ colorScheme: theme });
      for (const selector of [
        '.social-links__link',
        '.profile-header__nickname',
        '.lang-switcher__link',
      ]) {
        await page.keyboard.press('Tab');
        const element = page.locator(selector).first();
        await element.focus();
        const focus = await element.evaluate((element) => {
          const style = getComputedStyle(element);
          return {
            visible: element.matches(':focus-visible'),
            color: style.outlineColor,
            width: style.outlineWidth,
            style: style.outlineStyle,
            background: getComputedStyle(document.documentElement)
              .backgroundColor,
          };
        });
        expect(focus.visible).toBe(true);
        expect(focus.width).toBe('3px');
        expect(focus.style).toBe('solid');
        expect(focus.color).toBe(
          theme === 'dark' ? 'rgb(246, 240, 223)' : 'rgb(36, 36, 36)',
        );
        expect(focus.color).not.toBe(focus.background);
      }
    },
  );

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
