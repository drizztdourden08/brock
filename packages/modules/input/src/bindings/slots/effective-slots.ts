/* @layer core @kind logic */
import type { BindingSlot } from '../bindings.type';
import { defaultSlotList } from './default-slot-list';
import { renumberSlots } from './renumber-slots';
import type { SlotSource } from './slots.type';

const prefillFor = (source: SlotSource): BindingSlot[] => {
  if (source.keyboard) return renumberSlots(source.keyboardSlots?.() ?? []).slots;
  if (source.controls && source.controls.length > 0) return defaultSlotList(source.controls, source.claimed);
  return [];
};

const effectiveSlots = (source: SlotSource): BindingSlot[] => {
  const stored = source.stored;
  if (stored && stored.length > 0) return renumberSlots(stored).slots;
  return prefillFor(source);
};

export { effectiveSlots };
