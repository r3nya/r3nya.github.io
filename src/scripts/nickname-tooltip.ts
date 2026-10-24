document.addEventListener('keydown', (event: KeyboardEvent): void => {
  if (event.key !== 'Escape') return;
  document
    .querySelectorAll<HTMLElement>(
      '.profile-header__alias:hover, .profile-header__alias:focus-within',
    )
    .forEach((alias): void => {
      alias.dataset.dismissed = 'true';
    });
});

function restoreTooltip(event: FocusEvent | PointerEvent): void {
  if (!(event.target instanceof Element)) return;
  const alias = event.target.closest<HTMLElement>('.profile-header__alias');
  if (
    !alias ||
    (event.relatedTarget instanceof Node && alias.contains(event.relatedTarget))
  )
    return;
  delete alias.dataset.dismissed;
}

document.addEventListener('pointerover', restoreTooltip);
document.addEventListener('focusin', restoreTooltip);
