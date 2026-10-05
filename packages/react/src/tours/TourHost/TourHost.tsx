/* @layer renderer-shell @kind component */
import { useCallback, useMemo } from 'react';
import { GuidedTour, useGuidedTour } from '@drizztdourden08/tessera/composites';
import type { TourStep } from '@drizztdourden08/tessera/composites';
import { useSearchActions } from '../../search/useSearchActions';
import { tourSearchActions } from '../tour-search-actions';
import { tours } from '../tours';
import { useTourStore } from '../useTourStore';
import { useActiveStep } from './behavior/useActiveStep';
import { useAdvanceOn } from './behavior/useAdvanceOn';
import { useFirstRunTour } from './behavior/useFirstRunTour';
import { useRelayedClick } from './behavior/useRelayedClick';
import { useTourProgress } from './behavior/useTourProgress';
import { useTourSpot } from './behavior/useTourSpot';
import { KEEP_USABLE, TOUR_CLASS } from './TourHost.constants';
import type { TourHostProps } from './TourHost.type';

const onOpenChange = (open: boolean): void => {
  if (!open) tours.stop();
};

const onStepShown = (step: TourStep, index: number, target: HTMLElement | null): void => {
  const { active, setShown } = useTourStore.getState();
  if (active) setShown({ id: active.id, index, step: step.id, target });
};

const onStepLeave = (): void => useTourStore.getState().setShown(null);

const TourHost = (props: TourHostProps) => {
  const { ready } = props;
  const { list, def, step, steps, index, key, popped } = useActiveStep();
  const onFinish = useCallback(() => { if (def) tours.complete(def.id); }, [def]);
  const tour = useGuidedTour({ steps, step: index, open: def !== null, onStepChange: tours.goTo, onOpenChange, onFinish, onStepShown, onStepLeave });

  useTourProgress();
  useFirstRunTour(ready);
  useSearchActions(useMemo(() => tourSearchActions(list), [list]));
  useAdvanceOn(step, key, tour.next);
  useTourSpot(tour.shown ? step : null, popped);
  useRelayedClick(tour.shown ? step : null, key, popped, tour.next);

  return <GuidedTour tour={tour} keep={KEEP_USABLE} mascot="auto" className={TOUR_CLASS} />;
};

export { TourHost };
