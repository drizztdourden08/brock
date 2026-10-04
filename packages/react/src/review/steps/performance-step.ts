/* @layer renderer-shell @kind logic */
import { performanceChecks } from '../checks/performance-checks';
import { delay } from '../dom/delay';
import { find } from '../dom/find';
import { statRows } from '../dom/stat-rows';
import { waitFor } from '../dom/wait-for';
import { menuPathTo } from '../menu/menu-path-to';
import { pickMenuPath } from '../menu/pick-menu-path';
import { FPS_VALUE, PERFORMANCE_LIVE_MS, PERFORMANCE_ROWS, PERFORMANCE_WIDGET_KEY, SELECTORS } from '../review.constants';
import type { ReviewStep } from '../review.type';

const performanceStep: ReviewStep = {
  name: 'performance',
  run: async (tour) => {
    const path = menuPathTo(tour.env.menu, (item) => item.key === PERFORMANCE_WIDGET_KEY);
    if (!path) {
      tour.check('performance-widget-entry', false, '', 'the menu has no Performance widget entry');
      return;
    }
    const route = path.join(' > ');
    const shown = await pickMenuPath(path) ? await waitFor(() => find(SELECTORS.performanceWidget)) : null;
    tour.check('performance-widget-opens', shown !== null, `${route} showed the performance widget`, `${route} did not show the performance widget`);
    if (shown === null) return;
    await waitFor(() => FPS_VALUE.test(statRows(shown)[PERFORMANCE_ROWS.frameRate] ?? ''), PERFORMANCE_LIVE_MS);
    const before = statRows(shown);
    await delay(PERFORMANCE_LIVE_MS);
    tour.report(performanceChecks({ before, after: statRows(shown), sampling: shown.dataset.sampling === 'on' }));
    await tour.capture('performance-widget');
    const hidden = await pickMenuPath(path) ? await waitFor(() => find(SELECTORS.performanceWidget) === null) : null;
    tour.check('performance-widget-closes', hidden !== null, `${route} hid the performance widget again`, `${route} left the performance widget on screen`);
  },
};

export { performanceStep };
