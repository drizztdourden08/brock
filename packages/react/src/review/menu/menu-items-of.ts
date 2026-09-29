/* @layer renderer-shell @kind logic */
import { SELECTORS } from '../review.constants';

const menuItemsOf = (panel: HTMLElement): HTMLElement[] =>
  [...panel.querySelectorAll<HTMLElement>(SELECTORS.menuItem)];

export { menuItemsOf };
