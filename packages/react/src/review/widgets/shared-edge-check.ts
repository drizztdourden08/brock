/* @layer renderer-shell @kind logic */
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { requireHostApi } from '../../host/require-host-api';
import { widgets } from '../../widgets/widgets';
import type { StepTour } from '../review.type';
import { probe } from './probe';
import { sameRect } from './same-rect';
import { checkStackedSeam } from './stacked-seam-check';
import { windowOpen } from './window-open';
import { withReviewWidget } from './with-review-widget';
import { EDGE_SHIFT, FREE_GAP, MAIN_LINK, STACK_SIZE, STACK_WIDGET_ID } from './widget-review.constants';

const stackBoth = async (id: string, otherId: string): Promise<{ x: number; y: number } | null> => {
  const main = (await probe({ kind: 'window', id })).facts?.windows[MAIN_LINK];
  if (!main) return null;
  const x = main.x + main.width + FREE_GAP;
  await probe({ kind: 'drag', alone: true, id, bounds: { x, y: main.y, ...STACK_SIZE } });
  await probe({ kind: 'drag', alone: true, id: otherId, bounds: { x, y: main.y + STACK_SIZE.height, ...STACK_SIZE } });
  return { x, y: main.y };
};

const resized = async (id: string, bounds: WidgetWindowBounds) => (await probe({ kind: 'resize', id, bounds })).facts?.windows;

const checkOuterEdge = async (tour: StepTour, id: string, otherId: string, at: { x: number; y: number }): Promise<void> => {
  const below = { ...at, y: at.y + STACK_SIZE.height, ...STACK_SIZE };
  const after = await resized(id, { x: at.x - EDGE_SHIFT, y: at.y, width: STACK_SIZE.width + EDGE_SHIFT, height: STACK_SIZE.height });
  const alone = after?.[id]?.x === at.x - EDGE_SHIFT && sameRect(after[otherId], below);
  tour.check('snapped-outer-edge', alone, 'dragging the outer left edge of a snapped window left the window below it untouched', `the window below changed with an edge it does not share (${JSON.stringify(after)})`);
};

const checkSeam = async (tour: StepTour, id: string, otherId: string, at: { x: number; y: number }): Promise<void> => {
  const seam = at.y + STACK_SIZE.height + EDGE_SHIFT;
  const after = await resized(id, { x: at.x - EDGE_SHIFT, y: at.y, width: STACK_SIZE.width + EDGE_SHIFT, height: STACK_SIZE.height + EDGE_SHIFT });
  const other = after?.[otherId];
  const followed = after?.[id]?.height === STACK_SIZE.height + EDGE_SHIFT && sameRect(other, { x: at.x, y: seam, width: STACK_SIZE.width, height: STACK_SIZE.height - EDGE_SHIFT });
  tour.check('shared-edge-resize', followed, 'dragging the shared bottom edge moved only the top edge of the window below, its width and bottom stayed', `the window below did not keep its size apart from the shared edge (${JSON.stringify(after)})`);
};

const checkCtrl = async (tour: StepTour, id: string, otherId: string, at: { x: number; y: number }): Promise<void> => {
  const held = (await probe({ kind: 'modifier', ctrl: true })).facts?.ctrl === true;
  const after = held ? await resized(id, { x: at.x - EDGE_SHIFT, y: at.y, width: STACK_SIZE.width + EDGE_SHIFT, height: STACK_SIZE.height }) : undefined;
  await probe({ kind: 'modifier', ctrl: false });
  const other = after?.[otherId];
  const one = after?.[id]?.height === STACK_SIZE.height && other?.width === STACK_SIZE.width && other.height === STACK_SIZE.height - EDGE_SHIFT;
  tour.check('shared-edge-ctrl', one, 'with Ctrl held, the shared edge resized only the dragged window', `Ctrl did not limit the resize to one window (ctrl read ${String(held)}, ${JSON.stringify(after)})`);
};

const checkStack = async (tour: StepTour, id: string, otherId: string): Promise<void> => {
  widgets.popOut(otherId);
  const at = (await windowOpen(otherId, true)) ? await stackBoth(id, otherId) : null;
  if (!at) {
    tour.check('shared-edge-resize', false, '', 'the second window for the shared-edge resize did not open');
    return;
  }
  await checkOuterEdge(tour, id, otherId, at);
  await checkSeam(tour, id, otherId, at);
  await requireHostApi().reviewCaptureGroup('window-grid');
  await checkCtrl(tour, id, otherId, at);
  await checkStackedSeam(tour, id, otherId);
};

const checkSharedEdge = (tour: StepTour, id: string): Promise<void> =>
  withReviewWidget({ id: STACK_WIDGET_ID, label: 'Review stack', popOut: true }, (otherId) => checkStack(tour, id, otherId));

export { checkSharedEdge };
