import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { Window } from 'happy-dom';

interface RenderOptions {
  props?: Record<string, unknown>;
  slots?: Record<string, unknown>;
}

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
  Component: unknown,
  options: RenderOptions = {},
): Promise<HTMLDivElement> {
  const container = await AstroContainer.create();
  const result = await container.renderToString(Component, options);

  const div = happyWindow.document.createElement('div');
  div.innerHTML = cleanAstroAttributes(result);
  return div;
}
