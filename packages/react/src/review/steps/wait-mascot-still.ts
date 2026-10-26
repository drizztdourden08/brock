/* @layer renderer-shell @kind logic */
import { delay } from '../dom/delay';
import { find } from '../dom/find';
import { POLL_MS } from '../review.constants';
import { TOUR_MASCOT_STILL_SAMPLES, TOUR_MASCOT_WAIT_MS, TOUR_SELECTORS } from './tours-step.constants';

const placeOf = (): string | null => {
  const mascot = find(TOUR_SELECTORS.mascot);
  if (!mascot) return null;
  const box = mascot.getBoundingClientRect();
  return `${box.left}:${box.top}:${box.width}:${box.height}`;
};

const waitMascotStill = async (): Promise<boolean> => {
  const deadline = performance.now() + TOUR_MASCOT_WAIT_MS;
  let last = placeOf();
  let still = 1;
  while (last !== null && still < TOUR_MASCOT_STILL_SAMPLES) {
    if (performance.now() >= deadline) return false;
    await delay(POLL_MS);
    const now = placeOf();
    still = now === last ? still + 1 : 1;
    last = now;
  }
  return true;
};

export { waitMascotStill };
