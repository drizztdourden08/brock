/* @layer renderer-shell @kind logic */
import { SELECTORS } from '../review.constants';

const navGroupLabels = (): string[] =>
  [...document.querySelectorAll<HTMLElement>(SELECTORS.hubNavGroup)].map((group) => group.getAttribute('aria-label') ?? '');

export { navGroupLabels };
