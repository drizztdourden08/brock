/* @layer renderer-shell @kind logic */
import type { StepTour } from '../review.type';
import { probe } from './probe';
import { sameRect } from './same-rect';
import { EDGE_SHIFT, MAIN_LINK, STACK_SIZE } from './widget-review.constants';

const checkStackedSeam = async (tour: StepTour, id: string, otherId: string): Promise<void> => {
  const main = (await probe({ kind: 'main' })).bounds;
  if (!main || main.height < 2 * STACK_SIZE.height) {
    tour.check('stacked-seam', false, '', `the app is too short to stack two windows against its left edge (${JSON.stringify(main)})`);
    return;
  }
  const x = main.x - STACK_SIZE.width;
  const top = { x, y: main.y, ...STACK_SIZE };
  const below = { x, y: main.y + STACK_SIZE.height, ...STACK_SIZE };
  await probe({ kind: 'drag', alone: true, id, bounds: top });
  await probe({ kind: 'drag', alone: true, id: otherId, bounds: below });
  const after = (await probe({ kind: 'resize', id, bounds: { ...top, width: STACK_SIZE.width - EDGE_SHIFT } })).facts?.windows;
  const app = { ...main, x: main.x - EDGE_SHIFT, width: main.width + EDGE_SHIFT };
  const followed = sameRect(after?.[otherId], { ...below, width: STACK_SIZE.width - EDGE_SHIFT }) && sameRect(after?.[MAIN_LINK], app);
  tour.check('stacked-seam', followed, `dragging the right edge of the "${id}" window stacked over another against the app's left edge moved the app's edge and the other window's edge with it`, `the stacked window or the app stayed behind when the shared line moved (${JSON.stringify(after)})`);
  await probe({ kind: 'main', bounds: main });
};

export { checkStackedSeam };
