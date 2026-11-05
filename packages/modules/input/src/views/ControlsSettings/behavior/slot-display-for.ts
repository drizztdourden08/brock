/* @layer renderer-components @kind logic */
import type { InputBinding, SlotDisplay } from '../../../bindings';
import { sameGamepadInput } from '../../../bindings/device-keys/same-gamepad-input';
import { slotForControl } from '../../../bindings/slots/slot-for-control';
import type { ResolvedControl } from '../../../family/family.type';

const slotDisplayFor = (binding: InputBinding, controls: readonly ResolvedControl[]): SlotDisplay => {
  for (const control of controls) {
    const slot = slotForControl(control);
    if (slot && sameGamepadInput(slot.binding, binding)) {
      return { position: slot.position, icon: slot.icon, label: slot.label };
    }
  }
  return {};
};

export { slotDisplayFor };
