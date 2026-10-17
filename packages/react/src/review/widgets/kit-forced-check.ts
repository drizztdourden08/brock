/* @layer renderer-shell @kind logic */
import { contexts } from '../../contexts/contexts';
import { widgetKits } from '../../widgets/kits/widget-kits';
import { widgets } from '../../widgets/widgets';
import { find } from '../dom/find';
import { waitFor } from '../dom/wait-for';
import type { StepTour } from '../review.type';
import { kitDrawn } from './kit-drawn';
import { REVIEW_KIT_CONTEXT, REVIEW_KIT_ID, REVIEW_KIT_MEMBERS, kitSelectors } from './kit-review.constants';

const checkKitForced = async (tour: StepTour): Promise<void> => {
  const [forced] = REVIEW_KIT_MEMBERS;
  widgetKits.close();
  contexts.set(REVIEW_KIT_CONTEXT, { active: false });
  widgets.force([forced]);
  const opened = await waitFor(() => widgetKits.isOpen(REVIEW_KIT_ID) && kitDrawn.waiting() === null && find(kitSelectors.widget(forced)) !== null);
  tour.check('kit-forced-opens', opened !== null, 'a forced kit widget opened its kit past the kit gate, with no reason card', 'a forced kit widget did not open its kit past the gate');
  widgets.force([]);
  const gated = await waitFor(() => kitDrawn.waiting() !== null && find(kitSelectors.widget(forced)) === null);
  tour.check('kit-forced-released', gated !== null, 'once nothing was forced, the gate held the kit on its reason card again', 'the kit stayed past its gate after the forced list was cleared');
  contexts.set(REVIEW_KIT_CONTEXT, { active: true });
};

export { checkKitForced };
