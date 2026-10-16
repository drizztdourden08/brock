/* @layer renderer-shell @kind logic */
import { find } from '../dom/find';
import { hover } from '../dom/hover';
import { waitFor } from '../dom/wait-for';
import { SELECTORS } from '../review.constants';
import { labelOf } from './label-of';
import { menuItemsOf } from './menu-items-of';
import { openMenu } from './open-menu';

const itemIn = (panel: HTMLElement | null, label: string): HTMLElement | undefined =>
  (panel ? menuItemsOf(panel).find((item) => labelOf(item) === label) : undefined);

const walkMenu = async (parents: readonly string[], last?: string): Promise<HTMLElement | null> => {
  let panel = await openMenu();
  for (const label of parents) {
    const item = itemIn(panel, label);
    if (!item) return null;
    hover(item);
    panel = await waitFor(() => find(SELECTORS.subMenu, item));
  }
  return last === undefined ? panel : itemIn(panel, last) ?? null;
};

export { walkMenu };
