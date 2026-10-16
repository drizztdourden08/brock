/* @layer renderer-shell @kind logic */
import { contexts } from '../../contexts/contexts';
import { widgetKits } from '../../widgets/kits/widget-kits';
import { find } from '../dom/find';
import { waitFor } from '../dom/wait-for';
import type { StepTour } from '../review.type';
import { kitDrawn } from './kit-drawn';
import { REVIEW_KIT_CONTEXT, REVIEW_KIT_ID, REVIEW_KIT_MEMBERS, REVIEW_KIT_OVERLAY, REVIEW_KIT_REASON, kitSelectors } from './kit-review.constants';

const scene = (active: boolean): void => contexts.set(REVIEW_KIT_CONTEXT, { active });

const blockedShown = (): boolean => {
  const card = kitDrawn.waiting();
  const hidden = REVIEW_KIT_MEMBERS.every((id) => find(kitSelectors.widget(id)) === null) && find(kitSelectors.overlay(REVIEW_KIT_OVERLAY)) === null;
  return card !== null && card.textContent.includes(REVIEW_KIT_REASON) && hidden && find(kitSelectors.bar(REVIEW_KIT_ID)) !== null;
};

const checkKitGate = async (tour: StepTour): Promise<void> => {
  scene(false);
  widgetKits.open(REVIEW_KIT_ID);
  const blocked = await waitFor(blockedShown);
  tour.check('kit-gate-reason', blocked !== null, 'a kit whose condition does not hold opened on a card with its reason and the kit bar, and drew none of its widgets', 'a blocked kit showed no reason card, or drew its widgets anyway');
  if (blocked) await tour.capture('kit-gate');
  scene(true);
  const opened = await waitFor(() => kitDrawn.waiting() === null && kitDrawn.all());
  tour.check('kit-gate-opens', opened !== null, 'once its condition held, the kit drew its widgets, its overlay and its bar in place of the card', 'the kit stayed on its card after its condition held');
  scene(false);
  const dropped = await waitFor(blockedShown);
  tour.check('kit-gate-drops', dropped !== null, 'when the condition stopped holding, the open kit went back to its reason card', 'the open kit kept its widgets after its condition stopped holding');
  scene(true);
  await waitFor(kitDrawn.all);
};

export { checkKitGate };
