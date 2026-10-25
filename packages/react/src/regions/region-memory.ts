/* @layer renderer-shell @kind logic */
import { REGION_SELECTOR } from './regions.constants';

const lastFocused = new WeakMap<HTMLElement, HTMLElement>();

const rememberFocus = (target: EventTarget | null): void => {
  if (!(target instanceof HTMLElement)) return;
  let region = target.closest<HTMLElement>(REGION_SELECTOR);
  while (region !== null) {
    if (region !== target) lastFocused.set(region, target);
    region = region.parentElement?.closest<HTMLElement>(REGION_SELECTOR) ?? null;
  }
};

const rememberedIn = (region: HTMLElement): HTMLElement | undefined => lastFocused.get(region);

export { rememberedIn, rememberFocus };
