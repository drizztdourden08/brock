/* @layer renderer-shell @kind logic */
import type { WidgetWindowInfo } from '@drizztdourden08/brock-core';
import { requireHostApi } from '../../host/require-host-api';
import { useWidgetLayoutStore } from '../../widgets/useWidgetLayoutStore';
import { widgets } from '../../widgets/widgets';
import { delay } from '../dom/delay';
import { POLL_MS, POP_OUT_WAIT_MS } from '../review.constants';
import type { StepTour } from '../review.type';

const windowOf = async (id: string): Promise<WidgetWindowInfo | null> =>
  (await requireHostApi().listPoppedWidgets()).find((info) => info.id === id) ?? null;

const until = async (probe: () => Promise<boolean>): Promise<boolean> => {
  const deadline = performance.now() + POP_OUT_WAIT_MS;
  while (performance.now() < deadline) {
    if (await probe()) return true;
    await delay(POLL_MS);
  }
  return false;
};

const checkPopOut = async (tour: StepTour): Promise<void> => {
  const id = useWidgetLayoutStore.getState().definitions.find((def) => def.popOut === true)?.id;
  if (id === undefined) {
    tour.check('pop-out-widget', true, 'no widget declares popOut, so none opens in its own window', '');
    return;
  }
  widgets.popOut(id);
  const opened = await until(async () => (await windowOf(id)) !== null);
  tour.check('pop-out-opens', opened, `"${id}" opened in its own window`, `"${id}" did not open in its own window`);
  if (!opened) return;
  const info = await windowOf(id);
  tour.check('pop-out-unfocused', info?.focused === false, `the "${id}" window did not take the focus`, `the "${id}" window took the focus`);
  widgets.close(id);
  const closed = await until(async () => (await windowOf(id)) === null);
  const gone = closed && !widgets.isVisible(id);
  tour.check('pop-out-closes', gone, `closing "${id}" closed its window and left no trace in the layout`, `closing "${id}" left its window or its layout entry`);
};

export { checkPopOut };
