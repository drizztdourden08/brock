/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { contexts } from '../../../contexts/contexts';
import { useContextsStore } from '../../../contexts/useContextsStore';
import { tourTargets } from '../../resolve-tour-target';
import { tourEvents } from '../../tour-events';
import { tours } from '../../tours';
import type { TourStepDef } from '../../tour.type';

const onClick = (step: TourStepDef, advance: () => void): (() => void) => {
  const listener = (event: MouseEvent): void => {
    const element = tourTargets.separateClick(step);
    if (element && event.target instanceof Node && element.contains(event.target)) advance();
  };
  document.addEventListener('click', listener);
  return () => document.removeEventListener('click', listener);
};

const onContext = (name: string, wanted: boolean, advance: () => void): (() => void) =>
  useContextsStore.subscribe(() => {
    if (contexts.isActive(name) === wanted) advance();
  });

const armAdvance = (step: TourStepDef, advance: () => void): (() => void) | undefined => {
  const on = step.advanceOn;
  if (!on) return undefined;
  if ('event' in on) return tourEvents.on((name) => { if (name === on.event) advance(); });
  if ('context' in on) return onContext(on.context, on.active ?? true, advance);
  return step.target === undefined ? undefined : onClick(step, advance);
};

const useAdvanceOn = (step: TourStepDef | null, key: string): void => {
  useEffect(() => {
    if (!step) return undefined;
    let done = false;
    const advance = (): void => {
      if (done) return;
      done = true;
      tours.next();
    };
    return armAdvance(step, advance);
  }, [key]);
};

export { useAdvanceOn };
