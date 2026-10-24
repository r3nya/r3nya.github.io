import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import type { BrowserCommandContext } from 'vitest/node';

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'behavior',
          environment: 'node',
          include: ['src/test/**/*.behavior.test.ts'],
          globalSetup: ['./src/test/serve-built-site.ts'],
        },
      },
      {
        test: {
          name: 'visual',
          include: ['src/test/**/*.visual.test.ts'],
          globalSetup: ['./src/test/serve-built-site.ts'],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({
              contextOptions: {
                colorScheme: 'light',
                reducedMotion: 'reduce',
                deviceScaleFactor: 1,
                // Keep the host window large enough to avoid scaling tall test frames.
                viewport: { width: 1280, height: 900 },
              },
            }),
            instances: [{ browser: 'chromium' }],
            viewport: { width: 1280, height: 720 },
            commands: {
              async prepareHomepage(
                { page, iframe }: BrowserCommandContext,
                theme: 'light' | 'dark',
              ): Promise<void> {
                await page.emulateMedia({ colorScheme: theme });
                const site = iframe.getByTestId('homepage').contentFrame();
                await site
                  .locator('[data-theme-toggle]')
                  .waitFor({ state: 'visible' });
                await site
                  .locator('html')
                  .evaluate(async (html): Promise<void> => {
                    await html.ownerDocument.fonts.ready;
                    if (
                      html.scrollHeight > html.clientHeight ||
                      html.scrollWidth > html.clientWidth
                    ) {
                      throw new Error(
                        'Homepage overflows the screenshot viewport',
                      );
                    }
                  });
              },
            },
          },
        },
      },
    ],
  },
});
