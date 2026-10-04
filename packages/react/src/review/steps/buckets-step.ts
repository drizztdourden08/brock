/* @layer renderer-shell @kind logic */
import { visibleHubPages } from '../../hub/Hub/behavior/visible-hub-pages';
import { nav } from '../../navigation/nav';
import { bucketChecks } from '../checks/bucket-checks';
import { menuReachChecks } from '../checks/menu-reach-checks';
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
    const hubIds = screenTree.hubs.map((hub) => hub.id);
    tour.report(menuReachChecks(menu, screenTree.screens.map((screen) => screen.id).filter((id) => !hubIds.includes(id))));
    for (const hub of screenTree.hubs) {
      await resetUi();
      const reachedVia = await openBucket(tour.env, hub);
      const opened = await waitFor(() => nav.active() === hub.id && find(SELECTORS.layer) !== null);
      const { pages } = visibleHubPages(hub, developerTools);
      tour.report(bucketChecks({ hub: hub.id, reachedVia: opened === null ? null : reachedVia, expected: pages.map((page) => page.label), shown: navLabels() }));
      if (opened === null) continue;
      await visitHubPages(tour, hub, pages);
      await hubBackCheck(tour, hub);
    }
  },
};

export { bucketsStep };
