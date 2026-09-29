/* @layer renderer-shell @kind logic */
import { press } from '../dom/press-key';
import { waitFor } from '../dom/wait-for';
import type { StepTour } from '../review.type';

const escapeCloses = async (tour: StepTour, what: string, closed: () => boolean): Promise<void> => {
  press({ key: 'Escape' });
  const done = await waitFor(closed);
  tour.check(`${what}-escape`, done !== null, `Escape closed ${what}`, `Escape left ${what} open`);
};

export { escapeCloses };
