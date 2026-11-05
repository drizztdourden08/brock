/* @layer core @kind logic */
import type { ResolvedControl } from '../../family/family.type';
import type { BindingSlot } from '../bindings.type';
import { deviceSlots } from './device-slots';
import { inPrefillOrder } from './in-prefill-order';
import { renumberSlots } from './renumber-slots';

const defaultSlotList = (controls: readonly ResolvedControl[], claimed: ReadonlySet<string>): BindingSlot[] => {
  const free = deviceSlots(controls).filter(slot => !slot.position || !claimed.has(slot.position));
  return renumberSlots(inPrefillOrder(free)).slots;
};

export { defaultSlotList };
