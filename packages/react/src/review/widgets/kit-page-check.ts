/* @layer renderer-shell @kind logic */
import { nav } from '../../navigation/nav';
import { widgetKits } from '../../widgets/kits/widget-kits';
import { waitFor } from '../dom/wait-for';
import type { StepTour } from '../review.type';
import { kitDrawn } from './kit-drawn';
import { REVIEW_KIT_ID } from './kit-review.constants';

const checkKitPage = async (tour: StepTour): Promise<void> => {
  const { homeScreen } = tour.env;
  widgetKits.open(REVIEW_KIT_ID);
  await waitFor(kitDrawn.all);
  nav.home(homeScreen);
  const hidden = await waitFor(() => nav.active() !== null && kitDrawn.none() && widgetKits.isOpen(REVIEW_KIT_ID));
  tour.check('kit-page-hides', hidden !== null, `opening "${homeScreen}" over the open kit hid its widgets, overlay and bar and left the kit open`, `the open kit stayed drawn over "${homeScreen}", or the page closed it`);
  if (hidden) await tour.capture('kit-under-page');
  nav.close();
  const back = await waitFor(() => nav.active() === null && kitDrawn.all());
  tour.check('kit-page-returns', back !== null, 'the kit came back as it was once the page closed', 'the kit did not come back after the page closed');
};

export { checkKitPage };
