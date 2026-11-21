/* @layer renderer-shell @kind logic */
import { controlSources } from '../../app/control-sources';
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
    const label = controlSources.get().text(UPDATE_MENU_LABEL);
    const picked = await pickMenuPath([label]);
    tour.check('update-menu-entry', picked, `the menu has "${label}"`, `the menu has no "${label}" entry`);
    if (!picked) return;
    const opened = await waitFor(() => find(SELECTORS.updateDialog));
    tour.check('update-dialog-opens', opened !== null, `"${label}" opened the update dialog`, `"${label}" did not open the update dialog`);
    if (opened === null) return;
    await tour.capture('update-dialog');
    await escapeCloses(tour, 'update-dialog', () => find(SELECTORS.updateDialog) === null);
  },
};

export { updaterStep };
