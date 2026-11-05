/* @layer core @kind logic */
import type { ResolvedControl } from '../../family/family.type';
import { AXIS_INDEX, BUTTON_INDEX } from '../../family/sdl-capabilities.constants';
import type { BindingSlot, InputBinding } from '../bindings.type';
import { sdlIndexOf } from './sdl-index-of';
import { RESERVED_CATEGORY } from './slots.constants';

const pressableBinding = (control: ResolvedControl): InputBinding | null => {
  if (control.kind === 'button') {
    const index = sdlIndexOf(BUTTON_INDEX, control.position);
    return index === undefined ? null : { type: 'gamepad-button', index, label: control.label };
  }
  const axisIndex = sdlIndexOf(AXIS_INDEX, control.position);
  if (axisIndex === undefined || control.category !== 'trigger') return null;
  return { type: 'gamepad-axis', axisIndex, direction: '+', label: control.label };
};

const slotForControl = (control: ResolvedControl): Omit<BindingSlot, 'index'> | null => {
  if (control.category === RESERVED_CATEGORY) return null;
  const binding = pressableBinding(control);
  if (!binding) return null;
  return {
    binding,
    position: control.position,
    label: control.label,
    icon: control.icon ? { key: control.icon, path: null, label: control.label } : null,
  };
};

export { slotForControl };
