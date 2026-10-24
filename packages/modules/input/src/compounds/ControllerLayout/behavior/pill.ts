/* @layer renderer-shell @kind logic */
import { place } from './place';
import { rect } from './rect';
import type { ControllerPlace, ControllerSlotId } from '../ControllerLayout.type';

const pill = (id: ControllerSlotId, cx: number, cy: number): ControllerPlace =>
  place(id, 'button', rect({ x: cx - 9, y: cy - 6, w: 18, h: 12, r: 6 }), 'below');

export { pill };
