/* @layer renderer-shell @kind logic */
import { nav } from '../../navigation/nav';
import { aboutChecks } from '../checks/about-checks';
import { isClosed } from '../dom/is-closed';
import { waitFor } from '../dom/wait-for';
import { ABOUT_SCREEN, VERSION_LABEL } from '../review.constants';
import type { ReviewStep } from '../review.type';
import { escapeCloses } from './escape-closes';
import { openScreen } from './open-screen';
import { readAbout } from './read-about';

const aboutStep: ReviewStep = {
  name: 'about',
  run: async (tour) => {
    const via = await openScreen(tour.env, ABOUT_SCREEN);
    const opened = await waitFor(() => nav.active() === ABOUT_SCREEN);
    tour.check('about-opens', opened !== null, `About opened through ${via}`, `About did not open through ${via}`);
    if (opened === null) return;
    tour.report(aboutChecks(await readAbout(VERSION_LABEL)));
    await tour.capture('about');
    await escapeCloses(tour, 'about', isClosed);
  },
};

export { aboutStep };
