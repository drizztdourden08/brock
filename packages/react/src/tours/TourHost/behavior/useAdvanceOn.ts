/* @layer renderer-shell @kind hook */
import { useEffect, useRef } from 'react';
import { contexts } from '../../../contexts/contexts';
import { useContextsStore } from '../../../contexts/useContextsStore';
import { tourEvents } from '../../tour-events';
import type { TourStepDef } from '../../tour.type';

const onContext = (name: string, wanted: boolean, advance: () => void): (() => void) =>
  useContextsStore.subscribe(() => {
    if (contexts.isActive(name) === wanted) advance();
  });

const armAdvance = (step: TourStepDef, advance: () => void): (() => void) | undefined => {
  const on = step.advanceOn;
  if (on && 'event' in on) return tourEvents.on((name) => { if (name === on.event) advance(); });
  if (on && 'context' in on) return onContext(on.context, on.active ?? true, advance);
  return undefined;
};

const useAdvanceOn = (step: TourStepDef | null, key: string, next: () => void): void => {
  const latest = useRef(next);
  latest.current = next;

  useEffect(() => {
    if (!step) return undefined;
    let done = false;
    const advance = (): void => {
      if (done) return;
      done = true;
      latest.current();
    };
    return armAdvance(step, advance);
  }, [key]);
};

export { useAdvanceOn };
