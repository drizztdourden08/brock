/* @layer renderer-shell @kind logic */
import { brandMascot } from '../../brand/brand-mascot';
import { isScreenAllowed } from '../../screens/is-screen-allowed';
import { useProfilesStore } from '../../stores/useProfilesStore';
import { mascotApart } from '../checks/mascot-apart';
import { paletteChecks } from '../checks/mascot-palette-checks';
import { windowChecks } from '../checks/mascot-window-checks';
import { find } from '../dom/find';
import { isClosed } from '../dom/is-closed';
import { press } from '../dom/press-key';
import { readWalker } from '../dom/read-walker';
import { waitFor } from '../dom/wait-for';
import { SELECTORS } from '../review.constants';
import type { ReviewStep } from '../review.type';
import { escapeCloses } from './escape-closes';
import { openScreen } from './open-screen';

const mascotStep: ReviewStep = {
  name: 'mascot',
  run: async (tour) => {
    const { product, screens, home, developerTools } = tour.env;
    const hasProfile = useProfilesStore.getState().active !== null;
    const screen = screens.find((s) => s.id !== home && s.layer !== 'own' && isScreenAllowed(s, developerTools, hasProfile));
    if (screen === undefined) return;
    await openScreen(tour.env, screen.id);
    const walks = product.mascot !== false && brandMascot(product.icons.brand) !== null;
    const walker = await waitFor(() => find(SELECTORS.walker), walks ? undefined : 600);
    if (!walks) {
      tour.check('mascot-off', walker === null, 'no mascot walks: the product has none or turned it off', 'a mascot walks although the product has none or turned it off');
    } else {
      tour.report(windowChecks(readWalker()));
      await tour.capture('mascot-window');
      press({ key: 'k', ctrlKey: true });
      await waitFor(() => find(SELECTORS.walkerBeside) && readWalker().hint);
      await waitFor(() => mascotApart(readWalker()), 8000);
      tour.report(paletteChecks(readWalker()));
      await tour.capture('mascot-palette');
      await escapeCloses(tour, 'mascot-palette', () => find(SELECTORS.palette) === null);
    }
    await escapeCloses(tour, 'mascot-window', isClosed);
    const gone = await waitFor(() => find(SELECTORS.walker) === null);
    tour.check('mascot-gone', gone !== null, 'the mascot goes when no window is open', 'the mascot stays after the window closed');
  },
};

export { mascotStep };
