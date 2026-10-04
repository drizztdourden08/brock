/* @layer renderer-shell @kind logic */
import { requireHostApi } from '../../host/require-host-api';
import { PERFORMANCE_WIDGET_ID } from '../../widgets/built-in/PerformanceWidget/PerformanceWidget.constants';
import { widgets } from '../../widgets/widgets';
import { performanceChecks } from '../checks/performance-checks';
import { delay } from '../dom/delay';
import { find } from '../dom/find';
import { readPerformance } from '../dom/read-performance';
import { settle } from '../dom/settle';
import { waitFor } from '../dom/wait-for';
import { closeMenu } from '../menu/close-menu';
import { menuPathTo } from '../menu/menu-path-to';
import { pickMenuPath } from '../menu/pick-menu-path';
import {
  FPS_VALUE, PERFORMANCE_LIVE_MS, PERFORMANCE_PROCESSES, PERFORMANCE_TILES, PERFORMANCE_WIDGET_KEY, PERFORMANCE_WINDOW_SIZES, SELECTORS,
} from '../review.constants';
import type { ReviewStep, StepTour } from '../review.type';
import { probe } from '../widgets/probe';
import { windowOpen } from '../widgets/window-open';

const ready = (root: HTMLElement): boolean => {
  const reading = readPerformance(root);
  return FPS_VALUE.test(reading.tiles[PERFORMANCE_TILES.frameRate] ?? '') && PERFORMANCE_PROCESSES.every((label) => reading.legend.includes(label));
};

const capturePoppedOut = async (tour: StepTour): Promise<void> => {
  const id = PERFORMANCE_WIDGET_ID;
  widgets.popOut(id);
  const opened = await windowOpen(id, true);
  tour.check('performance-window-opens', opened, 'the performance widget opened in its own window', 'the performance widget did not open in its own window');
  const own = opened ? (await probe({ kind: 'window', id })).bounds : null;
  for (const size of own ? PERFORMANCE_WINDOW_SIZES : []) {
    if (own) await probe({ kind: 'resize', id, bounds: { ...own, ...size.bounds } });
    await delay(PERFORMANCE_LIVE_MS);
    await requireHostApi().reviewCaptureWidget(id, size.name);
  }
  widgets.close(id);
  await windowOpen(id, false);
};

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
    await closeMenu();
    await waitFor(() => ready(shown), PERFORMANCE_LIVE_MS * 2);
    const before = readPerformance(shown);
    await delay(PERFORMANCE_LIVE_MS);
    const inBody = shown.closest(SELECTORS.widgetBody) !== null;
    tour.report(performanceChecks({ before, after: readPerformance(shown), sampling: shown.dataset.sampling === 'on', inBody }));
    await settle();
    await tour.capture('performance-widget');
    const hidden = await pickMenuPath(path) ? await waitFor(() => find(SELECTORS.performanceWidget) === null) : null;
    tour.check('performance-widget-closes', hidden !== null, `${route} hid the performance widget again`, `${route} left the performance widget on screen`);
    await closeMenu();
    await capturePoppedOut(tour);
  },
};

export { performanceStep };
