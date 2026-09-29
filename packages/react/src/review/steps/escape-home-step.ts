/* @layer renderer-shell @kind logic */
import { nav } from '../../navigation/nav';
import { find } from '../dom/find';
import { isClosed } from '../dom/is-closed';
import { press } from '../dom/press-key';
import { waitFor } from '../dom/wait-for';
import { SELECTORS } from '../review.constants';
import type { ReviewStep } from '../review.type';
import { escapeCloses } from './escape-closes';

const escapeHomeStep: ReviewStep = {
  name: 'escape-home',
  run: async (tour) => {
    const { homeScreen } = tour.env;
    tour.check('starts-clear', isClosed(), 'nothing is open', `"${nav.active() ?? 'a layer'}" is still open`);
    press({ key: 'Escape' });
    const opened = await waitFor(() => nav.active() === homeScreen && find(SELECTORS.layer) !== null);
    tour.check('escape-opens-home', opened !== null, `Escape opened the home screen "${homeScreen}"`, `Escape did not open "${homeScreen}"; open: ${nav.active() ?? 'nothing'}`);
    if (opened === null) return;
    await tour.capture('escape-home');
    await escapeCloses(tour, 'home', isClosed);
  },
};

export { escapeHomeStep };
