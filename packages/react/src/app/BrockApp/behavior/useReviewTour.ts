/* @layer renderer-shell @kind hook */
import { useEffect, useRef } from 'react';
import { isReviewLaunch } from '../../../host/is-review-launch';
import { dropEntries } from '../../../menu/drop-entries';
import { TUCKED_KEYS } from '../../../menu/menu-config.constants';
import { useScreenRegistry } from '../../../screens/useScreenRegistry';
import { useBrock } from '../../useBrock';
import { useDeveloperTools } from '../../useDeveloperTools';
import { NO_ACTIONS } from '../../../shell/TitleBar/TitleBar.constants';
import { NO_MENU_OVERRIDES } from '../BrockApp.constants';
import type { ReviewEnv } from '../../../review/review.type';
import type { ReviewTourInput } from '../BrockApp.type';

const useReviewTour = (input: ReviewTourInput): void => {
  const { ready, menu, menuOverrides = NO_MENU_OVERRIDES, actions = NO_ACTIONS, moduleIds, review = null } = input;
  const { product, home, homeScreen, screenTree } = useBrock();
  const registry = useScreenRegistry();
  const developerTools = useDeveloperTools();
  const started = useRef(false);
  const latest = useRef<ReviewEnv | null>(null);

  useEffect(() => {
    const drawn = { menu: dropEntries(menu, (item) => TUCKED_KEYS.has(item.key)), menuOverrides: menuOverrides.filter((record) => !TUCKED_KEYS.has(record.key)) };
    const env: ReviewEnv = { product, home, homeScreen, screens: registry.list(), ...drawn, actions, moduleIds, developerTools, screenTree, review };
    latest.current = env;
    if (!ready || started.current || !isReviewLaunch()) return;
    started.current = true;
    void import('../../../review/run-review').then(({ runReview }) => runReview(() => latest.current ?? env));
  }, [ready, product, home, homeScreen, screenTree, registry, menu, menuOverrides, actions, moduleIds, developerTools, review]);
};

export { useReviewTour };
