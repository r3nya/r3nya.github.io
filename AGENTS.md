# AGENTS.md

## Scope and workflow

- Do what was requested; avoid unrelated changes.
- Prefer editing existing files. Create files only when needed for the task.
- Do not create documentation or README files unless requested. Updating AGENTS.md is encouraged when repository guidance changes.
- Keep exploratory mockups separate from production code. Do not commit temporary previews or `.superpowers/` artifacts.
- Use Brave for visual previews when available, as requested by the user.
- Respect explicit requests to leave experiments uncommitted.
- Run `pnpm run format` after code changes and review the resulting diff.

## Project and tools

Personal homepage built with **Astro 7**, **Tailwind CSS v4**, and TypeScript, deployed as a static site to GitHub Pages at `https://r3nya.ru`.

- Use the Node version in `.nvmrc` (Node 24).
- Use Corepack and the pnpm version pinned in `package.json#packageManager` (pnpm 12).
- The devcontainer stays on Node 22. Its Node feature installs that same pnpm with npm (`pnpmVersion`) and installs Yarn with apt (`installYarnUsingApt`) so the container build does not run `corepack enable`.
- Install dependencies with `pnpm install --frozen-lockfile`.
- Treat `package.json`, `pnpm-lock.yaml`, and `.nvmrc` as the version sources of truth.

```bash
pnpm run dev                   # Development server, default port 4321
pnpm run build                 # Static production build in dist/
pnpm run preview               # Serve the production build
pnpm run format                # Apply Prettier formatting
pnpm run format:check          # Check formatting
pnpm run test:unit --run       # Run unit tests once
pnpm run test:unit             # Watch locally; single run in CI
pnpm run test:unit --run -u    # Update HTML snapshots intentionally
pnpm run test:visual           # Browser and visual tests; build first
pnpm run test:visual:update    # Update approved visual baselines
pnpm run test:e2e              # Checks the live production site
pnpm run clean                # Remove dist/
```

`pnpm run type-check` runs `astro check` against Astro components and TypeScript files. The checker and TypeScript versions are declared in `package.json` and locked in `pnpm-lock.yaml`; PR CI runs this check before tests and the production build.

## Source map

| Location                                        | Purpose                                                      |
| ----------------------------------------------- | ------------------------------------------------------------ |
| `src/components/HomePage.astro`                 | Composes controls, profile, contact cards, and optional snow |
| `src/layouts/BaseLayout.astro` and `.css`       | Document metadata, landmarks, shared layout                  |
| `src/components/ProfileHeader.astro` and `.css` | Name, headline, nickname badge and tooltip                   |
| `src/components/SocialLinks.astro` and `.css`   | Contact-card grid                                            |
| `src/components/LangSwitcher.astro` and `.css`  | Locale links and active/hover markers                        |
| `src/components/ThemeToggle.astro` and `.css`   | Theme button                                                 |
| `src/scripts/`                                  | Client-side theme and tooltip behavior                       |
| `src/styles/global.css`                         | Tailwind import, theme tokens, focus styles                  |
| `src/config/site.ts`                            | Site metadata and profile information                        |
| `src/i18n/`                                     | Locale types and translated content                          |
| `src/pages/`                                    | Static routes                                                |
| `static/`                                       | Public assets; replaces Astro's default public/              |
| `src/test/`                                     | Unit tests, browser tests, and snapshots                     |
| `e2e-tests/`                                    | Production health checks                                     |

## Components and TypeScript

- Use descriptive PascalCase component names and explicit `Props` interfaces.
- Keep component logic small and reuse `HomePage` for localized routes.
- Use `unknown` instead of `any`; type function parameters and return values explicitly.
- Prefer interfaces for object shapes and type-safe contracts.
- Keep client behavior in files under `src/scripts/`, connected with Astro's processed `<script src="...">` syntax.
- Keep metadata in `site.ts` and localized strings in `i18n/messages.ts`.

## Languages and navigation

- Supported locales: `en`, `ru`, `es`; default: English.
- Generated routes: `/`, `/en/`, `/ru/`, `/es/`. The component-level locale fallback does not generate routes for arbitrary language codes.
- English navigation and hreflang use `/`. The `/en/` alias has canonical `/` and is excluded from the sitemap.
- Use typed messages and provide all three translations when adding content.
- Language links perform ordinary full-page navigation. There is no Astro `ClientRouter`.
- Preserve actual link URLs, `hreflang`, and the current-language indication.

## Styling and design

- Use separate component CSS files imported from their Astro components, with BEM class names.
- Prefer Tailwind utilities through `@apply`. Use custom CSS for effects that need it, such as gradients and hard shadows.
- Component CSS imports `@import '../styles/global.css' reference;` to access tokens.
- Tailwind v4 is loaded via `@import 'tailwindcss'` and its Vite plugin. Do not add a legacy Tailwind config or `@astrojs/tailwind`.
- Use a `0.25rem` spacing scale for padding, margins, and gaps. Small optical corrections and decorative offsets can differ when visually justified.
- Fonts come from the device's monospace stack (`font-monocode`); no external font downloads.
- Supporting text uses `text-lg` (`1.125rem`); profile names remain larger. Preserve readable line height and check translated text on narrow screens.
- Keep the approved tilted profile card, pink nickname badge, pastel contact cards, and hard offset shadows.
- Theme tokens separate text (`ink`), outlines (`outline`), shadows (`shadow`), and the background grid (`grid`). Do not reuse text color for every border and shadow.
- In dark mode, the grid and outlines are subdued, but warm gray shadows remain visible enough to preserve the raised-card effect.
- Current layout: languages left, theme right; desktop content has `20svh` top padding, mobile content has `pt-12`. Mobile nickname tooltips can grow to `16rem`, capped by the viewport width. The mobile layout breakpoint is 600px; contacts stack into one column at widths up to `22.5rem`.
- The active language has a pink marker; links get a lavender bottom-up fill on hover and keyboard focus.

## Theme and accessibility

- Default colors follow the system through `color-scheme: light dark` and CSS `light-dark()` tokens.
- `src/scripts/theme-toggle.ts` applies a temporary `data-theme` override and updates `aria-pressed`. It does not read or write localStorage.
- Reloading or following a language link resets manual theme selection to the system default.
- Browser theme-color metadata follows the system by default and the selected theme during a manual override.
- Without JavaScript, system theming still works and the inactive theme button remains hidden.
- Tooltip appearance uses hover/focus CSS; `nickname-tooltip.ts` supports Escape dismissal and restoration on re-entry/refocus.
- Preserve semantic landmarks, skip navigation, visible keyboard focus, descriptive labels, and current/pressed state attributes.
- Respect `prefers-reduced-motion` and verify both color themes.
- The optional snow component is controlled by `PUBLIC_SNOW_FALL_ENABLED`; it is disabled by default.

## Verification

### Unit tests

- Vitest runs in a Node environment; `src/test/helpers.ts` renders components with the Astro Container API and uses happy-dom for DOM queries.
- Use the shared helper: it removes Astro development attributes and normalizes checkout-specific script URLs. Never commit absolute local paths in snapshots.
- Tests include HTML snapshots and behavioral markup assertions. Use present-tense names such as `it('renders ...')`.
- Cover locale-dependent changes in English, Russian, and Spanish. Review snapshot changes before accepting them.

### Browser and visual tests

- Build first. `serve-built-site.ts` serves `dist/` over HTTP for both projects in `vitest.visual.config.ts`.
- `HomePage.visual.test.ts` runs in Vitest Browser Mode with the Playwright provider. It loads the built site in an iframe and compares real PNG images using `toMatchScreenshot()`.
- `HomePage.behavior.test.ts` runs in the Node project with Playwright Chromium to check full-page navigation, reloads, theme changes, and keyboard behavior. `pnpm run test:visual` runs both projects; unit tests exclude both files.
- Keep the provider's host viewport large enough for every test iframe, or Vitest can scale screenshots. Screenshot setup waits for theme initialization and fonts and rejects content overflow.
- Do not replace this with `page.setContent()` of raw build HTML: relative assets and client behavior need the served page.
- If Chromium is missing, install it with `pnpm exec playwright install chromium` (CI/Linux may need `--with-deps`).
- Baselines live in `src/test/__screenshots__/HomePage.visual.test.ts/` and include the browser and platform in their names. Update only for intentional, visually reviewed changes, then rerun without update mode.
- Failures produce actual/diff images in `.vitest-attachments/`; the PR and deployment workflows upload these and the reference screenshots as `visual-test-results`.
- Use the same OS/browser environment to generate and compare baselines. CI uses `macos-26`; the label does not pin every image update. Keep `@vitest/browser-playwright` aligned with the installed Vitest version.
- Browser/font differences can change screenshots; investigate before replacing baselines.
- For layout work, inspect desktop, mobile, narrow screens, both themes, and translated content in Brave. Check overflow and keyboard interaction, not only compilation.

### Production checks and CI

- **Lighthouse requirement:** the production build must score **100/100 in all four categories: Performance, Accessibility, Best Practices, and SEO**, in both mobile and desktop profiles.
- Run Lighthouse against the served production build for changes affecting the shipped site. Record the Lighthouse version, URL, profiles, and scores; keep reports available for review. Documentation-only changes do not require a new run.
- A score below 100 in any category blocks declaring the change ready. Investigate and fix the regression, then rerun. Do not hide failing audits, weaken throttling, or change the tested content to obtain a passing score. If an external condition prevents verification, report the blocker rather than claiming compliance.
- Local Lighthouse results do not establish deployed-site scores; distinguish local and production measurements when reporting results.

- `pnpm run test:e2e` uses Node's test runner and Playwright against the live `https://r3nya.ru` site. It is a production health check, not validation of local changes; no local server is needed.
- The PR build workflow checks formatting, unit tests, and the production build on Ubuntu, plus browser and visual tests against a production build on `macos-26`.
- For code changes, run relevant tests and a production build before reporting completion. For CSS/layout changes, also review and verify visual baselines before committing.
- For documentation-only changes, check the facts, formatting, and diff; a full browser test run is unnecessary.
