/* @layer renderer-shell @kind logic */
import { requireHostApi } from '../../host/require-host-api';
import { widgets } from '../../widgets/widgets';
import type { StepTour } from '../review.type';
import { probe } from './probe';
import { windowOpen } from './window-open';
import { withReviewWidget } from './with-review-widget';
import { EDGE_SHIFT, FREE_GAP, MAIN_LINK, STACK_SIZE, STACK_WIDGET_ID } from './widget-review.constants';

const stackBoth = async (id: string, otherId: string): Promise<{ x: number; y: number } | null> => {
  const main = (await probe({ kind: 'window', id })).facts?.windows[MAIN_LINK];
  if (!main) return null;
  const x = main.x + main.width + FREE_GAP;
  await probe({ kind: 'drag', id, bounds: { x, y: main.y, ...STACK_SIZE } });
  await probe({ kind: 'drag', id: otherId, bounds: { x, y: main.y + STACK_SIZE.height, ...STACK_SIZE } });
  return { x, y: main.y };
};

const resizeLeft = async (id: string, x: number, at: { x: number; y: number }) =>
  (await probe({ kind: 'resize', id, bounds: { x, y: at.y, width: at.x + STACK_SIZE.width - x, height: STACK_SIZE.height } })).facts?.windows;

const checkCtrl = async (tour: StepTour, id: string, otherId: string, at: { x: number; y: number }): Promise<void> => {
  const held = (await probe({ kind: 'modifier', ctrl: true })).facts?.ctrl === true;
  const alone = held ? await resizeLeft(id, at.x, at) : undefined;
  await probe({ kind: 'modifier', ctrl: false });
  const one = alone?.[id]?.x === at.x && alone[otherId]?.x === at.x - EDGE_SHIFT;
  tour.check('shared-edge-ctrl', one, 'with Ctrl held, the same edge resized only the dragged window', `Ctrl did not limit the resize to one window (ctrl read ${String(held)}, ${JSON.stringify(alone)})`);
};

const checkStack = async (tour: StepTour, id: string, otherId: string): Promise<void> => {
  widgets.popOut(otherId);
  const at = (await windowOpen(otherId, true)) ? await stackBoth(id, otherId) : null;
  if (!at) {
    tour.check('shared-edge-resize', false, '', 'the second window for the shared-edge resize did not open');
    return;
  }
  const moved = await resizeLeft(id, at.x - EDGE_SHIFT, at);
  const both = moved?.[id]?.x === at.x - EDGE_SHIFT && moved[otherId]?.x === at.x - EDGE_SHIFT;
  tour.check('shared-edge-resize', both, 'dragging a left edge shared by two stacked windows moved both left edges', `the stacked window did not follow the shared edge (${JSON.stringify(moved)})`);
  await requireHostApi().reviewCaptureGroup('window-grid');
  await checkCtrl(tour, id, otherId, at);
};

const checkSharedEdge = (tour: StepTour, id: string): Promise<void> =>
  withReviewWidget({ id: STACK_WIDGET_ID, label: 'Review stack', popOut: true }, (otherId) => checkStack(tour, id, otherId));

export { checkSharedEdge };
