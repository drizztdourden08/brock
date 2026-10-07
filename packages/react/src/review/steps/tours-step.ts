/* @layer renderer-shell @kind logic */
import { nav } from '../../navigation/nav';
import { tours } from '../../tours/tours';
import { tourTargets } from '../../tours/resolve-tour-target';
import type { TourDef, TourShown, TourStepDef } from '../../tours/tour.type';
import { delay } from '../dom/delay';
import { press } from '../dom/press-key';
import { waitFor } from '../dom/wait-for';
import type { ReviewStep, StepTour } from '../review.type';
import { tourLayout } from './read-tour-layout';
import { tourReading } from './read-tour-step';
import { checkPoppedTour } from './tour-popped-check';
import { TOUR_SETTLE_MS, TOUR_STEP_WAIT_MS } from './tours-step.constants';

const pad = (index: number): string => String(index + 1).padStart(2, '0');

const layoutChecks = (tour: StepTour, name: string): void => {
  const kept = tourLayout.titleBarKept();
  if (kept !== null) tour.check(`${name}-title-bar`, kept, 'the title bar stays live and undimmed', 'the title bar is inert or under the veil');
  tour.check(`${name}-bubble-on-screen`, tourLayout.bubbleOnScreen(), 'its bubble fits in the window', 'its bubble leaves the window');
  tour.check(`${name}-mascot-clear`, tourLayout.mascotOffHole(), 'the mascot keeps off the lit part', 'the mascot stands on the lit part');
};

const targetCheck = (tour: StepTour, name: string, step: TourStepDef, at: TourShown): void => {
  if (!tourTargets.litOf(step) || tourTargets.poppedSpot(step)) return;
  if (at.target === null) tour.check(`${name}-centred`, true, 'its target is absent, so its bubble shows centred and goes on with Next', '');
  else tour.check(`${name}-lit`, tourReading.lit(at), 'its target is lit with the glow ring', 'it found no target to light');
};

const walkStep = async (tour: StepTour, def: TourDef, index: number): Promise<boolean> => {
  const step = def.steps[index];
  if (!step) return false;
  const name = `tour-${def.id}-${step.id}`;
  const at = await waitFor(() => tourReading.shown(def.id, index), TOUR_STEP_WAIT_MS);
  tour.check(name, at !== null, `step "${step.title}" of "${def.title}" shows its bubble`, `step "${step.id}" of tour "${def.id}" never showed its bubble`);
  if (at) targetCheck(tour, name, step, at);
  await delay(TOUR_SETTLE_MS);
  if (at) layoutChecks(tour, name);
  await tour.capture(`tour-${def.id}-${pad(index)}-${step.id}`);
  if (!at) return false;
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
  nav.open(tour.env.homeScreen);
  tours.start(def.id, 0);
  await waitFor(() => tourReading.shown(def.id, 0), TOUR_STEP_WAIT_MS);
  const open = nav.active();
  press({ key: 'Escape' });
  const closed = (await waitFor(() => tourReading.layer() === null && !tours.isOpen())) !== null;
  tour.check('tour-escape-closes', closed, 'Escape closes an open tour', 'Escape left the tour open');
  const kept = open !== null && nav.active() === open;
  tour.check('tour-escape-keeps-screen', kept, `Escape closed the tour only, and "${open ?? ''}" stayed open`, `Escape also changed the screen (was ${open ?? 'nothing'}, now ${nav.active() ?? 'nothing'})`);
  tours.stop();
  nav.close();
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
    await checkPoppedTour(tour);
  },
};

export { toursStep };
