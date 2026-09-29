/* @layer renderer-shell @kind logic */
import { menuChecks } from '../checks/menu-checks';
import { find } from '../dom/find';
import { menuExpectation } from '../menu/menu-expectation';
import { openMenu } from '../menu/open-menu';
import { readMenu } from '../menu/read-menu';
import { SELECTORS } from '../review.constants';
import type { ReviewStep } from '../review.type';
import { escapeCloses } from './escape-closes';

const menuStep: ReviewStep = {
  name: 'menu',
  run: async (tour) => {
    await openMenu();
    const snapshot = readMenu();
    tour.report(menuChecks(snapshot, menuExpectation(tour.env.menu, tour.env.homeScreen)));
    if (!snapshot.open) return;
    await tour.capture('menu');
    await escapeCloses(tour, 'menu', () => find(SELECTORS.menu) === null);
  },
};

export { menuStep };
