/* @layer renderer-components @kind logic */
import { OPTION_LIMIT } from '../PadOverlay.constants';
import type { Point } from '../PadOverlay.type';
import { endSpots } from './end-spots';
import { leaderCost } from './leader-cost';
import { leaderRoutes } from './leader-routes';
import { partSides } from './part-sides';
import type { LabelOption, LabelSize, Scene, Segment } from './placement.type';
import { routeClear } from './route-clear';
import { sideSpots } from './side-spots';

const segmentsOf = (route: readonly Point[]): Segment[] =>
  route.slice(1).map((point, index): Segment => [route[index] ?? point, point]);

const labelOptions = (own: number, size: LabelSize, scene: Scene, fontPx: number): LabelOption[] => {
  const part = scene.parts[own];
  if (!part) return [];
  const spots = [...sideSpots(size, scene, partSides(part, scene)), ...endSpots(part, size, scene, fontPx)];
  const options = spots.flatMap((spot) => leaderRoutes(part, spot.elbow).flatMap((leader) => {
    const segments = segmentsOf(leader);
    if (!routeClear(segments, own, spot.rect, scene)) return [];
    return [{ spot, leader, segments, cost: leaderCost(segments, spot, part.slot.anchor, scene) }];
  }));
  return options.sort((a, b) => a.cost - b.cost).slice(0, OPTION_LIMIT);
};

export { labelOptions };
