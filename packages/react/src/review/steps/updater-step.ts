/* @layer renderer-shell @kind logic */
import { updaterChecks } from '../checks/updater-checks';
import { find } from '../dom/find';
import { waitFor } from '../dom/wait-for';
import { pickMenuPath } from '../menu/pick-menu-path';
import { SELECTORS, UPDATE_MENU_LABEL, UPDATER_MODULE_ID } from '../review.constants';
import type { ReviewStep } from '../review.type';
import { escapeCloses } from './escape-closes';
import { readUpdaterTitleBar } from './read-updater-title-bar';

const updaterStep: ReviewStep = {
  name: 'updater',
  run: async (tour) => {
    if (!tour.env.moduleIds.includes(UPDATER_MODULE_ID)) return;
    tour.report(updaterChecks(await readUpdaterTitleBar()));
    const picked = await pickMenuPath([UPDATE_MENU_LABEL]);
    tour.check('update-menu-entry', picked, `the menu has "${UPDATE_MENU_LABEL}"`, `the menu has no "${UPDATE_MENU_LABEL}" entry`);
    if (!picked) return;
    const opened = await waitFor(() => find(SELECTORS.updateDialog));
    tour.check('update-dialog-opens', opened !== null, `"${UPDATE_MENU_LABEL}" opened the update dialog`, `"${UPDATE_MENU_LABEL}" did not open the update dialog`);
    if (opened === null) return;
    await tour.capture('update-dialog');
    await escapeCloses(tour, 'update-dialog', () => find(SELECTORS.updateDialog) === null);
  },
};

export { updaterStep };
