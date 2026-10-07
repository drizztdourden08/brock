/* @layer renderer-shell @kind logic */
import { tourTargets } from '../../tours/resolve-tour-target';
import { tours } from '../../tours/tours';
import type { TourShown, TourStepDef } from '../../tours/tour.type';
import { useTourStore } from '../../tours/useTourStore';
import { click } from '../dom/click';
import { find } from '../dom/find';
import { probe } from '../widgets/probe';
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

const clickNext = (): string => {
  const next = find(TOUR_SELECTORS.next);
  if (next) click(next);
  return 'its Next button';
};

const clickTarget = (step: TourStepDef): string => {
  const relayed = tourTargets.poppedClick(step);
  if (relayed) {
    void probe({ kind: 'click', id: relayed.widget, selector: relayed.selector });
    return `a click on its target in the "${relayed.widget}" window`;
  }
  const target = tourTargets.resolve(tourTargets.clickOf(step));
  if (!target) return `${clickNext()}, since its target is absent`;
  click(target);
  return 'a click on its target';
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
  return on ? clickTarget(step) : clickNext();
};

const tourReading = { layer, lit, shown, movedOn, advance };

export { tourReading };
