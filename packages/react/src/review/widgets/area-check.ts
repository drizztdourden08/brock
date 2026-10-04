/* @layer renderer-shell @kind logic */
import type { StepTour } from '../review.type';
import { poppedEntry } from './popped-entry';
import { probe } from './probe';
import { sameRect } from './same-rect';
import { soon } from './soon';
import { LOST_AT } from './widget-review.constants';

const checkAreas = async (tour: StepTour, id: string): Promise<void> => {
  const now = await probe({ kind: 'areas' });
  const outside = now.outside.join(', ');
  tour.check('pop-out-in-area', now.outside.length === 0, 'every widget window sits inside a work area', `outside every work area: ${outside}`);
  const own = (await probe({ kind: 'window', id })).bounds;
  if (!own) return;
  const rescued = await probe({ kind: 'rescue', id, bounds: { ...own, x: LOST_AT, y: LOST_AT } });
  const back = rescued.outside.length === 0 && rescued.bounds !== null && rescued.bounds.x !== LOST_AT;
  const saved = back && await soon(() => sameRect(poppedEntry(id)?.bounds, rescued.bounds));
  tour.check('pop-out-rescued', saved, `a lost "${id}" window came back into a work area and its bounds were saved`, `a lost "${id}" window stayed out of reach or its bounds were not saved`);
  await probe({ kind: 'drag', alone: true, id, bounds: own });
};

export { checkAreas };
