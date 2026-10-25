/* @layer renderer-shell @kind logic */
import type { ControllerJoystickSample } from '../../../../../capture.type';
import type { AxisRanges } from './positional-capture.type';

const startAxisRanges = (sample: ControllerJoystickSample): AxisRanges =>
  sample.axes.map((v) => ({ min: v, max: v }));

export { startAxisRanges };
