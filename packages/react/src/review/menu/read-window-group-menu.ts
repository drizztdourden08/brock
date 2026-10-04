/* @layer renderer-shell @kind logic */
import { hover } from '../dom/hover';
import { waitFor } from '../dom/wait-for';
import { SELECTORS } from '../review.constants';
import type { ViewMenuSnapshot } from '../review.type';
import { labelOf } from './label-of';
import { menuItemsOf } from './menu-items-of';

const subMenus = (): HTMLElement[] => [...document.querySelectorAll<HTMLElement>(SELECTORS.subMenu)];

const readWindowGroupMenu = async (label: string): Promise<ViewMenuSnapshot> => {
  const [view] = subMenus();
  const trigger = view ? menuItemsOf(view).find((item) => labelOf(item) === label) : undefined;
  if (!trigger) return { open: false, labels: [] };
  hover(trigger);
  const sub = await waitFor(() => subMenus().at(1));
  return sub ? { open: true, labels: menuItemsOf(sub).map(labelOf) } : { open: false, labels: [] };
};

export { readWindowGroupMenu };
