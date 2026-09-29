/* @layer renderer-shell @kind hook */
import { useEffect, useRef } from 'react';
import { isReviewLaunch } from '../../../host/is-review-launch';
import type { MenuEntry } from '../../../menu/menu.type';
import type { TitleBarSlot } from '../../../modules/renderer-module.type';
import { useScreenRegistry } from '../../../screens/useScreenRegistry';
import { useBrock } from '../../useBrock';
import { useDeveloperTools } from '../../useDeveloperTools';
import { NO_SLOTS } from '../../../shell/TitleBar/TitleBar.constants';

const useReviewTour = (settled: boolean, menu: readonly MenuEntry[], slots: readonly TitleBarSlot[] = NO_SLOTS): void => {
  const { product, home, homeScreen } = useBrock();
  const registry = useScreenRegistry();
  const developerTools = useDeveloperTools();
  const started = useRef(false);

  useEffect(() => {
    if (!settled || started.current || !isReviewLaunch()) return;
    started.current = true;
    const env = { product, home, homeScreen, screens: registry.list(), menu, slotCount: slots.length, developerTools };
    void import('../../../review/run-review').then(({ runReview }) => runReview(env));
  }, [settled, product, home, homeScreen, registry, menu, slots, developerTools]);
};

export { useReviewTour };
