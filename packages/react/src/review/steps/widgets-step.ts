/* @layer renderer-shell @kind logic */
import { find } from '../dom/find';
import { waitFor } from '../dom/wait-for';
import { menuPathTo } from '../menu/menu-path-to';
import { pickMenuPath } from '../menu/pick-menu-path';
import { LOGS_WIDGET_KEY, SELECTORS } from '../review.constants';
import type { ReviewStep } from '../review.type';
import { checkFloatResize } from '../widgets/float-resize-check';
import { checkPopOut } from './pop-out-check';

const widgetsStep: ReviewStep = {
  name: 'widgets',
  run: async (tour) => {
    const path = menuPathTo(tour.env.menu, (item) => item.key === LOGS_WIDGET_KEY);
    if (!path) {
      tour.check('logs-widget-entry', false, '', 'the menu has no Logs widget entry');
      return;
    }
    const route = path.join(' > ');
    const shown = await pickMenuPath(path) ? await waitFor(() => find(SELECTORS.logsWidget)) : null;
    tour.check('logs-widget-opens', shown !== null, `${route} showed the logs widget`, `${route} did not show the logs widget`);
    if (shown === null) return;
    const docked = shown.closest(SELECTORS.dockPane) !== null;
    tour.check('logs-widget-docks', docked, 'the logs widget docked in a pane beside the main view', 'the logs widget did not dock in a pane');
    const gripHidden = find(SELECTORS.mainGrip) === null;
    tour.check('main-grip-at-rest', gripHidden, 'no main view grip shows while nothing is dragged', 'the main view grip shows while nothing is dragged');
    await tour.capture('logs-widget');
    const hidden = await pickMenuPath(path) ? await waitFor(() => find(SELECTORS.logsWidget) === null) : null;
    tour.check('logs-widget-closes', hidden !== null, `${route} hid the logs widget again`, `${route} left the logs widget on screen`);
    await checkFloatResize(tour);
    await checkPopOut(tour);
  },
};

export { widgetsStep };
