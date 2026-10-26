/* @layer renderer-components @kind logic */
import { BELOW_RATE, BEND_COST, BODY_COST, END_COST, GLYPH_REACH, TOP_MISS_COSTS, TOP_PREFERRED_SLOTS } from '../PadOverlay.constants';
import type { PlacedPart } from '../PadOverlay.type';
import { bodyLength } from './body-length';
import type { LabelSpot, Scene, Segment } from './placement.type';
import { wantsTop } from './wants-top';

const lengthOf = (segments: readonly Segment[]): number => segments.reduce((sum, [a, b]) => sum + Math.hypot(b.x - a.x, b.y - a.y), 0);

const partsTop = (scene: Scene): number => Math.min(...scene.parts.map((part) => part.y - part.radius * GLYPH_REACH[part.slot.kind]));

const zoneCost = (spot: LabelSpot, part: PlacedPart, scene: Scene): number => {
  const below = spot.zone === 'below' ? BELOW_RATE * Math.max(0, spot.elbow.y - part.y) : 0;
  if (wantsTop(part, scene)) return spot.zone === 'above' && spot.elbow.y <= partsTop(scene) ? 0 : (TOP_MISS_COSTS[part.slot.anchor] ?? 0) + below;
  if (TOP_PREFERRED_SLOTS.includes(part.slot.anchor)) return 0;
  return spot.zone === 'above' ? END_COST : below;
};

const leaderCost = (segments: readonly Segment[], spot: LabelSpot, part: PlacedPart, scene: Scene): number =>
  lengthOf(segments) + (segments.length - 1) * BEND_COST + zoneCost(spot, part, scene) + bodyLength(segments, scene) * BODY_COST;

export { leaderCost };
