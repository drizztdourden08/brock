/* @layer renderer-shell @kind logic */
import { SELECTORS } from '../review.constants';

const navLabels = (): string[] =>
  [...document.querySelectorAll<HTMLElement>(SELECTORS.hubNavItem)].map((item) => item.getAttribute('aria-label') ?? '');

export { navLabels };
