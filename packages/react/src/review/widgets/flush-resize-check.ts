/* @layer renderer-shell @kind logic */
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import type { StepTour } from '../review.type';
import type { FlushPair } from './flush-resize-check.type';
import { probe } from './probe';
import { sameRect } from './same-rect';
import { EDGE_SHIFT, FLUSH_DROP, MAIN_LINK, SNAP_NEAR } from './widget-review.constants';

const snapLeftOf = async (id: string, main: WidgetWindowBounds, width: number): Promise<WidgetWindowBounds | null> => {
  const placed = await probe({ kind: 'drag', alone: true, id, bounds: { x: main.x - width - SNAP_NEAR, y: main.y + FLUSH_DROP, width, height: main.height - FLUSH_DROP } });
  return placed.link?.to === MAIN_LINK && placed.link.edge === 'left' ? placed.bounds : null;
};

const dragTo = async (id: string, bounds: WidgetWindowBounds): Promise<FlushPair | null> => {
  const windows = (await probe({ kind: 'resize', id, bounds })).facts?.windows;
  const main = windows?.[MAIN_LINK];
  const own = windows?.[id];
  return main && own ? { main, own } : null;
};

const flush = (pair: FlushPair | null): boolean => pair !== null && pair.own.x + pair.own.width === pair.main.x;

const checkTop = async (tour: StepTour, id: string, start: FlushPair): Promise<void> => {
  const { main, own } = start;
  const wanted = { ...own, y: main.y - EDGE_SHIFT, height: own.y + own.height - main.y + EDGE_SHIFT };
  const after = await dragTo(id, wanted);
  const link = (await probe({ kind: 'window', id })).link;
  const alone = flush(after) && sameRect(after?.main, main) && sameRect(after?.own, wanted) && link?.to === MAIN_LINK;
  tour.check('resize-flush-top', alone, `dragging the top edge of the "${id}" window past the app's top moved that edge alone, and it stayed flush and linked`, `the top-edge drag moved another edge or window (${JSON.stringify(after)}, link ${JSON.stringify(link)})`);
};

const checkBottom = async (tour: StepTour, id: string, start: FlushPair): Promise<void> => {
  const wanted = { ...start.own, height: start.own.height + EDGE_SHIFT };
  const after = await dragTo(id, wanted);
  const alone = flush(after) && sameRect(after?.main, start.main) && sameRect(after?.own, wanted);
  tour.check('resize-flush-bottom', alone, `dragging the bottom edge of the "${id}" window off the app's bottom left the app untouched`, `the bottom-edge drag moved the app or another edge (${JSON.stringify(after)})`);
};

const checkSeam = async (tour: StepTour, id: string, start: FlushPair): Promise<void> => {
  const wanted = { ...start.own, width: start.own.width - EDGE_SHIFT };
  const after = await dragTo(id, wanted);
  const app = { ...start.main, x: start.main.x - EDGE_SHIFT, width: start.main.width + EDGE_SHIFT };
  const shared = flush(after) && sameRect(after?.own, wanted) && sameRect(after?.main, app);
  tour.check('resize-flush-seam', shared, `dragging the edge the "${id}" window shares with the app moved the app's facing edge with it`, `the shared edge did not move both windows together (${JSON.stringify(after)})`);
};

const checkFlushResize = async (tour: StepTour, id: string): Promise<void> => {
  const main = (await probe({ kind: 'main' })).bounds;
  const own = (await probe({ kind: 'window', id })).bounds;
  const placed = main && own ? await snapLeftOf(id, main, own.width) : null;
  if (!main || !own || !placed) {
    tour.check('resize-flush-top', false, '', `the "${id}" window could not be snapped flush to the app's left edge`);
    return;
  }
  await checkTop(tour, id, { main, own: placed });
  const raised = (await probe({ kind: 'window', id })).bounds;
  if (raised) await checkBottom(tour, id, { main, own: raised });
  const taller = (await probe({ kind: 'window', id })).bounds;
  if (taller) await checkSeam(tour, id, { main, own: taller });
  await probe({ kind: 'main', bounds: main });
  await probe({ kind: 'drag', alone: true, id, bounds: own });
};

export { checkFlushResize };
