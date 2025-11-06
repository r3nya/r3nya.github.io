import { test } from 'node:test';
import assert from 'node:assert';
import { chromium } from 'playwright';
import HomePageObject from './HomePage.js';

test('Home page available', async (t) => {
  const browser = await chromium.launch({
    headless: true,
  });
  const page = await browser.newPage();
  const homePage = new HomePageObject(page);

  await t.test('Loads successfully.', async () => {
    const response = await homePage.navigate();

    assert.equal(response.status(), 200);
  });

  await t.test('Page title is correct', async () => {
    const title = await homePage.getTitle();
    assert.equal(
      title,
      'Andrey Makarov aka r3nya',
      'Page title should be correct',
    );
  });

  await t.test('Links are present and correct', async () => {
    const expectedLinks = [
      { href: homePage.links.github, text: 'Github' },
      { href: homePage.links.linkedin, text: 'LinkedIn' },
      { href: homePage.links.telegram, text: 'Telegram' },
      { href: homePage.links.twitter, text: 'X/Twitter' },
    ];

    for (const link of expectedLinks) {
      const element = await homePage.getLinkElement(link.href);
      const count = await element.count();
      assert(count > 0, `${link.text} link should be present`);

      const text = await homePage.getLinkText(element);
      assert(
        text.includes(link.text),
        `${link.text} link should have correct text`,
      );
    }
  });

  await browser.close();
});
