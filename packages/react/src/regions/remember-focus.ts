/* @layer renderer-shell @kind logic */
import { lastFocused } from './last-focused';
import { REGION_SELECTOR } from './regions.constants';

const rememberFocus = (target: EventTarget | null): void => {
  if (!(target instanceof HTMLElement)) return;
  let region = target.closest<HTMLElement>(REGION_SELECTOR);
  while (region !== null) {
    if (region !== target) lastFocused.set(region, target);
    region = region.parentElement?.closest<HTMLElement>(REGION_SELECTOR) ?? null;
  }
};

export { rememberFocus };
