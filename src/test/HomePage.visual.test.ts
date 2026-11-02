import { afterEach, describe, expect, inject, it } from 'vitest';
import { page, server } from 'vitest/browser';

declare module 'vitest/browser' {
  interface BrowserCommands {
    prepareHomepage(
      theme: 'light' | 'dark',
      allowVerticalScroll: boolean,
    ): Promise<void>;
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
    // iPhone Duo CSS-pixel viewports.
    {
      name: 'duo-outer-portrait',
      path: '/',
      width: 382,
      height: 580,
      theme: 'light',
    },
    {
      name: 'duo-outer-landscape',
      path: '/',
      width: 594,
      height: 368,
      theme: 'light',
      // The ≤600 px layout is taller than the outer landscape screen.
      allowVerticalScroll: true,
    },
    {
      name: 'duo-inner-portrait',
      path: '/',
      width: 669,
      height: 867,
      theme: 'light',
    },
    {
      name: 'duo-inner-landscape',
      path: '/',
      width: 951,
      height: 585,
      theme: 'light',
    },
    {
      name: 'duo-split',
      path: '/',
      width: 385,
      height: 571,
      theme: 'light',
    },
  ] as const)(
    'matches $name snapshot',
    async ({ name, path, width, height, theme, ...options }) => {
      await page.viewport(width, height);
      document.body.style.margin = '0';
      const site = document.createElement('iframe');
      site.dataset.testid = 'homepage';
      site.title = 'Built homepage';
      site.style.cssText = `display:block;border:0;width:${width}px;height:${height}px`;
      site.src = new URL(path, inject('siteUrl')).href;
      document.body.append(site);
      await server.commands.prepareHomepage(
        theme,
        'allowVerticalScroll' in options,
      );
      await expect(page.getByTestId('homepage')).toMatchScreenshot(
        `homepage-${name}`,
      );
    },
  );
});
