/* @layer renderer-shell @kind logic */
import type { ControllerJoystickSample } from '../../../../../capture.type';
import type { PositionalRefs } from './positional-capture.type';
import { startAxisRanges } from './start-axis-ranges';

const adoptIdleBaseline = (refs: PositionalRefs, sample: ControllerJoystickSample): ControllerJoystickSample => {
  const idle: ControllerJoystickSample = {
    id: sample.id,
    buttons: sample.buttons.map(() => false),
    axes: sample.axes.map(() => 0),
    hats: [],
  };
  refs.baselineRef.current = idle;
  refs.rangesRef.current = startAxisRanges(idle);
  refs.awaitingRestRef.current = false;
  return idle;
};

export { adoptIdleBaseline };
