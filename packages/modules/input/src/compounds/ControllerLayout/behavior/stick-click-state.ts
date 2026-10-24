/* @layer renderer-shell @kind logic */
import type { ControllerSlotId, ControllerSlotState, ControllerSlots } from '../ControllerLayout.type';
import { stickClick } from './stick-click';

const stickClickState = (slots: ControllerSlots, id: ControllerSlotId): ControllerSlotState | undefined => {
  const clickId = stickClick(id);
  return clickId ? slots[clickId] : undefined;
};

export { stickClickState };
