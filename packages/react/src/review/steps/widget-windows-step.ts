/* @layer renderer-shell @kind logic */
import { requireHostApi } from '../../host/require-host-api';
import { useWidgetLayoutStore } from '../../widgets/useWidgetLayoutStore';
import { widgets } from '../../widgets/widgets';
import { settle } from '../dom/settle';
import type { ReviewStep, StepTour } from '../review.type';
import { checkAreas } from '../widgets/area-check';
import { checkBoundsRoundTrip } from '../widgets/bounds-check';
import { checkDevGate } from '../widgets/dev-gate-check';
import { checkDropIn } from '../widgets/drop-check';
import { checkFlushResize } from '../widgets/flush-resize-check';
import { checkContextGate } from '../widgets/gate-check';
import { checkGrid } from '../widgets/grid-check';
import { checkGroups } from '../widgets/group-check';
import { checkGuide } from '../widgets/guide-check';
import { checkMainSnap } from '../widgets/main-snap-check';
import { checkPin } from '../widgets/pin-check';
import { checkRestartRestore } from '../widgets/restart-check';
import { checkSharedEdge } from '../widgets/shared-edge-check';
import { checkSync } from '../widgets/sync-check';
import { checkSnapAndTow } from '../widgets/tow-check';
import { windowOpen } from '../widgets/window-open';

const popOut = async (tour: StepTour, id: string, check: string): Promise<boolean> => {
  widgets.popOut(id);
  const opened = await windowOpen(id, true);
  tour.check(check, opened, `"${id}" opened in its own window`, `"${id}" did not open in its own window`);
  return opened;
};

const captureWidget = async (id: string, name: string): Promise<void> => {
  await settle();
  await requireHostApi().reviewCaptureWidget(id, name);
};

const windowChecks = async (tour: StepTour, id: string): Promise<void> => {
  await captureWidget(id, 'widget-window');
  await checkPin(tour, id);
  await checkBoundsRoundTrip(tour, id);
  await checkSnapAndTow(tour, id);
  await checkRestartRestore(tour, id);
  await checkMainSnap(tour, id);
  await checkAreas(tour, id);
  await checkSync(tour, id);
  await checkGrid(tour, id);
  await checkSharedEdge(tour, id);
  await checkFlushResize(tour, id);
  await checkGroups(tour, id);
  await checkGuide(tour, id);
  await checkDropIn(tour, id);
};

const widgetWindowsStep: ReviewStep = {
  name: 'widget-windows',
  run: async (tour) => {
    const id = useWidgetLayoutStore.getState().definitions.find((def) => def.popOut === true)?.id;
    if (id === undefined) {
      tour.check('widget-windows', true, 'no widget declares popOut, so no widget window to drive', '');
      return;
    }
    widgets.close(id);
    if (await popOut(tour, id, 'widget-window-opens')) await windowChecks(tour, id);
    if (await popOut(tour, id, 'widget-window-reopens')) await checkContextGate(tour, id);
    await checkDevGate(tour);
    widgets.close(id);
    const closed = await windowOpen(id, false);
    tour.check('widget-windows-close', closed && !widgets.isVisible(id), 'every widget window closed at the end', 'a widget window stayed open at the end');
  },
};

export { widgetWindowsStep };
