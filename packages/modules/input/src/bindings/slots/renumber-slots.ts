/* @layer core @kind logic */
import { FIRST_SLOT } from '../bindings.constants';
import type { BindingSlot } from '../bindings.type';
import type { SlotListEdit } from './slots.type';

const renumberSlots = (slots: readonly BindingSlot[]): SlotListEdit => {
  const renumber = new Map<number, number>();
  const next = slots.map((slot, position) => {
    const index = FIRST_SLOT + position;
    renumber.set(slot.index, index);
    return slot.index === index ? slot : { ...slot, index };
  });
  return { slots: next, renumber };
};

export { renumberSlots };
