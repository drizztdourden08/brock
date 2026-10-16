/* @layer renderer-shell @kind logic */
import { VIEW_MENU_KEY } from '../../menu/menu-config.constants';
import { viewHidden } from '../../menu/view-hidden';
import { menuChecks } from '../checks/menu-checks';
import { viewMenuChecks } from '../checks/view-menu-checks';
import { find } from '../dom/find';
import { menuExpectation } from '../menu/menu-expectation';
import { openMenu } from '../menu/open-menu';
import { readMenu } from '../menu/read-menu';
import { readViewMenu } from '../menu/read-view-menu';
import { viewMenuLabels } from '../menu/view-menu-labels';
import { withoutTuckedRows } from '../menu/without-tucked-rows';
import { SELECTORS } from '../review.constants';
import type { ReviewStep } from '../review.type';
import { escapeCloses } from './escape-closes';
import { menuOverridePass } from './menu-override-pass';

const menuStep: ReviewStep = {
  name: 'menu',
  run: async (tour) => {
    const { menu, menuOverrides, homeScreen, actions, product } = tour.env;
    const { controls } = product.window.titleBar;
    await openMenu();
    const snapshot = withoutTuckedRows(readMenu(), product.menu);
    const titleBar = { actions, controls, viewLabel: product.menu?.entries?.[VIEW_MENU_KEY]?.label, viewHidden: viewHidden(product.menu) };
    const expected = menuExpectation(menu, homeScreen, titleBar, new Set(menuOverrides.map((record) => record.key)));
    tour.report(menuChecks(snapshot, expected));
    if (!snapshot.open) return;
    await tour.capture('menu');
    await escapeCloses(tour, 'menu', () => find(SELECTORS.menu) === null);
    await menuOverridePass(tour, [...expected.actions, ...(expected.view === null ? [] : [expected.view])]);
    if (expected.view === null) return;
    await openMenu();
    tour.report(viewMenuChecks(await readViewMenu(expected.view), viewMenuLabels(titleBar)));
    await tour.capture('menu-view');
  },
};

export { menuStep };
