// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import HomePage from '../components/HomePage.astro';
import { renderAstroComponent } from './helpers';

describe('HomePage', () => {
  it('renders with English locale', async () => {
    const result = await renderAstroComponent(HomePage, {
      props: {
        locale: 'en',
      },
    });

    expect(result.innerHTML).toMatchSnapshot();
  });

  it('renders with Russian locale', async () => {
    const result = await renderAstroComponent(HomePage, {
      props: {
        locale: 'ru',
      },
    });

    expect(result.innerHTML).toMatchSnapshot();
  });

  it('renders with Spanish locale', async () => {
    const result = await renderAstroComponent(HomePage, {
      props: {
        locale: 'es',
      },
    });

    expect(result.innerHTML).toMatchSnapshot();
  });
});
