/* @layer renderer-shell @kind constants */
const TOUR_SELECTORS = {
  layer: '.guided-tour',
  bubble: '.guided-tour__bubble',
  ring: '.tour-spotlight__ring',
  veil: '.tour-spotlight__veil',
  mascot: '.guided-tour__mascot--shown .mascot-stage__actor',
  next: '.guided-tour__actions button:last-of-type',
  primary: '.guided-tour__actions .btn--primary',
  hint: '.guided-tour__hint',
} as const;

const RING_OFF_CLASS = 'tour-spotlight__ring--off';

const POPPED_TOUR_ID = 'review-popped-widget';




const TOUR_MASCOT_STILL_SAMPLES = 10;

const TOUCH_SLACK_PX = 2;

export { POPPED_TOUR_ID, RING_OFF_CLASS, TOUCH_SLACK_PX, TOUR_MASCOT_STILL_SAMPLES, TOUR_SELECTORS };
