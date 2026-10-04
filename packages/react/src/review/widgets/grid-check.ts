/* @layer renderer-shell @kind logic */
import type { StepTour } from '../review.type';
import { probe } from './probe';
import { CORNER_NEAR, MAIN_LINK, SNAP_NEAR } from './widget-review.constants';

const checkGrid = async (tour: StepTour, id: string): Promise<void> => {
  const start = await probe({ kind: 'window', id });
  const main = start.facts?.windows[MAIN_LINK];
  const own = start.bounds;
  if (!main || !own) {
    tour.check('snap-corner', false, '', `no bounds came back for the app or the "${id}" window`);
    return;
  }
  const height = Math.min(own.height, main.height - 2 * CORNER_NEAR);
  const corner = (await probe({ kind: 'drag', alone: true, id, bounds: { ...own, height, x: main.x + main.width + SNAP_NEAR, y: main.y + CORNER_NEAR } })).bounds;
  const cornered = corner !== null && corner.x === main.x + main.width && corner.y === main.y;
  tour.check('snap-corner', cornered, `the "${id}" window snapped onto the app's top-right corner`, `the "${id}" window did not line up with the app's corner (${JSON.stringify(corner)})`);
  if (!corner) return;
  const bottom = main.y + main.height;
  const resized = (await probe({ kind: 'resize', id, bounds: { ...corner, height: bottom - corner.y - SNAP_NEAR } })).facts?.windows[id];
  const lined = resized?.y === main.y && resized.y + resized.height === bottom;
  tour.check('resize-edge-snap', lined, `resizing the "${id}" window's bottom edge snapped it to the app's bottom edge`, `the resized "${id}" window's bottom edge did not snap to the app's (${JSON.stringify(resized)})`);
  await probe({ kind: 'drag', alone: true, id, bounds: own });
};

export { checkGrid };
