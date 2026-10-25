/* @layer renderer-components @kind logic */
import type { ControllerSlotId } from '../../../pad/controller-slot.type';
import { BEND_COST, BODY_COST, END_COST, TOP_MISS_COST, TOP_PREFERRED_SLOTS } from '../PadOverlay.constants';
import { bodyLength } from './body-length';
import type { LabelSpot, Scene, Segment } from './placement.type';

const lengthOf = (segments: readonly Segment[]): number => segments.reduce((sum, [a, b]) => sum + Math.hypot(b.x - a.x, b.y - a.y), 0);

const zoneCost = (spot: LabelSpot, slot: ControllerSlotId): number => {
  if (TOP_PREFERRED_SLOTS.includes(slot)) return spot.zone === 'above' ? 0 : TOP_MISS_COST;
  return spot.zone === 'above' || spot.zone === 'below' ? END_COST : 0;
};

const leaderCost = (segments: readonly Segment[], spot: LabelSpot, slot: ControllerSlotId, scene: Scene): number =>
  lengthOf(segments) + (segments.length - 1) * BEND_COST + zoneCost(spot, slot) + bodyLength(segments, scene) * BODY_COST;

export { leaderCost };
