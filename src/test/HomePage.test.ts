// @vitest-environment node
import { describe, it, expect } from 'vitest';
import HomePage from '../components/HomePage.astro';
import { renderAstroComponent } from './helpers';
import { messages } from '../i18n/messages';

describe('HomePage', () => {
  describe('English locale', () => {
    it('renders correct title and meta tags', async () => {
      const result = await renderAstroComponent(HomePage, {
        props: {
          locale: 'en',
        },
      });

      const html = result.innerHTML;
      const t = messages.en;

      expect(html).toContain(`<title>${t.title}</title>`);

      expect(html).toContain(`<meta property="og:title" content="${t.title}">`);
      expect(html).toContain(
        `<meta name="twitter:title" content="${t.title}">`,
      );
    });

    it('renders correct header content', async () => {
      const result = await renderAstroComponent(HomePage, {
        props: {
          locale: 'en',
        },
      });

      const header = result.querySelector('.profile-header');
      expect(header).toBeTruthy();

      const title = header?.querySelector('.profile-header__title');
      expect(title?.textContent?.trim()).toBe(messages.en.name);

      const headline = header?.querySelector('.profile-header__headline');
      expect(headline?.textContent?.trim()).toBe(messages.en.headline);
    });

    it('renders correct skip link text', async () => {
      const result = await renderAstroComponent(HomePage, {
        props: {
          locale: 'en',
        },
      });

      const skipLink = result.querySelector('.base-layout__skip-link');
      expect(skipLink?.textContent?.trim()).toBe(messages.en.skip_to_content);
    });

    it('renders correct language switcher', async () => {
      const result = await renderAstroComponent(HomePage, {
        props: {
          locale: 'en',
        },
      });

      const langSwitcher = result.querySelector(
        '[data-testid="lang-switcher"]',
      );
      const currentLang = langSwitcher?.querySelector('[aria-current="true"]');
      expect(currentLang?.getAttribute('data-lang')).toBe('en');
      expect(currentLang?.textContent?.trim()).toBe('en');
    });

    it('renders social links correctly', async () => {
      const result = await renderAstroComponent(HomePage, {
        props: {
          locale: 'en',
        },
      });

      const socialLinks = result.querySelectorAll('.social-links__link');
      expect(socialLinks).toHaveLength(4);

      messages.en.links.forEach((link, index) => {
        const linkElement = socialLinks[index];
        expect(linkElement?.getAttribute('href')).toBe(link.url);
        expect(linkElement?.getAttribute('aria-label')).toBe(link.title);
        expect(
          linkElement
            ?.querySelector('.social-links__title')
            ?.textContent?.trim(),
        ).toBe(link.title);
      });
    });

    it('renders profile header section snapshot', async () => {
      const result = await renderAstroComponent(HomePage, {
        props: {
          locale: 'en',
        },
      });

      const header = result.querySelector('.profile-header');
      expect(header?.outerHTML).toMatchSnapshot();
    });
  });

  describe('Russian locale', () => {
    it('renders correct title and meta tags', async () => {
      const result = await renderAstroComponent(HomePage, {
        props: {
          locale: 'ru',
        },
      });

      const html = result.innerHTML;
      const t = messages.ru;

      expect(html).toContain(`<title>${t.title}</title>`);

      expect(html).toContain(`<meta property="og:title" content="${t.title}">`);
      expect(html).toContain(
        `<meta name="twitter:title" content="${t.title}">`,
      );
    });

    it('renders correct header content', async () => {
      const result = await renderAstroComponent(HomePage, {
        props: {
          locale: 'ru',
        },
      });

      const header = result.querySelector('.profile-header');
      expect(header).toBeTruthy();

      const title = header?.querySelector('.profile-header__title');
      expect(title?.textContent?.trim()).toBe(messages.ru.name);

      const headline = header?.querySelector('.profile-header__headline');
      expect(headline?.textContent?.trim()).toBe(messages.ru.headline);
    });

    it('renders correct skip link text', async () => {
      const result = await renderAstroComponent(HomePage, {
        props: {
          locale: 'ru',
        },
      });

      const skipLink = result.querySelector('.base-layout__skip-link');
      expect(skipLink?.textContent?.trim()).toBe(messages.ru.skip_to_content);
    });

    it('renders correct language switcher', async () => {
      const result = await renderAstroComponent(HomePage, {
        props: {
          locale: 'ru',
        },
      });

      const langSwitcher = result.querySelector(
        '[data-testid="lang-switcher"]',
      );
      const currentLang = langSwitcher?.querySelector('[aria-current="true"]');
      expect(currentLang?.getAttribute('data-lang')).toBe('ru');
      expect(currentLang?.textContent?.trim()).toBe('ru');
    });

    it('renders profile header section snapshot', async () => {
      const result = await renderAstroComponent(HomePage, {
        props: {
          locale: 'ru',
        },
      });

      const header = result.querySelector('.profile-header');
      expect(header?.outerHTML).toMatchSnapshot();
    });
  });

  describe('Spanish locale', () => {
    it('renders correct title and meta tags', async () => {
      const result = await renderAstroComponent(HomePage, {
        props: {
          locale: 'es',
        },
      });

      const html = result.innerHTML;
      const t = messages.es;

      expect(html).toContain(`<title>${t.title}</title>`);

      expect(html).toContain(`<meta property="og:title" content="${t.title}">`);
      expect(html).toContain(
        `<meta name="twitter:title" content="${t.title}">`,
      );
    });

    it('renders correct header content', async () => {
      const result = await renderAstroComponent(HomePage, {
        props: {
          locale: 'es',
        },
      });

      const header = result.querySelector('.profile-header');
      expect(header).toBeTruthy();

      const title = header?.querySelector('.profile-header__title');
      expect(title?.textContent?.trim()).toBe(messages.es.name);

      const headline = header?.querySelector('.profile-header__headline');
      expect(headline?.textContent?.trim()).toBe(messages.es.headline);
    });

    it('renders correct skip link text', async () => {
      const result = await renderAstroComponent(HomePage, {
        props: {
          locale: 'es',
        },
      });

      const skipLink = result.querySelector('.base-layout__skip-link');
      expect(skipLink?.textContent?.trim()).toBe(messages.es.skip_to_content);
    });

    it('renders correct language switcher', async () => {
      const result = await renderAstroComponent(HomePage, {
        props: {
          locale: 'es',
        },
      });

      const langSwitcher = result.querySelector(
        '[data-testid="lang-switcher"]',
      );
      const currentLang = langSwitcher?.querySelector('[aria-current="true"]');
      expect(currentLang?.getAttribute('data-lang')).toBe('es');
      expect(currentLang?.textContent?.trim()).toBe('es');
    });

    it('renders profile header section snapshot', async () => {
      const result = await renderAstroComponent(HomePage, {
        props: {
          locale: 'es',
        },
      });

      const header = result.querySelector('.profile-header');
      expect(header?.outerHTML).toMatchSnapshot();
    });
  });
});
