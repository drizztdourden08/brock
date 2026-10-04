/* @layer renderer-shell @kind logic */
import { menuChecks } from '../checks/menu-checks';
import { viewMenuChecks } from '../checks/view-menu-checks';
import { windowGroupMenuChecks } from '../checks/window-group-menu-checks';
import { find } from '../dom/find';
import { menuExpectation } from '../menu/menu-expectation';
import { openMenu } from '../menu/open-menu';
import { readMenu } from '../menu/read-menu';
import { readViewMenu } from '../menu/read-view-menu';
import { readWindowGroupMenu } from '../menu/read-window-group-menu';
import { viewMenuLabels } from '../menu/view-menu-labels';
import { TESSERA_STRINGS } from '@drizztdourden08/tessera/primitives';
import { WINDOW_GROUPS } from '../../widgets/window-groups.constants';
import { SELECTORS } from '../review.constants';
import type { ReviewStep } from '../review.type';
import { escapeCloses } from './escape-closes';

const menuStep: ReviewStep = {
  name: 'menu',
  run: async (tour) => {
    const { menu, homeScreen, actions, product } = tour.env;
    const { controls } = product.window.titleBar;
    await openMenu();
    const snapshot = readMenu();
    const titleBar = { actions, controls, windowGroups: true };
    const expected = menuExpectation(menu, homeScreen, titleBar);
    tour.report(menuChecks(snapshot, expected));
    if (!snapshot.open) return;
    await tour.capture('menu');
    await escapeCloses(tour, 'menu', () => find(SELECTORS.menu) === null);
    if (expected.view === null) return;
    await openMenu();
    tour.report(viewMenuChecks(await readViewMenu(expected.view), viewMenuLabels(titleBar)));
    await tour.capture('menu-view');
    const { windows } = TESSERA_STRINGS;
    tour.report(windowGroupMenuChecks(await readWindowGroupMenu(windows.windowGroup), [windows.windowGroupNone, ...WINDOW_GROUPS.map((group) => group.label)]));
    await tour.capture('menu-view-window-group');
  },
};

export { menuStep };
