/* @layer renderer-shell @kind logic */
import { nav } from '../../navigation/nav';
import { useNavigationStore } from '../../navigation/useNavigationStore';
import { find } from '../dom/find';
import { isClosed } from '../dom/is-closed';
import { press } from '../dom/press-key';
import { waitFor } from '../dom/wait-for';
import { SELECTORS } from '../review.constants';
import type { StepTour, ReviewStep } from '../review.type';
import { escapeCloses } from './escape-closes';

const checkReopenLast = async (tour: StepTour): Promise<void> => {
  const { closed } = useNavigationStore.getState();
  if (closed === null) {
    tour.check('escape-reopens-last', true, 'skipped: no window was closed before this step', '');
    return;
  }
  press({ key: 'Escape' });
  const back = await waitFor(() => nav.active() === closed.active && JSON.stringify(useNavigationStore.getState().params) === JSON.stringify(closed.params));
  tour.check('escape-reopens-last', back !== null, `Escape with nothing open reopened the last closed window "${closed.active}"`, `Escape did not reopen "${closed.active}"; open: ${nav.active() ?? 'nothing'}`);
  if (back === null) return;
  await tour.capture('escape-reopen');
  await escapeCloses(tour, 'reopened', isClosed);
};

const escapeHomeStep: ReviewStep = {
  name: 'escape-home',
  run: async (tour) => {
    const { homeScreen } = tour.env;
    tour.check('starts-clear', isClosed(), 'nothing is open', `"${nav.active() ?? 'a layer'}" is still open`);
    await checkReopenLast(tour);
    useNavigationStore.setState({ closed: null });
    press({ key: 'Escape' });
    const opened = await waitFor(() => nav.active() === homeScreen && find(SELECTORS.layer) !== null);
    tour.check('escape-opens-home', opened !== null, `with no window to reopen, Escape opened the home screen "${homeScreen}"`, `Escape did not open "${homeScreen}"; open: ${nav.active() ?? 'nothing'}`);
    if (opened === null) return;
    await tour.capture('escape-home');
    await escapeCloses(tour, 'home', isClosed);
  },
};

export { escapeHomeStep };
