/* @layer renderer-shell @kind logic */
import { requireHostApi } from '../../host/require-host-api';
import { widgets } from '../../widgets/widgets';
import { settle } from '../dom/settle';
import { waitFor } from '../dom/wait-for';
import { find } from '../dom/find';
import { withReviewWidget } from '../widgets/with-review-widget';
import type { ReviewStep, StepTour } from '../review.type';
import { AWAY_Y, FULLSCREEN_DOCK, TOP_EDGE_Y } from './fullscreen-step.constants';
import { titleBarDrawn as bar } from './read-title-bar-drawn';

const pointAt = (y: number): void => {
  document.body.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: Math.round(window.innerWidth / 2), clientY: y }));
};

const tapAlt = (): void => {
  for (const type of ['keydown', 'keyup'] as const) document.body.dispatchEvent(new KeyboardEvent(type, { bubbles: true, cancelable: true, key: 'Alt', altKey: type === 'keydown' }));
};

const checkReveal = async (tour: StepTour): Promise<void> => {
  pointAt(TOP_EDGE_Y);
  const shown = await waitFor(bar.drawn);
  tour.check('fullscreen-bar-reveal', shown !== null, 'pointing at the top edge in full screen slid the whole title bar in, drawn above the widgets', 'pointing at the top edge in full screen did not draw the whole title bar, or something covered part of it');
  if (shown !== null) await tour.capture('fullscreen-revealed');
  pointAt(AWAY_Y);
  const away = await waitFor(bar.hidden);
  tour.check('fullscreen-bar-leaves', away !== null, 'moving away from the top edge hid the title bar again', 'the title bar stayed after the pointer left the top edge');
  tapAlt();
  const focused = await waitFor(bar.focusedInside);
  if (focused !== null && !document.hasFocus()) document.activeElement?.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
  const keyed = focused === null ? null : await waitFor(bar.drawn);
  const missed = focused === null ? 'focus did not move into it' : 'it was not drawn';
  tour.check('fullscreen-bar-keyboard', keyed !== null, 'Alt in full screen revealed the title bar and moved focus into it', `Alt in full screen did not reveal the title bar: ${missed}`);
  if (keyed !== null) await tour.capture('fullscreen-keyboard');
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
};

const inFullscreen = async (tour: StepTour): Promise<void> => {
  requireHostApi().setFullscreen(true);
  try {
    const hidden = await waitFor(bar.hidden);
    tour.check('fullscreen-bar-hidden', hidden !== null, 'in full screen the title bar is fully hidden, with no strip left at the top edge', 'in full screen the title bar is neither fully hidden nor fully drawn');
    await settle();
    await tour.capture('fullscreen');
    if (hidden !== null) await checkReveal(tour);
  } finally {
    requireHostApi().setFullscreen(false);
  }
};

const fullscreenStep: ReviewStep = {
  name: 'fullscreen',
  run: async (tour) => {
    if (bar.bar() === null || !tour.env.product.window.titleBar.controls.fullscreen) {
      tour.check('fullscreen-bar', true, 'skipped: the app has no title bar or no full screen', '');
      return;
    }
    await withReviewWidget(FULLSCREEN_DOCK, async (id) => {
      widgets.open(id);
      await waitFor(() => find(`[data-widget-id="${id}"]`));
      await inFullscreen(tour);
      const back = await waitFor(bar.inFlow);
      tour.check('fullscreen-bar-restored', back !== null, 'leaving full screen put the title bar back above the content', 'leaving full screen did not put the title bar back');
    });
  },
};

export { fullscreenStep };
