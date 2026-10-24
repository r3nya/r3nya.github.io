type Theme = 'light' | 'dark';
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
let preference: Theme | null = null;

function isDark(): boolean {
  return preference === 'dark' || (preference === null && systemTheme.matches);
}

function applyTheme(): void {
  if (preference === null) {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = preference;
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
  preference = isDark() ? 'light' : 'dark';
  applyTheme();
});
systemTheme.addEventListener('change', (): void => applyTheme());
applyTheme();
