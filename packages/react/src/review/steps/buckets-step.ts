/* @layer renderer-shell @kind logic */
import { showsHubNav } from '../../hub/Hub/behavior/shows-hub-nav';
import { visibleHubPages } from '../../hub/Hub/behavior/visible-hub-pages';
import { nav } from '../../navigation/nav';
import { bucketChecks } from '../checks/bucket-checks';
import { menuReachChecks } from '../checks/menu-reach-checks';
import { menuReachIds } from '../menu/menu-reach-ids';
import { find } from '../dom/find';
import { navLabels } from '../dom/nav-labels';
import { waitFor } from '../dom/wait-for';
import { SELECTORS } from '../review.constants';
import type { ReviewStep } from '../review.type';
import { hubBackCheck } from './hub-back-check';
import { openBucket } from './open-bucket';
import { resetUi } from './reset-ui';
import { visitHubPages } from './visit-hub-pages';

const bucketsStep: ReviewStep = {
  name: 'buckets',
  run: async (tour) => {
    const { screenTree, homeScreen, menu, developerTools } = tour.env;
    if (screenTree === null) return;
    tour.check('home-bucket', homeScreen === screenTree.home, `Escape and Home open the "${screenTree.home}" bucket`, `home is "${homeScreen}", not the config home "${screenTree.home}"`);
    tour.report(menuReachChecks(menu, menuReachIds(screenTree)));
    for (const hub of screenTree.hubs) {
      await resetUi();
      const reachedVia = await openBucket(tour.env, hub);
      const opened = await waitFor(() => nav.active() === hub.id && find(SELECTORS.layer) !== null);
      const { pages } = visibleHubPages(hub, developerTools);
      const navShown = showsHubNav(hub.nav, pages.length);
      tour.report(bucketChecks({ hub: hub.id, reachedVia: opened === null ? null : reachedVia, nav: navShown, expected: pages.map((page) => page.label), shown: navLabels() }));
      if (opened === null) continue;
      await visitHubPages(tour, hub, pages, navShown);
      await hubBackCheck(tour, hub);
    }
  },
};

export { bucketsStep };
