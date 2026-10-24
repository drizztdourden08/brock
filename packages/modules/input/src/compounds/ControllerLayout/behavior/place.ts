/* @layer renderer-shell @kind logic */
import { TAG_GAP } from './controller-shapes.constants';
import type { ControllerControlKind, ControllerPlace, ControllerShape, ControllerSlotId, ControllerTagAt } from '../ControllerLayout.type';

const centerOf = (shape: ControllerShape) =>
  shape.kind === 'circle' ? { x: shape.cx, y: shape.cy } : { x: shape.x + shape.w / 2, y: shape.y + shape.h / 2 };

const bottomOf = (shape: ControllerShape): number => (shape.kind === 'circle' ? shape.cy + shape.r : shape.y + shape.h);

const place = (id: ControllerSlotId, kind: ControllerControlKind, shape: ControllerShape, at: ControllerTagAt = 'on'): ControllerPlace => {
  const center = centerOf(shape);
  const y = at === 'on' ? center.y : bottomOf(shape) + TAG_GAP;
  return { id, kind, shape, tag: { x: center.x, y, at } };
};

export { place };
