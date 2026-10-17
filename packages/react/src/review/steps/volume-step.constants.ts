/* @layer renderer-shell @kind constants */
const VOLUME_SELECTORS = {
  button: 'button',
  panel: '.volume-control__panel',
  slider: '.volume-control__panel .slider__input',
} as const;

const VOLUME_SLIDE = 0.25;

const VOLUME_TOLERANCE = 0.01;

export { VOLUME_SELECTORS, VOLUME_SLIDE, VOLUME_TOLERANCE };
