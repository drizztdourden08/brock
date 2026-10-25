/* @layer renderer-components @kind logic */
import type { PadState } from '../../../pad/controller-slot.type';
import type { OverlaySlotView, PadOverlayState } from '../../../composites/PadOverlay';
import { partStateOf } from './part-state-of';

const padToOverlayState = (pad: PadState, slots: readonly OverlaySlotView[]): PadOverlayState =>
  Object.fromEntries(slots.map((slot) => [slot.anchor, partStateOf(pad, slot)]));

export { padToOverlayState };
