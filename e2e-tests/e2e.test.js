const { test } = require('node:test');
const assert = require('node:assert');
const puppeteer = require('puppeteer');

const HomePageObject = require('./HomePage');

test('Home page available', async (t) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process', // <- this one doesn't work in Windows
      '--disable-gpu'
    ]
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
      assert(element, `${link.text} link should be present`);

      const text = await homePage.getLinkText(element);
      assert(
        text.includes(link.text),
        `${link.text} link should have correct text`,
      );
    }
  });

  await browser.close();
});
