import { experimental_AstroContainer as AstroContainer } from 'astro/container';

function cleanAstroAttributes(html: string): string {
  // Remove Astro development attributes that contain absolute file paths
  // These attributes would cause snapshot tests to fail in CI/cloud environments
  // where file paths differ from local development machines
  return html
    .replace(/\s*data-astro-source-file="[^"]*"/g, '')
    .replace(/\s*data-astro-source-loc="[^"]*"/g, '');
}

export async function renderAstroComponent(Component: any, options: any = {}) {
  const container = await AstroContainer.create();
  const result = await container.renderToString(Component, options);

  const div = document.createElement('div');
  div.innerHTML = cleanAstroAttributes(result);
  document.body.appendChild(div);
  
  return div;
}