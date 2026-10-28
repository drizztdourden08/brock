/* @layer renderer-shell @kind logic */
import { widgets } from '../../widgets/widgets';
import { settle } from '../dom/settle';
import type { StepTour } from '../review.type';
import { poppedWindowOf } from '../steps/popped-window-of';
import { poppedEntry } from './popped-entry';
import { windowOpen } from './window-open';
import { withDeveloperTools } from './with-developer-tools';
import { withReviewWidget } from './with-review-widget';
import { DEV_WIDGET_ID } from './widget-review.constants';

const gone = async (id: string): Promise<boolean> => (await windowOpen(id, false)) && poppedEntry(id) === null;

const checkDevGate = async (tour: StepTour): Promise<void> => {
  await withReviewWidget({ id: DEV_WIDGET_ID, label: 'Review dev only', popOut: true, devOnly: true }, async (id) => {
    await withDeveloperTools(async (switchTo) => {
      widgets.popOut(id);
      const opened = await windowOpen(id, true);
      tour.check('gate-dev-only-opens', opened, 'with developer tools on, the popped devOnly widget opened its window', 'with developer tools on, the popped devOnly widget did not open its window');
      await switchTo(false);
      const closed = await gone(id);
      tour.check('gate-dev-only-closed', closed, 'turning developer tools off closed the popped devOnly widget and its window', 'turning developer tools off left the popped devOnly widget open');
      await switchTo(true);
      await settle();
      const stays = (await poppedWindowOf(id)) === null && poppedEntry(id) === null;
      tour.check('gate-dev-only-stays-closed', stays, 'turning developer tools back on left the closed devOnly widget closed', 'turning developer tools back on reopened the devOnly widget');
    });
  });
};

export { checkDevGate };
