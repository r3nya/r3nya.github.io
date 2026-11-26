import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
  inject,
} from 'vitest';
import { chromium, type Browser, type Page, type Route } from 'playwright';

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

interface DuoViewport extends Viewport {
  name: string;
  fits: boolean;
}

// iPhone Duo CSS-pixel viewports: outer and inner screens, plus split view.
const duoViewports: readonly DuoViewport[] = [
  { name: 'outer portrait', width: 382, height: 580, fits: true },
  { name: 'outer landscape', width: 594, height: 368, fits: false },
  { name: 'inner portrait', width: 669, height: 867, fits: true },
  { name: 'inner landscape', width: 951, height: 585, fits: true },
  { name: 'split view', width: 385, height: 571, fits: true },
];

const layoutViewports: readonly Viewport[] = [
  { width: 375, height: 900 },
  { width: 1280, height: 900 },
  ...duoViewports,
];

describe('HomePage browser behavior', (): void => {
  let browser: Browser;
  let page: Page;
  const baseUrl = inject('siteUrl');

  beforeAll(async (): Promise<void> => {
    browser = await chromium.launch({ headless: true });
    page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  });

  beforeEach(async (): Promise<void> => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.emulateMedia({
      colorScheme: 'light',
      reducedMotion: 'reduce',
      forcedColors: 'none',
    });
    await page.goto(baseUrl);
    await page.evaluate((): void => localStorage.clear());
    await page.reload();
    await page.locator('[data-theme-toggle]').waitFor({ state: 'visible' });
  });

  afterAll(async (): Promise<void> => {
    await browser?.close();
  });

  it.runIf(process.env.PUBLIC_SNOW_FALL_ENABLED === 'true')(
    'respects reduced-motion preferences for snow',
    async (): Promise<void> => {
      const toggle = page.locator('[data-snow-toggle]');
      const flake = page.locator('snow-fall').locator('div').first();
      expect(await toggle.isVisible()).toBe(false);
      expect(await page.locator('snow-fall').isVisible()).toBe(false);
      expect(await page.locator('snow-fall div').count()).toBe(0);
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await toggle.waitFor({ state: 'visible' });
      expect(await toggle.getAttribute('aria-pressed')).toBe('false');
      await expect.poll((): Promise<boolean> => flake.isVisible()).toBe(true);
      await toggle.click();
      expect(await toggle.getAttribute('aria-pressed')).toBe('true');
      await expect.poll((): Promise<boolean> => flake.isVisible()).toBe(false);
      await toggle.click();
      expect(await toggle.getAttribute('aria-pressed')).toBe('false');
      await expect.poll((): Promise<boolean> => flake.isVisible()).toBe(true);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await expect.poll((): Promise<boolean> => flake.isVisible()).toBe(false);
      expect(await toggle.isVisible()).toBe(false);
    },
  );

  it.each(['en', 'ru', 'es'])(
    'reaches every control and link with Tab in %s',
    async (locale: string): Promise<void> => {
      await page.goto(`${baseUrl}/${locale}/`);
      await page.locator('[data-theme-toggle]').waitFor({ state: 'visible' });
      for (const selector of [
        '.base-layout__skip-link',
        ...['en', 'ru', 'es']
          .filter((code: string): boolean => code !== locale)
          .map(
            (code: string): string =>
              `.lang-switcher__link[data-lang="${code}"]`,
          ),
        '[data-theme-toggle]',
        '.profile-header__nickname',
        '.social-links__item:nth-child(1) .social-links__link',
        '.social-links__item:nth-child(2) .social-links__link',
        '.social-links__item:nth-child(3) .social-links__link',
        '.social-links__item:nth-child(4) .social-links__link',
      ]) {
        await page.keyboard.press('Tab');
        expect(
          await page
            .locator(':focus')
            .evaluate(
              (el: Element, selector: string): boolean => el.matches(selector),
              selector,
            ),
        ).toBe(true);
      }
    },
  );

  it('gives contact cards the same hover and keyboard feedback', async (): Promise<void> => {
    const link = page.locator('.social-links__link').first();
    const appearance = async (): Promise<CardAppearance> => ({
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
    const hover = await appearance();
    expect(hover.translate).toBe('-2px -2px');
    expect(hover.decoration).toBe('underline');
    await page.mouse.move(0, 0);
    await page.keyboard.press('Tab');
    await link.focus();
    expect(await appearance()).toEqual(hover);
  });

  it.each(['light', 'dark'] as const)(
    'matches browser chrome to the %s system background',
    async (theme: 'light' | 'dark'): Promise<void> => {
      await page.emulateMedia({ colorScheme: theme });
      const content = await page
        .locator(
          `meta[name="theme-color"][media="(prefers-color-scheme: ${theme})"]`,
        )
        .getAttribute('content');
      expect(content).toBe(theme === 'light' ? '#f4f1e8' : '#242424');
    },
  );

  it.each(layoutViewports)(
    'scales profile typography with the browser font size at $width×$height',
    async ({ width, height }: Viewport): Promise<void> => {
      await page.setViewportSize({ width, height });
      const selectors = [
        '.profile-header__title',
        '.profile-header__nickname',
        '.social-links__arrow',
      ];
      for (const selector of selectors) {
        const element = page.locator(selector).first();
        const original = await element.evaluate((el: Element): number =>
          parseFloat(getComputedStyle(el).fontSize),
        );
        await page.locator('html').evaluate((el: HTMLElement): void => {
          el.style.fontSize = '20px';
        });
        const enlarged = await element.evaluate((el: Element): number =>
          parseFloat(getComputedStyle(el).fontSize),
        );
        expect(enlarged / original).toBeCloseTo(1.25);
        await page.locator('html').evaluate((el: HTMLElement): void => {
          el.style.removeProperty('font-size');
        });
      }
    },
  );

  it('keeps canonical and hreflang consistent on every generated route', async (): Promise<void> => {
    const canonicals = new Map<string, string | null>();
    const alternates: AlternateLink[] = [];
    for (const path of ['/', '/en/', '/ru/', '/es/']) {
      const response = await page.goto(`${baseUrl}${path}`);
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
    'updates browser chrome for a manual theme override from %s',
    async (system: 'light' | 'dark'): Promise<void> => {
      const colors = async (): Promise<string[]> =>
        page
          .locator('meta[name="theme-color"]')
          .evaluateAll((metas: HTMLMetaElement[]): string[] =>
            metas.map((meta: HTMLMetaElement): string => meta.content),
          );
      await page.emulateMedia({ colorScheme: system });
      await page.locator('[data-theme-toggle]').click();
      const expected = system === 'light' ? '#242424' : '#f4f1e8';
      expect(await colors()).toEqual([expected, expected]);
      expect(
        await page.locator('meta[name="color-scheme"]').getAttribute('content'),
      ).toBe(system === 'light' ? 'dark' : 'light');
      await page.emulateMedia({
        colorScheme: system === 'light' ? 'dark' : 'light',
      });
      expect(await colors()).toEqual([expected, expected]);
      await page.emulateMedia({ colorScheme: system });
      await page.locator('[data-theme-toggle]').click();
      expect(await colors()).toEqual(['#f4f1e8', '#242424']);
      expect(
        await page.locator('meta[name="color-scheme"]').getAttribute('content'),
      ).toBe('light dark');
      await page.locator('[data-theme-toggle]').click();
      expect(await colors()).toEqual([expected, expected]);
      await page.reload();
      expect(await colors()).toEqual(['#f4f1e8', '#242424']);
      expect(
        await page.locator('meta[name="color-scheme"]').getAttribute('content'),
      ).toBe('light dark');
    },
  );

  it.each([
    ['en', 'Language switcher', 'Social links'],
    ['ru', 'Выбор языка', 'Социальные сети'],
    ['es', 'Selector de idioma', 'Redes sociales'],
  ])(
    'labels navigation in %s',
    async (
      locale: string,
      languages: string,
      social: string,
    ): Promise<void> => {
      await page.goto(`${baseUrl}/${locale}/`);
      const banner = page.getByRole('banner');
      expect(await banner.count()).toBe(1);
      expect(await banner.locator('[data-theme-toggle]').count()).toBe(1);
      expect(await page.getByRole('main').count()).toBe(1);
      expect(
        await page
          .getByRole('navigation', { name: languages, exact: true })
          .count(),
      ).toBe(1);
      const socialNav = page.getByRole('navigation', {
        name: social,
        exact: true,
      });
      expect(await socialNav.count()).toBe(1);
      expect(await socialNav.getByRole('list').count()).toBe(1);
      expect(await socialNav.getByRole('listitem').count()).toBe(4);
      await page.keyboard.press('Tab');
      expect(
        await page
          .locator(':focus')
          .evaluate((el: Element): boolean =>
            el.matches('.base-layout__skip-link'),
          ),
      ).toBe(true);
      await page.keyboard.press('Enter');
      expect(
        await page.evaluate(
          (): string | undefined => document.activeElement?.id,
        ),
      ).toBe('main-content');
    },
  );

  it.each(['light', 'dark'] as const)(
    'shows keyboard focus against the %s page background',
    async (theme: 'light' | 'dark'): Promise<void> => {
      await page.emulateMedia({ colorScheme: theme });
      for (const selector of [
        '.social-links__link',
        '.profile-header__nickname',
        '.lang-switcher__link',
      ]) {
        await page.keyboard.press('Tab');
        const element = page.locator(selector).first();
        await element.focus();
        const focus = await element.evaluate(
          (element: Element): FocusAppearance => {
            const style = getComputedStyle(element);
            return {
              visible: element.matches(':focus-visible'),
              color: style.outlineColor,
              width: style.outlineWidth,
              style: style.outlineStyle,
              background: getComputedStyle(document.documentElement)
                .backgroundColor,
            };
          },
        );
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

  it.each(layoutViewports)(
    'keeps content stable while theme controls initialize at $width×$height',
    async ({ width, height }: Viewport): Promise<void> => {
      await page.setViewportSize({ width, height });
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

  it('matches the language hover and keyboard highlight on the theme toggle', async (): Promise<void> => {
    const button = page.locator('[data-theme-toggle]');
    const language = page.locator('.lang-switcher__link').first();
    const appearance = (selector: string): Promise<Record<string, string>> =>
      page
        .locator(selector)
        .first()
        .evaluate((element: HTMLElement): Record<string, string> => {
          const marker = getComputedStyle(element, '::before');
          return {
            color: getComputedStyle(element).color,
            background: marker.backgroundColor,
            scale: marker.scale,
            duration: marker.transitionDuration,
            property: marker.transitionProperty,
          };
        });
    const initial = await appearance('[data-theme-toggle]');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await language.hover();
    await expect
      .poll(
        async (): Promise<string> =>
          (await appearance('.lang-switcher__link')).scale,
      )
      .toBe('1');
    const highlight = await appearance('.lang-switcher__link');
    expect(highlight.background).toBe('rgb(213, 220, 244)');
    expect(highlight.duration).toBe('0.2s');
    await button.hover();
    await expect
      .poll(() => appearance('[data-theme-toggle]'))
      .toEqual(highlight);
    expect(highlight.scale).not.toBe(initial.scale);
    await page.mouse.move(0, 0);
    await page.keyboard.press('Tab');
    await button.focus();
    await expect
      .poll(() => appearance('[data-theme-toggle]'))
      .toEqual(highlight);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect((await appearance('[data-theme-toggle]')).duration).toBe('0s');
    expect(
      await button.evaluate(
        (element: HTMLElement): string =>
          getComputedStyle(element).transitionProperty,
      ),
    ).toContain('color');
  });

  it.each(['en', 'ru', 'es'] as const)(
    'reveals manual theme changes from top to bottom in %s',
    async (locale: string): Promise<void> => {
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.goto(`${baseUrl}/${locale === 'en' ? '' : `${locale}/`}`);
      await page.locator('[data-theme-toggle]').waitFor({ state: 'visible' });
      for (const expectedTheme of ['dark', null] as const) {
        await page.locator('[data-theme-toggle]').click();
        await expect
          .poll((): Promise<boolean> =>
            page.evaluate((): boolean =>
              document
                .getAnimations()
                .some(
                  (animation: Animation): boolean =>
                    animation instanceof CSSAnimation &&
                    animation.animationName === 'theme-toggle-reveal',
                ),
            ),
          )
          .toBe(true);
        const reveal = await page.evaluate(() => {
          const animation = document
            .getAnimations()
            .find(
              (candidate: Animation): boolean =>
                candidate instanceof CSSAnimation &&
                candidate.animationName === 'theme-toggle-reveal',
            );
          return {
            duration: animation?.effect?.getTiming().duration,
            clips:
              animation?.effect instanceof KeyframeEffect
                ? animation.effect
                    .getKeyframes()
                    .map(
                      (keyframe: ComputedKeyframe): unknown =>
                        keyframe.clipPath,
                    )
                : [],
          };
        });
        expect(reveal).toEqual({
          duration: 280,
          clips: ['inset(0px 0px 100%)', 'inset(0px)'],
        });
        await page.evaluate(async (): Promise<void> => {
          await Promise.all(
            document
              .getAnimations()
              .map(
                (animation: Animation): Promise<Animation> =>
                  animation.finished,
              ),
          );
        });
        expect(await page.getAttribute('html', 'data-theme')).toBe(
          expectedTheme,
        );
        expect(
          await page
            .locator('meta[name="color-scheme"]')
            .getAttribute('content'),
        ).toBe(expectedTheme ?? 'light dark');
      }
    },
  );

  it.each(['light', 'dark'] as const)(
    'updates the theme icon after touch taps from %s without a sticky highlight',
    async (system: 'light' | 'dark'): Promise<void> => {
      const mobile = await browser.newPage({
        viewport: { width: 375, height: 812 },
        isMobile: true,
        hasTouch: true,
        colorScheme: system,
        reducedMotion: 'no-preference',
      });
      try {
        await mobile.goto(baseUrl);
        const button = mobile.locator('[data-theme-toggle]');
        await button.waitFor({ state: 'visible' });
        for (const dark of [system === 'light', system === 'dark']) {
          await button.tap();
          await expect
            .poll((): Promise<string | null> =>
              button.getAttribute('aria-pressed'),
            )
            .toBe(String(dark));
          await expect
            .poll((): Promise<string> =>
              button
                .locator('span')
                .evaluate(
                  (icon: HTMLElement): string => getComputedStyle(icon).color,
                ),
            )
            .toBe(dark ? 'rgb(246, 240, 223)' : 'rgb(36, 36, 36)');
          expect(
            await button.evaluate(
              (element: HTMLElement): string =>
                getComputedStyle(element, '::before').scale,
            ),
          ).toBe('1 0');
        }
      } finally {
        await mobile.close();
      }
    },
  );

  it('keeps the last theme after rapid toggle clicks', async (): Promise<void> => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page
      .locator('[data-theme-toggle]')
      .evaluate((button: HTMLButtonElement): void => {
        button.click();
        button.click();
      });
    await expect
      .poll((): Promise<string | null> =>
        page.getAttribute('html', 'data-theme'),
      )
      .toBeNull();
    expect(
      await page.locator('meta[name="color-scheme"]').getAttribute('content'),
    ).toBe('light dark');
    expect(
      await page.locator('[data-theme-toggle]').getAttribute('aria-pressed'),
    ).toBe('false');
  });

  it.each(['reduced motion', 'unsupported API'])(
    'switches themes immediately with %s',
    async (fallback: string): Promise<void> => {
      if (fallback === 'unsupported API') {
        await page.emulateMedia({ reducedMotion: 'no-preference' });
        await page.evaluate((): void => {
          Object.defineProperty(document, 'startViewTransition', {
            value: undefined,
            configurable: true,
          });
        });
      }
      await page.locator('[data-theme-toggle]').click();
      expect(await page.getAttribute('html', 'data-theme')).toBe('dark');
      expect(
        await page.evaluate((): boolean =>
          document
            .getAnimations()
            .some(
              (animation: Animation): boolean =>
                animation instanceof CSSAnimation,
            ),
        ),
      ).toBe(false);
    },
  );

  it('loads a new document on locale navigation and resets the temporary theme', async (): Promise<void> => {
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
    await page.locator('a[data-lang="en"]').click();
    await page.waitForURL(`${baseUrl}/`);
  });

  it('follows system theme changes until a preference is selected', async (): Promise<void> => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await expect
      .poll((): Promise<string | null> =>
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
    expect(
      await page.locator('meta[name="color-scheme"]').getAttribute('content'),
    ).toBe('light');
    await page.emulateMedia({ colorScheme: 'light' });
    await page.emulateMedia({ colorScheme: 'dark' });
    expect(await page.getAttribute('html', 'data-theme')).toBe('light');
    // Toggling back to match the OS dark scheme resumes following OS changes.
    await page.locator('[data-theme-toggle]').click();
    expect(await page.getAttribute('html', 'data-theme')).toBeNull();
    expect(
      await page.locator('meta[name="color-scheme"]').getAttribute('content'),
    ).toBe('light dark');
    expect(
      await page
        .locator('meta[name="theme-color"]')
        .evaluateAll((metas: HTMLMetaElement[]): string[] =>
          metas.map((meta: HTMLMetaElement): string => meta.content),
        ),
    ).toEqual(['#f4f1e8', '#242424']);
    await page.emulateMedia({ colorScheme: 'light' });
    await expect
      .poll((): Promise<string | null> =>
        page.locator('[data-theme-toggle]').getAttribute('aria-pressed'),
      )
      .toBe('false');
    await page.emulateMedia({ colorScheme: 'dark' });
    await expect
      .poll((): Promise<string | null> =>
        page.locator('[data-theme-toggle]').getAttribute('aria-pressed'),
      )
      .toBe('true');
  });

  it.each([
    { width: 320, fontSize: 16 },
    { width: 375, fontSize: 16 },
    { width: 320, fontSize: 20 },
    { width: 375, fontSize: 20 },
  ])(
    'keeps mobile tooltips clear at $width px with a $fontSize px base font',
    async ({
      width,
      fontSize,
    }: {
      width: number;
      fontSize: number;
    }): Promise<void> => {
      await page.setViewportSize({ width, height: 812 });
      for (const locale of ['en', 'ru', 'es']) {
        await page.goto(`${baseUrl}/${locale}/`);
        await page
          .locator('html')
          .evaluate((html: HTMLElement, size: number): void => {
            html.style.fontSize = `${size}px`;
          }, fontSize);
        await page.locator('[data-theme-toggle]').waitFor({ state: 'visible' });
        expect(
          await page.evaluate(
            (): boolean => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        expect(await page.locator('.social-links__link').count()).toBe(4);
        const columns = await page
          .locator('.social-links__list')
          .evaluate(
            (list: Element): number =>
              getComputedStyle(list).gridTemplateColumns.split(' ').length,
          );
        expect(columns).toBe(width === 375 && fontSize === 16 ? 2 : 1);
        const nickname = page.locator('.profile-header__nickname');
        await nickname.focus();
        expect(await page.locator('[role="tooltip"]').isVisible()).toBe(true);
        const tooltip = await page.locator('[role="tooltip"]').boundingBox();
        const controls = await page
          .locator('.base-layout__controls')
          .boundingBox();
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

  it.each(duoViewports)(
    'fits the iPhone Duo $name screen at $width×$height',
    async ({ width, height, fits }: DuoViewport): Promise<void> => {
      await page.setViewportSize({ width, height });
      for (const locale of ['en', 'ru', 'es']) {
        await page.goto(`${baseUrl}/${locale}/`);
        await page.locator('[data-theme-toggle]').waitFor({ state: 'visible' });
        const overflow = await page.evaluate((): Viewport => ({
          width:
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
          height:
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight,
        }));
        expect(overflow.width).toBe(0);
        if (fits) expect(overflow.height).toBe(0);
        const targets = await page
          .locator(
            '.lang-switcher__current, .lang-switcher__link, [data-theme-toggle]',
          )
          .evaluateAll((elements: Element[]): Viewport[] =>
            elements.map((element: Element): Viewport => {
              const { width, height } = element.getBoundingClientRect();
              return { width, height };
            }),
          );
        expect(targets).toHaveLength(4);
        for (const target of targets) {
          expect(target.width).toBeGreaterThanOrEqual(44);
          expect(target.height).toBeGreaterThanOrEqual(44);
        }
      }
    },
  );

  it('dismisses the nickname tooltip with Escape and restores it on refocus', async (): Promise<void> => {
    const nickname = page.locator('.profile-header__nickname');
    const tooltip = page.locator('[role="tooltip"]');
    await nickname.focus();
    expect(await tooltip.isVisible()).toBe(true);
    expect(await nickname.getAttribute('aria-expanded')).toBe('true');
    await page.keyboard.press('Escape');
    expect(await tooltip.isVisible()).toBe(false);
    expect(await nickname.getAttribute('aria-expanded')).toBe('false');
    expect(
      await nickname.evaluate(
        (element: Element): boolean => element === document.activeElement,
      ),
    ).toBe(true);
    await nickname.blur();
    await nickname.focus();
    expect(await tooltip.isVisible()).toBe(true);
    expect(await nickname.getAttribute('aria-expanded')).toBe('true');
    await nickname.blur();
    expect(await tooltip.isVisible()).toBe(false);
    expect(await nickname.getAttribute('aria-expanded')).toBe('false');
    await nickname.click();
    expect(await tooltip.isVisible()).toBe(true);
    expect(await nickname.getAttribute('aria-expanded')).toBe('true');
    await nickname.click();
    expect(await tooltip.isVisible()).toBe(false);
    expect(await nickname.getAttribute('aria-expanded')).toBe('false');
  });

  it.each([
    { system: 'light', saved: 'dark', pressed: 'false' },
    { system: 'dark', saved: 'light', pressed: 'true' },
  ] as const)(
    'uses the $system system theme despite an old $saved saved preference',
    async ({
      system,
      saved,
      pressed,
    }: {
      system: 'light' | 'dark';
      saved: 'light' | 'dark';
      pressed: string;
    }): Promise<void> => {
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

  it('preserves visible indicators in forced-colors mode', async (): Promise<void> => {
    try {
      await page.emulateMedia({ forcedColors: 'active' });
      const currentDecoration = await page
        .locator('.lang-switcher__current')
        .evaluate(
          (el: Element): string => getComputedStyle(el).textDecorationLine,
        );
      expect(currentDecoration).toBe('underline');

      const toggleBorder = await page
        .locator('[data-theme-toggle]')
        .evaluate((el: Element): { style: string; width: string } => {
          const style = getComputedStyle(el);
          return { style: style.borderTopStyle, width: style.borderTopWidth };
        });
      expect(toggleBorder).toEqual({ style: 'solid', width: '1px' });

      await page.keyboard.press('Tab');
      const skipBorder = await page
        .locator('.base-layout__skip-link')
        .evaluate((el: Element): { style: string; width: string } => {
          const style = getComputedStyle(el);
          return { style: style.borderTopStyle, width: style.borderTopWidth };
        });
      expect(skipBorder).toEqual({ style: 'solid', width: '2px' });

      const langLink = page.locator('.lang-switcher__link').first();
      await langLink.focus();
      const langFocus = await langLink.evaluate(
        (
          el: Element,
        ): {
          decoration: string;
          outlineStyle: string;
          outlineWidth: string;
        } => {
          const style = getComputedStyle(el);
          return {
            decoration: style.textDecorationLine,
            outlineStyle: style.outlineStyle,
            outlineWidth: style.outlineWidth,
          };
        },
      );
      expect(langFocus).toEqual({
        decoration: 'underline',
        outlineStyle: 'solid',
        outlineWidth: '3px',
      });
    } finally {
      await page.emulateMedia({ forcedColors: 'none' });
    }
  });

  it('toggles the nickname tooltip by tap and dismisses on outside tap on touch devices', async (): Promise<void> => {
    const mobile = await browser.newPage({
      viewport: { width: 375, height: 812 },
      isMobile: true,
      hasTouch: true,
    });
    try {
      await mobile.goto(baseUrl);
      await mobile.locator('[data-theme-toggle]').waitFor({ state: 'visible' });
      const nickname = mobile.locator('.profile-header__nickname');
      const tooltip = mobile.locator('[role="tooltip"]');

      expect(await tooltip.isVisible()).toBe(false);
      expect(await nickname.getAttribute('aria-expanded')).toBe('false');

      await nickname.tap();
      expect(await tooltip.isVisible()).toBe(true);
      expect(await nickname.getAttribute('aria-expanded')).toBe('true');

      await mobile.locator('.profile-header__title').tap();
      expect(await tooltip.isVisible()).toBe(false);
      expect(await nickname.getAttribute('aria-expanded')).toBe('false');

      await nickname.tap();
      expect(await tooltip.isVisible()).toBe(true);
      expect(await nickname.getAttribute('aria-expanded')).toBe('true');

      await nickname.tap();
      expect(await tooltip.isVisible()).toBe(false);
      expect(await nickname.getAttribute('aria-expanded')).toBe('false');
    } finally {
      await mobile.close();
    }
  });
});
