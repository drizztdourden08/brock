/* @layer renderer-shell @kind logic */
import { SELECTORS } from '../review.constants';
import type { IconSlotSnapshot } from '../review.type';

const readPaletteIcons = (): IconSlotSnapshot[] =>
  [...document.querySelectorAll<HTMLElement>(SELECTORS.paletteRow)].flatMap((row) => {
    const icon = row.querySelector(SELECTORS.paletteRowIcon);
    if (!icon) return [];
    const label = row.querySelector(SELECTORS.paletteRowLabel)?.textContent.trim() ?? '';
    return [{ label, text: icon.textContent.trim(), hasElement: icon.childElementCount > 0 }];
  });

export { readPaletteIcons };
