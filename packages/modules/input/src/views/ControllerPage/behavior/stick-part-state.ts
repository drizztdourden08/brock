/* @layer renderer-components @kind logic */
import type { ControllerSlotId, PadState } from '../../../pad/controller-slot.type';
import type { PartState } from '../../../composites/PadOverlay';
import { CLICK_OF } from './pad-to-overlay-state.constants';

const stickPartState = (pad: PadState, anchor: ControllerSlotId): PartState => {
  const live = pad.slots[anchor];
  const click = CLICK_OF[anchor];
  return { x: live?.x ?? 0, y: live?.y ?? 0, pressed: click !== undefined && Boolean(pad.slots[click]?.pressed) };
};

export { stickPartState };
