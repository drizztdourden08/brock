/* @layer core @kind logic */
import type { BindingSlot, InputBinding } from '../bindings.type';
import type { SlotDisplay } from './slots.type';

const setSlotBinding = (
  slots: readonly BindingSlot[],
  index: number,
  binding: InputBinding,
  display?: SlotDisplay,
): BindingSlot[] => slots.map((slot) => {
  if (slot.index !== index) return slot;
  return {
    index: slot.index,
    binding,
    label: display?.label ?? slot.label,
    ...(display?.position ? { position: display.position } : {}),
    ...(display?.icon ? { icon: display.icon } : {}),
  };
});

export { setSlotBinding };
