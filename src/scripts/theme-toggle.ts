import { themeColors } from '@/config/site';

type Theme = 'light' | 'dark';
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
let preference: Theme | null = null;
let transition: ViewTransition | undefined;

function isDark(): boolean {
  return preference === 'dark' || (preference === null && systemTheme.matches);
}

function applyTheme(): void {
  const schemeMeta = document.querySelector<HTMLMetaElement>(
    'meta[name="color-scheme"]',
  );
  if (schemeMeta) {
    schemeMeta.content = preference ?? 'light dark';
  }
  if (preference === null) {
    delete document.documentElement.dataset.theme;
    const lightMeta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"][media="(prefers-color-scheme: light)"]',
    );
    if (lightMeta) lightMeta.content = themeColors.light;
    const darkMeta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"][media="(prefers-color-scheme: dark)"]',
    );
    if (darkMeta) darkMeta.content = themeColors.dark;
  } else {
    document.documentElement.dataset.theme = preference;
    const color = themeColors[preference];
    for (const meta of document.querySelectorAll<HTMLMetaElement>(
      'meta[name="theme-color"]',
    )) {
      meta.content = color;
    }
  }
  const button = document.querySelector<HTMLButtonElement>(
    '[data-theme-toggle]',
  );
  if (button) {
    button.hidden = false;
    button.setAttribute('aria-pressed', String(isDark()));
  }
}

document.addEventListener('click', (event: MouseEvent): void => {
  if (
    !(event.target instanceof Element) ||
    !event.target.closest('[data-theme-toggle]')
  )
    return;
  const target: Theme = isDark() ? 'light' : 'dark';
  const system: Theme = systemTheme.matches ? 'dark' : 'light';
  // Revert to following the OS when toggling back to the system scheme.
  preference = target === system ? null : target;
  transition?.skipTransition();
  if (
    !document.startViewTransition ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    applyTheme();
    return;
  }
  transition = document.startViewTransition(applyTheme);
});
systemTheme.addEventListener('change', (): void => applyTheme());
applyTheme();
