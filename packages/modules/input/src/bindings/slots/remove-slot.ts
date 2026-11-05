/* @layer core @kind logic */
import type { BindingSlot } from '../bindings.type';
import { renumberSlots } from './renumber-slots';
import type { SlotListEdit } from './slots.type';

const removeSlot = (slots: readonly BindingSlot[], index: number): SlotListEdit =>
  renumberSlots(slots.filter(slot => slot.index !== index));

export { removeSlot };
