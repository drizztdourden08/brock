/* @layer renderer-shell @kind logic */
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import type { StepTour } from '../review.type';
import type { ClusterPair } from './cluster-check.type';
import { probe } from './probe';
import { sameRect } from './same-rect';
import { MAIN_LINK, MOVE } from './widget-review.constants';

const shifted = (b: WidgetWindowBounds): WidgetWindowBounds => ({ ...b, x: b.x + MOVE.x, y: b.y + MOVE.y });

const both = async (id: string, main: WidgetWindowBounds, own: WidgetWindowBounds): Promise<{ at: boolean; windows: unknown }> => {
  const windows = (await probe({ kind: 'window', id })).facts?.windows;
  return { at: sameRect(windows?.[MAIN_LINK], main) && sameRect(windows?.[id], own), windows };
};

const checkClusterMoves = async (tour: StepTour, id: string, [main, own]: ClusterPair): Promise<void> => {
  const dragged = await probe({ kind: 'drag', id, bounds: shifted(own) });
  const moved = await both(id, shifted(main), shifted(own));
  const together = moved.at && dragged.link?.to === MAIN_LINK;
  tour.check('cluster-moves-together', together, `dragging the "${id}" window moved the app snapped to it by the same amount, and they stayed linked`, `the app did not move with the "${id}" window (${JSON.stringify(moved.windows)})`);
  await probe({ kind: 'mainDrag', bounds: main });
  const back = await both(id, main, own);
  tour.check('cluster-moves-with-main', back.at, `dragging the app back took the "${id}" window with it`, `the "${id}" window stayed behind when the app moved (${JSON.stringify(back.windows)})`);
};

export { checkClusterMoves };
