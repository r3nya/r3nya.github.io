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

Personal homepage built with **Astro 6**, **Tailwind CSS v4**, and TypeScript, deployed as a static site to GitHub Pages at `https://r3nya.ru`.

- Use the Node version in `.nvmrc` (Node 24).
- Use Corepack and the pnpm version pinned in `package.json#packageManager` (pnpm 11).
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

Known tooling limitation: `type-check` invokes `tsc`, but TypeScript is not declared as a dependency. A clean install may report `tsc: command not found`; do not claim type-check passed or silently install an unpinned compiler.

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
- Current layout: languages left, theme right; desktop content has `20svh` top padding, mobile content has `pt-4`. The mobile layout breakpoint is 600px; contacts stack into one column at widths up to `22.5rem`.
- The active language has a pink marker; links get a lavender bottom-up fill on hover and keyboard focus.

## Theme and accessibility

- Default colors follow the system through `color-scheme: light dark` and CSS `light-dark()` tokens.
- `src/scripts/theme-toggle.ts` applies a temporary `data-theme` override and updates `aria-pressed`. It does not read or write localStorage.
- Reloading or following a language link resets manual theme selection to the system default.
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

- Build first. `HomePage.visual.test.ts` starts its own local HTTP server for `dist/` and loads real CSS and scripts with Playwright Chromium.
- Do not replace this with `page.setContent()` of raw build HTML: relative assets and client behavior need the served page.
- If Chromium is missing, install it with `pnpm exec playwright install chromium` (CI/Linux may need `--with-deps`).
- Baselines live in `src/test/__screenshots__/`. Update only for intentional, visually reviewed changes, then rerun without update mode.
- Browser/font differences can change screenshots; investigate before replacing baselines.
- For layout work, inspect desktop, mobile, narrow screens, both themes, and translated content in Brave. Check overflow and keyboard interaction, not only compilation.

### Production checks and CI

- `pnpm run test:e2e` uses Node's test runner and Playwright against the live `https://r3nya.ru` site. It is a production health check, not validation of local changes; no local server is needed.
- The PR build workflow checks formatting, unit tests, and the production build. Visual tests are a separate local check.
- For code changes, run relevant tests and a production build before reporting completion. For CSS/layout changes, also review and verify visual baselines before committing.
- For documentation-only changes, check the facts, formatting, and diff; a full browser test run is unnecessary.
