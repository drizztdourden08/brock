/* @layer renderer-shell @kind logic */
import { frameOf, placementOf, setFrame } from '@drizztdourden08/tessera/composites';
import type { WidgetVisibility } from '@drizztdourden08/tessera/composites';
import { requireHostApi } from '../../host/require-host-api';
import { useWidgetLayoutStore } from '../../widgets/useWidgetLayoutStore';
import { widgets } from '../../widgets/widgets';
import type { WidgetDef } from '../../widgets/widget.type';
import { delay } from '../dom/delay';
import { find } from '../dom/find';
import { waitFor } from '../dom/wait-for';
import { POPPED_PAINT_MS } from '../review.constants';
import type { StepTour } from '../review.type';
import { windowOpen } from '../widgets/window-open';

const store = () => useWidgetLayoutStore.getState();

const showAs = (def: WidgetDef, show: WidgetVisibility): void => {
  store().change((layout) => setFrame(layout, def.id, { show }, def));
};

const drawn = (id: string): HTMLElement | null => find(`[data-widget-id="${CSS.escape(id)}"]`);

const reviewDocked = async (tour: StepTour, def: WidgetDef): Promise<void> => {
  const { id } = def;
  widgets.open(id);
  const shown = await waitFor(() => drawn(id));
  const docked = shown !== null && placementOf(store().layout, id) === 'docked';
  tour.check(`app-widget-${id}-docks`, docked, `the "${id}" widget opened docked`, `the "${id}" widget did not open docked`);
  if (shown) await tour.capture(`widget-${id}`);
  widgets.close(id);
  await waitFor(() => drawn(id) === null);
};

const reviewPopped = async (tour: StepTour, def: WidgetDef): Promise<void> => {
  const { id } = def;
  widgets.popOut(id);
  const opened = await windowOpen(id, true);
  if (opened) await delay(POPPED_PAINT_MS);
  const file = opened ? await requireHostApi().reviewCaptureWidget(id, `widget-${id}-popped`) : null;
  tour.check(`app-widget-${id}-pops`, file !== null, `the "${id}" widget opened in its own window and was captured`, `the "${id}" widget did not open in its own window`);
  widgets.close(id);
  await windowOpen(id, false);
};

const reviewAppWidget = async (tour: StepTour, def: WidgetDef): Promise<void> => {
  if (def.devOnly === true && !tour.env.developerTools) {
    tour.check(`app-widget-${def.id}`, true, `the "${def.id}" widget is devOnly and developer tools are off, so it stays closed`, '');
    return;
  }
  const show = frameOf(store().layout, def.id, def).show;
  if (show === 'context-only') showAs(def, 'always');
  try {
    await reviewDocked(tour, def);
    if (def.popOut === true) await reviewPopped(tour, def);
  } finally {
    if (show === 'context-only') showAs(def, show);
  }
};

export { reviewAppWidget };
