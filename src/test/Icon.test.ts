// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import Icon from '../components/Icon.astro';
import { renderAstroComponent } from './helpers';

describe('Icon', () => {
  it('renders github icon', async () => {
    const result = await renderAstroComponent(Icon, {
      props: {
        name: 'github',
      },
    });

    expect(result.innerHTML).toMatchSnapshot();
  });

  it('renders linkedin icon', async () => {
    const result = await renderAstroComponent(Icon, {
      props: {
        name: 'linkedin',
      },
    });

    expect(result.innerHTML).toMatchSnapshot();
  });

  it('renders paper-plane icon', async () => {
    const result = await renderAstroComponent(Icon, {
      props: {
        name: 'paper-plane',
      },
    });

    expect(result.innerHTML).toMatchSnapshot();
  });

  it('renders twitter icon', async () => {
    const result = await renderAstroComponent(Icon, {
      props: {
        name: 'twitter',
      },
    });

    expect(result.innerHTML).toMatchSnapshot();
  });

  it('renders with custom className', async () => {
    const result = await renderAstroComponent(Icon, {
      props: {
        name: 'github',
        className: 'w-4 h-4 custom-class',
      },
    });

    expect(result.innerHTML).toMatchSnapshot();
  });
});