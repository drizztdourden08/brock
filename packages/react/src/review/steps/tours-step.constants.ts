/* @layer renderer-shell @kind constants */
const TOUR_SELECTORS = {
  layer: '.guided-tour',
  bubble: '.guided-tour__bubble',
  ring: '.tour-spotlight__ring',
  veil: '.tour-spotlight__veil',
  mascot: '.guided-tour__mascot--shown .mascot-stage__actor',
  next: '.guided-tour__actions button:last-of-type',
} as const;

const RING_OFF_CLASS = 'tour-spotlight__ring--off';

const POPPED_TOUR_ID = 'review-popped-widget';

const TOUR_STEP_WAIT_MS = 4000;

const TOUR_SETTLE_MS = 700;

const TOUCH_SLACK_PX = 2;

export { POPPED_TOUR_ID, RING_OFF_CLASS, TOUCH_SLACK_PX, TOUR_SELECTORS, TOUR_SETTLE_MS, TOUR_STEP_WAIT_MS };
