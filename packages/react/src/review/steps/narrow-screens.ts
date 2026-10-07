/* @layer renderer-shell @kind logic */
import { nav } from '../../navigation/nav';
import type { ScreenDef } from '../../screens/screen.type';
import { narrowFitChecks } from '../checks/narrow-fit-checks';
import { find } from '../dom/find';
import { isClosed } from '../dom/is-closed';
import { press } from '../dom/press-key';
import { readNarrowFit } from '../dom/read-narrow-fit';
import { settle } from '../dom/settle';
import { waitFor } from '../dom/wait-for';
import { NARROW_WINDOW, SELECTORS } from '../review.constants';
import type { StepTour } from '../review.type';
import { probe } from '../widgets/probe';

const reviewNarrow = async (tour: StepTour, screen: ScreenDef): Promise<void> => {
  nav.open(screen.id);
  const shown = await waitFor(() => nav.active() === screen.id && (screen.layer === 'own' || find(SELECTORS.layer) !== null));
  if (shown === null) {
    tour.check(`${screen.id}-fits-narrow`, false, '', `"${screen.id}" did not open in the ${NARROW_WINDOW.width} px wide window`);
    return;
  }
  await settle();
  if (find(SELECTORS.layer) !== null) tour.report(narrowFitChecks(screen.id, readNarrowFit()));
  await tour.capture(`screen-${screen.id}-narrow`);
  press({ key: 'Escape' });
  await waitFor(isClosed);
};

const narrowScreens = async (tour: StepTour, screens: readonly ScreenDef[]): Promise<void> => {
  const start = (await probe({ kind: 'main' })).bounds;
  if (start === null || screens.length === 0) return;
  await probe({ kind: 'main', bounds: { ...start, ...NARROW_WINDOW } });
  await settle();
  for (const screen of screens) await reviewNarrow(tour, screen);
  await probe({ kind: 'main', bounds: start });
  await settle();
};

export { narrowScreens };
