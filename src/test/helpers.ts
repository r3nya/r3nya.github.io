import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { Window, type HTMLDivElement } from 'happy-dom';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../../', import.meta.url));

function cleanAstroAttributes(html: string): string {
  // Remove Astro development attributes that contain absolute file paths
  // These attributes would cause snapshot tests to fail in CI/cloud environments
  // where file paths differ from local development machines
  return html
    .replace(/\s*data-astro-source-file="[^"]*"/g, '')
    .replace(/\s*data-astro-source-loc="[^"]*"/g, '');
}

// Shared happy-dom window for DOM queries (avoids creating a new window per test)
const happyWindow = new Window();

export async function renderAstroComponent(
  Component: Parameters<AstroContainer['renderToString']>[0],
  options: Parameters<AstroContainer['renderToString']>[1] = {},
): Promise<HTMLDivElement> {
  const container = await AstroContainer.create();
  const result = await container.renderToString(Component, options);

  const div = happyWindow.document.createElement('div');
  div.innerHTML = cleanAstroAttributes(result);
  // Astro's development script URLs include the checkout's absolute path.
  for (const script of div.querySelectorAll('script[src]')) {
    const src = script.getAttribute('src');
    if (src?.startsWith(projectRoot)) {
      script.setAttribute('src', `/${src.slice(projectRoot.length)}`);
    }
  }
  return div;
}
