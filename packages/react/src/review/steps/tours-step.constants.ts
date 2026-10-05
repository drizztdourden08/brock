/* @layer renderer-shell @kind constants */
const TOUR_SELECTORS = {
  layer: '.guided-tour',
  bubble: '.guided-tour__bubble',
  ring: '.guided-tour__ring',
  next: '.guided-tour__actions button:last-of-type',
} as const;

const RING_OFF_CLASS = 'guided-tour__ring--off';

const TOUR_STEP_WAIT_MS = 4000;

const TOUR_SETTLE_MS = 700;

export { RING_OFF_CLASS, TOUR_SELECTORS, TOUR_SETTLE_MS, TOUR_STEP_WAIT_MS };
