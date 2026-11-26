import type { Locator, Page, Response } from 'playwright';

type MediaOptions = Parameters<Page['emulateMedia']>[0];

export interface Overflow {
  width: number;
  height: number;
}

export class HomePageObject {
  readonly themeToggle: Locator;
  readonly snowToggle: Locator;
  readonly snowFall: Locator;
  readonly snowFlakes: Locator;
  readonly skipLink: Locator;
  readonly controls: Locator;
  readonly banner: Locator;
  readonly main: Locator;
  readonly langSwitcher: Locator;
  readonly currentLang: Locator;
  readonly langLinks: Locator;
  readonly nickname: Locator;
  readonly tooltip: Locator;
  readonly profileHeader: Locator;
  readonly profileTitle: Locator;
  readonly socialLinksList: Locator;
  readonly socialLinks: Locator;

  constructor(
    readonly page: Page,
    private readonly baseUrl: string,
  ) {
    this.themeToggle = page.locator('[data-theme-toggle]');
    this.snowToggle = page.locator('[data-snow-toggle]');
    this.snowFall = page.locator('snow-fall');
    this.snowFlakes = this.snowFall.locator('div');
    this.skipLink = page.locator('.base-layout__skip-link');
    this.controls = page.locator('.base-layout__controls');
    this.banner = page.getByRole('banner');
    this.main = page.getByRole('main');
    this.langSwitcher = page.locator('[data-testid="lang-switcher"]');
    this.currentLang = page.locator('.lang-switcher__current');
    this.langLinks = page.locator('.lang-switcher__link');
    this.nickname = page.locator('.profile-header__nickname');
    this.tooltip = page.locator('[role="tooltip"]');
    this.profileHeader = page.locator('.profile-header');
    this.profileTitle = page.locator('.profile-header__title');
    this.socialLinksList = page.locator('.social-links__list');
    this.socialLinks = page.locator('.social-links__link');
  }

  langLink(code: string): Locator {
    return this.page.locator(`.lang-switcher__link[data-lang="${code}"]`);
  }

  socialLink(index: number): Locator {
    return this.page.locator(
      `.social-links__item:nth-child(${index + 1}) .social-links__link`,
    );
  }

  navigation(name: string): Locator {
    return this.page.getByRole('navigation', { name, exact: true });
  }

  async goto(path = '/'): Promise<Response | null> {
    const response = await this.page.goto(`${this.baseUrl}${path}`);
    await this.themeToggle.waitFor({ state: 'visible' });
    return response;
  }

  async reload(): Promise<void> {
    await this.page.reload();
    await this.themeToggle.waitFor({ state: 'visible' });
  }

  async setMedia(options: MediaOptions): Promise<void> {
    await this.page.emulateMedia(options);
  }

  async setViewport(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({ width, height });
  }

  async setRootFontSize(px: number | null): Promise<void> {
    await this.page
      .locator('html')
      .evaluate((html: HTMLElement, size: number | null): void => {
        if (size === null) {
          html.style.removeProperty('font-size');
        } else {
          html.style.fontSize = `${size}px`;
        }
      }, px);
  }

  async toggleTheme(): Promise<void> {
    await this.themeToggle.click();
  }

  async getThemeAttr(): Promise<string | null> {
    return this.page.getAttribute('html', 'data-theme');
  }

  async getColorSchemeMeta(): Promise<string | null> {
    return this.page
      .locator('meta[name="color-scheme"]')
      .getAttribute('content');
  }

  async getThemeColors(): Promise<string[]> {
    return this.page
      .locator('meta[name="theme-color"]')
      .evaluateAll((metas: HTMLMetaElement[]): string[] =>
        metas.map((meta: HTMLMetaElement): string => meta.content),
      );
  }

  async getSocialColumns(): Promise<number> {
    return this.socialLinksList.evaluate(
      (list: Element): number =>
        getComputedStyle(list).gridTemplateColumns.split(' ').length,
    );
  }

  async getOverflow(): Promise<Overflow> {
    return this.page.evaluate((): Overflow => ({
      width:
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
      height:
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight,
    }));
  }

  async hasCssAnimation(name?: string): Promise<boolean> {
    return this.page.evaluate((animationName?: string): boolean => {
      return document
        .getAnimations()
        .some(
          (animation: Animation): boolean =>
            animation instanceof CSSAnimation &&
            (animationName === undefined ||
              animation.animationName === animationName),
        );
    }, name);
  }

  async waitForAnimations(): Promise<void> {
    await this.page.evaluate(async (): Promise<void> => {
      await Promise.all(
        document
          .getAnimations()
          .map(
            (animation: Animation): Promise<Animation> => animation.finished,
          ),
      );
    });
  }
}
