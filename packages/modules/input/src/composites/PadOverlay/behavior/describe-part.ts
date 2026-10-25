/* @layer renderer-components @kind logic */
import type { OverlaySlotView, PartState } from '../PadOverlay.type';
import { describeAnalog } from './describe-analog';
import { describeDpad } from './describe-dpad';
import { describeStick } from './describe-stick';
import { faceDirection } from './face-direction';

const describePart = (slot: OverlaySlotView, state: PartState | undefined): string | undefined => {
  if (slot.kind === 'analog') return describeAnalog(state);
  if (slot.kind === 'stick') return describeStick(state);
  if (slot.kind === 'dpad') return describeDpad(state);
  return faceDirection(slot);
};

export { describePart };
