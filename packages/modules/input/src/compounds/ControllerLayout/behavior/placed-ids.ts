/* @layer renderer-shell @kind logic */
import type { ControllerGeometry, ControllerSlotId } from '../ControllerLayout.type';
import { stickClick } from './stick-click';

const placedIds = (geometry: ControllerGeometry): ReadonlySet<ControllerSlotId> => {
  const ids = geometry.places.map((entry) => entry.id);
  const clicks = ids.map(stickClick).filter((id): id is ControllerSlotId => id !== null);
  return new Set([...ids, ...clicks]);
};

export { placedIds };
