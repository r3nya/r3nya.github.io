export default class HomePage {
  constructor(page) {
    this.page = page;
    this.url = 'https://r3nya.ru';
  }

  async navigate() {
    const response = await this.page.goto(this.url);
    return response;
  }

  async getTitle() {
    return await this.page.title();
  }

  async getLinkElement(href) {
    return await this.page.locator(`a[href="${href}"]`);
  }

  async getLinkText(element) {
    return await element.textContent();
  }

  links = {
    github: 'https://github.com/r3nya',
    linkedin: 'https://www.linkedin.com/in/r3nya',
    twitter: 'https://x.com/r3nya',
    telegram: 'https://t.me/r3nya',
  };
}
