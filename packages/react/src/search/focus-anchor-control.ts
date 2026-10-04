/* @layer renderer-shell @kind logic */
import { ANCHOR_CONTROL_SELECTORS } from './search.constants';

const controlIn = (target: HTMLElement): HTMLElement | null => {
  for (const selector of ANCHOR_CONTROL_SELECTORS) {
    const control = target.querySelector<HTMLElement>(selector);
    if (control) return control;
  }
  return null;
};

const focusAnchorControl = (target: HTMLElement): void => {
  const control = controlIn(target);
  if (control) {
    control.focus({ preventScroll: true });
    return;
  }
  if (!target.hasAttribute('tabindex')) target.tabIndex = -1;
  target.focus({ preventScroll: true });
};

export { focusAnchorControl };
