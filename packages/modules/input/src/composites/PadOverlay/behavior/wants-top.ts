/* @layer renderer-components @kind logic */
import { TOP_PREFERRED_SLOTS } from '../PadOverlay.constants';
import type { PlacedPart } from '../PadOverlay.type';
import type { Scene } from './placement.type';

const wantsTop = (part: PlacedPart, scene: Scene): boolean => {
  const ys = scene.outline.map((point) => point.y);
  return TOP_PREFERRED_SLOTS.includes(part.slot.anchor) && part.y < (Math.min(...ys) + Math.max(...ys)) / 2;
};

export { wantsTop };
