/* @layer renderer-shell @kind logic */
import type { HubDef, HubPage } from '../../hub/hub.type';
import type { ScreenParams } from '../../navigation/navigation.type';
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
import { scrolledPane } from './scrolled-pane';

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

const sameParams = (a: ScreenParams, b: ScreenParams): boolean => JSON.stringify(a) === JSON.stringify(b);

const reopened = (hub: HubDef, params: ScreenParams): boolean => {
  const state = useNavigationStore.getState();
  return state.active === hub.id && sameParams(state.params, params) && find(SELECTORS.layer) !== null;
};

const checkReopen = async (tour: StepTour, hub: HubDef, params: ScreenParams, top: number | null): Promise<void> => {
  press({ key: 'Escape' });
  const back = await waitFor(() => reopened(hub, params));
  tour.check(`${hub.id}-escape-reopen`, back !== null, `Escape with nothing open reopened "${hub.id}" on the page it was closed on`, `Escape with nothing open did not reopen "${hub.id}" on ${JSON.stringify(params)}`);
  if (back === null) return;
  const scrolled = top === null || (await waitFor(() => scrolledPane.at(top))) !== null;
  tour.check(`${hub.id}-reopen-scroll`, scrolled, top === null ? `skipped: no page of "${hub.id}" scrolls` : `the reopened "${hub.id}" came back at its scroll offset`, `the reopened "${hub.id}" lost its scroll offset`);
  await tour.capture(`bucket-${hub.id}-reopened`);
};

const escapeCloses = async (tour: StepTour, hub: HubDef, pages: readonly HubPage[]): Promise<void> => {
  const top = await scrolledPane.scroll(hub, pages);
  const { params } = useNavigationStore.getState();
  press({ key: 'Escape' });
  const closed = await waitFor(() => isClosed());
  tour.check(`${hub.id}-escape`, closed !== null, `Escape closed "${hub.id}" from its "${String(params.section ?? hub.home.id)}" page in one press`, `Escape left "${hub.id}" open`);
  if (closed !== null) await checkReopen(tour, hub, params, top);
  for (let step = 0; step <= HISTORY_LIMIT && !isClosed(); step += 1) {
    press({ key: 'Escape' });
    await settle();
  }
};

const hubBackCheck = async (tour: StepTour, hub: HubDef, pages: readonly HubPage[]): Promise<void> => {
  if (trailOf(hub) > 1) await checkBackButton(tour, hub);
  await escapeCloses(tour, hub, pages);
};

export { hubBackCheck };
