/* @layer core @kind logic */
import type { ResolvedControl } from '../../family/family.type';
import type { BindingSlot } from '../bindings.type';
import { renumberSlots } from './renumber-slots';
import { slotForControl } from './slot-for-control';

const deviceSlots = (controls: readonly ResolvedControl[]): BindingSlot[] => {
  const slots: BindingSlot[] = [];
  for (const control of controls) {
    const slot = slotForControl(control);
    if (slot) slots.push({ ...slot, index: 0 });
  }
  return renumberSlots(slots).slots;
};

export { deviceSlots };
