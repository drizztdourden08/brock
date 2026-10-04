/* @layer renderer-shell @kind logic */
import { BAR_ITEM_ATTRIBUTE, SELECTORS } from '../review.constants';

const readBarItems = (): string[] =>
  [...document.querySelectorAll<HTMLElement>(SELECTORS.barItem)].map((item) => item.getAttribute(BAR_ITEM_ATTRIBUTE) ?? '');

export { readBarItems };
