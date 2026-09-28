/* @layer renderer-shell @kind constants */
import type { TriggerStep } from './TriggerCalibrationPanel.type';

const MIN_TRIGGER_TRAVEL = 0.5;

const TRIGGER_STEP_TEXT: Record<TriggerStep, string> = {
  rest: 'Let go of the trigger, then record its resting point.',
  press: 'Pull the trigger all the way in and let it out again.',
  review: 'Set the dead zone, then save.',
};

export { MIN_TRIGGER_TRAVEL, TRIGGER_STEP_TEXT };
