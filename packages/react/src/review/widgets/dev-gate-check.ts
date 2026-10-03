/* @layer renderer-shell @kind logic */
import { requireHostApi } from '../../host/require-host-api';
import { widgets } from '../../widgets/widgets';
import { delay } from '../dom/delay';
import type { StepTour } from '../review.type';
import { poppedWindowOf } from '../steps/popped-window-of';
import { poppedEntry } from './popped-entry';
import { windowOpen } from './window-open';
import { withReviewWidget } from './with-review-widget';
import { DEV_SETTING, DEV_WIDGET_ID, GATE_QUIET_MS } from './widget-review.constants';

const shownAs = async (id: string, on: boolean): Promise<boolean> => {
  if (on) return windowOpen(id, true);
  await delay(GATE_QUIET_MS);
  return (await poppedWindowOf(id)) === null && poppedEntry(id) !== null;
};

const state = (on: boolean): string => (on ? 'on' : 'off');

const follows = async (tour: StepTour, id: string, on: boolean, check: string): Promise<void> => {
  const held = await shownAs(id, on);
  const shown = on ? 'opened its window' : 'kept its place in the layout but has no window';
  tour.check(check, held, `with developer tools ${state(on)}, the popped devOnly widget ${shown}`, `with developer tools ${state(on)}, the popped devOnly widget did not follow`);
};

const toggled = async (tour: StepTour, id: string, start: boolean): Promise<void> => {
  await follows(tour, id, start, 'gate-dev-only-start');
  requireHostApi().patchWidgetSettings({ [DEV_SETTING]: !start });
  await follows(tour, id, !start, 'gate-dev-only-toggled');
  requireHostApi().patchWidgetSettings({ [DEV_SETTING]: start });
  await follows(tour, id, start, 'gate-dev-only-restored');
};

const checkDevGate = async (tour: StepTour): Promise<void> => {
  await withReviewWidget({ id: DEV_WIDGET_ID, label: 'Review dev only', popOut: true, devOnly: true }, async (id) => {
    widgets.popOut(id);
    if (!requireHostApi().isDev) {
      await toggled(tour, id, tour.env.developerTools);
      return;
    }
    const opened = await windowOpen(id, true);
    tour.check('gate-dev-only-opens', opened, 'developer tools are always on in a development run, so the devOnly widget opened its window', 'a devOnly widget did not open with developer tools on');
  });
};

export { checkDevGate };
