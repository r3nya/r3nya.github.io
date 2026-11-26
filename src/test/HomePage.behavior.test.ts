import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
  inject,
} from 'vitest';
import {
  chromium,
  type Browser,
  type Locator,
  type Page,
  type Route,
} from 'playwright';
import { HomePageObject } from './HomePage.page';

interface CardAppearance {
  translate: string;
  shadow: string;
  decoration: string;
}

interface FocusAppearance {
  visible: boolean;
  color: string;
  width: string;
  style: string;
  background: string;
}

interface AlternateLink {
  locale: string | null;
  href: string | null;
}

interface Viewport {
  width: number;
  height: number;
}

describe('HomePage browser behavior', (): void => {
  let browser: Browser;
  let page: Page;
  let home: HomePageObject;
  const baseUrl = inject('siteUrl');

  beforeAll(async (): Promise<void> => {
    browser = await chromium.launch({ headless: true });
    page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    home = new HomePageObject(page, baseUrl);
  });

  beforeEach(async (): Promise<void> => {
    await home.setViewport(1280, 720);
    await home.setMedia({
      colorScheme: 'light',
      reducedMotion: 'reduce',
      forcedColors: 'none',
    });
    await home.goto();
  });

  afterAll(async (): Promise<void> => {
    await browser?.close();
  });

  it.runIf(process.env.PUBLIC_SNOW_FALL_ENABLED === 'true')(
    'respects reduced-motion preferences for snow',
    async (): Promise<void> => {
      const flake = home.snowFlakes.first();
      expect(await home.snowToggle.isVisible()).toBe(false);
      expect(await home.snowFall.isVisible()).toBe(false);
      expect(await home.snowFlakes.count()).toBe(0);

      await home.setMedia({ reducedMotion: 'no-preference' });
      await home.snowToggle.waitFor({ state: 'visible' });
      expect(await home.snowToggle.getAttribute('aria-pressed')).toBe('false');
      await expect.poll((): Promise<boolean> => flake.isVisible()).toBe(true);

      await home.snowToggle.click();
      expect(await home.snowToggle.getAttribute('aria-pressed')).toBe('true');
      await expect.poll((): Promise<boolean> => flake.isVisible()).toBe(false);

      await home.snowToggle.click();
      expect(await home.snowToggle.getAttribute('aria-pressed')).toBe('false');
      await expect.poll((): Promise<boolean> => flake.isVisible()).toBe(true);

      await home.setMedia({ reducedMotion: 'reduce' });
      await expect.poll((): Promise<boolean> => flake.isVisible()).toBe(false);
      expect(await home.snowToggle.isVisible()).toBe(false);
    },
  );

  it('reaches every control and link with Tab and exposes landmarks', async (): Promise<void> => {
    expect(await home.banner.count()).toBe(1);
    expect(await home.banner.locator('[data-theme-toggle]').count()).toBe(1);
    expect(await home.main.count()).toBe(1);
    expect(await home.navigation('Language switcher').count()).toBe(1);

    const socialNav = home.navigation('Social links');
    expect(await socialNav.count()).toBe(1);
    expect(await socialNav.getByRole('list').count()).toBe(1);
    expect(await socialNav.getByRole('listitem').count()).toBe(4);

    for (const target of [
      home.skipLink,
      home.langLink('ru'),
      home.langLink('es'),
      home.themeToggle,
      home.nickname,
      home.socialLink(0),
      home.socialLink(1),
      home.socialLink(2),
      home.socialLink(3),
    ]) {
      await page.keyboard.press('Tab');
      const focused = await target.evaluate(
        (el: Element): boolean => el === document.activeElement,
      );
      expect(focused).toBe(true);
    }

    await home.skipLink.focus();
    await page.keyboard.press('Enter');
    expect(
      await page.evaluate((): string | undefined => document.activeElement?.id),
    ).toBe('main-content');
  });

  it('gives controls consistent hover, focus, and reduced-motion feedback', async (): Promise<void> => {
    const link = home.socialLinks.first();
    const cardAppearance = async (): Promise<CardAppearance> => ({
      ...(await link.evaluate(
        (element: Element): Omit<CardAppearance, 'decoration'> => ({
          translate: getComputedStyle(element).translate,
          shadow: getComputedStyle(element).boxShadow,
        }),
      )),
      decoration: await link
        .locator('.social-links__title')
        .evaluate(
          (element: Element): string =>
            getComputedStyle(element).textDecorationLine,
        ),
    });

    await link.hover();
    const hover = await cardAppearance();
    expect(hover.translate).toBe('-2px -2px');
    expect(hover.decoration).toBe('underline');

    await page.mouse.move(0, 0);
    await page.keyboard.press('Tab');
    await link.focus();
    expect(await cardAppearance()).toEqual(hover);

    const outlineColors = new Set<string>();
    for (const theme of ['light', 'dark'] as const) {
      await home.setMedia({ colorScheme: theme });
      for (const element of [
        home.socialLinks.first(),
        home.nickname,
        home.langLinks.first(),
      ]) {
        await element.focus();
        const focus = await element.evaluate((el: Element): FocusAppearance => {
          const style = getComputedStyle(el);
          return {
            visible: el.matches(':focus-visible'),
            color: style.outlineColor,
            width: style.outlineWidth,
            style: style.outlineStyle,
            background: getComputedStyle(document.documentElement)
              .backgroundColor,
          };
        });
        expect(focus.visible).toBe(true);
        expect(focus.style).toBe('solid');
        expect(parseFloat(focus.width)).toBeGreaterThan(0);
        expect(focus.color).not.toBe(focus.background);
        outlineColors.add(focus.color);
      }
    }
    expect(outlineColors.size).toBe(2);

    const markerAppearance = (
      locator: Locator,
    ): Promise<Record<string, string>> =>
      locator.evaluate((element: HTMLElement): Record<string, string> => {
        const marker = getComputedStyle(element, '::before');
        return {
          color: getComputedStyle(element).color,
          background: marker.backgroundColor,
          scale: marker.scale,
          duration: marker.transitionDuration,
          property: marker.transitionProperty,
        };
      });

    await home.setMedia({
      colorScheme: 'light',
      reducedMotion: 'no-preference',
    });
    const initial = await markerAppearance(home.themeToggle);
    await home.langLinks.first().hover();
    await expect
      .poll(
        async (): Promise<string> =>
          (await markerAppearance(home.langLinks.first())).scale,
      )
      .toBe('1');
    const highlight = await markerAppearance(home.langLinks.first());
    expect(highlight.background).not.toBe('rgba(0, 0, 0, 0)');
    expect(highlight.scale).not.toBe(initial.scale);

    await home.themeToggle.hover();
    await expect
      .poll(() => markerAppearance(home.themeToggle))
      .toEqual(highlight);

    await page.mouse.move(0, 0);
    await home.themeToggle.focus();
    await expect
      .poll(() => markerAppearance(home.themeToggle))
      .toEqual(highlight);

    await home.setMedia({ reducedMotion: 'reduce' });
    expect((await markerAppearance(home.themeToggle)).duration).toBe('0s');
    expect(
      await home.themeToggle.evaluate(
        (element: HTMLElement): string =>
          getComputedStyle(element).transitionProperty,
      ),
    ).toContain('color');
  });

  it('preserves visible indicators in forced-colors mode', async (): Promise<void> => {
    try {
      await home.setMedia({ forcedColors: 'active' });
      const currentDecoration = await home.currentLang.evaluate(
        (el: Element): string => getComputedStyle(el).textDecorationLine,
      );
      expect(currentDecoration).toBe('underline');

      const toggleBorder = await home.themeToggle.evaluate(
        (el: Element): { style: string; width: number } => {
          const style = getComputedStyle(el);
          return {
            style: style.borderTopStyle,
            width: parseFloat(style.borderTopWidth),
          };
        },
      );
      expect(toggleBorder.style).toBe('solid');
      expect(toggleBorder.width).toBeGreaterThan(0);

      await page.keyboard.press('Tab');
      const skipBorder = await home.skipLink.evaluate(
        (el: Element): { style: string; width: number } => {
          const style = getComputedStyle(el);
          return {
            style: style.borderTopStyle,
            width: parseFloat(style.borderTopWidth),
          };
        },
      );
      expect(skipBorder.style).toBe('solid');
      expect(skipBorder.width).toBeGreaterThan(0);

      const langLink = home.langLinks.first();
      await langLink.focus();
      const langFocus = await langLink.evaluate(
        (
          el: Element,
        ): {
          decoration: string;
          outlineStyle: string;
          outlineWidth: number;
        } => {
          const style = getComputedStyle(el);
          return {
            decoration: style.textDecorationLine,
            outlineStyle: style.outlineStyle,
            outlineWidth: parseFloat(style.outlineWidth),
          };
        },
      );
      expect(langFocus.decoration).toBe('underline');
      expect(langFocus.outlineStyle).toBe('solid');
      expect(langFocus.outlineWidth).toBeGreaterThan(0);
    } finally {
      await home.setMedia({ forcedColors: 'none' });
    }
  });

  it('keeps canonical and hreflang consistent on every generated route', async (): Promise<void> => {
    const canonicals = new Map<string, string | null>();
    const alternates: AlternateLink[] = [];

    for (const path of ['/', '/en/', '/ru/', '/es/']) {
      const response = await home.goto(path);
      expect(response?.status()).toBe(200);
      const canonical = await page
        .locator('link[rel="canonical"]')
        .getAttribute('href');
      expect(canonical).toBe(`https://r3nya.ru${path === '/en/' ? '/' : path}`);
      canonicals.set(path, canonical);
      alternates.push(
        ...(await page
          .locator('link[rel="alternate"][hreflang]')
          .evaluateAll((links: Element[]): AlternateLink[] =>
            links.map((link: Element): AlternateLink => ({
              locale: link.getAttribute('hreflang'),
              href: link.getAttribute('href'),
            })),
          )),
      );
    }

    expect(alternates).toHaveLength(16);
    for (const alternate of alternates) {
      const target =
        alternate.locale === 'en' || alternate.locale === 'x-default'
          ? '/'
          : `/${alternate.locale}/`;
      expect(alternate.href).toBe(canonicals.get(target));
    }

    const sitemap = await page.request.get(`${baseUrl}/sitemap-0.xml`);
    const urls = [...(await sitemap.text()).matchAll(/<loc>(.*?)<\/loc>/g)].map(
      (match: RegExpMatchArray): string | undefined => match[1],
    );
    expect(urls.sort()).toEqual([
      'https://r3nya.ru/',
      'https://r3nya.ru/es/',
      'https://r3nya.ru/ru/',
    ]);
  });

  it.each(['light', 'dark'] as const)(
    'follows %s system theme, overrides manually, and reverts on second click',
    async (system: 'light' | 'dark'): Promise<void> => {
      const opposite = system === 'light' ? 'dark' : 'light';
      const overrideHex = system === 'light' ? '#242424' : '#f4f1e8';

      await home.setMedia({ colorScheme: system });
      await expect
        .poll((): Promise<string | null> =>
          home.themeToggle.getAttribute('aria-pressed'),
        )
        .toBe(String(system === 'dark'));
      expect(await home.getThemeAttr()).toBeNull();
      expect(await home.getColorSchemeMeta()).toBe('light dark');
      expect(await home.getThemeColors()).toEqual(['#f4f1e8', '#242424']);

      if (system === 'dark') {
        expect(
          await page.evaluate(
            (): string =>
              getComputedStyle(document.documentElement).backgroundColor,
          ),
        ).toBe('rgb(36, 36, 36)');
        expect(
          await page.evaluate(
            (): string =>
              getComputedStyle(document.documentElement).backgroundImage,
          ),
        ).toContain('246, 240, 223');
      }

      // First click pins the opposite scheme and updates browser chrome metadata.
      await home.toggleTheme();
      expect(await home.getThemeAttr()).toBe(opposite);
      expect(await home.getColorSchemeMeta()).toBe(opposite);
      expect(await home.getThemeColors()).toEqual([overrideHex, overrideHex]);

      await home.setMedia({ colorScheme: opposite });
      await home.setMedia({ colorScheme: system });
      expect(await home.getThemeAttr()).toBe(opposite);

      // Second click returns to system default and resumes following OS changes.
      await home.toggleTheme();
      expect(await home.getThemeAttr()).toBeNull();
      expect(await home.getColorSchemeMeta()).toBe('light dark');
      expect(await home.getThemeColors()).toEqual(['#f4f1e8', '#242424']);

      await home.setMedia({ colorScheme: opposite });
      await expect
        .poll((): Promise<string | null> =>
          home.themeToggle.getAttribute('aria-pressed'),
        )
        .toBe(String(opposite === 'dark'));
    },
  );

  it('resets manual theme on navigation and reload without using localStorage', async (): Promise<void> => {
    try {
      await page.evaluate((): void => {
        document.documentElement.dataset.navigationMarker = 'previous-document';
      });
      await home.toggleTheme();
      expect(await home.getThemeAttr()).toBe('dark');
      expect(await home.themeToggle.getAttribute('aria-pressed')).toBe('true');

      await home.langLink('ru').click();
      await page.waitForURL(`${baseUrl}/ru/`);
      await home.themeToggle.waitFor({ state: 'visible' });
      expect(
        await page.getAttribute('html', 'data-navigation-marker'),
      ).toBeNull();
      expect(await home.getThemeAttr()).toBeNull();
      expect(
        await page.evaluate((): string | null => localStorage.getItem('theme')),
      ).toBeNull();

      await home.toggleTheme();
      expect(await home.getThemeAttr()).toBe('dark');
      await home.reload();
      expect(await home.getThemeAttr()).toBeNull();
      expect(await home.getColorSchemeMeta()).toBe('light dark');
      expect(await home.themeToggle.getAttribute('aria-pressed')).toBe('false');

      for (const [system, saved] of [
        ['light', 'dark'],
        ['dark', 'light'],
      ] as const) {
        await page.evaluate(
          (theme: string): void => localStorage.setItem('theme', theme),
          saved,
        );
        await home.setMedia({ colorScheme: system });
        await home.reload();
        expect(await home.getThemeAttr()).toBeNull();
        expect(await home.themeToggle.getAttribute('aria-pressed')).toBe(
          String(system === 'dark'),
        );
        await home.toggleTheme();
        expect(
          await page.evaluate((): string | null =>
            localStorage.getItem('theme'),
          ),
        ).toBe(saved);
      }
    } finally {
      await page.evaluate((): void => localStorage.clear());
    }
  });

  it('animates theme changes when motion is allowed, skips fallbacks, and settles rapid clicks', async (): Promise<void> => {
    await home.setMedia({ reducedMotion: 'no-preference' });
    for (const expectedTheme of ['dark', null] as const) {
      await home.toggleTheme();
      await expect
        .poll((): Promise<boolean> =>
          home.hasCssAnimation('theme-toggle-reveal'),
        )
        .toBe(true);
      await home.waitForAnimations();
      expect(await home.getThemeAttr()).toBe(expectedTheme);
      expect(await home.getColorSchemeMeta()).toBe(
        expectedTheme ?? 'light dark',
      );
    }

    await home.themeToggle.evaluate((button: HTMLButtonElement): void => {
      button.click();
      button.click();
    });
    await expect
      .poll((): Promise<string | null> => home.getThemeAttr())
      .toBeNull();
    expect(await home.getColorSchemeMeta()).toBe('light dark');
    expect(await home.themeToggle.getAttribute('aria-pressed')).toBe('false');

    await home.setMedia({ reducedMotion: 'reduce' });
    await home.toggleTheme();
    expect(await home.getThemeAttr()).toBe('dark');
    expect(await home.hasCssAnimation()).toBe(false);

    await home.reload();
    await home.setMedia({ reducedMotion: 'no-preference' });
    await page.evaluate((): void => {
      Object.defineProperty(document, 'startViewTransition', {
        value: undefined,
        configurable: true,
      });
    });
    await home.toggleTheme();
    expect(await home.getThemeAttr()).toBe('dark');
    expect(await home.hasCssAnimation()).toBe(false);
  });

  it.each([
    { width: 375, height: 812 },
    { width: 1280, height: 720 },
  ])(
    'keeps content stable while theme controls initialize at $width×$height',
    async ({ width, height }: Viewport): Promise<void> => {
      await home.setViewport(width, height);
      let releaseScripts: () => void = (): void => {};
      const scriptsReady = new Promise<void>((resolve: () => void): void => {
        releaseScripts = resolve;
      });
      await page.route('**/*.js', async (route: Route): Promise<void> => {
        await scriptsReady;
        await route.continue();
      });
      try {
        await page.goto(`${baseUrl}/ru/`, { waitUntil: 'commit' });
        await home.profileHeader.waitFor({ state: 'visible' });
        await page.waitForFunction((): boolean => {
          const main = document.querySelector('main');
          return main !== null && getComputedStyle(main).display === 'flex';
        });
        const before = await home.profileHeader.boundingBox();
        expect(await home.themeToggle.isVisible()).toBe(false);
        releaseScripts();
        await home.themeToggle.waitFor({ state: 'visible' });
        const after = await home.profileHeader.boundingBox();
        expect(before).not.toBeNull();
        expect(after).toEqual(before);
      } finally {
        releaseScripts();
        await page.unrouteAll({ behavior: 'wait' });
      }
    },
  );

  it.each([
    { width: 320, fontSize: 16 },
    { width: 375, fontSize: 16 },
    { width: 320, fontSize: 20 },
    { width: 375, fontSize: 20 },
  ])(
    'keeps mobile tooltips clear and reflows cards at $width px with a $fontSize px base font',
    async ({
      width,
      fontSize,
    }: {
      width: number;
      fontSize: number;
    }): Promise<void> => {
      await home.setViewport(width, 812);
      for (const locale of ['en', 'ru', 'es']) {
        await home.goto(`/${locale}/`);
        await home.setRootFontSize(fontSize);

        expect((await home.getOverflow()).width).toBe(0);
        expect(await home.socialLinks.count()).toBe(4);
        expect(await home.getSocialColumns()).toBe(
          width === 375 && fontSize === 16 ? 2 : 1,
        );

        const targets = await page
          .locator(
            '.lang-switcher__current, .lang-switcher__link, [data-theme-toggle]',
          )
          .evaluateAll((elements: Element[]): Viewport[] =>
            elements.map((element: Element): Viewport => {
              const rect = element.getBoundingClientRect();
              return { width: rect.width, height: rect.height };
            }),
          );
        expect(targets).toHaveLength(4);
        for (const target of targets) {
          expect(target.width).toBeGreaterThanOrEqual(44);
          expect(target.height).toBeGreaterThanOrEqual(44);
        }

        await home.nickname.focus();
        expect(await home.tooltip.isVisible()).toBe(true);
        const tooltip = await home.tooltip.boundingBox();
        const controls = await home.controls.boundingBox();
        expect(tooltip).not.toBeNull();
        expect(controls).not.toBeNull();
        if (!tooltip || !controls)
          throw new Error('Missing tooltip or controls');
        expect(tooltip.y).toBeGreaterThan(controls.y + controls.height);
        expect(tooltip.x).toBeGreaterThanOrEqual(0);
        expect(tooltip.x + tooltip.width).toBeLessThanOrEqual(width);
      }
    },
  );

  it('dismisses the nickname tooltip with Escape and restores it on refocus', async (): Promise<void> => {
    await home.nickname.focus();
    expect(await home.tooltip.isVisible()).toBe(true);
    expect(await home.nickname.getAttribute('aria-expanded')).toBe('true');

    await page.keyboard.press('Escape');
    expect(await home.tooltip.isVisible()).toBe(false);
    expect(await home.nickname.getAttribute('aria-expanded')).toBe('false');
    expect(
      await home.nickname.evaluate(
        (element: Element): boolean => element === document.activeElement,
      ),
    ).toBe(true);

    await home.nickname.blur();
    await home.nickname.focus();
    expect(await home.tooltip.isVisible()).toBe(true);
    expect(await home.nickname.getAttribute('aria-expanded')).toBe('true');

    await home.nickname.blur();
    expect(await home.tooltip.isVisible()).toBe(false);
    expect(await home.nickname.getAttribute('aria-expanded')).toBe('false');

    await home.nickname.click();
    expect(await home.tooltip.isVisible()).toBe(true);
    expect(await home.nickname.getAttribute('aria-expanded')).toBe('true');

    await home.nickname.click();
    expect(await home.tooltip.isVisible()).toBe(false);
    expect(await home.nickname.getAttribute('aria-expanded')).toBe('false');
  });

  it.each(['light', 'dark'] as const)(
    'handles theme and tooltip taps from %s without sticky hover highlight',
    async (system: 'light' | 'dark'): Promise<void> => {
      const mobilePage = await browser.newPage({
        viewport: { width: 375, height: 812 },
        isMobile: true,
        hasTouch: true,
        colorScheme: system,
        reducedMotion: 'no-preference',
      });
      const mobile = new HomePageObject(mobilePage, baseUrl);
      try {
        await mobile.goto();
        for (const dark of [system === 'light', system === 'dark']) {
          await mobile.themeToggle.tap();
          await expect
            .poll((): Promise<string | null> =>
              mobile.themeToggle.getAttribute('aria-pressed'),
            )
            .toBe(String(dark));
          await expect
            .poll((): Promise<string> =>
              mobile.themeToggle
                .locator('span')
                .evaluate(
                  (icon: HTMLElement): string => getComputedStyle(icon).color,
                ),
            )
            .toBe(dark ? 'rgb(246, 240, 223)' : 'rgb(36, 36, 36)');
          expect(
            await mobile.themeToggle.evaluate(
              (element: HTMLElement): string =>
                getComputedStyle(element, '::before').scale,
            ),
          ).toBe('1 0');
        }

        expect(await mobile.tooltip.isVisible()).toBe(false);
        expect(await mobile.nickname.getAttribute('aria-expanded')).toBe(
          'false',
        );

        await mobile.nickname.tap();
        expect(await mobile.tooltip.isVisible()).toBe(true);
        expect(await mobile.nickname.getAttribute('aria-expanded')).toBe(
          'true',
        );

        await mobile.profileTitle.tap();
        expect(await mobile.tooltip.isVisible()).toBe(false);
        expect(await mobile.nickname.getAttribute('aria-expanded')).toBe(
          'false',
        );

        await mobile.nickname.tap();
        expect(await mobile.tooltip.isVisible()).toBe(true);
        expect(await mobile.nickname.getAttribute('aria-expanded')).toBe(
          'true',
        );

        await mobile.nickname.tap();
        expect(await mobile.tooltip.isVisible()).toBe(false);
        expect(await mobile.nickname.getAttribute('aria-expanded')).toBe(
          'false',
        );
      } finally {
        await mobilePage.close();
      }
    },
  );
});
