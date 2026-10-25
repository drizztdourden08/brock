/* @layer renderer-components @kind logic */
import { FACE_DIRECTIONS } from '../PadOverlay.constants';
import type { OverlaySlotView } from '../PadOverlay.type';

const faceDirection = (slot: OverlaySlotView): string | undefined =>
  slot.kind === 'button' ? FACE_DIRECTIONS[slot.anchor] : undefined;

export { faceDirection };
