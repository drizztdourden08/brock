/* @layer renderer-shell @kind constants */
import type { StickStep } from './StickCalibrationPanel.type';

const MIN_STICK_SPAN = 1.2;

const STICK_STEP_TEXT: Record<StickStep, string> = {
  center: 'Let go of the stick so it rests at its center, then record it.',
  range: 'Roll the stick around its full edge a few times.',
  review: 'Set the dead zones, then save.',
};

export { MIN_STICK_SPAN, STICK_STEP_TEXT };
