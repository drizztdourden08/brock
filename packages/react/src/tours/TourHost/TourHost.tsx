/* @layer renderer-shell @kind component */
import { useCallback, useMemo } from 'react';
import { GuidedTour, useGuidedTour } from '@drizztdourden08/tessera/composites';
import { useSearchActions } from '../../search/useSearchActions';
import { tourTargets } from '../resolve-tour-target';
import { toGuidedSteps } from '../to-guided-steps';
import { tourSearchActions } from '../tour-search-actions';
import { tours } from '../tours';
import { TITLE_BAR_SELECTOR } from '../tours.constants';
import { useTourStore } from '../useTourStore';
import { useAdvanceOn } from './behavior/useAdvanceOn';
import { useFirstRunTour } from './behavior/useFirstRunTour';
import { useKeepUsable } from './behavior/useKeepUsable';
import { useTourProgress } from './behavior/useTourProgress';
import { useTouringClass } from './behavior/useTouringClass';
import { NO_STEPS, TOUR_CLASS } from './TourHost.constants';
import type { TourHostProps } from './TourHost.type';
import './TourHost.css';

const onOpenChange = (open: boolean): void => {
  if (!open) tours.stop();
};

const TourHost = (props: TourHostProps) => {
  const { ready } = props;
  const list = useTourStore((s) => s.tours);
  const active = useTourStore((s) => s.active);
  const def = active ? list.find((tour) => tour.id === active.id) ?? null : null;
  const step = def && active ? def.steps[active.index] ?? null : null;
  const steps = useMemo(() => (def ? toGuidedSteps(def) : NO_STEPS), [def]);
  const onFinish = useCallback(() => { if (def) tours.complete(def.id); }, [def]);
  const tour = useGuidedTour({ steps, step: active?.index ?? 0, open: def !== null, onStepChange: tours.goTo, onOpenChange, onFinish });
  const stepKey = def && active ? `${def.id}:${active.index}` : '';
  const keep = useCallback((): Element[] => {
    const clicked = step ? tourTargets.separateClick(step) : null;
    return [document.querySelector(TITLE_BAR_SELECTOR), clicked].filter((node): node is Element => node !== null);
  }, [step]);

  useTourProgress();
  useFirstRunTour(ready);
  useSearchActions(useMemo(() => tourSearchActions(list), [list]));
  useAdvanceOn(step, stepKey);
  useKeepUsable(def !== null, keep, stepKey);
  useTouringClass(def !== null);

  return <GuidedTour tour={tour} mascot="auto" className={TOUR_CLASS} />;
};

export { TourHost };
