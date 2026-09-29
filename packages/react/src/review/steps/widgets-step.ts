/* @layer renderer-shell @kind logic */
import { find } from '../dom/find';
import { waitFor } from '../dom/wait-for';
import { menuPathTo } from '../menu/menu-path-to';
import { pickMenuPath } from '../menu/pick-menu-path';
import { LOGS_WIDGET_KEY, SELECTORS } from '../review.constants';
import type { ReviewStep } from '../review.type';

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
    await tour.capture('logs-widget');
    const hidden = await pickMenuPath(path) ? await waitFor(() => find(SELECTORS.logsWidget) === null) : null;
    tour.check('logs-widget-closes', hidden !== null, `${route} hid the logs widget again`, `${route} left the logs widget on screen`);
  },
};

export { widgetsStep };
