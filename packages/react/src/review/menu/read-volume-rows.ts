/* @layer renderer-shell @kind logic */
import { find } from '../dom/find';
import { SELECTORS } from '../review.constants';
import { MENU_SLIDER_CLASS } from '../steps/volume-step.constants';
import { labelOf } from './label-of';
import { menuItemsOf } from './menu-items-of';

const readVolumeRows = (label: string, muteLabel: string): { muteRow: boolean; sliderRow: boolean } => {
  const panel = find(SELECTORS.menu);
  if (!panel) return { muteRow: false, sliderRow: false };
  const items = menuItemsOf(panel);
  const at = items.findIndex((item) => item.classList.contains(MENU_SLIDER_CLASS) && labelOf(item) === label);
  const before = at > 0 ? items[at - 1] : undefined;
  return { sliderRow: at >= 0, muteRow: before !== undefined && labelOf(before) === muteLabel };
};

export { readVolumeRows };
