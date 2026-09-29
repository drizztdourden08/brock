/* @layer renderer-shell @kind logic */
import { click } from '../dom/click';
import { find } from '../dom/find';
import { waitFor } from '../dom/wait-for';
import { SELECTORS } from '../review.constants';

const openMenu = async (): Promise<HTMLElement | null> => {
  const open = find(SELECTORS.menu);
  if (open) return open;
  const button = find(SELECTORS.menuButton);
  if (!button) return null;
  click(button);
  return waitFor(() => find(SELECTORS.menu));
};

export { openMenu };
