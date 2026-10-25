/* @layer renderer-shell @kind logic */
import { isShown } from './is-shown';
import { rememberedIn } from './region-memory';
import { ROVING_SELECTOR, TABBABLE_SELECTOR } from './regions.constants';

const firstShown = (region: HTMLElement, selector: string): HTMLElement | null =>
  [...region.querySelectorAll<HTMLElement>(selector)].find(isShown) ?? null;

const remembered = (region: HTMLElement): HTMLElement | null => {
  const last = rememberedIn(region);
  return last !== undefined && last.isConnected && region.contains(last) && isShown(last) ? last : null;
};

const focusTarget = (region: HTMLElement): HTMLElement => {
  const found = remembered(region) ?? firstShown(region, ROVING_SELECTOR) ?? firstShown(region, TABBABLE_SELECTOR);
  if (found !== null) return found;
  if (!region.hasAttribute('tabindex')) region.tabIndex = -1;
  return region;
};

export { focusTarget };
