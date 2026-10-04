/* @layer renderer-shell @kind logic */
import { menuChecks } from '../checks/menu-checks';
import { viewMenuChecks } from '../checks/view-menu-checks';
import { find } from '../dom/find';
import { menuExpectation } from '../menu/menu-expectation';
import { openMenu } from '../menu/open-menu';
import { readMenu } from '../menu/read-menu';
import { readViewMenu } from '../menu/read-view-menu';
import { viewMenuLabels } from '../menu/view-menu-labels';
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
    const expected = menuExpectation(menu, homeScreen, { actions, controls });
    tour.report(menuChecks(snapshot, expected));
    if (!snapshot.open) return;
    await tour.capture('menu');
    await escapeCloses(tour, 'menu', () => find(SELECTORS.menu) === null);
    if (expected.view === null) return;
    await openMenu();
    tour.report(viewMenuChecks(await readViewMenu(expected.view), viewMenuLabels(controls)));
    await tour.capture('menu-view');
  },
};

export { menuStep };
