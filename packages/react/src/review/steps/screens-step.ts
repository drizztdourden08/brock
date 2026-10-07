/* @layer renderer-shell @kind logic */
import { isScreenAllowed } from '../../screens/is-screen-allowed';
import { useProfilesStore } from '../../stores/useProfilesStore';
import { resetUi } from './reset-ui';
import type { ReviewStep } from '../review.type';
import { narrowScreens } from './narrow-screens';
import { reviewScreen } from './review-screen';

const screensStep: ReviewStep = {
  name: 'screens',
  run: async (tour) => {
    const { screens, home, developerTools } = tour.env;
    const hasProfile = useProfilesStore.getState().active !== null;
    const shown = screens.filter((screen) => screen.id !== home && isScreenAllowed(screen, developerTools, hasProfile));
    for (const screen of shown) {
      await reviewScreen(tour, screen);
      await resetUi();
    }
    await narrowScreens(tour, shown);
  },
};

export { screensStep };
