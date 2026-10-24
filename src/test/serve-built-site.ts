import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { extname, resolve, sep } from 'node:path';
import type { TestProject } from 'vitest/node';

declare module 'vitest' {
  interface ProvidedContext {
    siteUrl: string;
  }
}

export default async function setup(
  project: TestProject,
): Promise<() => Promise<void>> {
  const root = resolve('dist');
  // Fail before starting the browser if the production build is missing.
  readFileSync(resolve(root, 'index.html'));
  const contentTypes: Record<string, string> = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.ico': 'image/x-icon',
  };
  const server = createServer((request, response): void => {
    const pathname = new URL(request.url ?? '/', 'http://localhost').pathname;
    const file = resolve(
      root,
      `.${pathname}${pathname.endsWith('/') ? 'index.html' : ''}`,
    );
    if (!file.startsWith(root + sep)) {
      response.writeHead(404).end();
      return;
    }
    try {
      const body = readFileSync(file);
      response.writeHead(200, {
        'Content-Type':
          contentTypes[extname(file)] ?? 'application/octet-stream',
      });
      response.end(body);
    } catch {
      response.writeHead(404).end();
    }
  });
  await new Promise<void>((resolve, reject): void => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  if (!address || typeof address === 'string')
    throw new Error('Missing test server port');
  project.provide('siteUrl', `http://127.0.0.1:${address.port}`);
  return async (): Promise<void> => {
    await new Promise<void>((resolve, reject): void => {
      server.close((error?: Error): void =>
        error ? reject(error) : resolve(),
      );
    });
  };
}
