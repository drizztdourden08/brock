/* @layer renderer-shell @kind logic */
import { place } from './place';
import { rect } from './rect';
import type { ControllerPlace, ControllerSlotId } from '../ControllerLayout.type';

const square = (id: ControllerSlotId, cx: number, cy: number): ControllerPlace =>
  place(id, 'button', rect({ x: cx - 6, y: cy - 5, w: 12, h: 10, r: 3 }), 'below');

export { square };
