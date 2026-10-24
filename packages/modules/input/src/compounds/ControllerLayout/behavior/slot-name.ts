/* @layer renderer-shell @kind logic */
import type { ControllerSlotId, ControllerSlots, ControllerStrings } from '../ControllerLayout.type';

const slotName = (slots: ControllerSlots, id: ControllerSlotId, strings: ControllerStrings): string => slots[id]?.label ?? strings.names[id];

export { slotName };
