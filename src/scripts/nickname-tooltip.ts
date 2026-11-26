const hoverCapable = window.matchMedia('(hover: hover)');

function syncExpanded(
  alias: HTMLElement,
  { leavingFocus = false, leavingHover = false } = {},
): void {
  const button = alias.querySelector<HTMLButtonElement>(
    '.profile-header__nickname',
  );
  if (!button) return;
  const dismissed = alias.hasAttribute('data-dismissed');
  const open = alias.hasAttribute('data-open');
  const focused = !leavingFocus && alias.matches(':focus-within');
  const hovered =
    !leavingHover && hoverCapable.matches && alias.matches(':hover');
  const expanded = !dismissed && (open || focused || hovered);
  button.setAttribute('aria-expanded', String(expanded));
}

document.addEventListener('click', (event: MouseEvent): void => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest<HTMLButtonElement>(
    '.profile-header__nickname',
  );
  if (button) {
    const alias = button.closest<HTMLElement>('.profile-header__alias');
    if (!alias) return;
    if (alias.hasAttribute('data-open')) {
      delete alias.dataset.open;
      alias.dataset.dismissed = 'true';
    } else {
      delete alias.dataset.dismissed;
      alias.dataset.open = 'true';
    }
    syncExpanded(alias);
    return;
  }
  const clickedAlias = event.target.closest<HTMLElement>(
    '.profile-header__alias',
  );
  document
    .querySelectorAll<HTMLElement>('.profile-header__alias[data-open]')
    .forEach((alias): void => {
      if (alias === clickedAlias) return;
      delete alias.dataset.open;
      syncExpanded(alias);
    });
});

document.addEventListener('keydown', (event: KeyboardEvent): void => {
  if (event.key !== 'Escape') return;
  document
    .querySelectorAll<HTMLElement>(
      '.profile-header__alias[data-open], .profile-header__alias:hover, .profile-header__alias:focus-within',
    )
    .forEach((alias): void => {
      delete alias.dataset.open;
      alias.dataset.dismissed = 'true';
      syncExpanded(alias);
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
  syncExpanded(alias);
}

function handleLeave(event: FocusEvent | PointerEvent): void {
  if (!(event.target instanceof Element)) return;
  const alias = event.target.closest<HTMLElement>('.profile-header__alias');
  if (
    !alias ||
    (event.relatedTarget instanceof Node && alias.contains(event.relatedTarget))
  )
    return;
  syncExpanded(alias, {
    leavingFocus: event.type === 'focusout',
    leavingHover: event.type === 'pointerout',
  });
}

document.addEventListener('pointerover', restoreTooltip);
document.addEventListener('focusin', restoreTooltip);
document.addEventListener('pointerout', handleLeave);
document.addEventListener('focusout', handleLeave);
