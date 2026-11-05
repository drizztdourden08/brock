/* @layer core @kind logic */
import { FIRST_SLOT, UNBOUND } from '../bindings.constants';
import type { BindingSlot } from '../bindings.type';
import { renumberSlots } from './renumber-slots';
import { slotName } from './slot-name';
import type { SlotListEdit, SlotSeed } from './slots.type';

const addSlot = (slots: readonly BindingSlot[], seed?: SlotSeed): SlotListEdit => {
  const index = slots.length + FIRST_SLOT;
  const slot: BindingSlot = {
    index,
    binding: seed?.binding ?? UNBOUND,
    label: seed?.label ?? slotName(index),
    ...(seed?.position ? { position: seed.position } : {}),
    ...(seed?.icon ? { icon: seed.icon } : {}),
  };
  return renumberSlots([...slots, slot]);
};

export { addSlot };
