// @vitest-environment node
import { describe, it, expect } from 'vitest';
import HomePage from '../components/HomePage.astro';
import { renderAstroComponent } from './helpers';
import { defaultLocale, locales } from '../i18n/config';
import { messages } from '../i18n/messages';

describe('HomePage', () => {
  it.each(locales)(
    'renders localized metadata, landmarks, and controls in %s',
    async (locale) => {
      const result = await renderAstroComponent(HomePage, {
        props: { locale },
      });
      const html = result.innerHTML;
      const t = messages[locale];

      expect(html).toContain(`<title>${t.title}</title>`);
      expect(html).toContain(`<meta property="og:title" content="${t.title}">`);
      expect(html).toContain(
        `<meta name="twitter:title" content="${t.title}">`,
      );
      expect(html).toContain(
        '<meta name="referrer" content="strict-origin-when-cross-origin">',
      );
      expect(html).toContain('"@context":"https://schema.org"');
      expect(html).not.toContain('http://schema.org');

      expect(result.querySelector('header.base-layout__controls')).toBeTruthy();
      const main = result.querySelector('main#main-content');
      expect(main?.getAttribute('tabindex')).toBe('-1');
      expect(main?.getAttribute('role')).toBeNull();

      const skipLink = result.querySelector('.base-layout__skip-link');
      expect(skipLink?.getAttribute('href')).toBe('#main-content');
      expect(skipLink?.textContent?.trim()).toBe(t.skip_to_content);

      expect(
        result.querySelector('.profile-header__title')?.textContent?.trim(),
      ).toBe(t.name);
      const headline = result.querySelector('p.profile-header__headline');
      expect(headline?.textContent?.trim()).toBe(t.headline);
      expect(headline?.querySelector('[aria-hidden="true"]')?.textContent).toBe(
        '👨‍💻',
      );

      const nickname = result.querySelector('.profile-header__nickname');
      expect(nickname?.tagName).toBe('BUTTON');
      expect(nickname?.getAttribute('type')).toBe('button');
      expect(nickname?.getAttribute('tabindex')).toBeNull();
      expect(nickname?.getAttribute('aria-expanded')).toBe('false');
      expect(nickname?.textContent?.trim()).toBe('r3nya');

      const tooltipId = nickname?.getAttribute('aria-describedby');
      const tooltip = result.querySelector(`[id="${tooltipId}"]`);
      expect(tooltip?.getAttribute('role')).toBe('tooltip');
      expect(tooltip?.textContent?.trim()).toBe(t.alias_label);

      const langNav = result.querySelector('[data-testid="lang-switcher"]');
      expect(langNav?.getAttribute('aria-label')).toBe(t.language_switcher);
      expect(langNav?.querySelector('ul')?.getAttribute('role')).toBeNull();
      const currentLang = langNav?.querySelector('[aria-current="true"]');
      expect(currentLang?.getAttribute('data-lang')).toBe(locale);
      expect(currentLang?.textContent?.trim()).toBe(locale);

      for (const code of locales.filter((item) => item !== locale)) {
        const link = langNav?.querySelector(`a[data-lang="${code}"]`);
        expect(link?.getAttribute('href')).toBe(
          code === defaultLocale ? '/' : `/${code}/`,
        );
        expect(link?.getAttribute('lang')).toBe(code);
        expect(link?.getAttribute('hreflang')).toBe(code);
      }

      const toggle = result.querySelector('button[data-theme-toggle]');
      expect(toggle?.getAttribute('aria-label')).toBe(t.dark_theme);
      expect(toggle?.getAttribute('aria-pressed')).toBe('false');
      expect(toggle?.hasAttribute('hidden')).toBe(true);

      const socialNav = result.querySelector('nav.social-links');
      expect(socialNav?.getAttribute('aria-label')).toBe(t.social_links);
      expect(socialNav?.querySelectorAll('ul > li')).toHaveLength(
        t.links.length,
      );

      const links = socialNav?.querySelectorAll('.social-links__link') ?? [];
      t.links.forEach((expected, index) => {
        const link = links[index];
        expect(link?.getAttribute('href')).toBe(expected.url);
        expect(link?.getAttribute('rel')).toBe('me noopener noreferrer');
        expect(link?.getAttribute('target')).toBe('_blank');
        expect(
          link?.querySelector('.social-links__title')?.textContent?.trim(),
        ).toBe(expected.title);
        expect(
          link
            ?.querySelector('.social-links__arrow')
            ?.getAttribute('aria-hidden'),
        ).toBe('true');
      });
    },
  );
});
