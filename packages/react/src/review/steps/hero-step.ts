/* @layer renderer-shell @kind logic */
import { heroBuckets } from '../../screens/kinds/hero-buckets';
import { heroChecks } from '../checks/hero-checks';
import { find } from '../dom/find';
import { readHero } from '../dom/read-hero';
import { waitFor } from '../dom/wait-for';
import { SELECTORS } from '../review.constants';
import type { ReviewStep } from '../review.type';
import { openBucket } from './open-bucket';
import { resetUi } from './reset-ui';

const heroStep: ReviewStep = {
  name: 'hero',
  run: async (tour) => {
    const hubs = tour.env.screenTree?.hubs.filter((hub) => heroBuckets.has(hub.id)) ?? [];
    for (const hub of hubs) {
      await resetUi();
      await openBucket(tour.env, hub);
      const hero = await waitFor(() => find(SELECTORS.hero));
      tour.report(heroChecks(readHero(hub.id, hero)));
      if (hero !== null) await tour.capture(`hero-${hub.id}`);
    }
  },
};

export { heroStep };
