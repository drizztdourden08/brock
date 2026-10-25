/* @layer renderer-shell @kind logic */
import type { ControllerJoystickSample } from '../../../../../capture.type';
import type { AxisRanges } from './positional-capture.type';

const growAxisRanges = (ranges: AxisRanges, sample: ControllerJoystickSample): AxisRanges =>
  sample.axes.map((v, i) => {
    const prev = ranges[i] ?? { min: v, max: v };
    return { min: Math.min(prev.min, v), max: Math.max(prev.max, v) };
  });

export { growAxisRanges };
