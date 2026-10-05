/* @layer renderer-shell @kind logic */
import { tourTargets } from '../../tours/resolve-tour-target';
import { tours } from '../../tours/tours';
import type { TourStepDef } from '../../tours/tour.type';
import { useTourStore } from '../../tours/useTourStore';
import { click } from '../dom/click';
import { find } from '../dom/find';
import { SELECTORS } from '../review.constants';
import { RING_OFF_CLASS, TOUR_SELECTORS } from './tours-step.constants';

const layer = (): HTMLElement | null => find(TOUR_SELECTORS.layer);

const lit = (): boolean => {
  const ring = find(TOUR_SELECTORS.ring);
  return ring !== null && !ring.classList.contains(RING_OFF_CLASS);
};

const shown = (step: TourStepDef): HTMLElement | null => {
  const root = layer();
  if (root?.dataset.step !== step.id) return null;
  const bubble = find(TOUR_SELECTORS.bubble, root);
  return bubble && (tourTargets.litOf(step) === undefined || lit()) ? bubble : null;
};

const titleBarUsable = (): boolean => {
  const bar = find(SELECTORS.titleBar);
  return bar !== null && bar.closest('[inert]') === null;
};

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

const tourReading = { layer, lit, shown, titleBarUsable, movedOn, advance };

export { tourReading };
