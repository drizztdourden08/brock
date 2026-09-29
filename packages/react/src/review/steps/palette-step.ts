/* @layer renderer-shell @kind logic */
import { ICONS } from '@drizztdourden08/tessera/primitives';
import { iconSlotChecks } from '../checks/icon-slot-checks';
import { find } from '../dom/find';
import { press } from '../dom/press-key';
import { waitFor } from '../dom/wait-for';
import { SELECTORS } from '../review.constants';
import type { ReviewStep } from '../review.type';
import { escapeCloses } from './escape-closes';
import { readPaletteIcons } from './read-palette-icons';

const paletteStep: ReviewStep = {
  name: 'palette',
  run: async (tour) => {
    press({ key: 'k', ctrlKey: true });
    const opened = await waitFor(() => find(SELECTORS.palette));
    tour.check('palette-opens', opened !== null, 'Ctrl+K opened the search palette', 'Ctrl+K did not open the search palette');
    if (opened === null) return;
    await tour.capture('palette');
    tour.report(iconSlotChecks('palette-icons', readPaletteIcons(), (text) => Object.hasOwn(ICONS, text)));
    await escapeCloses(tour, 'palette', () => find(SELECTORS.palette) === null);
  },
};

export { paletteStep };
