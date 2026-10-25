/* @layer renderer-shell @kind logic */
import type { ControllerJoystickSample } from '../../../../../capture.type';
import type { PositionalTarget } from './positional-capture.type';

const trimTargetsToDevice = (targets: PositionalTarget[], sample: ControllerJoystickSample): PositionalTarget[] =>
  targets.filter((t) => t.kind === 'axis' || t.expectedIndex === null || t.expectedIndex < sample.buttons.length);

export { trimTargetsToDevice };
