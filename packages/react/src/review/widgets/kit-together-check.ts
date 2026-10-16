/* @layer renderer-shell @kind logic */
import { widgetKits } from '../../widgets/kits/widget-kits';
import { click } from '../dom/click';
import { find } from '../dom/find';
import { waitFor } from '../dom/wait-for';
import type { StepTour } from '../review.type';
import { kitDrawn } from './kit-drawn';
import { KIT_NORMAL_WIDGET, REVIEW_KIT_ID, kitSelectors } from './kit-review.constants';

const normalShown = (): boolean => find(kitSelectors.widget(KIT_NORMAL_WIDGET)) !== null;

const closedBy = async (tour: StepTour, how: string, close: () => void): Promise<void> => {
  close();
  const gone = await waitFor(kitDrawn.none);
  const back = await waitFor(normalShown);
  tour.check(`kit-closes-together-${how}`, gone !== null && back !== null, `${how === 'bar' ? 'the kit bar close button' : 'widgetKits.close()'} closed every kit widget, the overlay and the bar at once and gave the normal widgets back`, `closing the kit by ${how} left a part of it on screen or kept the normal widgets hidden`);
};

const checkKitTogether = async (tour: StepTour): Promise<void> => {
  const together = await waitFor(kitDrawn.all);
  tour.check('kit-opens-together', together !== null, 'the kit opened its two widgets, its overlay over the main view and its bar together', 'the kit did not draw every widget, its overlay and its bar');
  tour.check('kit-hides-normal-widgets', !normalShown(), 'the normal widgets left the screen while the kit was open', 'a normal widget stayed beside the open kit');
  if (together) await tour.capture('kit-open');
  const button = find(kitSelectors.close(REVIEW_KIT_ID));
  await closedBy(tour, 'bar', () => { if (button) click(button); });
  widgetKits.open(REVIEW_KIT_ID);
  await waitFor(kitDrawn.all);
  await closedBy(tour, 'api', widgetKits.close);
};

export { checkKitTogether };
