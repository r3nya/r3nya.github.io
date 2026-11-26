const snow = document.querySelector<HTMLElement>('snow-fall');
const button = document.querySelector<HTMLButtonElement>('[data-snow-toggle]');

if (snow && button) {
  let paused = false;
  let loaded = false;
  const allowMotion = window.matchMedia(
    '(prefers-reduced-motion: no-preference)',
  );

  const sync = (): void => {
    if (allowMotion.matches) {
      button.hidden = false;
      snow.hidden = paused;
      button.setAttribute('aria-pressed', String(paused));
      if (!paused && !loaded) {
        loaded = true;
        void import('@zachleat/snow-fall');
      }
    } else {
      button.hidden = true;
      snow.hidden = true;
    }
  };

  button.addEventListener('click', (): void => {
    paused = !paused;
    sync();
  });
  allowMotion.addEventListener('change', sync);
  sync();
}
