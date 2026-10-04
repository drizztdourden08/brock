/* @layer renderer-shell @kind hook */
import { useEffect, useRef } from 'react';
import { isReviewLaunch } from '../../../host/is-review-launch';
import { useScreenRegistry } from '../../../screens/useScreenRegistry';
import { useBrock } from '../../useBrock';
import { useDeveloperTools } from '../../useDeveloperTools';
import { NO_ACTIONS } from '../../../shell/TitleBar/TitleBar.constants';
import type { ReviewTourInput } from '../BrockApp.type';

const useReviewTour = (input: ReviewTourInput): void => {
  const { ready, menu, actions = NO_ACTIONS, moduleIds } = input;
  const { product, home, homeScreen, screenTree } = useBrock();
  const registry = useScreenRegistry();
  const developerTools = useDeveloperTools();
  const started = useRef(false);

  useEffect(() => {
    if (!ready || started.current || !isReviewLaunch()) return;
    started.current = true;
    const env = { product, home, homeScreen, screens: registry.list(), menu, actions, moduleIds, developerTools, screenTree };
    void import('../../../review/run-review').then(({ runReview }) => runReview(env));
  }, [ready, product, home, homeScreen, screenTree, registry, menu, actions, moduleIds, developerTools]);
};

export { useReviewTour };
