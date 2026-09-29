/* @layer renderer-shell @kind logic */
import { SELECTORS } from '../review.constants';
import type { MenuSnapshot } from '../review.type';
import { find } from '../dom/find';
import { labelOf } from './label-of';
import { menuItemsOf } from './menu-items-of';

const readMenu = (): MenuSnapshot => {
  const panel = find(SELECTORS.menu);
  if (!panel) return { open: false, items: [] };
  return {
    open: true,
    items: menuItemsOf(panel).map((item) => ({
      label: labelOf(item),
      hasIcon: item.querySelector(`${SELECTORS.menuIcon} svg, ${SELECTORS.menuIcon} img`) !== null,
      isSection: item.classList.contains(SELECTORS.sectionTrigger),
    })),
  };
};

export { readMenu };
