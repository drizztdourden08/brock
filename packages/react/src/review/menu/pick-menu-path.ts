/* @layer renderer-shell @kind logic */
import { click } from '../dom/click';
import { find } from '../dom/find';
import { hover } from '../dom/hover';
import { waitFor } from '../dom/wait-for';
import { SELECTORS } from '../review.constants';
import { labelOf } from './label-of';
import { menuItemsOf } from './menu-items-of';
import { openMenu } from './open-menu';

const itemIn = (panel: HTMLElement, label: string): HTMLElement | undefined =>
  menuItemsOf(panel).find((item) => labelOf(item) === label);

const pickMenuPath = async (path: readonly string[]): Promise<boolean> => {
  let panel = await openMenu();
  for (const [index, label] of path.entries()) {
    const item = panel ? itemIn(panel, label) : undefined;
    if (!item) return false;
    if (index === path.length - 1) {
      click(item);
      return true;
    }
    hover(item);
    panel = await waitFor(() => find(SELECTORS.subMenu, item));
  }
  return false;
};

export { pickMenuPath };
