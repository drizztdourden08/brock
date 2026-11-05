/* @layer core @kind logic */
import type { VerbBindings } from '../bindings.type';
import type { SlotPosition } from '../slots/slots.type';
import { positionOfBinding } from './position-of-binding';
import type { VerbDef } from './verbs.type';

const claimedPositions = (verbs: VerbBindings, defs: readonly VerbDef[]): Set<SlotPosition> => {
  const claimed = new Set<SlotPosition>();
  for (const def of defs) {
    if (!def.claimsSlot) continue;
    const binding = verbs[def.id];
    const position = binding ? positionOfBinding(binding) : null;
    if (position) claimed.add(position);
  }
  return claimed;
};

export { claimedPositions };
