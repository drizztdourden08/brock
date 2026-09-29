/* @layer renderer-shell @kind logic */
import { isScreenAllowed } from '../../screens/is-screen-allowed';
import { useProfilesStore } from '../../stores/useProfilesStore';
import { resetUi } from './reset-ui';
import type { ReviewStep } from '../review.type';
import { reviewScreen } from './review-screen';

const screensStep: ReviewStep = {
  name: 'screens',
  run: async (tour) => {
    const { screens, home, developerTools } = tour.env;
    const hasProfile = useProfilesStore.getState().active !== null;
    for (const screen of screens) {
      if (screen.id === home) continue;
      if (!isScreenAllowed(screen, developerTools, hasProfile)) continue;
      await reviewScreen(tour, screen);
      await resetUi();
    }
  },
};

export { screensStep };
