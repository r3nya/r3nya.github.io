// @vitest-environment node
import { describe, it, expect } from 'vitest';
import SocialLinks from '../components/SocialLinks.astro';
import { renderAstroComponent } from './helpers';
import { messages } from '../i18n/messages';

describe('SocialLinks', () => {
  it('renders with English links', async () => {
    const result = await renderAstroComponent(SocialLinks, {
      props: {
        links: messages.en.links,
        label: messages.en.social_links,
      },
    });

    expect(result.innerHTML).toMatchSnapshot();
  });

  it('renders with Russian links', async () => {
    const result = await renderAstroComponent(SocialLinks, {
      props: {
        links: messages.ru.links,
        label: messages.ru.social_links,
      },
    });

    expect(result.innerHTML).toMatchSnapshot();
  });

  it('renders with Spanish links', async () => {
    const result = await renderAstroComponent(SocialLinks, {
      props: {
        links: messages.es.links,
        label: messages.es.social_links,
      },
    });

    expect(result.innerHTML).toMatchSnapshot();
  });
});
