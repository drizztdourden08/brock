/* @layer renderer-shell @kind hook */
import { useEffect, useRef } from 'react';
import { isReviewLaunch } from '../../../host/is-review-launch';
import { useScreenRegistry } from '../../../screens/useScreenRegistry';
import { useBrock } from '../../useBrock';
import { useDeveloperTools } from '../../useDeveloperTools';
import { NO_SLOTS } from '../../../shell/TitleBar/TitleBar.constants';
import type { ReviewTourInput } from '../BrockApp.type';

const useReviewTour = (input: ReviewTourInput): void => {
  const { ready, menu, slots = NO_SLOTS, moduleIds } = input;
  const { product, home, homeScreen } = useBrock();
  const registry = useScreenRegistry();
  const developerTools = useDeveloperTools();
  const started = useRef(false);

  useEffect(() => {
    if (!ready || started.current || !isReviewLaunch()) return;
    started.current = true;
    const env = { product, home, homeScreen, screens: registry.list(), menu, slotCount: slots.length, moduleIds, developerTools };
    void import('../../../review/run-review').then(({ runReview }) => runReview(env));
  }, [ready, product, home, homeScreen, registry, menu, slots, moduleIds, developerTools]);
};

export { useReviewTour };
