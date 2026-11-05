/* @layer core @kind logic */
import type { ResolvedControl } from '../../family/family.type';
import { AXIS_INDEX, BUTTON_INDEX } from '../../family/sdl-capabilities.constants';
import type { SdlButtonName } from '../../pad/sdl-button-name.type';
import { UNBOUND } from '../bindings.constants';
import type { InputBinding, VerbPosition } from '../bindings.type';
import { axisEndLabel } from './axis-end-label';

type AxisVerbPosition = Extract<VerbPosition, { axis: unknown }>;

const isAxisPosition = (position: VerbPosition): position is AxisVerbPosition => typeof position !== 'string';

const bindingForPosition = (position: VerbPosition, byPosition: ReadonlyMap<string, ResolvedControl>): InputBinding => {
  if (isAxisPosition(position)) {
    const control = byPosition.get(position.axis);
    if (control?.kind !== 'axis') return UNBOUND;
    const label = axisEndLabel(control.label, position.direction);
    return { type: 'gamepad-axis', axisIndex: AXIS_INDEX[position.axis], direction: position.direction, label };
  }
  const control = byPosition.get(position);
  if (control?.kind !== 'button') return UNBOUND;
  return { type: 'gamepad-button', index: BUTTON_INDEX[control.position as SdlButtonName], label: control.label };
};

export { bindingForPosition };
