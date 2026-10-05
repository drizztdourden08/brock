/* @layer renderer-shell @kind logic */
import type { TourAdvance } from '@drizztdourden08/tessera/composites';
import { stepAdvance } from './step-advance';
import { CLOSE_TOUR_KEY, TOUR_STEP_KEYS } from './tours.constants';
import type { TouringKey } from './tour.type';
import { useTourStore } from './useTourStore';

const touringAdvance = (): TourAdvance | null => {
  const { active, tours } = useTourStore.getState();
  const step = active ? tours.find((tour) => tour.id === active.id)?.steps[active.index] : undefined;
  return step ? stepAdvance(step) : null;
};

const touringHolds = (event: TouringKey, advance: TourAdvance | null = touringAdvance()): boolean => {
  if (advance === null) return false;
  if (event.key === CLOSE_TOUR_KEY) return true;
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return false;
  return TOUR_STEP_KEYS[advance].includes(event.key);
};

export { touringHolds };
