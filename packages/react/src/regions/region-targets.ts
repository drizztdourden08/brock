/* @layer renderer-shell @kind logic */
import { isShown } from './is-shown';
import { MAIN_SELECTOR, MARKED_SELECTOR, MODAL_SELECTOR, REGION_SELECTOR, STOP_SELECTOR } from './regions.constants';

const marked = (region: HTMLElement): boolean => region.matches(MARKED_SELECTOR);

const dockLane = (region: HTMLElement): boolean => region.matches(STOP_SELECTOR);

const insideOther = (region: HTMLElement, all: readonly HTMLElement[]): boolean => all.some((other) => other !== region && !marked(other) && other.contains(region));

const coversMarked = (region: HTMLElement, all: readonly HTMLElement[]): boolean =>
  region.matches(MAIN_SELECTOR) && all.some((other) => marked(other) && region.contains(other));

const regionTargets = (): HTMLElement[] => {
  const modal = [...document.querySelectorAll<HTMLElement>(MODAL_SELECTOR)].find(isShown);
  const scope: ParentNode = modal ?? document;
  const found = [...scope.querySelectorAll<HTMLElement>(REGION_SELECTOR)].filter(isShown);
  return found.filter((region) => marked(region) || dockLane(region) || (!insideOther(region, found) && !coversMarked(region, found)));
};

export { regionTargets };
