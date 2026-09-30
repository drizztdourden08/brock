/* @layer renderer-shell @kind logic */
import { useWidgetLayoutStore } from '../../widgets/useWidgetLayoutStore';
import { widgets } from '../../widgets/widgets';
import { until } from '../dom/until';
import type { StepTour } from '../review.type';
import { checkPoppedPref } from './pop-out-pref-check';
import { poppedWindowOf } from './popped-window-of';

const checkPopOut = async (tour: StepTour): Promise<void> => {
  const id = useWidgetLayoutStore.getState().definitions.find((def) => def.popOut === true)?.id;
  if (id === undefined) {
    tour.check('pop-out-widget', true, 'no widget declares popOut, so none opens in its own window', '');
    return;
  }
  widgets.popOut(id);
  const opened = await until(async () => (await poppedWindowOf(id)) !== null);
  tour.check('pop-out-opens', opened, `"${id}" opened in its own window`, `"${id}" did not open in its own window`);
  if (!opened) return;
  const info = await poppedWindowOf(id);
  tour.check('pop-out-unfocused', info?.focused === false, `the "${id}" window did not take the focus`, `the "${id}" window took the focus`);
  await checkPoppedPref(tour, id);
  widgets.close(id);
  const closed = await until(async () => (await poppedWindowOf(id)) === null);
  const gone = closed && !widgets.isVisible(id);
  tour.check('pop-out-closes', gone, `closing "${id}" left no window and no layout entry`, `closing "${id}" left its window or its layout entry`);
};

export { checkPopOut };
