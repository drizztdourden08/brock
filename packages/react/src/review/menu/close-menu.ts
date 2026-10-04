/* @layer renderer-shell @kind logic */
import { click } from '../dom/click';
import { find } from '../dom/find';
import { waitFor } from '../dom/wait-for';
import { SELECTORS } from '../review.constants';

const closeMenu = async (): Promise<void> => {
  const button = find(SELECTORS.menu) ? find(SELECTORS.menuButton) : null;
  if (button) click(button);
  await waitFor(() => find(SELECTORS.menu) === null);
};

export { closeMenu };
