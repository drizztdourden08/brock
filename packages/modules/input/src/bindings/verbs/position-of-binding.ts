/* @layer core @kind logic */
import type { InputBinding } from '../bindings.type';
import type { SlotPosition } from '../slots/slots.type';
import { AXIS_BY_INDEX, BUTTON_BY_INDEX, TRIGGER_AXIS_NAMES } from './verbs.constants';

const positionOfBinding = (binding: InputBinding): SlotPosition | null => {
  if (binding.type === 'gamepad-button') return BUTTON_BY_INDEX.get(binding.index) ?? null;
  if (binding.type === 'gamepad-axis') {
    const axis = AXIS_BY_INDEX.get(binding.axisIndex);
    return axis && TRIGGER_AXIS_NAMES.includes(axis) ? axis : null;
  }
  return null;
};

export { positionOfBinding };
