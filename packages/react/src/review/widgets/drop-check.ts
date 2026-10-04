/* @layer renderer-shell @kind logic */
import { placementOf } from '@drizztdourden08/tessera/composites';
import { requireHostApi } from '../../host/require-host-api';
import { useWidgetLayoutStore } from '../../widgets/useWidgetLayoutStore';
import { widgets } from '../../widgets/widgets';
import { until } from '../dom/until';
import type { StepTour } from '../review.type';
import { poppedWindowOf } from '../steps/popped-window-of';
import { probe } from './probe';
import { windowOpen } from './window-open';
import { withReviewWidget } from './with-review-widget';
import { COVER_INSET, COVER_POINT, COVER_SIZE, COVER_WIDGET_ID, EDGE_POINT_INSET } from './widget-review.constants';

const placement = (id: string) => placementOf(useWidgetLayoutStore.getState().layout, id);

const edgePoint = (): { x: number; y: number } => {
  const stage = document.querySelector('.dock-layout')?.getBoundingClientRect();
  return stage ? { x: stage.left + EDGE_POINT_INSET, y: stage.top + stage.height / 2 } : { x: EDGE_POINT_INSET, y: window.innerHeight / 2 };
};

const checkCovered = async (tour: StepTour, id: string, coverId: string): Promise<void> => {
  widgets.popOut(coverId);
  const opened = await windowOpen(coverId, true);
  const main = (await probe({ kind: 'main' })).bounds;
  if (!opened || !main) {
    tour.check('drop-in-covered', false, '', 'the window meant to cover the app did not open');
    return;
  }
  await requireHostApi().setWidgetPin(coverId, 'top');
  await probe({ kind: 'drag', alone: true, id: coverId, bounds: { x: main.x + COVER_INSET, y: main.y + COVER_INSET, width: COVER_SIZE, height: COVER_SIZE } });
  const drop = await probe({ kind: 'drop', id, point: { x: COVER_POINT, y: COVER_POINT } });
  const ignored = !drop.counted && placement(id) === 'popped';
  tour.check('drop-in-covered', ignored, 'a drop where another window covers the app did not count', 'a drop under another window still docked the widget');
};

const checkDropIn = async (tour: StepTour, id: string): Promise<void> => {
  await withReviewWidget({ id: COVER_WIDGET_ID, label: 'Review cover', popOut: true }, (coverId) => checkCovered(tour, id, coverId));
  const point = edgePoint();
  const hover = await probe({ kind: 'dragOver', id, point });
  await tour.capture('widget-drop-preview');
  const drop = await probe({ kind: 'drop', id, point });
  const docked = await until(async () => placement(id) === 'docked' && (await poppedWindowOf(id)) === null);
  const counted = hover.counted && drop.counted && docked;
  tour.check('drop-in-docks', counted, `dropping the "${id}" window on the app's edge docked it and closed its window`, `dropping the "${id}" window on the app's edge did not dock it`);
};

export { checkDropIn };
