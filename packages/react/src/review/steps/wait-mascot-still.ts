/* @layer renderer-shell @kind logic */
import { reviewAlive } from '../dom/review-alive';
import { find } from '../dom/find';
import { reportCeiling } from '../dom/report-ceiling';
import { WAIT_CEILING_MS } from '../review.constants';
import { TOUR_MASCOT_STILL_SAMPLES, TOUR_SELECTORS } from './tours-step.constants';

const placeOf = (): string | null => {
  const mascot = find(TOUR_SELECTORS.mascot);
  if (!mascot) return null;
  const box = mascot.getBoundingClientRect();
  return `${box.left}:${box.top}:${box.width}:${box.height}`;
};

const waitMascotStill = (): Promise<boolean> => new Promise((resolve) => {
  let last = placeOf();
  let still = 1;
  if (last === null) {
    resolve(true);
    return;
  }
  const ceiling = setTimeout(() => {
    reportCeiling('the tour mascot to stop walking', WAIT_CEILING_MS);
    resolve(false);
  }, WAIT_CEILING_MS);
  const frame = (): void => {
    reviewAlive();
    const now = placeOf();
    still = now === last ? still + 1 : 1;
    last = now;
    if (now === null || still >= TOUR_MASCOT_STILL_SAMPLES) {
      clearTimeout(ceiling);
      resolve(true);
      return;
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
});

export { waitMascotStill };
