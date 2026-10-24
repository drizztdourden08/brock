/* @layer renderer-shell @kind logic */
import type { ControllerSlotId } from '../ControllerLayout.type';

const stickClick = (id: ControllerSlotId): ControllerSlotId | null => {
  if (id === 'stick.left') return 'stick.left.click';
  if (id === 'stick.right') return 'stick.right.click';
  return null;
};

export { stickClick };
