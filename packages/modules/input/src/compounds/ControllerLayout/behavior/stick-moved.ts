/* @layer renderer-shell @kind logic */
import { STICK_REST } from '../ControllerLayout.constants';
import type { ControllerSlotState } from '../ControllerLayout.type';
import { clampAxis } from './clamp-axis';

const stickMoved = (state: ControllerSlotState | undefined): boolean =>
  Math.hypot(clampAxis(state?.x), clampAxis(state?.y)) >= STICK_REST;

export { stickMoved };
