[![CodeFactor](https://www.codefactor.io/repository/github/r3nya/r3nya.github.io/badge)](https://www.codefactor.io/repository/github/r3nya/r3nya.github.io)
[![Known Vulnerabilities](https://snyk.io/test/github/r3nya/r3nya.github.io/badge.svg?targetFile=package.json)](https://snyk.io/test/github/r3nya/r3nya.github.io?targetFile=package.json)

# [My homepage](https://r3nya.ru)

Personal homepage built with Astro 7, Tailwind CSS v4, and TypeScript. Static pages in English, Russian, and Spanish are deployed to GitHub Pages.

## Local development

Use Node.js 24 from [`.nvmrc`](.nvmrc) and the pnpm 12 version pinned in [`package.json`](package.json). With nvm installed:

```bash
nvm install
nvm use
corepack enable
pnpm install --frozen-lockfile
pnpm run dev
```

The development server uses `http://localhost:4321` by default. To preview a production build:

```bash
pnpm run build
pnpm run preview
```

## Commands

| Command                       | Description                                               |
| ----------------------------- | --------------------------------------------------------- |
| `pnpm run dev`                | Start the development server                              |
| `pnpm run build`              | Generate the static site in `dist/`                       |
| `pnpm run preview`            | Serve the production build locally                        |
| `pnpm run clean`              | Remove `dist/`                                            |
| `pnpm run format`             | Format files with Prettier                                |
| `pnpm run format:check`       | Check formatting without changing files                   |
| `pnpm run test:unit`          | Run unit tests in watch mode locally, once in CI          |
| `pnpm run test:unit --run`    | Run unit tests once                                       |
| `pnpm run test:unit --run -u` | Update HTML snapshots                                     |
| `pnpm run test:visual`        | Run browser behavior and screenshot tests against `dist/` |
| `pnpm run test:visual:update` | Update visual baselines against `dist/`                   |
| `pnpm run test:e2e`           | Check the live site at `https://r3nya.ru`                 |
| `pnpm run type-check`         | Check Astro components and TypeScript files               |

## Testing

Unit tests use Vitest, the Astro Container API, and happy-dom to check component markup and HTML snapshots.

Browser tests use Playwright Chromium against the served production build. They check navigation, theme changes, keyboard behavior, and PNG screenshots through Vitest Browser Mode. The test setup starts its own HTTP server, so no preview server is needed.

```bash
pnpm run format:check
pnpm run type-check
pnpm run test:unit --run
pnpm run build
pnpm exec playwright install chromium
pnpm run test:visual
```

On Linux, Playwright may require `pnpm exec playwright install --with-deps chromium` to install browser system dependencies.

Visual baselines live in `src/test/__screenshots__/HomePage.visual.test.ts/`. Generate and compare them on the same OS and browser environment. CI runs these tests on `macos-26`. After an intentional design change, inspect the screenshots before updating baselines, then rerun `pnpm run test:visual` without update mode. Failures produce actual and diff images in `.vitest-attachments/`.

`pnpm run test:e2e` uses Node's test runner and Playwright to check the deployed site. It does not validate local changes.

Changes to the shipped site also require Lighthouse scores of 100 in Performance, Accessibility, Best Practices, and SEO for both mobile and desktop profiles. Run Lighthouse against the served production build and retain the reports with the version, URL, profiles, and scores. These are local measurements; deployed-site scores require a separate run. Documentation-only changes do not require Lighthouse or browser tests.

## Languages and themes

| Language | Routes      |
| -------- | ----------- |
| English  | `/`, `/en/` |
| Russian  | `/ru/`      |
| Spanish  | `/es/`      |

Language links use full-page navigation. Colors follow the system theme by default. The theme button applies a temporary override that resets on reload or language navigation; it does not use localStorage. System theming also works without JavaScript.

The optional snow effect is disabled by default. Set `PUBLIC_SNOW_FALL_ENABLED=true` when building to enable it.

## Project structure

| Path                    | Purpose                                         |
| ----------------------- | ----------------------------------------------- |
| `src/pages/`            | Static routes                                   |
| `src/components/`       | Shared homepage components and their CSS        |
| `src/layouts/`          | Document metadata and shared layout             |
| `src/config/site.ts`    | Site metadata and profile information           |
| `src/i18n/`             | Locale definitions and translated content       |
| `src/scripts/`          | Theme and nickname tooltip behavior             |
| `src/styles/global.css` | Tailwind import, theme tokens, and focus styles |
| `static/`               | Public assets                                   |
| `src/test/`             | Unit, browser, and visual tests                 |
| `e2e-tests/`            | Live production checks                          |

See [AGENTS.md](AGENTS.md) for component conventions, accessibility requirements, and verification guidance.

## CI and deployment

- Pull requests run formatting checks, type checks, unit tests, and a production build on Ubuntu, plus browser and visual tests on `macos-26`.
- Pushes to `develop` deploy to GitHub Pages after a build and browser and visual tests. Deployment can also run manually. The workflow enables snow for builds made from December 15 through January 15, inclusive, using UTC dates.
- Production E2E checks run every Sunday at 06:00 UTC and can also run manually.
- Failed browser and visual runs upload `visual-test-results` artifacts containing failure images and reference screenshots.
