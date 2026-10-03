/* @layer renderer-shell @kind logic */
import type { StepTour } from '../review.type';
import { probe } from './probe';
import { EDGE_DROP, FREE_GAP, MAIN_LINK, SNAP_NEAR } from './widget-review.constants';

const checkMainSnap = async (tour: StepTour, id: string): Promise<void> => {
  const start = (await probe({ kind: 'main' })).bounds;
  const own = (await probe({ kind: 'window', id })).bounds;
  if (!start || !own) return;
  const free = await probe({ kind: 'drag', id, bounds: { ...own, x: start.x + start.width + FREE_GAP, y: start.y + EDGE_DROP } });
  if (!free.bounds || free.link) {
    tour.check('main-snaps-to-widget', false, '', `the "${id}" window could not be parked away from the app`);
    return;
  }
  const main = (await probe({ kind: 'mainDrag', bounds: { ...start, x: free.bounds.x - start.width - SNAP_NEAR } })).bounds;
  const after = await probe({ kind: 'window', id });
  const snapped = main !== null && main.x + main.width === free.bounds.x && after.link?.to === MAIN_LINK && after.link.edge === 'right';
  tour.check('main-snaps-to-widget', snapped, `dragging the app beside the "${id}" window snapped it flush and linked the two`, `the app did not snap to the "${id}" window (app ${JSON.stringify(main)}, window ${JSON.stringify(free.bounds)}, link ${JSON.stringify(after.link)})`);
  await probe({ kind: 'main', bounds: start });
};

export { checkMainSnap };
