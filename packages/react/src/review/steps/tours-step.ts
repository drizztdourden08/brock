/* @layer renderer-shell @kind logic */
import { tours } from '../../tours/tours';
import { tourTargets } from '../../tours/resolve-tour-target';
import type { TourDef } from '../../tours/tour.type';
import { delay } from '../dom/delay';
import { press } from '../dom/press-key';
import { waitFor } from '../dom/wait-for';
import type { ReviewStep, StepTour } from '../review.type';
import { tourReading } from './read-tour-step';
import { TOUR_SETTLE_MS, TOUR_STEP_WAIT_MS } from './tours-step.constants';

const pad = (index: number): string => String(index + 1).padStart(2, '0');

const walkStep = async (tour: StepTour, def: TourDef, index: number): Promise<boolean> => {
  const step = def.steps[index];
  if (!step) return false;
  const name = `tour-${def.id}-${step.id}`;
  const shown = (await waitFor(() => tourReading.shown(step), TOUR_STEP_WAIT_MS)) !== null;
  tour.check(name, shown, `step "${step.title}" of "${def.title}" shows its bubble`, `step "${step.id}" of tour "${def.id}" never showed its bubble`);
  if (tourTargets.litOf(step)) tour.check(`${name}-lit`, tourReading.lit(), 'its target is lit with the glow ring', 'it found no target to light');
  if (index === 0) tour.check(`tour-${def.id}-title-bar-usable`, tourReading.titleBarUsable(), 'the title bar stays usable over the tour', 'the title bar is inert while the tour is open');
  await delay(TOUR_SETTLE_MS);
  await tour.capture(`tour-${def.id}-${pad(index)}-${step.id}`);
  if (!shown) return false;
  const how = tourReading.advance(step);
  const moved = (await waitFor(() => tourReading.movedOn(def.id, index), TOUR_STEP_WAIT_MS)) !== null;
  tour.check(`${name}-advances`, moved, `it goes on after ${how}`, `it did not go on after ${how}`);
  return moved;
};

const walkTour = async (tour: StepTour, def: TourDef): Promise<void> => {
  tours.start(def.id, 0);
  let index = 0;
  while (index < def.steps.length && await walkStep(tour, def, index)) index += 1;
  const closed = (await waitFor(() => tourReading.layer() === null)) !== null;
  tour.check(`tour-${def.id}-completed`, closed && tours.isCompleted(def.id), `"${def.title}" ran end to end and is kept as completed`, `tour "${def.id}" did not finish (stopped at step ${index + 1})`);
  tours.stop();
};

const escapeCloses = async (tour: StepTour, def: TourDef): Promise<void> => {
  tours.start(def.id, 0);
  const first = def.steps[0];
  if (first) await waitFor(() => tourReading.shown(first), TOUR_STEP_WAIT_MS);
  press({ key: 'Escape' });
  const closed = (await waitFor(() => tourReading.layer() === null && !tours.isOpen())) !== null;
  tour.check('tour-escape-closes', closed, 'Escape closes an open tour', 'Escape left the tour open');
  tours.stop();
};

const toursStep: ReviewStep = {
  name: 'tours',
  run: async (tour) => {
    const list = tours.list();
    const [first] = list;
    if (!first) {
      tour.check('tours', true, 'the app and its modules register no tour', '');
      return;
    }
    for (const def of list) await walkTour(tour, def);
    await escapeCloses(tour, first);
  },
};

export { toursStep };
