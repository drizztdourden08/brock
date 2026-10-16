/* @layer renderer-shell @kind logic */
import { kitViewOf } from '../../widgets/kits/kit-view-of';
import { useWidgetKitStore } from '../../widgets/kits/useWidgetKitStore';
import { widgetKits } from '../../widgets/kits/widget-kits';
import { useWidgetLayoutStore } from '../../widgets/useWidgetLayoutStore';
import { widgets } from '../../widgets/widgets';
import { find } from '../dom/find';
import { until } from '../dom/until';
import { waitFor } from '../dom/wait-for';
import type { StepTour } from '../review.type';
import { poppedWindowOf } from '../steps/popped-window-of';
import { kitDrawn } from './kit-drawn';
import { KIT_NORMAL_WIDGET, REVIEW_KIT_ID, REVIEW_KIT_MEMBERS, kitSelectors } from './kit-review.constants';

const [, RIGHT] = REVIEW_KIT_MEMBERS;

const windowOpen = async (): Promise<boolean> => until(async () => (await poppedWindowOf(RIGHT)) !== null);

const windowGone = async (): Promise<boolean> => until(async () => (await poppedWindowOf(RIGHT)) === null);

const poppedInKit = (): boolean => {
  const view = kitViewOf(REVIEW_KIT_ID, useWidgetKitStore.getState());
  const normal = useWidgetLayoutStore.getState().layout.popped;
  return view !== null && view.layout.popped.some((p) => p.id === RIGHT) && !normal.some((p) => p.id === RIGHT);
};

const checkKitPopOut = async (tour: StepTour): Promise<void> => {
  widgets.popOut(RIGHT);
  const out = await windowOpen();
  tour.check('kit-widget-pops-out', out && poppedInKit(), 'a kit widget popped out into its own window and stayed in the kit layout, not the normal one', 'a kit widget did not pop out, or its window landed in the normal layout');
  widgetKits.close();
  tour.check('kit-popped-closes-with-kit', await windowGone(), 'closing the kit closed the kit widget\'s window too', 'the kit widget\'s window stayed open after the kit closed');
  widgetKits.open(REVIEW_KIT_ID);
  const restored = await windowOpen();
  tour.check('kit-popped-restored', restored && find(kitSelectors.widget(RIGHT)) === null, 'reopening the kit brought the kit widget back in its own window, as it was left', 'reopening the kit did not bring the popped kit widget back in its window');
  if (restored) await tour.capture('kit-popped');
  widgets.open(KIT_NORMAL_WIDGET);
  tour.check('kit-popped-closes-with-normal-widget', await windowGone(), 'opening a normal widget closed the kit and its popped window', 'the kit widget\'s window stayed open after a normal widget closed the kit');
  widgetKits.reset(REVIEW_KIT_ID);
  widgetKits.open(REVIEW_KIT_ID);
  await waitFor(kitDrawn.all);
};

export { checkKitPopOut };
