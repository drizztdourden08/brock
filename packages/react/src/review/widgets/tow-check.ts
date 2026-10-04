/* @layer renderer-shell @kind logic */
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { until } from '../dom/until';
import type { StepTour } from '../review.type';
import { poppedEntry } from './popped-entry';
import { probe } from './probe';
import { sameRect } from './same-rect';
import { soon } from './soon';
import { EDGE_DROP, GROW, MAIN_LINK, MOVE, SNAP_NEAR } from './widget-review.constants';

const onRightEdge = async (id: string, main: WidgetWindowBounds | null, y: number): Promise<boolean> => {
  const own = (await probe({ kind: 'window', id })).bounds;
  return main !== null && own !== null && own.x === main.x + main.width && own.y === y;
};

const towSteps = (start: WidgetWindowBounds) => [
  { check: 'pop-out-tow-right', label: 'the app grew from its right edge', bounds: { ...start, width: start.width + GROW }, dy: 0 },
  { check: 'pop-out-tow-left', label: 'the app grew from its left edge', bounds: { ...start, x: start.x - GROW, width: start.width + 2 * GROW }, dy: 0 },
  { check: 'pop-out-tow-move', label: 'the app moved', bounds: { ...start, x: start.x + MOVE.x, y: start.y + MOVE.y }, dy: MOVE.y },
];

const checkSnapAndTow = async (tour: StepTour, id: string): Promise<void> => {
  const start = (await probe({ kind: 'main' })).bounds;
  const own = (await probe({ kind: 'window', id })).bounds;
  if (!start || !own) return;
  const snapped = await probe({ kind: 'drag', alone: true, id, bounds: { ...own, x: start.x + start.width + SNAP_NEAR, y: start.y + EDGE_DROP } });
  const linked = snapped.link?.to === MAIN_LINK && snapped.link.edge === 'right' && snapped.bounds?.x === start.x + start.width;
  tour.check('pop-out-snaps', linked, `the "${id}" window snapped onto the app's right edge and linked to it`, `the "${id}" window did not snap onto the app's right edge`);
  if (!linked || !snapped.bounds) return;
  const top = snapped.bounds.y;
  for (const step of towSteps(start)) {
    const main = (await probe({ kind: 'main', bounds: step.bounds })).bounds;
    const flush = await until(() => onRightEdge(id, main, top + step.dy));
    tour.check(step.check, flush, `the "${id}" window stayed on the app's right edge when ${step.label}`, `the "${id}" window left the app's right edge when ${step.label}`);
  }
  const final = (await probe({ kind: 'window', id })).bounds;
  const saved = await soon(() => sameRect(poppedEntry(id)?.bounds, final) && poppedEntry(id)?.link?.to === MAIN_LINK);
  tour.check('pop-out-tow-saved', saved, 'the towed bounds and the link reached the layout', 'the layout kept stale bounds or lost the link after a tow');
  await probe({ kind: 'main', bounds: start });
};

export { checkSnapAndTow };
