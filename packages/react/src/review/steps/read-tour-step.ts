/* @layer renderer-shell @kind logic */
import { tourTargets } from '../../tours/resolve-tour-target';
import { tours } from '../../tours/tours';
import type { TourShown, TourStepDef } from '../../tours/tour.type';
import { useTourStore } from '../../tours/useTourStore';
import { click } from '../dom/click';
import { find } from '../dom/find';
import { RING_OFF_CLASS, TOUR_SELECTORS } from './tours-step.constants';

const layer = (): HTMLElement | null => find(TOUR_SELECTORS.layer);

const ringLit = (): boolean => {
  const ring = find(TOUR_SELECTORS.ring);
  return ring !== null && !ring.classList.contains(RING_OFF_CLASS);
};

const shown = (id: string, index: number): TourShown | null => {
  const at = useTourStore.getState().shown;
  return at?.id === id && at.index === index && find(TOUR_SELECTORS.bubble) !== null ? at : null;
};

const lit = (at: TourShown): boolean => at.target !== null && ringLit();

const movedOn = (id: string, index: number): boolean => {
  const { active } = useTourStore.getState();
  return active?.id !== id || active.index !== index;
};

const advance = (step: TourStepDef): string => {
  const on = step.advanceOn;
  if (on && 'event' in on) {
    tours.emit(on.event);
    return `the "${on.event}" event`;
  }
  if (on && 'context' in on) {
    tours.next();
    return `the "${on.context}" context`;
  }
  const target = on ? tourTargets.resolve(tourTargets.clickOf(step)) : find(TOUR_SELECTORS.next);
  if (target) click(target);
  return on ? 'a click on its target' : 'its Next button';
};

const tourReading = { layer, lit, shown, movedOn, advance };

export { tourReading };
