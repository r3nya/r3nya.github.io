import { isTransitionBeforeSwapEvent } from 'astro:transitions/client';

type Theme = 'light' | 'dark';
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
let preference: Theme | null = null;

function isDark(): boolean {
  return preference === 'dark' || (preference === null && systemTheme.matches);
}

function applyTheme(target: Document = document): void {
  if (preference === null) {
    delete target.documentElement.dataset.theme;
  } else {
    target.documentElement.dataset.theme = preference;
  }
  const button = target.querySelector<HTMLButtonElement>('[data-theme-toggle]');
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
  preference = isDark() ? 'light' : 'dark';
  applyTheme();
});
systemTheme.addEventListener('change', (): void => applyTheme());
document.addEventListener('astro:page-load', (): void => applyTheme());
document.addEventListener('astro:before-swap', (event: Event): void => {
  if (isTransitionBeforeSwapEvent(event)) applyTheme(event.newDocument);
});
applyTheme();
