// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import LangSwitcher from '../components/LangSwitcher.astro';
import { renderAstroComponent } from './helpers';

describe('LangSwitcher', () => {
  it('renders with English as current language', async () => {
    const result = await renderAstroComponent(LangSwitcher, {
      props: {
        current: 'en',
      },
    });

    expect(result.innerHTML).toMatchSnapshot();
  });

  it('renders with Russian as current language', async () => {
    const result = await renderAstroComponent(LangSwitcher, {
      props: {
        current: 'ru',
      },
    });

    expect(result.innerHTML).toMatchSnapshot();
  });

  it('renders with Spanish as current language', async () => {
    const result = await renderAstroComponent(LangSwitcher, {
      props: {
        current: 'es',
      },
    });

    expect(result.innerHTML).toMatchSnapshot();
  });
});
