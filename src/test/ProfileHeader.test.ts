// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import ProfileHeader from '../components/ProfileHeader.astro';
import { renderAstroComponent } from './helpers';

describe('ProfileHeader', () => {
  it('renders with English props', async () => {
    const result = await renderAstroComponent(ProfileHeader, {
      props: {
        name: 'Andrey Makarov',
        headline: 'Software Developer 👨‍💻',
      },
    });

    expect(result.innerHTML).toMatchSnapshot();
  });

  it('renders with Russian props', async () => {
    const result = await renderAstroComponent(ProfileHeader, {
      props: {
        name: 'Андрей Макаров',
        headline: 'Разработчик ПО 👨‍💻',
      },
    });

    expect(result.innerHTML).toMatchSnapshot();
  });

  it('renders with Spanish props', async () => {
    const result = await renderAstroComponent(ProfileHeader, {
      props: {
        name: 'Andrey Makárov',
        headline: 'Desarrollador 👨‍💻',
      },
    });

    expect(result.innerHTML).toMatchSnapshot();
  });
});
