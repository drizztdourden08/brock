/* @layer renderer-shell @kind logic */
import { find } from '../dom/find';
import { hover } from '../dom/hover';
import { waitFor } from '../dom/wait-for';
import { SELECTORS } from '../review.constants';
import type { ViewMenuSnapshot } from '../review.type';
import { labelOf } from './label-of';
import { menuItemsOf } from './menu-items-of';

const readViewMenu = async (view: string): Promise<ViewMenuSnapshot> => {
  const panel = find(SELECTORS.menu);
  const trigger = panel ? menuItemsOf(panel).find((item) => labelOf(item) === view) : undefined;
  if (!trigger) return { open: false, labels: [] };
  hover(trigger);
  const sub = await waitFor(() => find(SELECTORS.subMenu, trigger) ?? find(SELECTORS.subMenu));
  return sub ? { open: true, labels: menuItemsOf(sub).map(labelOf) } : { open: false, labels: [] };
};

export { readViewMenu };
