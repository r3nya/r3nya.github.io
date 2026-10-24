import { afterEach, describe, expect, inject, it } from 'vitest';
import { page, server } from 'vitest/browser';

declare module 'vitest/browser' {
  interface BrowserCommands {
    prepareHomepage(theme: 'light' | 'dark'): Promise<void>;
  }
}

describe('HomePage visual regression', () => {
  afterEach((): void => {
    document.body.replaceChildren();
  });

  it.each([
    { name: 'en', path: '/en/', width: 1280, height: 720, theme: 'light' },
    { name: 'ru', path: '/ru/', width: 1280, height: 720, theme: 'light' },
    { name: 'es', path: '/es/', width: 1280, height: 720, theme: 'light' },
    { name: 'default', path: '/', width: 1280, height: 720, theme: 'light' },
    {
      name: 'mobile-dark',
      path: '/es/',
      width: 375,
      height: 812,
      theme: 'dark',
    },
  ] as const)(
    'matches $name snapshot',
    async ({ name, path, width, height, theme }) => {
      await page.viewport(width, height);
      document.body.style.margin = '0';
      const site = document.createElement('iframe');
      site.dataset.testid = 'homepage';
      site.title = 'Built homepage';
      site.style.cssText = `display:block;border:0;width:${width}px;height:${height}px`;
      site.src = new URL(path, inject('siteUrl')).href;
      document.body.append(site);
      await server.commands.prepareHomepage(theme);
      await expect(page.getByTestId('homepage')).toMatchScreenshot(
        `homepage-${name}`,
      );
    },
  );
});
