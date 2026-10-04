/* @layer renderer-shell @kind logic */
import type { HubDef } from '../../hub/hub.type';
import { HISTORY_LIMIT } from '../../navigation/navigation.constants';
import { useNavigationStore } from '../../navigation/useNavigationStore';
import { click } from '../dom/click';
import { find } from '../dom/find';
import { isClosed } from '../dom/is-closed';
import { press } from '../dom/press-key';
import { settle } from '../dom/settle';
import { waitFor } from '../dom/wait-for';
import { SELECTORS } from '../review.constants';
import type { StepTour } from '../review.type';

const trailOf = (hub: HubDef): number => useNavigationStore.getState().history[hub.id]?.length ?? 0;

const checkBackButton = async (tour: StepTour, hub: HubDef): Promise<void> => {
  const before = trailOf(hub);
  const button = find(SELECTORS.layerBack);
  tour.check(`${hub.id}-back-button`, button !== null, `the "${hub.id}" header shows Back after a page change`, `the "${hub.id}" header has no Back button after a page change`);
  if (button === null) return;
  await tour.capture(`bucket-${hub.id}-back`);
  click(button);
  const went = await waitFor(() => trailOf(hub) === before - 1);
  tour.check(`${hub.id}-back`, went !== null, `Back went one page back in "${hub.id}"`, `Back did not go a page back in "${hub.id}"`);
};

const escapeWalksBack = async (tour: StepTour, hub: HubDef): Promise<void> => {
  const before = trailOf(hub);
  if (before > 0) {
    press({ key: 'Escape' });
    const went = await waitFor(() => trailOf(hub) === before - 1 && !isClosed());
    tour.check(`${hub.id}-escape-back`, went !== null, `Escape went one page back in "${hub.id}" before closing it`, `Escape did not go a page back in "${hub.id}"`);
  }
  for (let step = 0; step <= HISTORY_LIMIT && !isClosed(); step += 1) {
    press({ key: 'Escape' });
    await settle();
  }
  tour.check(`${hub.id}-escape`, isClosed(), `Escape walked back through "${hub.id}" and closed it`, `Escape left "${hub.id}" open`);
};

const hubBackCheck = async (tour: StepTour, hub: HubDef): Promise<void> => {
  if (trailOf(hub) > 1) await checkBackButton(tour, hub);
  await escapeWalksBack(tour, hub);
};

export { hubBackCheck };
